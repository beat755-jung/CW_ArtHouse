#!/usr/bin/env node
/**
 * scripts/process-images.mjs — 사이트 이미지 일괄 처리 (sharp)
 *
 * 사용: npm run images               — assets-src/ 원본 → public/images/ 결과물 + docs/image-report.md
 *       npm run images -- --compare  — scripts/out/compare/ 에 전후 비교 이미지도 생성 (git 제외)
 *       npm run images -- --no-adjust — 톤 보정 없이 방향·메타데이터·크기만 처리
 *
 * [원칙]
 * - 원본(assets-src/)은 읽기만 한다. 절대 덮어쓰지 않는다.
 * - 대응표: lib/image-map.json (id = 인벤토리 ID, source = assets-src/ 기준, output = public/images/ 기준)
 *
 * [처리]
 * 1. 방향: EXIF Orientation 을 픽셀에 반영 (rotate())
 * 2. 메타데이터: EXIF·GPS·ICC·XMP 를 쓰지 않음 → 결과를 다시 읽어 남은 메타데이터가 없는지 검증
 * 3. 크기: 긴 변 2400px 이하로 축소, 작은 원본은 확대하지 않음. JPEG 품질 82 (mozjpeg)
 * 5. 워터마크 (실사만): 오른쪽 아래 작은 "CW_ArtHouse" (반투명). 렌더(out-*·in-*)는 회사 제작물이 아니거나 샘플이라 넣지 않음
 *    끄기: npm run images -- --no-watermark
 * 4. 톤 (실사만, 렌더 제외): 약하게만
 *    - 화이트밸런스: 무채색에 가까운 중간 밝기 화소의 R·G·B 평균을 맞추는 계수, ±6% 로 제한. 근거 화소가 2% 미만이면 생략
 *    - 노출: 밝기 중앙값을 목표(0.45)로 옮기는 양, ±0.25EV 로 제한. 0.05EV 미만이면 생략
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "assets-src");
const OUT = path.join(ROOT, "public", "images");
const COMPARE = path.join(ROOT, "scripts", "out", "compare");
const REPORT = path.join(ROOT, "docs", "image-report.md");

const MAX_EDGE = 2400;
const QUALITY = 82;
const WB_LIMIT = 0.06; // ±6%
const EV_LIMIT = 0.25; // ±0.25 EV
const EV_MIN = 0.05;
const TARGET_LUMA = 0.45;

const args = new Set(process.argv.slice(2));
const doCompare = args.has("--compare");
const doAdjust = !args.has("--no-adjust");
const doWatermark = !args.has("--no-watermark");
const WATERMARK = "CW_ArtHouse";

/** 워터마크 SVG — 짧은 변의 2.6% 크기, 오른쪽 아래 여백 2.2%, 흰색 55% + 옅은 그림자 */
function watermarkSvg(w, h) {
  const size = Math.max(14, Math.round(Math.min(w, h) * 0.026));
  const pad = Math.round(Math.min(w, h) * 0.022);
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
      `<text x="${w - pad}" y="${h - pad}" text-anchor="end" font-family="Georgia, 'Times New Roman', serif" font-size="${size}" letter-spacing="${(size * 0.06).toFixed(1)}" ` +
      `fill="#ffffff" fill-opacity="0.55" stroke="#000000" stroke-opacity="0.25" stroke-width="${Math.max(1, size * 0.05).toFixed(1)}" paint-order="stroke">${WATERMARK}</text></svg>`,
  );
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const kb = (bytes) => Math.round(bytes / 1024);

/** 축소본 화소로 화이트밸런스 계수와 노출 보정량 계산 */
async function measureTone(pipeline) {
  const { data, info } = await pipeline
    .clone()
    .resize(256, 256, { fit: "inside" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const lumas = [];
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const R = data[i], G = data[i + 1], B = data[i + 2];
    const l = 0.2126 * R + 0.7152 * G + 0.0722 * B;
    lumas.push(l);
    // 무채색에 가까운 중간 밝기 화소만 (하늘·잔디 같은 강한 색은 제외)
    if (l > 40 && l < 220 && Math.max(R, G, B) - Math.min(R, G, B) < 40) {
      r += R; g += G; b += B; n++;
    }
  }
  const total = data.length / info.channels;
  let gains = [1, 1, 1];
  if (n / total >= 0.02) {
    const mean = (r + g + b) / (3 * n);
    gains = [mean / (r / n), mean / (g / n), mean / (b / n)].map((x) => clamp(x, 1 - WB_LIMIT, 1 + WB_LIMIT));
  }
  lumas.sort((a, c) => a - c);
  const median = lumas[Math.floor(lumas.length / 2)] / 255;
  let ev = clamp(Math.log2(TARGET_LUMA / Math.max(median, 0.01)), -EV_LIMIT, EV_LIMIT);
  if (Math.abs(ev) < EV_MIN) ev = 0;
  const wbApplied = gains.some((x) => Math.abs(x - 1) >= 0.005);
  return { gains: wbApplied ? gains : [1, 1, 1], ev, applied: wbApplied || ev !== 0 };
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const map = JSON.parse(await fs.readFile(path.join(ROOT, "lib", "image-map.json"), "utf8"));
  const images = map.images;
  const missing = [];
  for (const img of images) if (!(await exists(path.join(SRC, img.source)))) missing.push(img.source);
  if (missing.length) {
    console.error(`[images] 원본이 없습니다 (${missing.length}건): ${missing.slice(0, 5).join(", ")}…`);
    console.error("[images] assets-src/ 는 git 에 포함되지 않습니다. 원본을 이 PC 에 복사한 뒤 다시 실행하세요.");
    process.exit(1);
  }

  for (const dir of ["exterior", "process", "interior"]) await fs.mkdir(path.join(OUT, dir), { recursive: true });
  if (doCompare) await fs.mkdir(COMPARE, { recursive: true });

  const rows = [];
  let metaLeft = 0;
  for (const img of images) {
    const srcPath = path.join(SRC, img.source);
    const outPath = path.join(OUT, img.output);
    const srcStat = await fs.stat(srcPath);
    const srcMeta = await sharp(srcPath).metadata();

    // 1·3. 방향 반영 + 축소 (확대 안 함)
    let pipeline = sharp(srcPath).rotate().resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true });

    // 4. 톤 (실사만)
    let tone = { gains: [1, 1, 1], ev: 0, applied: false };
    if (doAdjust && img.kind === "photo") {
      tone = await measureTone(pipeline);
      if (tone.applied) {
        const f = 2 ** tone.ev;
        pipeline = pipeline.linear(tone.gains.map((x) => x * f), [0, 0, 0]);
      }
    }

    // 2. 메타데이터 없이 저장 (withMetadata 를 호출하지 않으면 EXIF·GPS·ICC 를 쓰지 않음)
    const marked = doWatermark && img.kind === "photo";
    if (marked) {
      // 축소·보정까지 끝낸 화소 위에 워터마크를 합성 (크기를 알아야 위치를 정할 수 있음)
      const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
      await sharp(data, { raw: info })
        .composite([{ input: watermarkSvg(info.width, info.height), left: 0, top: 0 }])
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(outPath);
    } else {
      await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toFile(outPath);
    }

    const outMeta = await sharp(outPath).metadata();
    const hasMeta = Boolean(outMeta.exif || outMeta.xmp || outMeta.iptc || outMeta.icc);
    if (hasMeta) metaLeft++;
    const outStat = await fs.stat(outPath);
    const swap = (srcMeta.orientation ?? 1) >= 5;
    const srcW = swap ? srcMeta.height : srcMeta.width;
    const srcH = swap ? srcMeta.width : srcMeta.height;

    if (doCompare) {
      const W = 800;
      const before = await sharp(srcPath).rotate().resize(W).jpeg({ quality: 80 }).toBuffer();
      const after = await sharp(outPath).resize(W).toBuffer();
      const h = (await sharp(before).metadata()).height ?? 600;
      await sharp({ create: { width: W * 2 + 16, height: h, channels: 3, background: "#111111" } })
        .composite([{ input: before, left: 0, top: 0 }, { input: after, left: W + 16, top: 0 }])
        .jpeg({ quality: 80 })
        .toFile(path.join(COMPARE, path.basename(img.output)));
    }

    rows.push({
      id: img.id,
      output: img.output,
      kind: img.kind,
      src: `${srcW}×${srcH}`,
      out: `${outMeta.width}×${outMeta.height}`,
      srcKB: kb(srcStat.size),
      outKB: kb(outStat.size),
      gains: tone.applied ? tone.gains.map((x) => x.toFixed(2)).join("/") : "—",
      ev: tone.ev ? `${tone.ev > 0 ? "+" : ""}${tone.ev.toFixed(2)}` : "—",
      adjusted: img.kind === "render" ? "렌더 제외" : !doAdjust ? "보정 끔" : tone.applied ? "✓" : "변화 없음",
      watermark: marked ? "✓" : "—",
      meta: hasMeta ? "남음 ⚠" : "없음",
    });
    process.stdout.write(".");
  }
  process.stdout.write("\n");

  // 3. 리포트
  const sum = (k) => rows.reduce((a, r) => a + r[k], 0);
  const adjusted = rows.filter((r) => r.adjusted === "✓").length;
  const header = "| ID | 결과 파일 | 구분 | 원본 해상도 | 결과 해상도 | 원본 KB | 결과 KB | WB 계수 (R/G/B) | 노출 EV | 보정 | 워터마크 | 메타데이터 |";
  const line = "|---|---|---|---|---|---:|---:|---|---|---|---|---|";
  const body = rows.map((r) => `| ${r.id.toUpperCase()} | \`${r.output}\` | ${r.kind === "render" ? "렌더" : "실사"} | ${r.src} | ${r.out} | ${r.srcKB.toLocaleString()} | ${r.outKB.toLocaleString()} | ${r.gains} | ${r.ev} | ${r.adjusted} | ${r.watermark} | ${r.meta} |`);
  const summary = [
    `- 처리: ${rows.length}장 (실사 ${rows.filter((r) => r.kind === "photo").length} · 렌더 ${rows.filter((r) => r.kind === "render").length})`,
    `- 용량: 원본 ${(sum("srcKB") / 1024).toFixed(1)} MB → 결과 ${(sum("outKB") / 1024).toFixed(1)} MB`,
    `- 톤 보정 적용: ${adjusted}장 (화이트밸런스 ±${WB_LIMIT * 100}% · 노출 ±${EV_LIMIT}EV 이내, 렌더 제외)`,
    `- 메타데이터(EXIF·GPS·ICC·XMP)가 남은 결과 파일: ${metaLeft}장`,
    `- 설정: 긴 변 ${MAX_EDGE}px 이하(확대 없음) · JPEG 품질 ${QUALITY} · 보정 ${doAdjust ? "켬" : "끔"} · 워터마크 ${doWatermark ? `실사 ${rows.filter((r) => r.watermark === "✓").length}장` : "끔"}`,
  ];
  const md = [
    "# 이미지 처리 리포트",
    "",
    "`npm run images` 가 생성합니다 (scripts/process-images.mjs). 직접 고치지 마세요.",
    "",
    `- 생성: ${new Date().toISOString().slice(0, 10)}`,
    ...summary,
    "- 전후 비교: `npm run images -- --compare` → `scripts/out/compare/` (git 제외)",
    "",
    header,
    line,
    ...body,
    "",
  ].join("\n");
  await fs.writeFile(REPORT, md, "utf8");

  console.table(rows.map(({ id, output, src, out, srcKB, outKB, gains, ev, adjusted, watermark, meta }) => ({ id, output, src, out, srcKB, outKB, gains, ev, adjusted, watermark, meta })));
  console.log(summary.join("\n"));
  console.log(`[images] 리포트: ${path.relative(ROOT, REPORT)}`);
  if (metaLeft > 0) {
    console.error(`[images] 메타데이터가 남은 파일이 ${metaLeft}장 있습니다`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

// Photo-evidence concept sheets, NOT construction details. All coordinates are unitless.
// Shared geometry keeps openings aligned with the approved plan and interactive model.
import { mkdir, writeFile } from "node:fs/promises";
import { body, pod, walls, furniture } from "../lib/concept-house.ts";

const slug = "prototype-01";
const dir = new URL(`../public/drawings/${slug}/`, import.meta.url);
const esc = s => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const n = v => Number(v.toFixed(2));
const text = (x, y, s, cls = "body", anchor = "start") => `<text x="${n(x)}" y="${n(y)}" class="${cls}" text-anchor="${anchor}">${esc(s)}</text>`;
const line = (x1, y1, x2, y2, cls = "fine") => `<path class="${cls}" d="M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}"/>`;
const rect = (x, y, w, h, cls = "fine") => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" class="${cls}"/>`;
const pair = (x, y, ko, en, cls = "body", anchor = "start") => text(x, y, ko, cls, anchor) + text(x, y + 24, en, "meta", anchor);
function leader(x, y, bendX, labelX, labelY, ko, en, unknown = false) {
  const endX = labelX < bendX ? labelX + 285 : labelX - 12;
  return `<g><circle cx="${n(x)}" cy="${n(y)}" r="3" fill="#b8956a"/><path class="${unknown ? "guess" : "leader"}" d="M${n(x)} ${n(y)}L${n(bendX)} ${n(labelY - 6)}H${n(endX)}"/>${pair(labelX, labelY, ko, en, unknown ? "accent" : "body")}</g>`;
}
const style = `<defs>
<pattern id="panel-joints" width="86" height="460" patternUnits="userSpaceOnUse"><path d="M0 0V460" stroke="#7a7570" stroke-width=".65"/></pattern>
<pattern id="cut-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V10" stroke="#b8956a" stroke-width="1"/></pattern>
<pattern id="unknown-hatch" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M3 3h2" stroke="#7a7570" stroke-width="1"/></pattern>
</defs><style>
text{font-family:Arial,'Malgun Gothic',sans-serif;fill:#ede8e0}.title{font-size:38px}.body{font-size:19px}.meta{font-size:15px;fill:#7a7570}.accent{font-size:18px;fill:#b8956a}.small{font-size:16px}.tag{font-size:15px;fill:#b8956a;letter-spacing:2px}
.outline{fill:none;stroke:#ede8e0;stroke-width:3}.fine{fill:none;stroke:#ede8e0;stroke-width:1.2}.leader{fill:none;stroke:#7a7570;stroke-width:.8}.window{fill:none;stroke:#b8956a;stroke-width:1.25}.guess{fill:none;stroke:#b8956a;stroke-width:1.2;stroke-dasharray:7 5}.hidden{fill:none;stroke:#7a7570;stroke-width:1;stroke-dasharray:5 5}.cut{fill:url(#cut-hatch);stroke:#ede8e0;stroke-width:3}.unknown{fill:url(#unknown-hatch);stroke:#b8956a;stroke-width:1.2;stroke-dasharray:7 5}.panel{fill:url(#panel-joints);stroke:#ede8e0;stroke-width:2}.joint{fill:none;stroke:#7a7570;stroke-width:.65}
</style>`;
function sheet(title, english, content, source, footer) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1080" role="img" aria-labelledby="title desc">
<title id="title">${esc(title)} — ${slug}</title><desc id="desc">${esc(english)}. 고객 이해를 위한 개념도. 축척 없음. 비례·단면 구성 추정. 점선과 [확인 필요]는 미확인 구간. ${esc(source)}</desc>
${style}
${text(72,65,"CW_ART HOUSE / SPATIAL STUDY","tag")}${text(1368,65,"CONCEPT / 개념도","tag","end")}
${text(72,120,title,"title")}${text(72,153,english,"meta")}${line(72,180,1368,180,"leader")}
${content}
${line(72,998,1368,998,"leader")}${text(72,1025,footer,"small")}${text(72,1054,source,"meta")}
</svg>`;
}
const baseY = 690;
function elevationWall(w, scale, offset) {
  const left = offset + w.from * scale, top = baseY - w.height * scale;
  // Mask removes joint pattern under openings without introducing an opaque background.
  const mask = `mask-${w.id}`;
  const holes = w.openings.map(o => `<rect x="${n(offset + o.at * scale)}" y="${n(baseY - (o.sill + o.height) * scale)}" width="${n(o.width * scale)}" height="${n(o.height * scale)}" fill="black"/>`).join("");
  let result = `<g id="elevation-${w.id}"><defs><mask id="${mask}" maskUnits="userSpaceOnUse" x="${n(left - 5)}" y="${n(top - 5)}" width="${n((w.to - w.from) * scale + 10)}" height="${n(w.height * scale + 10)}"><rect x="${n(left - 5)}" y="${n(top - 5)}" width="${n((w.to - w.from) * scale + 10)}" height="${n(w.height * scale + 10)}" fill="white"/>${holes}</mask></defs><g mask="url(#${mask})">${rect(left, top, (w.to-w.from)*scale, w.height*scale,"panel")}</g>`;
  for (const [index, o] of w.openings.entries()) {
    const x = offset + o.at * scale, y = baseY - (o.sill+o.height)*scale, width = o.width * scale, height = o.height * scale;
    const cls = o.kind === "hatch" ? "fine" : "window";
    result += `<g data-opening="${w.id}-${index}">` + rect(x, y, width, height, cls) + rect(x+4,y+4,width-8,height-8,cls);
    if (o.kind === "door" || w.id === "a-pod") result += line(x+width/2,y+4,x+width/2,y+height-4,cls);
    result += "</g>";
  }
  return result + "</g>";
}
function heights(x, edgeY, highestY) {
  // No dimension table has been supplied: do not calculate measurements from illustration coordinates.
  return leader(x,highestY,1110,1140,305,"최고 높이 [확인 필요]","Overall height · unconfirmed",true)
    + leader(x,edgeY,1090,1140,385,"처마 높이 [확인 필요]","Eaves height · unconfirmed",true);
}
function elevationFooter(extra) {
  return pair(72,852,"실선: 사진에서 확인한 형태 · 선 패턴: 패널 이음의 단순화","Solid lines: observed form · Linear pattern: simplified panel joints")
    + pair(72,916,"점선: 추정 · 높이·간격·지반 레벨은 미확정","Dashed: inferred · Heights, spacing and ground level are unconfirmed")
    + pair(810,852,extra,"Expanded configuration · Not to scale")
    + pair(810,916,"GL은 개념 기준선이며 현장 측량값이 아닙니다.","GL is illustrative, not a surveyed level.");
}
function front() {
  const s=125, cx=655;
  let c = pair(72,222,"01 / 정면 · 견인부에서 본 모습","Front elevation · Looking from towing end");
  // Pod returns appear beyond the nearer towing-end wall; only exposed side strips are drawn.
  for (const id of ["b-pod-tow","a-pod-tow"]) c += elevationWall(walls.find(w=>w.id===id),s,cx);
  c += elevationWall(walls.find(w=>w.id==="tow-end"),s,cx);
  c += rect(cx-1.53*s,baseY-body.height*s-12,3.06*s,12,"outline");
  c += line(cx-2.65*s,baseY-pod.height*s-7,cx-1.5*s,baseY-pod.height*s-7,"fine");
  c += line(cx+1.5*s,baseY-pod.height*s-7,cx+2.65*s,baseY-pod.height*s-7,"fine");
  c += rect(cx-1.5*s,baseY,3*s,22,"outline") + rect(cx-10,baseY+22,20,28,"fine");
  c += line(200,770,1080,770,"hidden") + text(1100,776,"GL · 지반선","accent");
  c += `<path class="guess" d="M${cx-150} 712v58m300-58v58"/>`;
  c += heights(cx+1.53*s,baseY-body.height*s,baseY-body.height*s-12);
  c += pair(300,800,"B측 / B side","", "accent") + text(925,800,"A측 / A side","accent");
  c += leader(cx,baseY+42,1050,1140,650,"견인부 / 섀시","Drawbar / chassis");
  c += elevationFooter("양측 확장 상태 · 개구부는 평면도와 연동");
  return sheet("정면 입면도 · 견인부 쪽","FRONT ELEVATION / TOWING END",c,"사진 근거 / Photo references: ING-05 · ING-65 · 공통 형상 / Geometry: plan-prototype-01.svg","개념도 · 비례 추정 · 축척 없음 / Concept only · Inferred proportions · NTS");
}
function side() {
  const s=85,cx=625;
  let c = pair(72,222,"02 / A측면 · 출입문이 있는 쪽","A-side elevation · Entrance side");
  for (const id of ["a-tow","a-entry","a-pod"]) c += elevationWall(walls.find(w=>w.id===id),s,cx);
  // Main wall behind the pod: only the visible header is drawn, not a see-through wall.
  c += rect(cx+pod.left*s,baseY-body.height*s,(pod.right-pod.left)*s,(body.height-pod.height)*s,"panel");
  // The two uprights over the expansion box are visible in ING-08; sizes are schematic.
  for (const x of [pod.left + .45, pod.right - .45]) c += rect(cx+x*s,baseY-body.height*s+9,5,(body.height-pod.height)*s-9,"fine");
  c += rect(cx-5*s,baseY-body.height*s-10,10*s,10,"outline");
  c += line(cx+pod.left*s-5,baseY-pod.height*s-6,cx+pod.right*s+5,baseY-pod.height*s-6,"fine");
  c += rect(cx-5*s,baseY,10*s,20,"outline");
  c += `<path class="fine" d="M${cx-5*s} 708h-85m0 0v-12m-12 12h24"/>`;
  c += `<path class="guess" d="M250 710v60m700-60v60"/>`;
  c += line(100,770,1090,770,"hidden")+text(1120,776,"GL · 지반선","accent");
  c += heights(cx+5*s,baseY-body.height*s,baseY-body.height*s-10);
  c += pair(210,800,"← 견인부 Tow","", "accent")+text(1045,800,"출입문 쪽 Entry →","accent","end");
  c += elevationFooter("확장 상태 · 차축 수와 구동 장치는 미표기");
  return sheet("측면 입면도 · A측","SIDE ELEVATION / ENTRANCE SIDE",c,"사진 근거 / Photo references: ING-08 · ING-65 · 공통 형상 / Geometry: plan-prototype-01.svg","개념도 · 패널 이음 간격·창 크기·높이는 추정 / Panel spacing, opening sizes and heights are approximate.");
}

function section() {
  // A–A is X=-2.05, facing +X: it crosses the living sofa and kitchen counter.
  const xCut=-2.05,s=105,cx=710,fy=665;
  const X=z=>cx+z*s,Y=y=>fy-y*s;
  let c=pair(72,222,"03 / A–A · 거실을 지나는 횡단면","Living cross-section · Looking toward the loft end");
  c+=text(1368,222,"단면 구성 추정 / Inferred section","accent","end");
  // Roof panel, framing and unverified finish are separate symbol bands, not thickness specifications.
  const roofBand=(left,right,height)=>rect(X(left),Y(height)-13,(right-left)*s,13,"cut")
    + rect(X(left),Y(height),(right-left)*s,12,"fine")
    + line(X(left),Y(height)+22,X(right),Y(height)+22,"guess");
  c+=`<g id="section-roof">${roofBand(-1.5,1.5,body.height)}${roofBand(-2.6,-1.5,pod.height)}${roofBand(1.5,2.6,pod.height)}</g>`;
  // Wall cut and unverified interior lining.
  for(const z of [-2.6,2.6]) {
    c+=rect(X(z)-7,Y(pod.height),14,pod.height*s,"cut");
    c+=line(X(z)+(z<0?18:-18),Y(pod.height)+24,X(z)+(z<0?18:-18),fy,"guess");
  }
  for(const z of [-1.5,1.5]) c+=rect(X(z)-6,Y(body.height),12,(body.height-pod.height)*s,"cut");
  // Floors retain the A-side step observed in ING-13/16. Layer thicknesses are schematic.
  c+=`<g id="section-floor">${rect(X(-2.6),fy,4.1*s,8,"cut")}${rect(X(1.5),fy-16,1.1*s,8,"cut")}
    ${rect(X(-2.6),fy+8,4.1*s,14,"unknown")}${rect(X(1.5),fy-8,1.1*s,14,"unknown")}
    ${rect(X(-1.5),fy+22,3*s,18,"cut")}${rect(X(-2.6),fy+22,1.1*s,12,"fine")}${rect(X(1.5),fy+6,1.1*s,12,"fine")}</g>`;
  for(const f of furniture.filter(f=>!f.level && f.x<xCut && f.x+f.w>xCut)) {
    const level=f.z>1?.23:.08;
    c+=rect(X(f.z),Y(level+f.h),f.d*s,f.h*s,"guess");
    if(f.kind==="sofa") c+=rect(X(f.z),Y(level+f.h+.3),f.d*s,.3*s,"guess");
  }
  c+=line(380,780,1040,780,"hidden")+text(1048,786,"GL","accent");
  c+=`<path class="guess" d="M${X(-1)} ${fy+40}v75m${2*s} -75v75"/>`;
  c+=pair(X(-1.8),510,"주방 Kitchen","배치 추정 / Proposed", "small","middle");
  c+=pair(X(1.5),510,"거실 Living","배치 추정 / Proposed", "small","middle");
  c+=leader(X(-.65),Y(body.height)-9,390,72,290,"지붕 패널 · ING-24","Roof panels · observed");
  c+=leader(X(-.7),Y(body.height)+8,360,72,385,"지붕 골조 · ING-23","Roof framing · observed");
  c+=leader(X(-2.6),490,380,72,480,"외벽 패널 / 스터드","Panel / studs · ING-44");
  c+=leader(X(-1.1),fy+4,370,72,590,"바닥 판재 · ING-16","Floor boards · material TBD");
  c+=leader(X(-1.1),fy+30,350,72,700,"강재 섀시 · ING-03","Steel chassis · observed");
  c+=leader(X(.5),Y(body.height)-18,1080,1110,290,"방수층 [확인 필요]","Presence / position unverified",true);
  c+=leader(X(.6),Y(body.height)+22,1080,1110,385,"천장 마감 [확인 필요]","Ceiling finish unverified",true);
  c+=leader(X(2.6)-18,495,1080,1110,480,"내장 마감 [확인 필요]","Interior finish unverified",true);
  c+=leader(X(.6),fy+15,1080,1110,590,"바닥 단열·방습 [확인 필요]","Floor insulation / vapour control",true);
  c+=leader(X(1),fy+87,1080,1110,700,"기초·지지 방식 [확인 필요]","Final site support unverified",true);
  // Detail bubble is keyed to the outer A-side living wall.
  c+=`<circle cx="${X(2.6)}" cy="550" r="35" class="guess"/>${line(X(2.6)+27,574,1040,823,"guess")}${text(1050,830,"D1 → 외벽 상세 / Wall detail","accent")}`;
  c+=pair(72,880,"해치: 절단된 부재 · 점선: 미확인 구성 / 추정 위치","Hatched: cut members · Dashed: unverified build-up / inferred position");
  c+=pair(72,944,"A측 바닥 단차는 사진에 보이나, 단차 높이와 각 레이어 두께는 미확정입니다.","The A-side floor step is visible in photos; its height and all layer thicknesses remain unconfirmed.");
  return sheet("거실 단면도 · A–A","SECTION A–A / LIVING",c,"사진 근거 / Photo references: ING-03 · ING-13 · ING-16 · ING-23 · ING-24 · ING-44","개념도 · 레이어 순서·접합·두께는 시공 사양이 아닙니다 / Schematic build-up, not a construction specification.");
}

function detail() {
  let c=pair(72,222,"04 / D1 · 거실 외벽의 일반부 확대","Living exterior wall · Schematic enlarged section");
  c+=text(1368,222,"단면 구성 추정 / Inferred build-up","accent","end");
  c+=text(130,293,"실내 Interior","accent")+line(295,287,700,287,"leader")+`<path class="window" d="M687 280l13 7-13 7"/>`+text(735,293,"실외 Exterior","accent");
  // Finish not seen; steel stud is discrete framing, not a continuous solid layer.
  c+=`<g id="layer-interior-finish">${rect(165,335,25,360,"unknown")}${text(177,730,"01","accent","middle")}</g>`;
  c+=`<g id="layer-stud-zone">${rect(220,335,190,360,"guess")}
    <path d="M260 352h90v32h-10v-22h-70v306h70v-22h10v32h-90Z" fill="url(#cut-hatch)" stroke="#ede8e0" stroke-width="3"/>
    ${text(310,730,"02","accent","middle")}</g>`;
  c+=`<g id="layer-panel">${rect(455,335,16,360,"fine")}${rect(471,335,145,360,"unknown")}${rect(616,335,16,360,"fine")}
    ${text(543,730,"03","accent","middle")}${text(632,730,"04","accent","middle")}</g>`;
  c+=leader(178,350,720,900,315,"01 내장 마감 [확인 필요]","Interior lining / finish unverified",true);
  c+=leader(265,405,735,900,415,"02 강재 벽 스터드 · ING-44","Steel wall studs · observed");
  c+=leader(540,485,750,900,515,"03 패널 심재 [확인 필요]","Core type / thickness unverified",true);
  c+=leader(630,585,765,900,615,"04 외피 패널 면재 · ING-08/44","Panel facing · finish specification TBD");
  c+=pair(135,790,"방수·방습층 [확인 필요]","Membranes: presence / position unverified", "accent");
  c+=text(135,844,"설치 위치를 알 수 없어 특정 레이어로 배치하지 않았습니다.","small");
  c+=text(135,870,"No membrane position is implied by this diagram.","meta");
  c+=pair(900,715,"이음부 실링 · 창 주변 발포 충진","Joint sealant / window foam · ING-44");
  c+=pair(900,790,"‘PIR PANEL’ 표기 · ING-44","Marking observed; product specification TBD");
  c+=pair(900,865,"롤 단열재 · 보관 상태 ING-16","Stored insulation roll; installation unverified");
  c+=line(72,910,1368,910,"leader");
  c+=text(72,946,"사진에 보이는 부재와 미확인 구간을 구분한 도해입니다. 완성 벽체의 시공·성능을 입증하는 자료는 아닙니다.","small");
  c+=text(72,974,"Observed components are separated from unknowns. This is not proof of a completed wall assembly or its performance.","meta");
  return sheet("외벽 상세 확대도 · D1","WALL DETAIL / INTERIOR → EXTERIOR",c,"사진 근거 / Photo references: ING-08 · ING-16 · ING-44 · 표기 인용은 자재 성능·등급의 확정이 아닙니다.","개념 상세 · 실제 순서·간격·두께·접합은 [확인 필요] / Actual sequence, spacing, thickness and connections are unverified.");
}
await mkdir(dir,{recursive:true});
for(const [kind,svg] of [["elevation-front",front()],["elevation-side",side()],["section",section()],["detail-wall",detail()]]) {
  await writeFile(new URL(`${kind}-${slug}.svg`,dir),svg);
  console.log(`Generated ${kind}-${slug}.svg`);
}

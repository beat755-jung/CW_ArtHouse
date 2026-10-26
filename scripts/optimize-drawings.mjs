import { readdir, readFile, writeFile } from "node:fs/promises";
import { prepareSvg } from "./lib/prepare-svg.mjs";

const root = new URL("../public/drawings/", import.meta.url);
for (const dir of await readdir(root, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const folder = new URL(`${dir.name}/`, root);
  for (const file of await readdir(folder)) {
    if (!file.endsWith(".svg")) continue;
    const url = new URL(file, folder), before = await readFile(url, "utf8");
    const { svg, removed, ids, texts } = prepareSvg(before);
    await writeFile(url, svg);
    console.log(JSON.stringify({ file: `${dir.name}/${file}`, before: Buffer.byteLength(before), after: Buffer.byteLength(svg), removed, ids: ids.length, texts }));
  }
}

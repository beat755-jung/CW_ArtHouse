import test from "node:test";
import assert from "node:assert/strict";
import { prepareSvg } from "./lib/prepare-svg.mjs";

test("strips executable and external SVG content, preserving internal mask references", () => {
  const { svg, removed } = prepareSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" onload="alert(1)">
    <script>alert(1)</script><foreignObject><div>unsafe</div></foreignObject>
    <style>@import url('https://example.invalid/font.css');</style>
    <image href="https://example.invalid/a.png"/><use href="https://example.invalid/a.svg#x"/>
    <defs><mask id="mask"><rect width="10" height="10" fill="white"/></mask></defs>
    <g id="room-living" onclick="alert(2)" mask="url(#mask)"><text id="label">거실 Living</text></g>
  </svg>`);
  assert(!/<script|foreignObject|<image|onload=|onclick=|example\.invalid/.test(svg));
  assert(!/<svg[^>]*\s(?:width|height)=/.test(svg));
  assert(svg.includes('viewBox="0 0 800 600"'));
  assert(svg.includes('id="room-living"') && svg.includes('id="label"') && svg.includes("거실 Living"));
  assert(svg.includes('url(#mask)') && svg.includes('width="10"'));
  assert(removed.length >= 7);
});

test("normalizes the muted token without removing text, IDs or transparent hit areas", () => {
  const { svg, ids, texts } = prepareSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <style>.meta{fill:#7a7570}.room-hit{fill:#b8956a;fill-opacity:0}</style>
    <g id="room-loft"><rect class="room-hit" width="90" height="90"/><text class="meta">다락 Loft</text></g></svg>`);
  assert(!svg.includes("#7a7570"));assert(svg.includes("#8a857f"));
  assert.deepEqual(ids,["room-loft"]);assert.equal(texts,1);assert(svg.includes("room-hit"));
});

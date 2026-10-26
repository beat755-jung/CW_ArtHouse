import { optimize } from "svgo";

const elements = new Set("svg g defs style title desc path rect circle ellipse line polyline polygon text tspan textPath use symbol clipPath mask pattern linearGradient radialGradient stop".split(" "));
const localReference = /^#[A-Za-z_][\w:.-]*$/;
const unsafeCss = value => /@|\\|url\s*\(|expression\s*\(|javascript:/i.test(value.replace(/\/\*[\s\S]*?\*\//g, "").replace(/url\(\s*['"]?#[\w:.-]+['"]?\s*\)/gi, ""));

/** Strip active/external SVG content before it can be embedded, then optimize conservatively.
 * @param {string} source
 */
export function prepareSvg(source) {
  const removed = [];
  const ids = [];
  let texts = 0;
  const sanitize = {
    name: "local-drawing-only",
    fn: () => ({ element: { enter(node, parent) {
      if (!elements.has(node.name)) {
        removed.push(`element:${node.name}`);
        parent.children = parent.children.filter(child => child !== node);
        return;
      }
      if (node.name === "style") {
        const css = node.children.map(c => c.value ?? "").join("");
        if (unsafeCss(css)) {
          removed.push("external-or-active-css");
          parent.children = parent.children.filter(child => child !== node);
          return;
        }
        for (const child of node.children) if (child.type === "text") child.value = child.value.replaceAll(/#7a7570/gi, "#8a857f");
      }
      const root = node.name === "svg" && parent.type === "root";
      if (root && !node.attributes.viewBox) {
        const width = Number.parseFloat(node.attributes.width), height = Number.parseFloat(node.attributes.height);
        if (!(width > 0 && height > 0)) throw new Error("SVG needs a valid viewBox or numeric dimensions");
        node.attributes.viewBox = `0 0 ${width} ${height}`;
      }
      for (const [name, value] of Object.entries(node.attributes)) {
        const lower = name.toLowerCase();
        const href = lower === "href" || lower === "xlink:href";
        if (lower.startsWith("on") || ["src", "data", "xml:base"].includes(lower)
          || (href && !localReference.test(value))
          || (!lower.startsWith("xmlns") && unsafeCss(value))
          || (root && ["width", "height"].includes(lower))) {
          delete node.attributes[name]; removed.push(`${node.name}@${name}`);
        } else {
          node.attributes[name] = value.replaceAll(/#7a7570/gi, "#8a857f");
          if (root && lower === "style") node.attributes[name] = node.attributes[name].replace(/(?:^|;)\s*(?:width|height)\s*:[^;]*/gi, "");
        }
      }
      if (node.attributes.id) ids.push(node.attributes.id);
      if (node.name === "text") texts++;
    } } }),
  };
  const result = optimize(source, {
    // Explicit list: no cleanupIds, text removal, group collapse or shape conversion.
    plugins: ["removeDoctype", "removeXMLProcInst", "removeComments", sanitize,
      "cleanupAttrs", "minifyStyles", { name: "convertPathData", params: { floatPrecision: 5 } },
      { name: "convertTransform", params: { floatPrecision: 5 } }, "sortAttrs"],
  });
  const outputIds = [...result.data.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  if (ids.some(id => !outputIds.includes(id)) || (result.data.match(/<text\b/g) ?? []).length !== texts) {
    throw new Error("SVG optimization changed IDs or text elements");
  }
  const viewBox = result.data.match(/<svg\b[^>]*\bviewBox="([^"]+)"/)?.[1].split(/[\s,]+/).map(Number);
  if (!viewBox || viewBox.length !== 4 || !viewBox.every(Number.isFinite) || viewBox[2] <= 0 || viewBox[3] <= 0) throw new Error("Invalid SVG viewBox");
  return { svg: result.data, removed, ids, texts, viewBox };
}

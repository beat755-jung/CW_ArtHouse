import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { body, pod, loft, walls, furniture, rooms, type Wall } from "./concept-house";

export type HouseMode = "exterior" | "interior" | "loft";
export type HouseView = "perspective" | "top" | "bottom" | "a" | "b" | "tow" | "rear";
export type HouseScene = ReturnType<typeof createHouseScene>;

/** On-demand rendering; one model serves all camera directions and cutaways. */
export function createHouseScene(host: HTMLElement, onContextLost: () => void, onContextRestored: () => void) {
  const css = getComputedStyle(host);
  const color = (name: string) => new THREE.Color(css.getPropertyValue(name).trim());
  const ink = color("--text"), accent = color("--accent"), bg = color("--bg");
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute("aria-hidden", "true");
  const lost = (event: Event) => { event.preventDefault(); onContextLost(); };
  renderer.domElement.addEventListener("webglcontextlost", lost);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-8, 8, 6, -6, .1, 150);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = false;
  controls.enablePan = false;
  controls.minZoom = .65;
  controls.maxZoom = 3.5;
  controls.minPolarAngle = .001;
  controls.maxPolarAngle = Math.PI - .001;
  controls.target.set(-.3, 1.1, 0);
  scene.add(new THREE.HemisphereLight(ink, accent.clone().multiplyScalar(.4), 1.3));
  const light = new THREE.DirectionalLight(ink, 2);
  light.position.set(-4, 10, 8);
  scene.add(light);
  const fill = new THREE.DirectionalLight(accent, .65);
  fill.position.set(5, 4, -6);
  scene.add(fill);

  const shell = new THREE.Group(), base = new THREE.Group(), roof = new THREE.Group();
  const loftGroup = new THREE.Group(), labels = new THREE.Group();
  scene.add(shell, base, roof, loftGroup, labels);
  const materials: THREE.Material[] = [];
  const mat = (c: THREE.Color, roughness = .8, metalness = .05) => {
    const material = new THREE.MeshStandardMaterial({ color: c, roughness, metalness });
    materials.push(material);
    return material;
  };
  const exterior = mat(ink.clone().lerp(bg, .86), .6, .25);
  const edge = mat(accent, .5, .25);
  const wood = mat(accent.clone().lerp(ink, .25));
  const white = mat(ink);
  const frame = mat(ink.clone().lerp(bg, .85), .45, .35);
  const glass = mat(ink.clone().lerp(bg, .65), .12, .6);
  const bath = mat(ink.clone().lerp(accent, .15));

  const box = (group: THREE.Group, x: number, y: number, z: number, w: number, h: number, d: number, material: THREE.Material) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x + w / 2, y + h / 2, z + d / 2);
    group.add(mesh);
    return mesh;
  };
  // Floors, fascia, and beams; no invented wheel count or concealed mechanical detail.
  box(base, -5.05, -.2, -1.55, 10.1, .2, 3.1, frame);
  box(base, -5, 0, -1.5, 10, .08, 3, wood);
  box(base, pod.left, .1, 1.5, pod.right - pod.left, .13, pod.depth, wood);
  box(base, pod.left, 0, -2.6, pod.right - pod.left, .13, pod.depth, wood);
  for (const z of [-1.1, 1.1]) box(base, -5, -.38, z, 10, .2, .12, frame);
  const beam = (a: THREE.Vector3, b: THREE.Vector3) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(.12, a.distanceTo(b), .12), frame);
    mesh.position.copy(a).add(b).multiplyScalar(.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    base.add(mesh);
  };
  beam(new THREE.Vector3(-5, -.25, -1.1), new THREE.Vector3(-6.5, -.25, 0));
  beam(new THREE.Vector3(-5, -.25, 1.1), new THREE.Vector3(-6.5, -.25, 0));
  box(base, -6.7, -.31, -.1, .4, .15, .2, frame);

  function wallPiece(w: Wall, u: number, v: number, length: number, height: number, depth: number, material: THREE.Material, group = shell) {
    if (length <= .0001 || height <= .0001) return;
    if (w.axis === "x") box(group, u, v, w.fixed - depth / 2, length, height, depth, material);
    else box(group, w.fixed - depth / 2, v, u, depth, height, length, material);
  }
  for (const w of walls) {
    // Grid subdivision cuts genuine holes in all walls, including stacked windows.
    const xs = [...new Set([w.from, w.to, ...w.openings.flatMap(o => [o.at, o.at + o.width])])].sort((a, b) => a - b);
    const ys = [...new Set([0, w.height, ...w.openings.flatMap(o => [o.sill, o.sill + o.height])])].sort((a, b) => a - b);
    for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) {
      const u = (xs[i] + xs[i + 1]) / 2, v = (ys[j] + ys[j + 1]) / 2;
      if (w.openings.some(o => u > o.at && u < o.at + o.width && v > o.sill && v < o.sill + o.height)) continue;
      wallPiece(w, xs[i], ys[j], xs[i + 1] - xs[i], ys[j + 1] - ys[j], .12, exterior);
    }
    // Short wall outline stays visible in cutaway modes.
    const door = w.openings.find(o => o.kind === "door");
    if (door) {
      wallPiece(w, w.from, .08, door.at - w.from, .2, .12, exterior, base);
      wallPiece(w, door.at + door.width, .08, w.to - door.at - door.width, .2, .12, exterior, base);
    } else wallPiece(w, w.from, .08, w.to - w.from, .2, .12, exterior, base);
    for (const o of w.openings) {
      wallPiece(w, o.at, o.sill, o.width, o.height, .035, o.kind === "hatch" ? frame : glass);
      for (const u of [o.at, o.at + o.width - .045]) wallPiece(w, u, o.sill, .045, o.height, .16, frame);
      for (const y of [o.sill, o.sill + o.height - .045]) wallPiece(w, o.at, y, o.width, .045, .16, frame);
      if (o.kind === "door" || w.id === "a-pod") wallPiece(w, o.at + o.width / 2 - .02, o.sill, .04, o.height, .16, frame);
    }
  }
  // Headers over the two open connections to the pods.
  for (const z of [-1.5, 1.5]) box(shell, pod.left, pod.height, z - .06, pod.right - pod.left, body.height - pod.height, .12, exterior);
  box(roof, -5.08, 3.2, -1.58, 10.16, .13, 3.16, exterior);
  for (const z of [-2.66, 1.5]) box(roof, -2.86, 2.65, z, 4.72, .1, 1.16, exterior);
  for (const z of [-1.57, 1.53]) box(roof, -5.04, 3.22, z, 10.08, .025, .025, edge);
  // Existing partition outline; bathroom use/door swing are proposals.
  box(base, 2.8, .08, -1.5, .07, .55, 1.9, bath);
  box(base, 2.8, .08, .36, 1.3, .55, .07, bath);
  box(base, 4.8, .08, .36, .2, .55, .07, bath);
  box(shell, 2.8, .63, -1.5, .07, 1.42, 1.9, bath);
  box(shell, 2.8, .63, .36, 1.3, 1.42, .07, bath);
  box(shell, 4.8, .63, .36, .2, 1.42, .07, bath);
  box(loftGroup, loft.left, loft.level, loft.back, 2.2, .1, 3, wood);
  // Guardrail and access indicate the proposal, not a fabrication specification.
  for (const z of [-1.4, -.7, .7, 1.4]) box(loftGroup, 2.82, 2.15, z, .035, .45, .035, edge);
  box(loftGroup, 2.82, 2.6, -1.4, .035, .035, 2.8, edge);
  for (const z of [-.55, .2]) box(base, 2.48, .1, z, .05, 1.95, .05, frame);
  for (let y = .3; y < 2; y += .28) box(base, 2.47, y, -.55, .08, .04, .8, wood);

  for (const f of furniture) {
    const group = f.level ? loftGroup : base;
    const y = f.level ?? (f.z > 1.5 ? .23 : .13);
    const material = ["sofa", "bed"].includes(f.kind) ? white : ["wc", "basin", "shower"].includes(f.kind) ? bath : wood;
    if (f.kind === "table" || f.kind === "chair") {
      box(group, f.x, y + f.h - .06, f.z, f.w, .06, f.d, material);
      for (const x of [f.x + .04, f.x + f.w - .09]) for (const z of [f.z + .04, f.z + f.d - .09]) box(group, x, y, z, .05, f.h - .06, .05, frame);
      if (f.kind === "chair") box(group, f.x, y + f.h, f.z + f.d - .06, f.w, .3, .06, wood);
    } else if (f.kind === "wc") {
      box(group, f.x, y, f.z + .4, f.w, .55, .15, white);
      const bowl = new THREE.Mesh(new THREE.SphereGeometry(.25, 24, 16), white);
      bowl.scale.set(.85, .55, 1.1); bowl.position.set(f.x + f.w / 2, y + .28, f.z + .25); group.add(bowl);
      box(group, f.x + .12, y, f.z + .15, .24, .25, .3, white);
    } else box(group, f.x, y, f.z, f.w, f.h, f.d, material);
    if (f.kind === "sofa") {
      box(group, f.x, y + f.h, f.z, .13, .3, f.d, white);
      for (const z of [f.z, f.z + f.d - .1]) box(group, f.x, y + f.h, z, f.w, .15, .1, white);
    }
    if (f.kind === "bed") for (const z of [f.z + .12, f.z + 1.1]) box(group, f.x + .12, y + f.h, z, .38, .09, .62, white);
    if (f.kind === "counter") {
      box(group, f.x, y + f.h, f.z, f.w, .045, f.d, white);
      box(group, f.x + .2, y + f.h + .046, f.z + .1, .45, .018, .32, frame);
      box(group, f.x + 1.45, y + f.h + .046, f.z + .1, .45, .018, .32, frame);
    }
  }

  const textures: THREE.Texture[] = [];
  for (const r of rooms) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    ctx.fillStyle = `#${accent.getHexString()}`;
    ctx.beginPath(); ctx.arc(64, 64, 54, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `#${bg.getHexString()}`;
    ctx.font = "500 46px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(r.number, 64, 66);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; textures.push(texture);
    const material = new THREE.SpriteMaterial({ map: texture, depthTest: false, toneMapped: false }); materials.push(material);
    const marker = new THREE.Sprite(material);
    marker.position.set(r.x, .95, r.z); marker.scale.set(.38, .38, .38); marker.renderOrder = 10;
    labels.add(marker);
  }
  const render = () => renderer.render(scene, camera);
  controls.addEventListener("change", render);
  const fit = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    const aspect = width / height;
    const halfHeight = Math.max(4.3, 7.5 / aspect);
    camera.left = -halfHeight * aspect; camera.right = halfHeight * aspect;
    camera.top = halfHeight; camera.bottom = -halfHeight;
    camera.updateProjectionMatrix(); renderer.setSize(width, height); render();
  };
  const observer = new ResizeObserver(fit); observer.observe(host);
  const restored = () => { fit(); onContextRestored(); };
  renderer.domElement.addEventListener("webglcontextrestored", restored);
  const view = (next: HouseView) => {
    const positions: Record<HouseView, [number, number, number]> = {
      perspective: [-8, 8, 11], top: [0, 16, .001], bottom: [0, -16, .001],
      a: [0, 1.1, 18], b: [0, 1.1, -18], tow: [-18, 1.1, 0], rear: [18, 1.1, 0],
    };
    camera.position.fromArray(positions[next]); camera.zoom = 1;
    camera.updateProjectionMatrix(); controls.update(); render();
  };
  const mode = (next: HouseMode) => {
    shell.visible = next === "exterior"; roof.visible = next === "exterior";
    loftGroup.visible = next !== "interior"; labels.visible = next === "interior";
    render();
  };
  mode("interior"); view("perspective"); fit();
  return {
    view, mode,
    zoom(factor: number) { camera.zoom = THREE.MathUtils.clamp(camera.zoom * factor, .65, 3.5); camera.updateProjectionMatrix(); render(); },
    rotate(horizontal: number, vertical: number) {
      const offset = camera.position.clone().sub(controls.target);
      const spherical = new THREE.Spherical().setFromVector3(offset);
      spherical.theta += horizontal; spherical.phi = THREE.MathUtils.clamp(spherical.phi + vertical, .001, Math.PI - .001);
      camera.position.copy(controls.target).add(offset.setFromSpherical(spherical)); controls.update(); render();
    },
    dispose() {
      observer.disconnect(); controls.removeEventListener("change", render); controls.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      renderer.domElement.removeEventListener("webglcontextrestored", restored);
      scene.traverse(obj => { if (obj instanceof THREE.Mesh) obj.geometry.dispose(); });
      materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose());
      renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    },
  };
}

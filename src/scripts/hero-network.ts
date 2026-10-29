// Interactive node network rendered behind the home-page hero.
// Loaded lazily by HeroNetwork.astro; returns a cleanup function.
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';

const NEIGHBOURS = 3; // edges per node
const PULSES = 10; // signals travelling along edges
const RADIUS = 10;

interface Pulse {
  edge: number;
  t: number;
  speed: number;
}

function cssColor(name: string): Color {
  return new Color(getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#888888');
}

// Soft round sprite so points render as dots rather than squares.
function dotTexture(): CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.9)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

// Nodes in a flattened ellipsoid, each linked to its nearest neighbours.
function buildGraph(count: number) {
  const nodes: Vector3[] = [];
  while (nodes.length < count) {
    const v = new Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
    if (v.lengthSq() > 1) continue;
    nodes.push(v.multiply(new Vector3(RADIUS * 1.8, RADIUS, RADIUS * 0.8)));
  }

  const seen = new Set<string>();
  const edges: Array<[number, number]> = [];
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, d: a.distanceToSquared(b) }))
      .filter(({ j }) => j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, NEIGHBOURS)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push([i, j]);
        }
      });
  });
  return { nodes, edges };
}

export function mountHeroNetwork(canvas: HTMLCanvasElement): () => void {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    return () => {}; // No WebGL: the CSS fallback behind the canvas stays visible.
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.innerWidth < 768;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2));

  const scene = new Scene();
  const camera = new PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 26;
  const group = new Group();
  scene.add(group);

  const { nodes, edges } = buildGraph(small ? 55 : 110);
  const texture = dotTexture();

  // Nodes
  const nodeGeometry = new BufferGeometry().setFromPoints(nodes);
  const nodeMaterial = new PointsMaterial({ size: 0.32, map: texture, transparent: true, depthWrite: false });
  group.add(new Points(nodeGeometry, nodeMaterial));

  // Edges
  const edgePositions = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], i) => {
    nodes[a].toArray(edgePositions, i * 6);
    nodes[b].toArray(edgePositions, i * 6 + 3);
  });
  const edgeGeometry = new BufferGeometry();
  edgeGeometry.setAttribute('position', new BufferAttribute(edgePositions, 3));
  const edgeMaterial = new LineBasicMaterial({ transparent: true, opacity: 0.35, depthWrite: false });
  group.add(new LineSegments(edgeGeometry, edgeMaterial));

  // Pulses: accent-coloured signals moving along random edges
  const pulses: Pulse[] = Array.from({ length: PULSES }, () => ({
    edge: Math.floor(Math.random() * edges.length),
    t: Math.random(),
    speed: 0.15 + Math.random() * 0.25,
  }));
  const pulsePositions = new Float32Array(PULSES * 3);
  const pulseGeometry = new BufferGeometry();
  pulseGeometry.setAttribute('position', new BufferAttribute(pulsePositions, 3));
  const pulseMaterial = new PointsMaterial({
    size: 0.7,
    map: texture,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  group.add(new Points(pulseGeometry, pulseMaterial));

  const tmp = new Vector3();
  function placePulses(dt: number) {
    pulses.forEach((p, i) => {
      p.t += p.speed * dt;
      if (p.t >= 1) {
        // Hop to an edge that continues from the node we arrived at.
        const arrived = edges[p.edge][1];
        const next = edges.findIndex(([a], idx) => a === arrived && idx !== p.edge);
        p.edge = next >= 0 ? next : Math.floor(Math.random() * edges.length);
        p.t = 0;
      }
      const [a, b] = edges[p.edge];
      tmp.lerpVectors(nodes[a], nodes[b], p.t).toArray(pulsePositions, i * 3);
    });
    pulseGeometry.attributes.position.needsUpdate = true;
  }

  // Colours follow the site theme tokens, including live theme switches.
  function applyTheme() {
    nodeMaterial.color = cssColor('--color-text-tertiary');
    edgeMaterial.color = cssColor('--color-border-secondary');
    pulseMaterial.color = cssColor('--color-accent');
  }
  applyTheme();
  const themeObserver = new MutationObserver(() => {
    applyTheme();
    if (reducedMotion) render();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas.parentElement!;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Pull the camera back on narrow screens so the network still fills the width.
    camera.position.z = w / h < 1 ? 38 : 26;
    camera.updateProjectionMatrix();
    if (reducedMotion) render();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas.parentElement!);

  const pointer = { x: 0, y: 0 };
  const onPointerMove = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  function render() {
    renderer.render(scene, camera);
  }

  let last = performance.now();
  let spin = 0;
  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    spin += dt * 0.05;
    // Slow drift plus a gentle tilt towards the pointer.
    group.rotation.y += (spin + pointer.x * 0.25 - group.rotation.y) * 0.05;
    group.rotation.x += (pointer.y * 0.15 - group.rotation.x) * 0.05;
    placePulses(dt);
    render();
  }

  // Only animate while the hero is on screen and the tab is visible.
  let onScreen = true;
  function updateLoop() {
    const run = !reducedMotion && onScreen && !document.hidden;
    if (run) last = performance.now();
    renderer.setAnimationLoop(run ? frame : null);
  }
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    updateLoop();
  });
  visibilityObserver.observe(canvas);
  document.addEventListener('visibilitychange', updateLoop);

  if (reducedMotion) {
    placePulses(0);
  } else {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
  }
  resize();
  updateLoop();
  render();
  canvas.classList.add('is-ready');

  return () => {
    renderer.setAnimationLoop(null);
    themeObserver.disconnect();
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    document.removeEventListener('visibilitychange', updateLoop);
    window.removeEventListener('pointermove', onPointerMove);
    [nodeGeometry, edgeGeometry, pulseGeometry, nodeMaterial, edgeMaterial, pulseMaterial, texture].forEach((r) =>
      r.dispose(),
    );
    renderer.dispose();
    // Release the GL context now; browsers cap live contexts and view
    // transitions create a fresh canvas on every visit to the home page.
    renderer.forceContextLoss();
  };
}

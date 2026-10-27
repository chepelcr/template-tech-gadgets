/**
 * The hero's device: a small radio built from rounded boxes. Its knobs turn
 * toward the pointer and its LED powers on once. Renders only when something
 * changed (pointer, LED ramp, resize), and only while visible — core/fx.tsx
 * starts and stops it. three.js lives in this lazy chunk alone.
 */
import {
  CanvasTexture,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
  type Texture,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { SceneFactory } from '@/core';

const COLORS = {
  dial: '#FAFAF8',
  graphite: '#2A2C2F',
  plinth: '#C4C2BA',
  signal: '#E5601A',
  led: '#3C9A4E',
  shell: '#E6E5E0',
};

function grilleTexture(): CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = COLORS.graphite;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = 'rgba(230,229,224,0.28)';
  for (let y = 10; y < size; y += 16) {
    for (let x = 10 + ((y / 16) % 2) * 8; x < size; x += 16) {
      ctx.beginPath();
      ctx.arc(x, y, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function dialTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = COLORS.graphite;
  ctx.fillRect(0, 0, 512, 160);
  ctx.strokeStyle = 'rgba(230,229,224,0.8)';
  for (let i = 0; i <= 40; i += 1) {
    const x = 32 + i * 11.2;
    ctx.lineWidth = i % 5 === 0 ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(x, i % 5 === 0 ? 40 : 56);
    ctx.lineTo(x, 104);
    ctx.stroke();
  }
  ctx.fillStyle = COLORS.signal;
  ctx.fillRect(300, 24, 5, 112);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

const createDevice: SceneFactory = (canvas, { dpr, tier, pointer, fail }) => {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: tier !== 'low', powerPreference: 'low-power' });
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const camera = new PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 0.6, 9.2);
  camera.lookAt(0, -0.2, 0);

  scene.add(new HemisphereLight(0xffffff, 0xbdbbb3, 1.35));
  const key = new DirectionalLight(0xffffff, 1.7);
  key.position.set(3.5, 4.5, 6);
  scene.add(key);
  const rim = new DirectionalLight(0xffffff, 0.55);
  rim.position.set(-5, 2, -3);
  scene.add(rim);

  const geometries: BufferGeometry[] = [];
  const materials: Material[] = [];
  const textures: Texture[] = [];
  const track = <G extends BufferGeometry>(g: G) => (geometries.push(g), g);
  const mat = (m: MeshStandardMaterial) => (materials.push(m), m);

  const device = new Group();
  scene.add(device);

  const body = new Mesh(track(new RoundedBoxGeometry(3.9, 2.35, 1.15, 6, 0.34)), mat(new MeshStandardMaterial({ color: COLORS.dial, roughness: 0.5 })));
  device.add(body);

  const grille = grilleTexture();
  textures.push(grille);
  const grillePanel = new Mesh(
    track(new RoundedBoxGeometry(1.75, 1.75, 0.06, 4, 0.2)),
    mat(new MeshStandardMaterial({ map: grille, roughness: 0.85 })),
  );
  grillePanel.position.set(-0.86, -0.02, 0.58);
  device.add(grillePanel);

  const dial = dialTexture();
  textures.push(dial);
  const dialWindow = new Mesh(track(new RoundedBoxGeometry(1.3, 0.42, 0.05, 3, 0.08)), mat(new MeshStandardMaterial({ map: dial, roughness: 0.35 })));
  dialWindow.position.set(0.98, 0.66, 0.58);
  device.add(dialWindow);

  const knob = (radius: number, color: string, x: number, y: number) => {
    const group = new Group();
    const cap = new Mesh(track(new CylinderGeometry(radius, radius * 1.04, 0.24, 48)), mat(new MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.15 })));
    cap.rotation.x = Math.PI / 2;
    group.add(cap);
    const notch = new Mesh(track(new RoundedBoxGeometry(0.05, radius * 0.75, 0.03, 2, 0.015)), mat(new MeshStandardMaterial({ color: COLORS.shell, roughness: 0.6 })));
    notch.position.set(0, radius * 0.45, 0.13);
    group.add(notch);
    group.position.set(x, y, 0.64);
    device.add(group);
    return group;
  };
  const volume = knob(0.36, COLORS.graphite, 0.86, -0.38);
  const tuner = knob(0.24, COLORS.signal, 1.6, -0.58);

  const ledMaterial = mat(new MeshStandardMaterial({ color: '#1f3a25', emissive: COLORS.led, emissiveIntensity: 0, roughness: 0.3 }));
  const led = new Mesh(track(new SphereGeometry(0.065, 24, 16)), ledMaterial);
  led.position.set(1.6, 0.06, 0.6);
  device.add(led);

  const plinth = new Mesh(track(new RoundedBoxGeometry(4.8, 0.26, 1.7, 4, 0.1)), mat(new MeshStandardMaterial({ color: COLORS.plinth, roughness: 0.9 })));
  plinth.position.set(0, -1.32, 0);
  scene.add(plinth);

  device.rotation.set(-0.06, -0.38, 0);

  // Pointer, eased: knobs turn toward it, the device leans a little.
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let dirty = true;
  const onPointer = (event: PointerEvent) => {
    target.x = (event.clientX / window.innerWidth) * 2 - 1;
    target.y = (event.clientY / window.innerHeight) * 2 - 1;
    dirty = true;
  };

  const ledStart = performance.now();
  let ledOn = false;
  let raf = 0;
  let running = false;

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (!ledOn) {
      // The one autonomous moment: the LED powers on over ~0.9 s.
      const t = Math.min(1, (now - ledStart) / 900);
      ledMaterial.emissiveIntensity = 2.4 * t * t;
      ledOn = t >= 1;
      dirty = true;
    }
    const dx = target.x - current.x;
    const dy = target.y - current.y;
    if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
      current.x += dx * 0.12;
      current.y += dy * 0.12;
      dirty = true;
    }
    if (!dirty) return;
    volume.rotation.z = -current.x * 2.4;
    tuner.rotation.z = -current.x * 3.2 + current.y;
    device.rotation.y = -0.38 + current.x * 0.12;
    device.rotation.x = -0.06 + current.y * 0.05;
    renderer.render(scene, camera);
    dirty = false;
  };

  const onLost = (event: Event) => {
    event.preventDefault();
    cancelAnimationFrame(raf);
    fail();
  };
  canvas.addEventListener('webglcontextlost', onLost);

  return {
    start() {
      if (running) return;
      running = true;
      if (pointer === 'fine') window.addEventListener('pointermove', onPointer, { passive: true });
      dirty = true;
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
    },
    resize(width, height, nextDpr) {
      renderer.setPixelRatio(nextDpr);
      renderer.setSize(Math.max(1, width), Math.max(1, height), false);
      camera.aspect = Math.max(1, width) / Math.max(1, height);
      camera.updateProjectionMatrix();
      dirty = true;
      renderer.render(scene, camera);
    },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('webglcontextlost', onLost);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
};

export default createDevice;

// RENDER — renderer, tone mapping, sky, fog and the one shadow-casting sun.
// Everything visual hangs off the scene built here; draw() is the only paint call.
import * as THREE from 'three';

export function createRender(game) {
  const canvas = document.getElementById('scene');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);
  scene.fog = new THREE.Fog(0x9fd0f0, 180, 620);

  const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 1400);
  camera.position.set(0, 26, 60);

  const sun = new THREE.DirectionalLight(0xfff2cf, 2.6);
  sun.position.set(120, 180, 60);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -160;
  sun.shadow.camera.right = 160;
  sun.shadow.camera.top = 160;
  sun.shadow.camera.bottom = -160;
  sun.shadow.camera.far = 600;
  sun.shadow.bias = -0.0004;
  scene.add(sun);

  const ambient = new THREE.AmbientLight(0x8a97a8, 0.85);
  scene.add(ambient);

  const hemi = new THREE.HemisphereLight(0xbfd8ff, 0x3a2f28, 0.5);
  scene.add(hemi);

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', resize);

  function setSky(skyColor, fogColor, sunColor, sunIntensity, ambColor, ambIntensity) {
    scene.background.set(skyColor);
    scene.fog.color.set(fogColor);
    sun.color.set(sunColor);
    sun.intensity = sunIntensity;
    ambient.color.set(ambColor);
    ambient.intensity = ambIntensity;
  }

  // Lower the pixel ratio on weak machines without touching the scene: the
  // loop measures frame time elsewhere and calls this when it slips.
  function setPixelRatio(ratio) {
    renderer.setPixelRatio(Math.max(1, Math.min(window.devicePixelRatio || 1, ratio)));
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function draw() {
    renderer.render(scene, camera);
  }

  game.renderer = renderer;
  game.scene = scene;
  game.camera = camera;
  game.sun = sun;
  game.ambient = ambient;

  return { renderer, scene, camera, sun, ambient, resize, setSky, setPixelRatio, draw };
}

// IMPACTS — one pooled particle system for dust, smoke, sparks, shells, water
// splashes and tyre skid marks. Particles are recycled, never allocated per
// frame, so a firefight cannot stall the game.
import * as THREE from 'three';

export function createImpacts(game) {
  const MAX = 420;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(MAX * 3);
  const col = new Float32Array(MAX * 3);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({ size: 0.55, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  game.scene.add(points);
  const parts = [];
  for (let i = 0; i < MAX; i += 1) parts.push({ alive: false, x: 0, y: -99, z: 0, vx: 0, vy: 0, vz: 0, life: 0, max: 1, r: 1, g: 1, b: 1 });
  let cursor = 0;
  const skids = [];
  const skidMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0a, transparent: true, opacity: 0.55 });

  const COLORS = {
    dust: [0.75, 0.68, 0.55],
    smoke: [0.32, 0.32, 0.34],
    spark: [1.0, 0.75, 0.25],
    splash: [0.6, 0.75, 0.95],
    shell: [0.95, 0.8, 0.3],
  };

  function spawn(x, y, z, kind, vx, vy, vz, life) {
    const p = parts[cursor];
    cursor = (cursor + 1) % MAX;
    p.alive = true;
    p.x = x; p.y = y; p.z = z;
    p.vx = vx; p.vy = vy; p.vz = vz;
    p.life = life;
    p.max = life;
    const c = COLORS[kind] || COLORS.dust;
    p.r = c[0]; p.g = c[1]; p.b = c[2];
  }

  function burst(x, y, z, kind, n = 10) {
    for (let i = 0; i < n; i += 1) {
      spawn(x, y, z, kind, (Math.random() - 0.5) * 7, Math.random() * 5 + 1, (Math.random() - 0.5) * 7, 0.5 + Math.random() * 0.7);
    }
  }

  function smoke(x, y, z, dt) {
    spawn(x + (Math.random() - 0.5), y, z + (Math.random() - 0.5), 'smoke', 0, 1.6, 0, 1.1);
  }

  function muzzle(x, y, z, heading) {
    const fx = x + Math.sin(heading) * 1.2;
    const fz = z + Math.cos(heading) * 1.2;
    burst(fx, y, fz, 'spark', 6);
  }

  function tracer(origin, dir, range) {
    const end = origin.clone().addScaledVector(dir, Math.min(range, 40));
    spawn(end.x, end.y, end.z, 'spark', 0, 0, 0, 0.12);
  }

  function skidMark(x, z, heading) {
    if (skids.length > 60) {
      const old = skids.shift();
      game.scene.remove(old);
    }
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 2.2), skidMat);
    m.rotation.x = -Math.PI / 2;
    m.rotation.z = -heading;
    m.position.set(x, 0.06, z);
    game.scene.add(m);
    skids.push(m);
  }

  function update(dt) {
    for (let i = 0; i < MAX; i += 1) {
      const p = parts[i];
      if (!p.alive) { pos[i * 3 + 1] = -99; continue; }
      p.life -= dt;
      if (p.life <= 0) { p.alive = false; pos[i * 3 + 1] = -99; continue; }
      p.vy -= 3 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      if (p.y < 0.05) { p.y = 0.05; p.vy = 0; }
      pos[i * 3] = p.x;
      pos[i * 3 + 1] = p.y;
      pos[i * 3 + 2] = p.z;
      const f = p.life / p.max;
      col[i * 3] = p.r * f;
      col[i * 3 + 1] = p.g * f;
      col[i * 3 + 2] = p.b * f;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  }

  game.impacts = { burst, smoke, muzzle, tracer, skidMark, update };
  return game.impacts;
}

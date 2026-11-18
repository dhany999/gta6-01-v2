// CITY-BLOCKS — procedural blocks and facades per district: shared box geometry,
// one canvas window texture per district, heights and colours from the district
// palette. Colliders are recorded on the game so cars and feet never clip walls.
import * as THREE from 'three';
import { DISTRICTS } from './tuning.js';

const BLOCK = 52;
const ROAD = 14;

function windowTexture(base, lit) {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = base;
  g.fillRect(0, 0, 128, 256);
  for (let y = 12; y < 244; y += 26) {
    for (let x = 10; x < 118; x += 22) {
      const on = Math.random() < 0.5;
      g.fillStyle = on ? lit : 'rgba(96,118,150,0.92)';
      g.fillRect(x, y, 14, 18);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createCityBlocks(game) {
  const rng = game.rng;
  const group = new THREE.Group();
  group.name = 'city-blocks';
  const colliders = game.colliders;
  const windowMats = game.windowMats;
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);

  for (const d of DISTRICTS) {
    const [x0, z0, x1, z1] = d.bounds;
    const tex = windowTexture(d.palette[0], '#ffd27a');
    const mat = new THREE.MeshLambertMaterial({ map: tex, emissive: 0xffc861, emissiveMap: tex, emissiveIntensity: 0 });
    windowMats.push(mat);
    const roofMat = new THREE.MeshLambertMaterial({ color: 0x2c313a });
    for (let bx = x0 + BLOCK / 2; bx < x1; bx += BLOCK) {
      for (let bz = z0 + BLOCK / 2; bz < z1; bz += BLOCK) {
        if (rng.next() > d.density) continue;
        if (Math.abs(bx) < 30 && Math.abs(bz) < 30) continue;
        if (Math.hypot(bx + 120, bz + 30) < 36) continue;
        const w = rng.range(22, 34);
        const dep = rng.range(22, 34);
        const h = rng.range(d.height[0], d.height[1]);
        const mesh = new THREE.Mesh(boxGeo, mat);
        mesh.scale.set(w, h, dep);
        mesh.position.set(bx + rng.range(-4, 4), h / 2, bz + rng.range(-4, 4));
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
        const roof = new THREE.Mesh(boxGeo, roofMat);
        roof.scale.set(w + 1, 0.8, dep + 1);
        roof.position.set(mesh.position.x, h + 0.4, mesh.position.z);
        group.add(roof);
        colliders.push({
          minX: mesh.position.x - w / 2, maxX: mesh.position.x + w / 2,
          minZ: mesh.position.z - dep / 2, maxZ: mesh.position.z + dep / 2,
        });
        if (d.style === 'colorful' && rng.chance(0.5)) {
          const awn = new THREE.Mesh(boxGeo, new THREE.MeshLambertMaterial({ color: rng.pick([0xe2607a, 0xf2a541, 0x4fae8d]) }));
          awn.scale.set(w * 0.7, 1.2, 3);
          awn.position.set(mesh.position.x, 4.5, mesh.position.z + dep / 2 + 1);
          group.add(awn);
        }
      }
    }
  }
  game.scene.add(group);
  return { group };
}

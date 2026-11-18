// STREET-PROPS — palms, benches, street lamps, billboards, containers, hanging
// cables and neon signs. Lamps are emissive, not real lights, to keep the light
// budget to the one shadow sun plus headlights.
import * as THREE from 'three';

function neonSign(text, color) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = '#0c0f16';
  g.fillRect(0, 0, 256, 64);
  g.fillStyle = color;
  g.font = 'bold 34px system-ui, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(text, 128, 34);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(10, 2.5),
    new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }),
  );
}

export function createStreetProps(game) {
  const group = new THREE.Group();
  group.name = 'street-props';
  const rng = game.rng;
  const trunkMat = new THREE.MeshLambertMaterial({ color: 0x6b4a2f });
  const leafMat = new THREE.MeshLambertMaterial({ color: 0x2f7a4a });
  const lampGlowMat = new THREE.MeshBasicMaterial({ color: 0xffe9a8 });
  const lampPostMat = new THREE.MeshLambertMaterial({ color: 0x1f242c });

  for (let i = 0; i < 90; i += 1) {
    const x = rng.range(-260, 260);
    const z = rng.range(-260, 260);
    if (Math.abs(x % 52) < 10 || Math.abs(z % 52) < 10) continue;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 7, 6), trunkMat);
    trunk.position.set(x, 3.5, z);
    trunk.castShadow = true;
    group.add(trunk);
    const crown = new THREE.Mesh(new THREE.ConeGeometry(3.4, 4, 7), leafMat);
    crown.position.set(x, 8.6, z);
    group.add(crown);
  }
  for (let i = -5; i <= 5; i += 1) {
    for (let j = -5; j <= 5; j += 1) {
      if (rng.chance(0.4)) continue;
      const x = i * 52 + 10;
      const z = j * 52 + 10;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 7, 6), lampPostMat);
      post.position.set(x, 3.5, z);
      group.add(post);
      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), lampGlowMat);
      glow.position.set(x, 7.2, z);
      group.add(glow);
      game.lampGlows.push(glow);
    }
  }
  const signs = [
    { text: 'CAMI GARAGE', color: '#ff5a7a', x: -120, z: -30, ry: 0.4 },
    { text: 'EL FARO ★', color: '#35b6ff', x: -60, z: 60, ry: 1.4 },
    { text: 'RADIO ALBA', color: '#ffb02e', x: 40, z: 20, ry: 0.9 },
    { text: 'HOTEL BRISA', color: '#4fae8d', x: 150, z: 150, ry: -0.9 },
    { text: 'PELICAN BAR', color: '#ff3b6b', x: -180, z: 120, ry: 0.2 },
  ];
  for (const s of signs) {
    const sign = neonSign(s.text, s.color);
    sign.position.set(s.x, 9, s.z);
    sign.rotation.y = s.ry;
    group.add(sign);
    game.neonSigns.push(sign);
  }
  for (let i = 0; i < 26; i += 1) {
    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.5, 1),
      new THREE.MeshLambertMaterial({ color: 0x7a5a34 }),
    );
    bench.position.set(rng.range(-240, 240), 0.6, rng.range(-240, 240));
    group.add(bench);
  }
  game.scene.add(group);
  return { group };
}

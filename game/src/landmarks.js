// LANDMARKS — the three named landmarks with readable signboards: Faro Alba the
// lighthouse on the cape, Jembatan Cobalto the cable bridge, Gran Muelle the port.
import * as THREE from 'three';

function signboard(text, w = 26) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 96;
  const g = c.getContext('2d');
  g.fillStyle = '#101826';
  g.fillRect(0, 0, 512, 96);
  g.fillStyle = '#ffb02e';
  g.font = 'bold 44px system-ui, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(text, 256, 50);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, w * 96 / 512),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true }),
  );
  return mesh;
}

export function createLandmarks(game) {
  const group = new THREE.Group();
  group.name = 'landmarks';
  const rng = game.rng;

  const tower = new THREE.Mesh(
    new THREE.CylinderGeometry(4, 6, 42, 12),
    new THREE.MeshLambertMaterial({ color: 0xf2ead8 }),
  );
  tower.position.set(-248, 21, 248);
  tower.castShadow = true;
  group.add(tower);
  const band = new THREE.Mesh(
    new THREE.CylinderGeometry(4.4, 4.6, 6, 12),
    new THREE.MeshLambertMaterial({ color: 0xc2242a }),
  );
  band.position.set(-248, 30, 248);
  group.add(band);
  const lampRoom = new THREE.Mesh(
    new THREE.CylinderGeometry(3.4, 3.4, 5, 12),
    new THREE.MeshLambertMaterial({ color: 0x222222, emissive: 0xffe9a8, emissiveIntensity: 0.6 }),
  );
  lampRoom.position.set(-248, 44, 248);
  group.add(lampRoom);
  game.windowMats.push(lampRoom.material);
  const beam = new THREE.Mesh(
    new THREE.ConeGeometry(9, 70, 12, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xfff2b0, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }),
  );
  beam.rotation.z = Math.PI / 2;
  beam.position.set(-210, 44, 248);
  group.add(beam);
  game.faroBeam = beam;
  const faroSign = signboard('FARO ALBA');
  faroSign.position.set(-248, 8, 256);
  group.add(faroSign);

  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(26, 2, 560),
    new THREE.MeshLambertMaterial({ color: 0x3a4a5a }),
  );
  deck.position.set(0, 8, -262);
  deck.castShadow = true;
  group.add(deck);
  const pylonMat = new THREE.MeshLambertMaterial({ color: 0x2f6fb2 });
  for (const z of [-380, -262, -144]) {
    const pylon = new THREE.Mesh(new THREE.BoxGeometry(4, 46, 4), pylonMat);
    pylon.position.set(0, 30, z);
    group.add(pylon);
    for (const side of [-1, 1]) {
      const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 42, 6), new THREE.MeshBasicMaterial({ color: 0x9fc3e0 }));
      cable.position.set(side * 6, 26, z);
      cable.rotation.z = side * 0.5;
      group.add(cable);
    }
  }
  const neon = new THREE.Mesh(
    new THREE.BoxGeometry(26.4, 1.2, 3),
    new THREE.MeshBasicMaterial({ color: 0x35b6ff }),
  );
  neon.position.set(0, 9.4, -262);
  group.add(neon);
  game.windowMats.push(neon.material);
  const bridgeSign = signboard('JEMBATAN COBALTO', 34);
  bridgeSign.position.set(0, 16, -240);
  group.add(bridgeSign);

  const craneMat = new THREE.MeshLambertMaterial({ color: 0xd97b2f });
  for (let i = 0; i < 3; i += 1) {
    const x = 200 + i * 34;
    const legA = new THREE.Mesh(new THREE.BoxGeometry(3, 34, 3), craneMat);
    legA.position.set(x, 17, -238);
    group.add(legA);
    const legB = new THREE.Mesh(new THREE.BoxGeometry(3, 34, 3), craneMat);
    legB.position.set(x + 12, 17, -238);
    group.add(legB);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(44, 3, 3), craneMat);
    arm.position.set(x + 6, 34, -238);
    arm.rotation.z = 0.08;
    group.add(arm);
    const hook = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), new THREE.MeshLambertMaterial({ color: 0x222222 }));
    hook.position.set(x + 24, 22, -238);
    group.add(hook);
  }
  const contColors = [0xa34d2d, 0x2f6fb2, 0x4fae8d, 0xe2607a];
  for (let i = 0; i < 14; i += 1) {
    const cont = new THREE.Mesh(
      new THREE.BoxGeometry(12, 3, 3),
      new THREE.MeshLambertMaterial({ color: contColors[i % 4] }),
    );
    cont.position.set(190 + (i % 7) * 14, 1.5 + Math.floor(i / 7) * 3.2, -210 + rng.range(-8, 8));
    cont.castShadow = true;
    group.add(cont);
  }
  const muelleSign = signboard('GRAN MUELLE', 30);
  muelleSign.position.set(220, 12, -200);
  group.add(muelleSign);

  game.scene.add(group);
  return { group };
}

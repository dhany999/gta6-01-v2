// WATERFRONT — the sea south of Playa Brava, the sand, the wooden pier and the
// Gran Muelle quay. The sea is one big animated plane, not a simulation.
import * as THREE from 'three';

export function createWaterfront(game) {
  const group = new THREE.Group();
  group.name = 'waterfront';
  const seaMat = new THREE.MeshLambertMaterial({ color: 0x1d6f8e, transparent: true, opacity: 0.92 });
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(900, 260), seaMat);
  sea.rotation.x = -Math.PI / 2;
  sea.position.set(0, -0.2, 400);
  group.add(sea);
  game.sea = sea;
  game.seaMat = seaMat;

  const sand = new THREE.Mesh(
    new THREE.PlaneGeometry(560, 40),
    new THREE.MeshLambertMaterial({ color: 0xe8d3a0 }),
  );
  sand.rotation.x = -Math.PI / 2;
  sand.position.set(60, 0.0, 272);
  sand.receiveShadow = true;
  group.add(sand);

  const pierMat = new THREE.MeshLambertMaterial({ color: 0x8a6a42 });
  for (let i = 0; i < 12; i += 1) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(6, 0.4, 2.4), pierMat);
    plank.position.set(180, 0.6, 280 + i * 2.6);
    group.add(plank);
  }
  for (const x of [177, 183]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4, 6), pierMat);
    post.position.set(x, 1, 312);
    group.add(post);
  }
  const quay = new THREE.Mesh(
    new THREE.BoxGeometry(120, 2, 30),
    new THREE.MeshLambertMaterial({ color: 0x5d6b78 }),
  );
  quay.position.set(220, 1, -196);
  quay.receiveShadow = true;
  group.add(quay);

  game.scene.add(group);
  return { group, sea };
}

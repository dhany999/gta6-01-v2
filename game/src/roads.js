// ROADS — the street grid: asphalt planes, sidewalks, centre dashes, crossings
// and working traffic lights. Roads sit on a 52 m block pitch with 14 m streets.
import * as THREE from 'three';

export const BLOCK_PITCH = 52;
export const ROAD_WIDTH = 14;
export const WORLD_HALF = 272;

export function createRoads(game) {
  const group = new THREE.Group();
  group.name = 'roads';
  const asphalt = new THREE.MeshLambertMaterial({ color: 0x23262c, transparent: true, opacity: 1 });
  game.roadMat = asphalt;
  const sidewalkMat = new THREE.MeshLambertMaterial({ color: 0x8d8578 });
  const dashMat = new THREE.MeshBasicMaterial({ color: 0xd8c95a });
  const crossMat = new THREE.MeshBasicMaterial({ color: 0xe8e8e8 });

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(WORLD_HALF * 2 + 80, WORLD_HALF * 2 + 80),
    new THREE.MeshLambertMaterial({ color: 0x4a5a48 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  ground.receiveShadow = true;
  group.add(ground);

  const roadGeo = new THREE.PlaneGeometry(ROAD_WIDTH, WORLD_HALF * 2);
  const walkGeo = new THREE.PlaneGeometry(ROAD_WIDTH + 6, WORLD_HALF * 2);
  const lights = [];
  for (let i = -5; i <= 5; i += 1) {
    const c = i * BLOCK_PITCH;
    for (const horizontal of [false, true]) {
      const road = new THREE.Mesh(roadGeo, asphalt);
      road.rotation.x = -Math.PI / 2;
      if (horizontal) road.rotation.z = Math.PI / 2;
      road.position.set(horizontal ? 0 : c, 0.02, horizontal ? c : 0);
      road.receiveShadow = true;
      group.add(road);
      const walk = new THREE.Mesh(walkGeo, sidewalkMat);
      walk.rotation.x = -Math.PI / 2;
      if (horizontal) walk.rotation.z = Math.PI / 2;
      walk.position.set(horizontal ? 0 : c, 0.01, horizontal ? c : 0);
      group.add(walk);
      for (let d = -WORLD_HALF; d < WORLD_HALF; d += 16) {
        const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 4), dashMat);
        dash.rotation.x = -Math.PI / 2;
        if (horizontal) dash.rotation.z = Math.PI / 2;
        dash.position.set(horizontal ? d : c, 0.04, horizontal ? c : d);
        group.add(dash);
      }
    }
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 6, 8), new THREE.MeshLambertMaterial({ color: 0x222222 }));
    pole.position.set(c + 9, 3, c + 9);
    group.add(pole);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.6, 0.8), new THREE.MeshLambertMaterial({ color: 0x111111 }));
    head.position.set(c + 9, 6.4, c + 9);
    group.add(head);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), new THREE.MeshBasicMaterial({ color: 0x37d67a }));
    lamp.position.set(c + 9, 6.9, c + 9);
    group.add(lamp);
    lights.push({ lamp, phase: (i + 5) * 0.7 });
  }
  for (let i = -5; i <= 5; i += 1) {
    for (let j = -5; j <= 5; j += 1) {
      const cx = i * BLOCK_PITCH;
      const cz = j * BLOCK_PITCH;
      for (let s = -1; s <= 1; s += 1) {
        const stripe = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 9), crossMat);
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(cx + s * 3.4, 0.03, cz + 8.5);
        group.add(stripe);
      }
    }
  }
  game.scene.add(group);
  game.trafficLights = lights;
  return { group, lights };
}

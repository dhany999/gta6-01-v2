// POLICE-HELICOPTER — the single helicopter at four and five stars: it holds
// over the last known position, sweeps a visible spotlight cone, and keeps the
// player “seen” while the beam is on them, so hiding needs breaking the beam.
import * as THREE from 'three';

export function createPoliceHelicopter(game) {
  const group = new THREE.Group();
  const bodyMat = new THREE.MeshLambertMaterial({ color: 0x1c2f4a });
  const box = new THREE.BoxGeometry(1, 1, 1);
  function part(w, h, d, x, y, z, mat) {
    const m = new THREE.Mesh(box, mat || bodyMat);
    m.scale.set(w, h, d);
    m.position.set(x, y, z);
    group.add(m);
    return m;
  }
  part(3.4, 1.4, 1.6, 0, 0, 0);
  part(1.2, 1.0, 1.2, 1.6, 0.1, 0, new THREE.MeshLambertMaterial({ color: 0x9fc3e0 }));
  part(0.5, 0.5, 4.2, -2.2, 0.2, 0);
  const rotor = new THREE.Mesh(new THREE.BoxGeometry(9, 0.12, 0.5), new THREE.MeshLambertMaterial({ color: 0x111111 }));
  rotor.position.set(0, 1.1, 0);
  group.add(rotor);
  const beam = new THREE.Mesh(
    new THREE.ConeGeometry(7, 42, 14, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xfff6c0, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false }),
  );
  beam.position.set(0, -21, 0);
  group.add(beam);
  const spot = new THREE.Mesh(new THREE.CircleGeometry(5, 16), new THREE.MeshBasicMaterial({ color: 0xfff6c0, transparent: true, opacity: 0.35 }));
  spot.rotation.x = -Math.PI / 2;
  spot.position.set(0, -41.5, 0);
  group.add(spot);
  group.visible = false;
  game.scene.add(group);

  let angle = 0;
  function update(dt) {
    const s = game.state;
    const active = s.wanted >= 4;
    group.visible = active;
    if (!active) return;
    angle += dt * 0.35;
    const tx = game.lastKnown ? game.lastKnown.x : game.player.x;
    const tz = game.lastKnown ? game.lastKnown.z : game.player.z;
    const hx = tx + Math.sin(angle) * 22;
    const hz = tz + Math.cos(angle) * 22;
    group.position.set(hx, 52, hz);
    rotor.rotation.y += dt * 22;
    group.lookAt(game.player.x, 0, game.player.z);
    const pd = Math.hypot(game.player.x - hx, game.player.z - hz);
    if (pd < 16) {
      game.policeSeesPlayer = true;
      beam.material.opacity = 0.3;
    } else {
      beam.material.opacity = 0.16;
    }
  }

  game.heli = group;
  return { update, group };
}

// POLICE-ROADBLOCK — at three stars the police throw a roadblock across the road
// ahead of the player: two cruisers nose-to-nose plus a spike strip that shreds
// tyres. The block re-positions as the player turns away.
import * as THREE from 'three';
import { buildVehicleMesh } from './vehicles.js';

export function createPoliceRoadblock(game) {
  const blocks = [];
  let repositionTimer = 0;

  function place() {
    clear();
    const p = game.player;
    const v = game.vehicles.current;
    const heading = v ? v.heading : p.heading;
    const ahead = 34;
    const cx = (v ? v.x : p.x) + Math.sin(heading) * ahead;
    const cz = (v ? v.z : p.z) + Math.cos(heading) * ahead;
    for (const side of [-1, 1]) {
      const mesh = buildVehicleMesh('cruiser');
      const px = cx + Math.cos(heading) * side * 5;
      const pz = cz - Math.sin(heading) * side * 5;
      mesh.position.set(px, 0, pz);
      mesh.rotation.y = heading + Math.PI / 2;
      game.scene.add(mesh);
      blocks.push({ mesh, x: px, z: pz, kind: 'cruiser' });
    }
    const strip = new THREE.Group();
    const spikeMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
    for (let i = -4; i <= 4; i += 1) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.7, 4), spikeMat);
      spike.position.set(i * 1.4, 0.35, 0);
      strip.add(spike);
    }
    strip.position.set(cx, 0, cz);
    strip.rotation.y = heading + Math.PI / 2;
    game.scene.add(strip);
    blocks.push({ mesh: strip, x: cx, z: cz, kind: 'spikes' });
    game.notifications.toast('⚠ ROADBLOCK di depan — cari jalan lain!', 'bad');
    game.audio.siren();
  }

  function clear() {
    for (const b of blocks) game.scene.remove(b.mesh);
    blocks.length = 0;
  }

  function update(dt) {
    const s = game.state;
    if (s.wanted < 3) {
      if (blocks.length) clear();
      return;
    }
    repositionTimer -= dt;
    if (!blocks.length || repositionTimer <= 0) {
      place();
      repositionTimer = 14;
    }
    if (s.inCar && game.vehicles.current) {
      const v = game.vehicles.current;
      for (const b of blocks) {
        if (b.kind !== 'spikes') continue;
        if (Math.hypot(v.x - b.x, v.z - b.z) < 4 && Math.abs(v.speed) > 3) {
          v.speed *= 0.25;
          v.damage = Math.min(1, v.damage + 0.3);
          game.impacts.burst(v.x, 0.6, v.z, 'spark', 14);
          game.notifications.toast('Ban kena spike strip!', 'bad');
          game.camera.addShake(0.8);
        }
      }
    }
  }

  game.roadblocks = blocks;
  return { update, place, clear };
}

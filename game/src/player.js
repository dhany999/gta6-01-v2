// PLAYER — Teo Barros on foot: walk, run, aim, enter and exit vehicles. On foot
// he is a small figure with a jacket and cap; the camera, not the mesh, carries
// most of the third-person feel.
import * as THREE from 'three';
import { TUNING } from './tuning.js';
import { collideCircle } from './world.js';

export function createPlayer(game) {
  const group = new THREE.Group();
  const jacket = new THREE.MeshLambertMaterial({ color: 0x2f4a5a });
  const skin = new THREE.MeshLambertMaterial({ color: 0xc98d64 });
  const jeans = new THREE.MeshLambertMaterial({ color: 0x2a3242 });
  const box = new THREE.BoxGeometry(1, 1, 1);
  function part(w, h, d, x, y, z, mat) {
    const m = new THREE.Mesh(box, mat);
    m.scale.set(w, h, d);
    m.position.set(x, y, z);
    m.castShadow = true;
    group.add(m);
    return m;
  }
  const torso = part(0.62, 0.72, 0.34, 0, 1.15, 0, jacket);
  part(0.34, 0.34, 0.32, 0, 1.72, 0, skin);
  part(0.44, 0.16, 0.4, 0, 1.94, 0, new THREE.MeshLambertMaterial({ color: 0x1a1a22 }));
  const legL = part(0.24, 0.7, 0.28, -0.16, 0.35, 0, jeans);
  const legR = part(0.24, 0.7, 0.28, 0.16, 0.35, 0, jeans);
  const armL = part(0.18, 0.6, 0.2, -0.42, 1.15, 0, jacket);
  const armR = part(0.18, 0.6, 0.2, 0.42, 1.15, 0, jacket);
  game.scene.add(group);

  const player = {
    mesh: group, x: 0, z: 26, heading: 0, speed: 0,
    aiming: false, walkPhase: 0, dead: false,
  };

  function step(dt, input) {
    const s = game.state;
    if (s.inCar || player.dead) {
      group.visible = false;
      return;
    }
    group.visible = true;
    const axis = input.axis();
    const run = input.held.has('run');
    const speed = run ? TUNING.playerRun : TUNING.playerWalk;
    let mx = 0;
    let mz = 0;
    if (axis.x !== 0 || axis.y !== 0) {
      const camYaw = game.cameraYaw ?? 0;
      const forward = { x: Math.sin(camYaw), z: Math.cos(camYaw) };
      const right = { x: Math.cos(camYaw), z: -Math.sin(camYaw) };
      mx = forward.x * axis.y + right.x * axis.x;
      mz = forward.z * axis.y + right.z * axis.x;
      const len = Math.hypot(mx, mz) || 1;
      mx /= len;
      mz /= len;
      player.heading = Math.atan2(mx, mz);
      player.walkPhase += dt * (run ? 11 : 7);
    }
    const nx = player.x + mx * speed * dt;
    const nz = player.z + mz * speed * dt;
    const fixed = collideCircle(game, nx, nz, 0.5);
    player.x = fixed.x;
    player.z = fixed.z;
    player.speed = (axis.x !== 0 || axis.y !== 0) ? speed : 0;
    group.position.set(player.x, 0, player.z);
    group.rotation.y = player.heading;
    const swing = player.speed > 0 ? Math.sin(player.walkPhase) * 0.5 : 0;
    legL.rotation.x = swing;
    legR.rotation.x = -swing;
    armL.rotation.x = -swing * 0.7;
    armR.rotation.x = swing * 0.7;
    torso.position.y = 1.15 + (player.speed > 0 ? Math.abs(Math.sin(player.walkPhase)) * 0.05 : 0);
    s.speedKmh = player.speed * 3.6;
    const d = game.districtAt(player.x, player.z);
    if (d.name !== s.district) {
      s.district = d.name;
      game.notifications.toast(`📍 ${d.name}`, 'good');
    }
  }

  function enterVehicle(v) {
    game.vehicles.setCurrent(v);
    game.audio.door();
  }

  function exitVehicle() {
    const v = game.vehicles.current;
    if (!v) return;
    player.x = v.x + Math.cos(v.heading) * 3;
    player.z = v.z - Math.sin(v.heading) * 3;
    game.vehicles.setCurrent(null);
    game.audio.door();
  }

  function nearestVehicle(maxDist = 5) {
    let best = null;
    let bestD = maxDist;
    for (const v of game.vehicles.vehicles) {
      const d = Math.hypot(v.x - player.x, v.z - player.z);
      if (d < bestD) { bestD = d; best = v; }
    }
    return best;
  }

  game.player = player;
  return { player, step, enterVehicle, exitVehicle, nearestVehicle };
}

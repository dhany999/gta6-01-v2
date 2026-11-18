// POLICE-CRUISERS — ground pursuit: cruisers spawn at the map edge, chase the
// player's position (or the last known one), ram, and spin out when wrecked.
// One cruiser's lightbar flashes red and blue.
import { buildVehicleMesh } from './vehicles.js';
import { collideCircle } from './world.js';

export function createPoliceCruisers(game) {
  const cruisers = [];
  let spawnTimer = 0;

  function spawn() {
    const a = game.rng.range(0, Math.PI * 2);
    const x = game.player.x + Math.sin(a) * 90;
    const z = game.player.z + Math.cos(a) * 90;
    const mesh = buildVehicleMesh('cruiser');
    game.scene.add(mesh);
    const c = {
      mesh, x, z, heading: 0, speed: 0, hp: 120, damage: 0, dead: false,
      lightPhase: Math.random() * 2,
    };
    cruisers.push(c);
    return c;
  }

  function update(dt) {
    const s = game.state;
    const want = Math.min(s.wanted, 5);
    const target = want === 0 ? 0 : Math.min(want + 1, 5);
    spawnTimer -= dt;
    while (cruisers.filter((c) => !c.dead).length < target && spawnTimer <= 0) {
      spawn();
      spawnTimer = 2.5;
    }
    game.policeSeesPlayer = false;
    for (const c of cruisers) {
      if (c.dead) continue;
      const tx = game.lastKnown ? game.lastKnown.x : game.player.x;
      const tz = game.lastKnown ? game.lastKnown.z : game.player.z;
      const dx = tx - c.x;
      const dz = tz - c.z;
      const dist = Math.hypot(dx, dz);
      const desired = Math.atan2(dx, dz);
      let diff = desired - c.heading;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      c.heading += Math.max(-1.8 * dt, Math.min(1.8 * dt, diff));
      const top = 26 + s.wanted * 1.6;
      c.speed = Math.min(top, c.speed + 14 * dt);
      const nx = c.x + Math.sin(c.heading) * c.speed * dt;
      const nz = c.z + Math.cos(c.heading) * c.speed * dt;
      const fixed = collideCircle(game, nx, nz, 1.6);
      c.x = fixed.x;
      c.z = fixed.z;
      c.mesh.position.set(c.x, 0, c.z);
      c.mesh.rotation.y = c.heading;
      c.lightPhase += dt * 6;
      const bar = c.mesh.userData.lightbar;
      if (bar) bar.material.color.setHex(Math.sin(c.lightPhase) > 0 ? 0xff2233 : 0x2266ff);
      if (dist < 55) game.policeSeesPlayer = true;
      const pd = Math.hypot(game.player.x - c.x, game.player.z - c.z);
      if (pd < 3.2 && s.inCar && Math.abs(c.speed) > 4) {
        game.vehicles.current.damage = Math.min(1, game.vehicles.current.damage + 0.12);
        game.camera.addShake(0.7);
        game.camera.crashCut();
        game.impacts.burst(c.x, 1, c.z, 'dust', 12);
        c.speed *= 0.4;
      }
    }
  }

  game.cruisers = cruisers;
  return { update, cruisers, spawn };
}

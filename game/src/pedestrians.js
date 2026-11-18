// PEDESTRIANS — sidewalk walkers per district, with panic runs and umbrellas
// in the rain. They flee gunfire and speeding cars, and scream a notification
// when the player runs one down (which raises wanted heat).
import * as THREE from 'three';

const SHIRTS = [0xe2607a, 0xf2a541, 0x4fae8d, 0x6f9cc0, 0xd8d3c3, 0x9a4dff, 0x37d67a];

export function createPedestrians(game) {
  const peds = [];
  const rng = game.rng;
  const box = new THREE.BoxGeometry(1, 1, 1);

  function makePed(x, z) {
    const g = new THREE.Group();
    const shirt = new THREE.MeshLambertMaterial({ color: rng.pick(SHIRTS) });
    const skin = new THREE.MeshLambertMaterial({ color: 0xc98d64 });
    const pants = new THREE.MeshLambertMaterial({ color: 0x2a3242 });
    function part(w, h, d, px, py, pz, mat) {
      const m = new THREE.Mesh(box, mat);
      m.scale.set(w, h, d);
      m.position.set(px, py, pz);
      g.add(m);
      return m;
    }
    part(0.55, 0.65, 0.3, 0, 1.1, 0, shirt);
    part(0.3, 0.3, 0.28, 0, 1.62, 0, skin);
    const legL = part(0.2, 0.62, 0.24, -0.14, 0.31, 0, pants);
    const legR = part(0.2, 0.62, 0.24, 0.14, 0.31, 0, pants);
    let umbrella = null;
    if (rng.chance(0.3)) {
      umbrella = new THREE.Mesh(new THREE.ConeGeometry(0.7, 0.35, 8), new THREE.MeshLambertMaterial({ color: 0xc2242a }));
      umbrella.position.set(0, 2.1, 0);
      g.add(umbrella);
    }
    g.position.set(x, 0, z);
    game.scene.add(g);
    const ped = {
      mesh: g, x, z, heading: rng.range(0, Math.PI * 2),
      speed: rng.range(1.1, 1.9), panic: 0, phase: rng.range(0, 6),
      legL, legR, umbrella, alive: true,
    };
    peds.push(ped);
    return ped;
  }

  function update(dt) {
    while (peds.length < 30) {
      const x = game.player.x + game.rng.range(-70, 70);
      const z = game.player.z + game.rng.range(-70, 70);
      makePed(Math.max(-258, Math.min(258, x)), Math.max(-258, Math.min(258, z)));
    }
    const raining = game.state.rainAmount > 0.25;
    const shooting = game.combat && game.combat.shotsFiredAt > 0 && performance.now() - game.combat.shotsFiredAt < 2500;
    for (const ped of peds) {
      if (!ped.alive) continue;
      const pd = Math.hypot(game.player.x - ped.x, game.player.z - ped.z);
      if (pd < 7 && (shooting || (game.state.inCar && game.state.speedKmh > 50))) ped.panic = 3;
      if (ped.panic > 0) {
        ped.panic -= dt;
        const away = Math.atan2(ped.x - game.player.x, ped.z - game.player.z);
        ped.heading = away;
        ped.x += Math.sin(away) * 5.2 * dt;
        ped.z += Math.cos(away) * 5.2 * dt;
      } else {
        ped.x += Math.sin(ped.heading) * ped.speed * dt;
        ped.z += Math.cos(ped.heading) * ped.speed * dt;
        if (Math.random() < dt * 0.08) ped.heading += game.rng.range(-1.2, 1.2);
        if (Math.abs(ped.x) > 258 || Math.abs(ped.z) > 258) ped.heading += Math.PI;
      }
      ped.phase += dt * (ped.panic > 0 ? 12 : 6);
      ped.legL.rotation.x = Math.sin(ped.phase) * 0.55;
      ped.legR.rotation.x = -Math.sin(ped.phase) * 0.55;
      if (ped.umbrella) ped.umbrella.visible = raining;
      ped.mesh.position.set(ped.x, 0, ped.z);
      ped.mesh.rotation.y = ped.heading;
    }
  }

  game.peds = peds;
  return { update, peds, makePed };
}

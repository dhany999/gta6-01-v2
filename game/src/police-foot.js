// POLICE-FOOT — foot officers: they close in on foot, swing a baton at close
// range, and arrest the player if health is low and they get within arm's reach
// while the player is not in a car.
import * as THREE from 'three';

export function createPoliceFoot(game) {
  const cops = [];
  let spawnTimer = 0;
  const box = new THREE.BoxGeometry(1, 1, 1);

  function makeCop(x, z) {
    const g = new THREE.Group();
    const navy = new THREE.MeshLambertMaterial({ color: 0x1c2f4a });
    const skin = new THREE.MeshLambertMaterial({ color: 0xc98d64 });
    function part(w, h, d, px, py, pz, mat) {
      const m = new THREE.Mesh(box, mat);
      m.scale.set(w, h, d);
      m.position.set(px, py, pz);
      g.add(m);
      return m;
    }
    part(0.6, 0.7, 0.32, 0, 1.15, 0, navy);
    part(0.32, 0.32, 0.3, 0, 1.7, 0, skin);
    part(0.44, 0.14, 0.38, 0, 1.9, 0, navy);
    const legL = part(0.22, 0.68, 0.26, -0.15, 0.34, 0, navy);
    const legR = part(0.22, 0.68, 0.26, 0.15, 0.34, 0, navy);
    g.position.set(x, 0, z);
    game.scene.add(g);
    const cop = { mesh: g, x, z, heading: 0, hp: 60, dead: false, legL, legR, phase: 0, swing: 0 };
    cops.push(cop);
    return cop;
  }

  function update(dt) {
    const s = game.state;
    const want = s.wanted >= 2 ? Math.min(3, s.wanted - 1) : 0;
    spawnTimer -= dt;
    while (cops.filter((c) => !c.dead).length < want && spawnTimer <= 0) {
      makeCop(game.player.x + game.rng.range(-30, 30), game.player.z + game.rng.range(-30, 30));
      spawnTimer = 3;
    }
    game.footSeesPlayer = false;
    for (const cop of cops) {
      if (cop.dead) continue;
      const dx = game.player.x - cop.x;
      const dz = game.player.z - cop.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 40) game.footSeesPlayer = true;
      if (dist > 1.1) {
        cop.heading = Math.atan2(dx, dz);
        const speed = s.inCar ? 0 : 4.6;
        cop.x += Math.sin(cop.heading) * speed * dt;
        cop.z += Math.cos(cop.heading) * speed * dt;
        cop.phase += dt * 8;
        cop.legL.rotation.x = Math.sin(cop.phase) * 0.5;
        cop.legR.rotation.x = -Math.sin(cop.phase) * 0.5;
      } else if (!s.inCar) {
        cop.swing -= dt;
        if (cop.swing <= 0) {
          cop.swing = 0.9;
          game.combat.hurtPlayer(9);
          game.notifications.toast('Polisi memukulmu dengan pentungan!', 'bad');
        }
        if (s.health <= 25) {
          game.onArrested();
          return;
        }
      }
      cop.mesh.position.set(cop.x, 0, cop.z);
      cop.mesh.rotation.y = cop.heading;
    }
  }

  game.footCops = cops;
  return { update, cops, makeCop };
}

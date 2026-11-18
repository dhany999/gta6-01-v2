// COMBAT — shot resolution, damage, death and firefight status. A shot is a
// ray from the camera through the crosshair: the nearest cop, ped or cruiser in
// the cone takes damage; misses spark off the street.
import * as THREE from 'three';
import { WEAPONS } from './tuning.js';

export function createCombat(game) {
  let cooldown = 0;
  const combat = { shotsFiredAt: 0 };

  function targets() {
    const list = [];
    for (const c of game.cruisers || []) list.push({ x: c.x, z: c.z, r: 2.2, kind: 'cruiser', ref: c, hp: c.hp });
    for (const c of game.footCops || []) list.push({ x: c.x, z: c.z, r: 0.7, kind: 'cop', ref: c, hp: c.hp });
    return list;
  }

  function shoot() {
    const s = game.state;
    const w = WEAPONS[s.weapon];
    if (cooldown > 0 || s.ammo[s.weapon] <= 0) return;
    cooldown = w.rate;
    s.ammo[s.weapon] -= 1;
    combat.shotsFiredAt = performance.now();
    game.audio.gunshot(s.weapon);
    game.camera.addShake(s.weapon === 'shotgun' ? 0.5 : 0.16);
    game.wanted.addHeat(0.35);
    const origin = game.camera.position.clone();
    const dir = new THREE.Vector3();
    game.camera.getWorldDirection(dir);
    const pellets = w.pellets || 1;
    let hitAny = false;
    for (let p = 0; p < pellets; p += 1) {
      const spread = new THREE.Vector3(
        (Math.random() - 0.5) * w.spread * 2,
        (Math.random() - 0.5) * w.spread * 2,
        0,
      );
      const d = dir.clone().add(spread).normalize();
      let best = null;
      let bestT = w.range;
      for (const t of targets()) {
        const to = new THREE.Vector3(t.x - origin.x, 0.8 - origin.y, t.z - origin.z);
        const along = to.dot(d);
        if (along < 1 || along > bestT) continue;
        const perp = to.clone().addScaledVector(d, -along).length();
        if (perp < t.r && along < bestT) { bestT = along; best = t; }
      }
      if (best) {
        hitAny = true;
        const point = origin.clone().addScaledVector(d, bestT);
        game.impacts.burst(point.x, point.y, point.z, 'spark', 8);
        damageTarget(best, w.damage);
      } else {
        const end = origin.clone().addScaledVector(d, w.range);
        game.impacts.burst(end.x, 0.4, end.z, 'spark', 3);
      }
      game.impacts.tracer(origin, dir, w.range);
    }
    if (!hitAny) game.impacts.muzzle(game.player.x, 1.5, game.player.z, game.player.heading);
  }

  function damageTarget(t, dmg) {
    if (t.kind === 'cop') {
      t.ref.hp -= dmg;
      if (t.ref.hp <= 0) {
        t.ref.dead = true;
        t.ref.mesh.visible = false;
        game.state.kills += 1;
        game.wanted.addHeat(1.0);
        game.notifications.toast('Polisi tumbang — bintang naik!', 'bad');
      }
    } else if (t.kind === 'cruiser') {
      t.ref.hp -= dmg;
      t.ref.damage = Math.min(1, (t.ref.damage || 0) + dmg / 220);
      if (t.ref.hp <= 0 && !t.ref.dead) {
        t.ref.dead = true;
        game.impacts.burst(t.ref.x, 1, t.ref.z, 'smoke', 26);
        game.impacts.burst(t.ref.x, 1, t.ref.z, 'spark', 18);
        game.state.kills += 1;
        game.wanted.addHeat(1.2);
      }
    }
  }

  function hurtPlayer(amount) {
    const s = game.state;
    if (s.armor > 0) {
      const absorbed = Math.min(s.armor, amount * 0.6);
      s.armor -= absorbed;
      amount -= absorbed;
    }
    s.health = Math.max(0, s.health - amount);
    const flash = document.getElementById('damage-flash');
    if (flash) {
      flash.style.opacity = '1';
      window.setTimeout(() => { flash.style.opacity = '0'; }, 140);
    }
    if (s.health <= 0 && game.onPlayerDown) game.onPlayerDown();
  }

  function update(dt) {
    if (cooldown > 0) cooldown -= dt;
    const s = game.state;
    if (!s.inCar && game.input.mouseDown) {
      const w = WEAPONS[s.weapon];
      if (w.auto || game.input.takeMouseEdge()) shoot();
    }
  }

  game.combat = combat;
  return { update, shoot, hurtPlayer, damageTarget };
}

// VEHICLES — arcade driving, visible damage and six body types: sedan, sport,
// bike, box truck, taxi and police cruiser. Each has its own acceleration, grip
// and weight; the bike tips, the truck shrugs off roadblocks, the sport slides
// in the rain. Doors open, the radio plays, damage smokes and dents.
import * as THREE from 'three';
import { TUNING, VEHICLE_TYPES } from './tuning.js';
import { collideCircle } from './world.js';

export function buildVehicleMesh(type, colorHex) {
  const def = VEHICLE_TYPES[type];
  const color = colorHex ?? def.color;
  const group = new THREE.Group();
  const bodyMat = new THREE.MeshLambertMaterial({ color });
  const darkMat = new THREE.MeshLambertMaterial({ color: 0x14181f });
  const glassMat = new THREE.MeshLambertMaterial({ color: 0x9fc3e0, emissive: 0x223344, emissiveIntensity: 0.4 });
  const tyreMat = new THREE.MeshLambertMaterial({ color: 0x0c0d10 });
  const box = new THREE.BoxGeometry(1, 1, 1);
  function part(w, h, d, x, y, z, mat) {
    const m = new THREE.Mesh(box, mat || bodyMat);
    m.scale.set(w, h, d);
    m.position.set(x, y, z);
    m.castShadow = true;
    group.add(m);
    return m;
  }
  function wheel(x, z) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.32, 10), tyreMat);
    w.rotation.z = Math.PI / 2;
    w.position.set(x, 0.42, z);
    group.add(w);
    return w;
  }
  if (type === 'bike') {
    part(0.5, 0.5, 2.1, 0, 0.75, 0, darkMat);
    part(0.4, 0.45, 0.9, 0, 1.05, 0.2, bodyMat);
    const fender = part(0.5, 0.16, 0.8, 0, 0.95, -0.7, bodyMat);
    fender.rotation.x = 0.2;
    wheel(0, 0.85);
    wheel(0, -0.85);
  } else if (type === 'truck') {
    part(2.2, 1.6, 2.6, 0, 1.1, 1.6, bodyMat);
    part(2.3, 2.6, 4.6, 0, 1.9, -1.8, new THREE.MeshLambertMaterial({ color: 0xd8d3c3 }));
    part(2.0, 0.9, 0.2, 0, 1.5, 2.95, glassMat);
    wheel(1.05, 1.9); wheel(-1.05, 1.9); wheel(1.05, -2.6); wheel(-1.05, -2.6);
  } else {
    const low = type === 'sport';
    const h = low ? 0.62 : 0.78;
    const len = low ? 4.5 : 4.2;
    part(1.95, h, len, 0, 0.75, 0);
    part(1.7, 0.55, len * 0.5, 0, 1.25, low ? 0.25 : -0.2, glassMat);
    if (low) {
      const spoiler = part(1.8, 0.09, 0.45, 0, 1.35, -len / 2 + 0.15, darkMat);
      spoiler.rotation.x = -0.12;
    }
    if (type === 'taxi') {
      part(1.2, 0.3, 0.9, 0, 1.68, -0.2, new THREE.MeshLambertMaterial({ color: 0xf2c200, emissive: 0xaa8800, emissiveIntensity: 0.7 }));
    }
    if (type === 'cruiser') {
      part(2.0, 0.22, 1.1, 0, 1.5, -0.2, new THREE.MeshLambertMaterial({ color: 0xffffff }));
      const bar = new THREE.Mesh(box, new THREE.MeshBasicMaterial({ color: 0xff2233 }));
      bar.scale.set(1.1, 0.18, 0.4);
      bar.position.set(0, 1.62, -0.2);
      group.add(bar);
      group.userData.lightbar = bar;
    }
    wheel(0.95, 1.45); wheel(-0.95, 1.45); wheel(0.95, -1.45); wheel(-0.95, -1.45);
    const headMat = new THREE.MeshBasicMaterial({ color: 0xfff2b0 });
    for (const s of [-1, 1]) {
      const hl = new THREE.Mesh(box, headMat);
      hl.scale.set(0.35, 0.2, 0.1);
      hl.position.set(s * 0.65, 0.75, len / 2 + 0.02);
      group.add(hl);
    }
  }
  group.userData.type = type;
  return group;
}

export function createVehicles(game) {
  const vehicles = [];
  let current = null;

  function spawn(type, x, z, heading, colorHex) {
    const mesh = buildVehicleMesh(type, colorHex);
    mesh.position.set(x, 0, z);
    mesh.rotation.y = heading;
    game.scene.add(mesh);
    const v = {
      type, mesh, x, z, heading, speed: 0,
      damage: 0, color: colorHex ?? VEHICLE_TYPES[type].color,
      mods: game.state.garageMods[type] || {},
      smoke: null,
    };
    vehicles.push(v);
    return v;
  }

  function applyMods(v) {
    if (v.mods.paint) {
      v.mesh.traverse((o) => {
        if (o.isMesh && o.material && o.material.color && o.material.color.getHex() === v.color) {
          o.material = new THREE.MeshLambertMaterial({ color: 0x7a1a26 });
        }
      });
    }
    if (v.mods.underglow && !v.underglow) {
      const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(2.6, 5.2),
        new THREE.MeshBasicMaterial({ color: 0x9a4dff, transparent: true, opacity: 0.5, side: THREE.DoubleSide }),
      );
      glow.rotation.x = -Math.PI / 2;
      glow.position.y = 0.08;
      v.mesh.add(glow);
      v.underglow = glow;
    }
  }

  function step(dt, input) {
    if (!current) return;
    const s = game.state;
    const def = VEHICLE_TYPES[current.type];
    const axis = input.axis();
    const grip = def.grip * (s.rainAmount > 0.25 ? TUNING.rainGrip : 1) * (current.mods.wheels ? 1.08 : 1);
    const top = (def.topSpeed ?? TUNING.vehicleTopSpeed[current.type]) / 3.6;
    const accel = (TUNING.vehicleAccel[current.type] ?? 14) * (current.mods.spoiler ? 1.05 : 1);
    if (axis.y > 0) current.speed += accel * dt;
    else if (axis.y < 0) current.speed -= accel * 1.4 * dt;
    else current.speed *= Math.max(0, 1 - 0.9 * dt);
    if (input.held.has('brake')) current.speed *= Math.max(0, 1 - 3.2 * dt);
    const maxSpeed = top * (1 - current.damage * 0.45);
    current.speed = Math.max(-top * 0.35, Math.min(maxSpeed, current.speed));
    const steer = axis.x * 1.9 * grip * Math.min(1, Math.abs(current.speed) / 8 + 0.25);
    current.heading += steer * dt * Math.sign(current.speed || 1) * -1;
    const nx = current.x + Math.sin(current.heading) * current.speed * dt;
    const nz = current.z + Math.cos(current.heading) * current.speed * dt;
    const fixed = collideCircle(game, nx, nz, 1.6);
    if (Math.abs(fixed.x - nx) > 0.01 || Math.abs(fixed.z - nz) > 0.01) {
      if (Math.abs(current.speed) > 6) {
        current.damage = Math.min(1, current.damage + 0.08);
        game.impacts.burst(fixed.x, 0.8, fixed.z, 'dust', 10);
        game.audio.thud();
      }
      current.speed *= 0.35;
    }
    current.x = fixed.x;
    current.z = fixed.z;
    current.mesh.position.set(current.x, 0, current.z);
    current.mesh.rotation.y = current.heading;
    current.mesh.rotation.z = -axis.x * 0.05 * Math.min(1, Math.abs(current.speed) / 12);
    s.speedKmh = Math.abs(current.speed) * 3.6;
    s.vehicleDamage = current.damage;
    if (current.damage > 0.55 && game.impacts) {
      game.impacts.smoke(current.x, 1.4, current.z, dt);
    }
  }

  function setCurrent(v) {
    current = v;
    game.vehicle = v;
    game.state.inCar = !!v;
    game.state.vehicleType = v ? v.type : null;
    if (v) applyMods(v);
  }

  game.vehicles = { vehicles, spawn, step, setCurrent, applyMods, get current() { return current; } };
  return game.vehicles;
}

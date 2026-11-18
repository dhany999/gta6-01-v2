// CAPTURE — the four programmed screenshots: fixed seed, frozen clock, staged
// actors and vehicles, and a frame validation before the shot is declared
// ready. This replaces v1's ambiguous “shots” with a named capture module.
import * as THREE from 'three';
import { buildVehicleMesh } from './vehicles.js';
import { clockText } from './state.js';

export const SHOT_SPECS = [
  { id: 1, name: 'golden-hour-chase', clock: 17 * 60 + 40, weather: 0, wanted: 4, district: 'Centro Alba' },
  { id: 2, name: 'rain-neon-shootout', clock: 21 * 60 + 20, weather: 0.9, wanted: 2, district: 'Barrio Sal' },
  { id: 3, name: 'cami-garage', clock: 11 * 60 + 10, weather: 0, wanted: 0, district: 'Casco Viejo' },
  { id: 4, name: 'cobalt-bridge-dusk', clock: 18 * 60 + 55, weather: 0, wanted: 0, district: 'Jembatan Cobalto' },
];

export function buildGarageSet(game) {
  const group = new THREE.Group();
  group.name = 'cami-garage-set';
  const wallMat = new THREE.MeshLambertMaterial({ color: 0x8a6a4a });
  const floorMat = new THREE.MeshLambertMaterial({ color: 0x3a3f46 });
  const floor = new THREE.Mesh(new THREE.BoxGeometry(22, 0.4, 16), floorMat);
  floor.position.set(-120, 0.2, -30);
  floor.receiveShadow = true;
  group.add(floor);
  const back = new THREE.Mesh(new THREE.BoxGeometry(22, 7, 0.6), wallMat);
  back.position.set(-120, 3.5, -38);
  group.add(back);
  for (const sx of [-1, 1]) {
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.6, 7, 16), wallMat);
    side.position.set(-120 + sx * 11, 3.5, -30);
    group.add(side);
  }
  const roof = new THREE.Mesh(new THREE.BoxGeometry(23, 0.5, 17), new THREE.MeshLambertMaterial({ color: 0x2c313a }));
  roof.position.set(-120, 7.2, -30);
  group.add(roof);
  const lift = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.1, 5.6), new THREE.MeshLambertMaterial({ color: 0x4a5560 }));
  lift.position.set(-120, 0.9, -30);
  group.add(lift);
  const priceCanvas = document.createElement('canvas');
  priceCanvas.width = 512;
  priceCanvas.height = 320;
  const pg = priceCanvas.getContext('2d');
  pg.fillStyle = '#101826';
  pg.fillRect(0, 0, 512, 320);
  pg.fillStyle = '#ffb02e';
  pg.font = 'bold 40px system-ui, sans-serif';
  pg.fillText('GARASI CAMI', 24, 56);
  pg.fillStyle = '#eef1f5';
  pg.font = '28px system-ui, sans-serif';
  const priceLines = ['Cat dua warna .... $800', 'Velg gelap ........ $650', 'Spoiler karbon ... $500', 'Lampu bawah ...... $400', 'Pelat bodi ......... $1500'];
  priceLines.forEach((line, i) => pg.fillText(line, 24, 110 + i * 40));
  const priceTex = new THREE.CanvasTexture(priceCanvas);
  priceTex.colorSpace = THREE.SRGBColorSpace;
  const board = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 4.4),
    new THREE.MeshBasicMaterial({ map: priceTex }),
  );
  board.position.set(-109.6, 4, -26);
  board.rotation.y = -Math.PI / 2;
  group.add(board);
  const warm = new THREE.PointLight(0xffc861, 60, 26, 1.6);
  warm.position.set(-120, 5.5, -30);
  group.add(warm);
  game.scene.add(group);
  return group;
}

function setClockWeather(game, spec) {
  game.frozenClock = true;
  game.frozenWeather = true;
  game.state.clockMinutes = spec.clock;
  game.weather.setRain(spec.weather);
  game.daynight.update(0);
}

function placeCruiser(game, x, z, heading) {
  const c = game.policeCruisers.spawn();
  c.x = x;
  c.z = z;
  c.heading = heading;
  c.mesh.position.set(x, 0, z);
  c.mesh.rotation.y = heading;
  return c;
}

function stageShot1(game) {
  const spec = SHOT_SPECS[0];
  setClockWeather(game, spec);
  game.state.wanted = 4;
  game.state.heat = 3.4;
  game.state.money = 12450;
  game.state.health = 82;
  game.state.armor = 40;
  game.state.district = 'Centro Alba';
  const car = game.vehicles.spawn('sport', -40, 0, Math.PI / 2, 0xc2242a);
  car.damage = 0.62;
  game.vehicles.setCurrent(car);
  game.player.x = -40;
  game.player.z = 0;
  game.player.mesh.visible = false;
  game.state.vehicleDamage = 0.62;
  game.lastKnown = { x: -40, z: 0 };
  game.policeRoadblock.place();
  placeCruiser(game, -56, 2, Math.PI / 2);
  placeCruiser(game, -50, -3, Math.PI / 2);
  placeCruiser(game, -24, -4, Math.PI / 2);
  game.vehicles.spawn('sedan', -16, 4, Math.PI / 2, 0x8a97a5);
  game.vehicles.spawn('taxi', -24, -5, Math.PI / 2, 0xf2c200);
  game.pedestrians.makePed(-30, 10);
  game.pedestrians.makePed(-14, -10);
  game.heliOverride = { x: 0, y: 30, z: -20 };
  game.camera.position.set(-68, 9, 14);
  game.camera.lookAt(-10, 1, 0);
  game.cameraYaw = Math.PI * 0.75;
  game.state.objective = 'Kabur dari roadblock — capai Jembatan Cobalto.';
  game.state.speedKmh = 96;
  game.impacts.burst(-40, 1.2, 0, 'smoke', 14);
}

function stageShot2(game) {
  const spec = SHOT_SPECS[1];
  setClockWeather(game, spec);
  game.state.wanted = 2;
  game.state.heat = 1.4;
  game.state.money = 8200;
  game.state.health = 74;
  game.state.armor = 65;
  game.state.weapon = 'smg';
  game.state.ammo.smg = 24;
  game.state.district = 'Barrio Sal';
  game.player.x = -58;
  game.player.z = 48;
  game.player.heading = Math.PI / 4;
  game.player.mesh.position.set(-58, 0, 48);
  game.player.mesh.rotation.y = game.player.heading;
  game.player.mesh.visible = true;
  game.lastKnown = { x: -58, z: 48 };
  const patrol = game.vehicles.spawn('cruiser', -52, 64, Math.PI * 0.6, 0x1c2f4a);
  game.policeFoot.makeCop(-50, 56);
  game.policeFoot.makeCop(-46, 60);
  game.vehicles.spawn('taxi', -70, 52, Math.PI / 2, 0xf2c200);
  game.pedestrians.makePed(-62, 60);
  game.impacts.burst(-54, 1.5, 52, 'spark', 30);
  game.impacts.burst(-50, 1.2, 56, 'spark', 14);
  const flash = new THREE.PointLight(0xffd27a, 90, 20, 1.5);
  flash.position.set(-54, 1.8, 52);
  game.scene.add(flash);
  game.camera.position.set(-30, 4.5, 60);
  game.camera.lookAt(-56, 1.4, 50);
  game.cameraYaw = Math.PI * 0.9;
  game.state.objective = 'Bertahan di Barrio Sal — singkirkan polisi jalan kaki.';
}

function stageShot3(game) {
  const spec = SHOT_SPECS[2];
  setClockWeather(game, spec);
  game.state.wanted = 0;
  game.state.money = 15200;
  game.state.health = 100;
  game.state.armor = 0;
  game.state.district = 'Casco Viejo';
  if (!game.garageSet) game.garageSet = buildGarageSet(game);
  game.state.garageMods.sport = { paint: true, wheels: true, underglow: true, spoiler: true };
  const car = game.vehicles.spawn('sport', -120, -30, Math.PI / 2, 0xc2242a);
  car.mods = game.state.garageMods.sport;
  game.vehicles.applyMods(car);
  car.mesh.position.y = 1.45;
  game.vehicles.spawn('truck', -120, -2, Math.PI / 2, 0xd8d3c3);
  game.pedestrians.makePed(-112, -8);
  game.pedestrians.makePed(-126, -6);
  const cami = game.pedestrians.makePed(-115, -34);
  cami.mesh.scale.set(1.05, 1.05, 1.05);
  game.player.x = -112;
  game.player.z = -26;
  game.player.mesh.position.set(-112, 0, -26);
  game.player.mesh.visible = true;
  game.state.objective = 'Garasi Cami: cat dua warna terpasang — siap balapan malam.';
  game.camera.position.set(-128, 3.2, -36);
  game.camera.lookAt(-118, 1.4, -24);
  game.cameraYaw = Math.PI * 0.85;
}

function stageShot4(game) {
  const spec = SHOT_SPECS[3];
  setClockWeather(game, spec);
  game.state.wanted = 0;
  game.state.money = 9800;
  game.state.health = 100;
  game.state.district = 'Jembatan Cobalto';
  const r1 = game.vehicles.spawn('sport', -6, -285, 0, 0xc2242a);
  const r2 = game.vehicles.spawn('sport', 0, -285, 0, 0x1f6fb2);
  const r3 = game.vehicles.spawn('sport', 6, -285, 0, 0xf2c200);
  r1.mesh.position.y = 9;
  r2.mesh.position.y = 9;
  r3.mesh.position.y = 9;
  game.vehicles.spawn('bike', 12, -290, 0, 0x1f6fb2).mesh.position.y = 9;
  game.vehicles.spawn('sedan', -8, -270, Math.PI, 0x8a97a5).mesh.position.y = 9;
  game.impacts.burst(-6, 9.5, -292, 'dust', 26);
  game.impacts.burst(0, 9.5, -292, 'dust', 26);
  game.impacts.burst(6, 9.5, -292, 'dust', 26);
  for (const fx of [-6, 0, 6]) {
    const flare = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 1.6, 0.5),
      new THREE.MeshBasicMaterial({ color: 0xff7e2d }),
    );
    flare.position.set(fx, 10, -288);
    game.scene.add(flare);
  }
  game.player.x = 0;
  game.player.z = -240;
  game.player.mesh.visible = false;
  game.state.objective = 'Balapan Jembatan Cobalto — garis start, senja biru.';
  game.camera.position.set(-8, 20, -308);
  game.camera.lookAt(2, 8, -210);
  game.cameraYaw = Math.PI;
}

export function validateShot(game, spec) {
  const problems = [];
  if (clockText(game.state) !== `${String(Math.floor(spec.clock / 60)).padStart(2, '0')}:${String(spec.clock % 60).padStart(2, '0')}`) {
    problems.push('clock mismatch');
  }
  if (game.state.district !== spec.district) problems.push(`district ${game.state.district} != ${spec.district}`);
  return problems;
}

export function stageShot(game, id) {
  const spec = SHOT_SPECS[id - 1] || SHOT_SPECS[0];
  game.state.screen = 'play';
  game.state.missionStage = 'active';
  game.screens.show(null);
  game.missionTracker.render();
  game.hud.show(true);
  if (id === 1) stageShot1(game);
  else if (id === 2) stageShot2(game);
  else if (id === 3) stageShot3(game);
  else stageShot4(game);
  game.traffic.update(0.1);
  game.pedestrians.update(0.1);
  game.daynight.update(0);
  game.weather.update(0);
  game.cityLighting.update();
  game.policeHelicopter.update(0.1);
  if (game.heliOverride && game.state.wanted >= 4) {
    game.heli.position.set(game.heliOverride.x, game.heliOverride.y, game.heliOverride.z);
  }
  game.impacts.update(0.1);
  game.hud.update();
  game.minimap.draw();
  const problems = validateShot(game, spec);
  if (problems.length) console.warn('capture validation:', problems.join('; '));
  return { spec, problems };
}

export function createCapture(game) {
  game.capture = { stageShot: (id) => stageShot(game, id), validateShot: (spec) => validateShot(game, spec), SHOT_SPECS };
  return game.capture;
}

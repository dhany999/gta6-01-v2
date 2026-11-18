// MAIN — entry point, init order and the one fixed-step loop. Screens: title,
// play, paused, briefing, shop, garage, map, over. ?shot=1..4&seed=N stages a
// programmed screenshot instead of running the loop.
import { createState } from './state.js';
import { createRandom } from './rng.js';
import { createBoot } from './boot.js';
import { createRender } from './render.js';
import { createInput, ACT_CONFIRM, ACT_PAUSE, ACT_MAP, ACT_GARAGE, ACT_SHOP, ACT_ENTER, ACT_WEAPON1, ACT_WEAPON2, ACT_WEAPON3, ACT_HORN } from './input.js';
import { createDistricts } from './districts.js';
import { createWorld } from './world.js';
import { createDayNight } from './daynight.js';
import { createWeather } from './weather.js';
import { createCityLighting } from './city-lighting.js';
import { createImpacts } from './impacts.js';
import { createVehicles } from './vehicles.js';
import { createPlayer } from './player.js';
import { createCamera } from './camera.js';
import { createTraffic } from './traffic.js';
import { createPedestrians } from './pedestrians.js';
import { createWanted } from './wanted.js';
import { createPoliceCruisers } from './police-cruisers.js';
import { createPoliceFoot } from './police-foot.js';
import { createPoliceRoadblock } from './police-roadblock.js';
import { createPoliceHelicopter } from './police-helicopter.js';
import { createCombat } from './combat.js';
import { createWeapons } from './weapons.js';
import { createEconomy } from './economy.js';
import { createGarage } from './garage.js';
import { createShops } from './shops.js';
import { createSafehouse } from './safehouse.js';
import { createMissionRunner } from './mission-runner.js';
import { createSideActivities } from './side-activities.js';
import { createHud } from './hud.js';
import { createMinimap } from './minimap.js';
import { createMissionTracker } from './mission-tracker.js';
import { createScreens } from './screens.js';
import { createNotifications } from './notifications.js';
import { createSubtitles } from './subtitles.js';
import { createAudio } from './audio.js';
import { createCapture, buildGarageSet } from './capture.js';
import { loadGame, applySave, saveGame, hasSave } from './save.js';

const STEP = 1 / 60;
const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shotParam = Number.parseInt(params.get('shot') ?? '', 10);
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : 20261119;

const game = {
  state: createState(),
  rng: createRandom(seed),
  frozenClock: false,
  frozenWeather: false,
  lastKnown: null,
  isNight: false,
  dayFactor: 1,
  policeSeesPlayer: false,
  footSeesPlayer: false,
  colliders: [],
  windowMats: [],
  lampGlows: [],
  neonSigns: [],
  trafficCars: [],
  peds: [],
  cruisers: [],
  footCops: [],
  roadblocks: [],
  vehicle: null,
};
window.__game = game;

const boot = createBoot(game);
boot.setProgress(8, 'Menyalakan mesin…');
game.render = createRender(game);
game.input = createInput(document.getElementById('scene'));
boot.setProgress(18, 'Membangun Puerto Cobalto…');
createNotifications(game);
createSubtitles(game);
createAudio(game);
createImpacts(game);
createDistricts(game);
createWorld(game);
game.daynight = createDayNight(game);
game.weather = createWeather(game);
game.cityLighting = createCityLighting(game);
boot.setProgress(46, 'Memarkir kendaraan…');
game.vehicles = createVehicles(game);
game.playerApi = createPlayer(game);
game.cameraCtrl = createCamera(game);
game.traffic = createTraffic(game);
game.pedestrians = createPedestrians(game);
boot.setProgress(62, 'Menyiapkan polisi…');
game.wanted = createWanted(game);
game.policeCruisers = createPoliceCruisers(game);
game.policeFoot = createPoliceFoot(game);
game.policeRoadblock = createPoliceRoadblock(game);
game.policeHelicopter = createPoliceHelicopter(game);
game.combat = createCombat(game);
game.weapons = createWeapons(game);
boot.setProgress(74, 'Menghitung utang Vasco…');
game.economy = createEconomy(game);
game.garage = createGarage(game);
game.shops = createShops(game);
game.safehouse = createSafehouse(game);
game.missionRunner = createMissionRunner(game);
game.sideActivities = createSideActivities(game);
boot.setProgress(86, 'Menyalakan HUD…');
game.hud = createHud(game);
game.minimap = createMinimap(game);
game.missionTracker = createMissionTracker(game);
game.screens = createScreens(game);
game.capture = createCapture(game);
boot.setProgress(96, 'Hampir siap…');

game.vehicles.spawn('sedan', 0, 20, 0);
game.vehicles.spawn('taxi', 6, 34, Math.PI / 2);
game.vehicles.spawn('bike', -6, 30, 0);
game.garageSet = buildGarageSet(game);
game.player.x = 0;
game.player.z = 26;

game.onPlayerDown = () => {
  game.state.screen = 'over';
  document.getElementById('over-title').textContent = 'TEWAS DI JALANAN';
  document.getElementById('over-text').textContent = 'Teo tumbang. Vasco tetap menunggu — dan Dani tetap di kapal. Muat simpanan terakhir dan coba lagi.';
  game.screens.show('over');
  game.hud.show(false);
};

game.onArrested = () => {
  const s = game.state;
  s.wanted = 0;
  s.heat = 0;
  s.money = Math.max(0, s.money - 500);
  s.health = 60;
  game.state.screen = 'over';
  document.getElementById('over-title').textContent = 'TERTANGKAP';
  document.getElementById('over-text').textContent = 'Polisi memborgolmu di trotoar. Denda $500, satu malam di sel, dan Vasco tetap menunggu.';
  game.screens.show('over');
  game.hud.show(false);
};

game.onStoryComplete = () => {
  game.state.screen = 'over';
  document.getElementById('over-title').textContent = 'KOTA BEBAS';
  document.getElementById('over-text').textContent = 'Dani bebas, buku besar Vasco terbakar, dan Puerto Cobalto akhirnya bisa bernapas. Vela Negra berlayar — tapi kali ini atas kemauanmu sendiri.';
  game.screens.show('over');
  game.hud.show(false);
  saveGame(game);
};

game.startGame = (fresh) => {
  if (fresh) {
    game.state = createState();
    game.player.x = 0;
    game.player.z = 26;
    game.player.dead = false;
  } else {
    const saved = loadGame();
    if (saved) applySave(game, saved);
  }
  game.state.screen = 'play';
  game.state.objective = 'Buka briefing misi pertama — tekan Enter.';
  game.screens.show(null);
  game.hud.show(true);
  game.missionTracker.render();
  game.subtitles.say('Cami Reyes', 'Teo. Kau kembali juga. Vasco sudah menyebut tanggal kapal itu.');
  game.missionRunner.startBriefing();
  game.audio.ensure();
};

game.resumeGame = () => {
  game.state.screen = 'play';
  game.screens.show(null);
  game.hud.show(true);
};

game.toTitle = () => {
  game.state.screen = 'title';
  game.screens.show('title');
  game.hud.show(false);
  const btn = document.getElementById('btn-continue');
  if (btn) btn.disabled = !hasSave();
};

game.screens.bindButtons();
game.toTitle();
boot.finish();

// ---- game loop, action handling and screenshot staging (second half of main) ----
const statusEl = document.getElementById('status');
function announce(message) {
  if (statusEl) statusEl.textContent = message;
}

function handleActions() {
  const actions = game.input.takeActions();
  const s = game.state;
  if (actions & ACT_CONFIRM) {
    if (s.screen === 'title') { game.startGame(false); return; }
    if (s.screen === 'over') { game.startGame(false); return; }
    if (s.screen === 'briefing') { game.screens.show(null); s.screen = 'play'; game.missionRunner.start(); return; }
  }
  if (actions & ACT_PAUSE) {
    if (s.screen === 'play') {
      s.screen = 'paused';
      document.getElementById('pause-summary').textContent =
        `Uang $${s.money.toLocaleString()} • Utang $${(40000 - s.debtPaid).toLocaleString()} • Misi ${s.missionDone.length}/10 • Bintang ${s.wanted}`;
      game.screens.show('pause');
      game.hud.show(false);
      announce('Paused.');
    } else if (s.screen === 'paused') {
      game.resumeGame();
    } else if (s.screen === 'map' || s.screen === 'shop' || s.screen === 'garage') {
      game.resumeGame();
    }
    return;
  }
  if (s.screen !== 'play') return;
  if (actions & ACT_MAP) {
    s.screen = 'map';
    game.screens.drawBigMap();
    game.screens.show('map');
    game.hud.show(false);
  } else if (actions & ACT_GARAGE) {
    game.screens.renderGarage();
    game.garage.open();
    game.hud.show(false);
  } else if (actions & ACT_SHOP) {
    game.screens.renderShop();
    game.shops.open();
    game.hud.show(false);
  } else if (actions & ACT_ENTER) {
    if (!s.inCar && game.safehouse.isNear()) {
      game.safehouse.sleep();
    } else if (s.inCar) {
      game.playerApi.exitVehicle();
    } else {
      const v = game.playerApi.nearestVehicle();
      if (v) {
        game.playerApi.enterVehicle(v);
        if (v.type !== 'cruiser') game.wanted.addHeat(0.2);
      } else if (s.missionStage === 'idle') {
        game.missionRunner.startBriefing();
      }
    }
  }
  if (actions & ACT_WEAPON1) game.weapons.select('pistol');
  if (actions & ACT_WEAPON2) game.weapons.select('smg');
  if (actions & ACT_WEAPON3) game.weapons.select('shotgun');
  if (actions & ACT_HORN) {
    game.audio.raceHorn();
    if (s.inCar) game.notifications.toast('Klakson! Radio Alba 94.1 memutar lagu pelabuhan.', '');
  }
}

function stepWorld(dt) {
  const s = game.state;
  s.playTime += dt;
  if (s.inCar) game.vehicles.step(dt, game.input);
  else game.playerApi.step(dt, game.input);
  game.traffic.update(dt);
  game.pedestrians.update(dt);
  game.wanted.update(dt);
  game.policeCruisers.update(dt);
  game.policeFoot.update(dt);
  game.policeRoadblock.update(dt);
  game.policeHelicopter.update(dt);
  game.combat.update(dt);
  game.missionRunner.update(dt);
  game.sideActivities.update(dt);
  game.safehouse.update();
  game.daynight.update(dt);
  game.weather.update(dt);
  game.impacts.update(dt);
  game.cityLighting.update();
  game.audio.update();
  game.cameraCtrl.update(dt);
}

let frameCount = 0;
function runGame() {
  let accumulator = 0;
  let last = performance.now();
  announce('VELA NEGRA. Tekan Space atau klik untuk mulai.');
  function frame(now) {
    requestAnimationFrame(frame);
    accumulator += Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    handleActions();
    if (game.state.screen === 'play') {
      while (accumulator >= STEP) {
        stepWorld(STEP);
        accumulator -= STEP;
      }
      frameCount += 1;
      game.hud.update();
      if (frameCount % 6 === 0) game.minimap.draw();
      if (frameCount % 120 === 0) game.missionTracker.render();
    } else {
      accumulator = 0;
      if (game.state.screen === 'title') {
        game.daynight.update(0.016);
        game.camera.position.set(
          90 + Math.sin(performance.now() / 9000) * 40, 42,
          90 + Math.cos(performance.now() / 9000) * 40,
        );
        game.camera.lookAt(0, 8, 0);
      }
    }
    game.render.draw();
  }
  requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && game.state.screen === 'play') {
      game.state.screen = 'paused';
      game.screens.show('pause');
      game.hud.show(false);
    }
  });
}

function runShot(id) {
  game.capture.stageShot(id);
  game.render.draw();
  let painted = 0;
  function paint() {
    game.render.draw();
    painted += 1;
    if (painted >= 2) window.__shotReady = true;
    requestAnimationFrame(paint);
  }
  requestAnimationFrame(paint);
}

if (shotParam >= 1 && shotParam <= 4) runShot(shotParam);
else runGame();

// MISSION-RUNNER — the mission state machine: briefing, active objective, waypoint
// beacon, success and fail. It drives the HUD tracker, the 3D beacon and the
// debt counter, and saves after every completed mission.
import * as THREE from 'three';
import { MISSIONS, missionByIndex } from './story-arc.js';
import { saveGame } from './save.js';

export function createMissionRunner(game) {
  const beacon = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.2, 60, 12, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xffb02e, transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false }),
  );
  beacon.visible = false;
  game.scene.add(beacon);
  const marker = new THREE.Mesh(
    new THREE.ConeGeometry(1.4, 2.6, 4),
    new THREE.MeshBasicMaterial({ color: 0xffb02e }),
  );
  marker.visible = false;
  game.scene.add(marker);
  let active = null;
  let timer = 0;

  function current() {
    return missionByIndex(game.state.missionIndex);
  }

  function startBriefing() {
    const m = current();
    game.state.screen = 'briefing';
    game.screens.showBriefing(m);
  }

  function start() {
    const m = current();
    active = m;
    game.state.missionStage = 'active';
    game.state.objective = `${m.title}: pergi ke penanda kuning di ${game.districtAt(m.x, m.z).name}.`;
    game.state.waypoint = { x: m.x, z: m.z, label: m.title };
    beacon.position.set(m.x, 30, m.z);
    beacon.visible = true;
    marker.position.set(m.x, 4, m.z);
    marker.visible = true;
    timer = m.id === 'm3' ? 180 : 0;
    game.state.timer = timer;
    game.subtitles.say(m.speaker, m.enter);
    game.notifications.toast(`Misi dimulai: ${m.title}`, 'good');
  }

  function complete() {
    const m = active || current();
    game.economy.earn(m.pay, `Misi selesai: ${m.title}`);
    game.state.debtPaid += Math.min(m.pay, 40000 - game.state.debtPaid);
    game.state.missionDone.push(m.id);
    game.state.missionIndex = Math.min(game.state.missionIndex + 1, MISSIONS.length - 1);
    game.state.missionStage = 'idle';
    game.state.waypoint = null;
    beacon.visible = false;
    marker.visible = false;
    game.subtitles.say(m.speaker, m.exit);
    active = null;
    saveGame(game);
    if (game.state.missionDone.length >= MISSIONS.length) {
      game.onStoryComplete();
    } else {
      game.notifications.toast(`Misi berikutnya: ${current().title}`, 'good');
    }
  }

  function fail(reason) {
    const m = active || current();
    game.state.missionStage = 'failed';
    game.state.waypoint = null;
    beacon.visible = false;
    marker.visible = false;
    active = null;
    game.notifications.toast(`Misi gagal: ${reason}`, 'bad');
    game.subtitles.say(m.speaker, 'Ulangi. Vasco tidak memberi kesempatan kedua — tapi aku memberimu satu.');
  }

  function update(dt) {
    if (!active) return;
    marker.rotation.y += dt * 2;
    marker.position.y = 4 + Math.sin(performance.now() / 300) * 0.5;
    if (timer > 0) {
      timer -= dt;
      game.state.timer = Math.max(0, timer);
      if (timer <= 0) { fail('Waktu habis'); return; }
    }
    const d = Math.hypot(game.player.x - active.x, game.player.z - active.z);
    if (d < 7) complete();
  }

  game.missionRunner = { startBriefing, start, complete, fail, update, current };
  return game.missionRunner;
}

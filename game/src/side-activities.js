// SIDE-ACTIVITIES — street races, taxi driving and courier runs: repeatable
// money outside missions, with their own rules, timers and payouts. This is
// the money that buys guns, cars and mods between story beats.
import { TUNING } from './tuning.js';
import { RACE_ROUTES } from './race-routes.js';

export function createSideActivities(game) {
  function startRace(routeId) {
    const route = RACE_ROUTES.find((r) => r.id === routeId) || RACE_ROUTES[0];
    game.state.activity = 'race';
    game.state.raceCheckpoint = 0;
    game.state.timer = 0;
    game.state.waypoint = { x: route.checkpoints[0][0], z: route.checkpoints[0][1], label: `Balapan: ${route.name}` };
    game.state.objective = `Balapan ${route.name}: lewati ${route.checkpoints.length} checkpoint sebelum rival.`;
    game.notifications.toast(`🏁 Balapan dimulai: ${route.name} — hadiah $${TUNING.racePay}.`, 'good');
    game.audio.raceHorn();
  }

  function raceCheckpointReached() {
    const route = RACE_ROUTES[0];
    game.state.raceCheckpoint += 1;
    if (game.state.raceCheckpoint >= route.checkpoints.length) {
      game.state.activity = null;
      game.state.waypoint = null;
      game.economy.earn(TUNING.racePay, `Menang balapan ${route.name}`);
      game.state.objective = 'Balapan selesai. Cari misi berikutnya.';
    } else {
      const [x, z] = route.checkpoints[game.state.raceCheckpoint];
      game.state.waypoint = { x, z, label: 'Checkpoint' };
    }
  }

  function startTaxi() {
    game.state.activity = 'taxi';
    const dest = { x: game.rng.range(-220, 220), z: game.rng.range(-220, 220) };
    game.state.waypoint = { x: dest.x, z: dest.z, label: 'Tujuan penumpang' };
    game.state.objective = 'Taksi: antar penumpang ke penanda. Jangan tabrakan.';
    game.notifications.toast('🚕 Penumpang naik — antar ke tujuan.', 'good');
  }

  function taxiDelivered() {
    game.state.activity = null;
    game.state.waypoint = null;
    game.economy.earn(TUNING.taxiPay, 'Ongkos taksi');
  }

  function startCourier() {
    game.state.activity = 'courier';
    game.state.courierLeft = 120;
    const dest = { x: game.rng.range(-220, 220), z: game.rng.range(-220, 220) };
    game.state.waypoint = { x: dest.x, z: dest.z, label: 'Tujuan paket' };
    game.state.objective = 'Kurir: antar paket sebelum waktu habis (120 detik).';
    game.notifications.toast('📦 Paket diterima — 120 detik!', 'good');
  }

  function update(dt) {
    const s = game.state;
    if (s.activity === 'courier' && s.courierLeft > 0) {
      s.courierLeft -= dt;
      s.timer = s.courierLeft;
      if (s.courierLeft <= 0) {
        s.activity = null;
        s.waypoint = null;
        game.notifications.toast('Paket terlambat — pelanggan batal.', 'bad');
      }
    }
    if (!s.waypoint || !s.activity) return;
    const d = Math.hypot(game.player.x - s.waypoint.x, game.player.z - s.waypoint.z);
    if (d < 8) {
      if (s.activity === 'race') raceCheckpointReached();
      else if (s.activity === 'taxi') taxiDelivered();
      else if (s.activity === 'courier') {
        s.activity = null;
        s.waypoint = null;
        game.economy.earn(TUNING.courierPay, 'Paket terkirim tepat waktu');
      }
    }
  }

  game.sideActivities = { startRace, startTaxi, startCourier, update };
  return game.sideActivities;
}

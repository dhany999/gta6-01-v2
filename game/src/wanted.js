// WANTED — the one-to-five star level: heat accumulates on crimes, decays when
// unseen, and the search state tracks the last known position. Hiding means
// breaking line of sight, not just waiting.
import { TUNING } from './tuning.js';

export function createWanted(game) {
  let searchTimer = 0;

  function starsFromHeat(heat) {
    if (heat < 0.4) return 0;
    if (heat < 1.0) return 1;
    if (heat < 1.9) return 2;
    if (heat < 3.0) return 3;
    if (heat < 4.4) return 4;
    return 5;
  }

  function addHeat(amount) {
    const s = game.state;
    const before = s.wanted;
    s.heat = Math.min(6, s.heat + amount);
    s.wanted = starsFromHeat(s.heat);
    game.lastKnown = { x: game.player.x, z: game.player.z };
    if (s.wanted > before) {
      game.notifications.toast(`★ Bintang naik ke ${s.wanted} — polisi mengejar!`, 'bad');
      game.audio.siren();
    }
  }

  function update(dt) {
    const s = game.state;
    if (s.wanted === 0) return;
    const seen = (game.policeSeesPlayer || game.footSeesPlayer);
    if (seen) {
      searchTimer = 0;
      game.lastKnown = { x: game.player.x, z: game.player.z };
    } else {
      searchTimer += dt;
      s.heat = Math.max(0, s.heat - TUNING.wantedDecay * dt * (searchTimer > 4 ? 2.2 : 1));
      const next = starsFromHeat(s.heat);
      if (next < s.wanted) {
        s.wanted = next;
        if (next === 0) game.notifications.toast('Kau lolos. Polisi kehilangan jejak.', 'good');
        else game.notifications.toast(`Bintang turun ke ${next}.`, 'good');
      }
    }
  }

  game.wanted = { addHeat, update, starsFromHeat };
  return game.wanted;
}

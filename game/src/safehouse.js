// SAFEHOUSE — Teo's flat above the garage: sleeping heals to full, saves the
// game, and lets him change his jacket colour. The bed is the only free heal
// in Puerto Cobalto, so coming home matters.
import { saveGame } from './save.js';

export const SAFEHOUSE_POS = { x: -118, z: -26 };

export function createSafehouse(game) {
  let near = false;

  function update() {
    const d = Math.hypot(game.player.x - SAFEHOUSE_POS.x, game.player.z - SAFEHOUSE_POS.z);
    near = d < 6 && !game.state.inCar;
    if (near && game.state.health < 100) {
      game.state.health = Math.min(100, game.state.health + 0.4);
    }
  }

  function sleep() {
    if (!near) return false;
    game.state.health = 100;
    game.state.armor = Math.max(game.state.armor, 25);
    saveGame(game);
    game.notifications.toast('Tidur nyenyak — sehat penuh, permainan tersimpan.', 'good');
    game.subtitles.say('Teo', 'Besok pagi, Vasco. Besok pagi.');
    return true;
  }

  function isNear() {
    return near;
  }

  game.safehouse = { update, sleep, isNear, pos: SAFEHOUSE_POS };
  return game.safehouse;
}

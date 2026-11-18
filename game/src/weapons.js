// WEAPONS — the three guns plus fists: pistol (accurate, slow), SMG “Zumbido”
// (fast, spray), shotgun “Trueno” (close, heavy kick). Ammo is bought, armor
// absorbs part of the damage, each gun has its own recoil and camera shake.
import { WEAPONS } from './tuning.js';

export const WEAPON_LIST = ['pistol', 'smg', 'shotgun'];

export function weaponLabel(id) {
  return WEAPONS[id] ? WEAPONS[id].label : 'Pukulan';
}

export function createWeapons(game) {
  function select(id) {
    const s = game.state;
    if (!s.ownedWeapons.includes(id)) return false;
    s.weapon = id;
    game.audio.click();
    return true;
  }

  function cycle(dir = 1) {
    const s = game.state;
    const owned = WEAPON_LIST.filter((w) => s.ownedWeapons.includes(w));
    if (owned.length === 0) return;
    const i = owned.indexOf(s.weapon);
    select(owned[(i + dir + owned.length) % owned.length]);
  }

  function buy(id) {
    const s = game.state;
    const item = WEAPONS[id];
    if (!item || s.ownedWeapons.includes(id)) return false;
    return game.economy.spend(item.price, `Membeli ${item.label}`);
  }

  return { select, cycle, buy, list: WEAPON_LIST };
}

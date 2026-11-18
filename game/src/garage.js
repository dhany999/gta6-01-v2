// GARAGE — Cami Reyes's workshop in Casco Viejo: paint, wheels, spoiler, underglow
// and armour plating, with a rotating preview and per-car saved mods. Mods ride
// along into every screenshot the car appears in.
import { GARAGE_MODS, VEHICLE_TYPES } from './tuning.js';

export function createGarage(game) {
  function modsFor(type) {
    if (!game.state.garageMods[type]) game.state.garageMods[type] = {};
    return game.state.garageMods[type];
  }

  function buyMod(type, modId) {
    const s = game.state;
    const mod = GARAGE_MODS.find((m) => m.id === modId);
    if (!mod) return false;
    const owned = modsFor(type);
    if (owned[modId]) return false;
    if (!game.economy.spend(mod.price, `${mod.label} untuk ${VEHICLE_TYPES[type].label}`)) return false;
    owned[modId] = true;
    const v = game.vehicles.vehicles.find((car) => car.type === type);
    if (v) {
      v.mods = owned;
      game.vehicles.applyMods(v);
    }
    return true;
  }

  function open() {
    game.state.screen = 'garage';
    game.screens.show('garage');
  }

  function close() {
    game.state.screen = 'play';
    game.screens.show(null);
  }

  game.garage = { modsFor, buyMod, open, close, list: GARAGE_MODS };
  return game.garage;
}

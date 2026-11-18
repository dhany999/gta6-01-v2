// SAVE — versioned local save: money, missions, owned cars, garage mods, position
// and the clock. A save from an older version is ignored, never trusted blindly.
export const SAVE_KEY = 'vela-negra.save.v1';

export function saveGame(game) {
  try {
    const s = game.state;
    const data = {
      version: 1,
      money: s.money,
      debtPaid: s.debtPaid,
      health: s.health,
      armor: s.armor,
      missionIndex: s.missionIndex,
      missionDone: s.missionDone,
      clockMinutes: s.clockMinutes,
      ownedCars: s.ownedCars,
      ownedWeapons: s.ownedWeapons,
      ammo: s.ammo,
      garageMods: s.garageMods,
      x: game.player ? game.player.x : 0,
      z: game.player ? game.player.z : 0,
      savedAt: Date.now(),
    };
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function loadGame() {
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || data.version !== 1) return null;
    return data;
  } catch {
    return null;
  }
}

export function applySave(game, data) {
  const s = game.state;
  s.money = data.money ?? s.money;
  s.debtPaid = data.debtPaid ?? 0;
  s.health = data.health ?? 100;
  s.armor = data.armor ?? 0;
  s.missionIndex = data.missionIndex ?? 0;
  s.missionDone = data.missionDone ?? [];
  s.clockMinutes = data.clockMinutes ?? s.clockMinutes;
  s.ownedCars = data.ownedCars ?? s.ownedCars;
  s.ownedWeapons = data.ownedWeapons ?? s.ownedWeapons;
  s.ammo = { ...s.ammo, ...(data.ammo ?? {}) };
  s.garageMods = data.garageMods ?? {};
  if (game.player && typeof data.x === 'number') {
    game.player.x = data.x;
    game.player.z = data.z;
  }
}

export function hasSave() {
  return loadGame() !== null;
}

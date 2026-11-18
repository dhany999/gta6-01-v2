// DISTRICTS — the five districts of Puerto Cobalto: bounds, palette, building
// height, density and architectural style. districtAt() names where the player is.
import { DISTRICTS } from './tuning.js';

export function districtAt(x, z) {
  for (const d of DISTRICTS) {
    const [x0, z0, x1, z1] = d.bounds;
    if (x >= x0 && x <= x1 && z >= z0 && z <= z1) return d;
  }
  return DISTRICTS[2];
}

export function districtNameAt(x, z) {
  return districtAt(x, z).name;
}

export function createDistricts(game) {
  game.districtAt = (x, z) => districtAt(x, z);
  return { districtAt, districtNameAt };
}

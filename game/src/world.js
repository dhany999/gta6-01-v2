// WORLD — assembles the root of Puerto Cobalto: ground, districts, blocks, roads,
// landmarks, props and waterfront, in that order. No detail lives here; each
// builder owns its own corner of the city.
import { createCityBlocks } from './city-blocks.js';
import { createRoads } from './roads.js';
import { createLandmarks } from './landmarks.js';
import { createStreetProps } from './street-props.js';
import { createWaterfront } from './waterfront.js';

export function createWorld(game) {
  game.colliders = game.colliders || [];
  game.windowMats = game.windowMats || [];
  game.lampGlows = game.lampGlows || [];
  game.neonSigns = game.neonSigns || [];
  createRoads(game);
  createCityBlocks(game);
  createLandmarks(game);
  createStreetProps(game);
  createWaterfront(game);
  return { colliders: game.colliders };
}

export function collideCircle(game, x, z, radius) {
  let nx = x;
  let nz = z;
  for (const c of game.colliders) {
    const cx = Math.max(c.minX, Math.min(nx, c.maxX));
    const cz = Math.max(c.minZ, Math.min(nz, c.maxZ));
    const dx = nx - cx;
    const dz = nz - cz;
    const d2 = dx * dx + dz * dz;
    if (d2 < radius * radius && d2 > 0.0001) {
      const d = Math.sqrt(d2);
      nx = cx + (dx / d) * radius;
      nz = cz + (dz / d) * radius;
    } else if (d2 <= 0.0001) {
      nx += radius;
    }
  }
  return { x: nx, z: nz };
}

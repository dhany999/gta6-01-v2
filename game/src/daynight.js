// DAYNIGHT — the 24-minute day: sun position, sky colour stops, window glow and
// lamp glow. The clock advances always; screenshots freeze it at a chosen minute.
import { SKY_STOPS } from './tuning.js';

function lerpStops(stops, t) {
  let a = stops[0];
  let b = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i += 1) {
    if (t >= stops[i].t && t <= stops[i + 1].t) { a = stops[i]; b = stops[i + 1]; break; }
  }
  const span = Math.max(1, b.t - a.t);
  const f = Math.max(0, Math.min(1, (t - a.t) / span));
  const mix = (ca, cb) => {
    const r = Math.round(((ca >> 16) & 255) + (((cb >> 16) & 255) - ((ca >> 16) & 255)) * f);
    const g = Math.round(((ca >> 8) & 255) + (((cb >> 8) & 255) - ((ca >> 8) & 255)) * f);
    const bl = Math.round((ca & 255) + ((cb & 255) - (ca & 255)) * f);
    return (r << 16) | (g << 8) | bl;
  };
  return { sky: mix(a.sky, b.sky), fog: mix(a.fog, b.fog), sun: mix(a.sun, b.sun), amb: mix(a.amb, b.amb) };
}

export function createDayNight(game) {
  function update(dt) {
    const s = game.state;
    if (!game.frozenClock) s.clockMinutes = (s.clockMinutes + dt * (1440 / (24 * 60))) % 1440;
    const t = s.clockMinutes;
    const colors = lerpStops(SKY_STOPS, t);
    const hourAngle = ((t - 360) / 1440) * Math.PI * 2;
    const elevation = Math.sin(hourAngle);
    const dayFactor = Math.max(0, Math.min(1, elevation * 2 + 0.25));
    game.sun.position.set(Math.cos(hourAngle) * 220, Math.max(18, elevation * 220 + 30), 80);
    const night = t < 360 || t >= 1115;
    game.render.setSky(
      colors.sky, colors.fog, colors.sun,
      night ? 0.55 : 1.6 + dayFactor * 1.2,
      colors.amb, night ? 0.75 : 1.0,
    );
    const glow = night ? 0.9 : 0.06;
    for (const m of game.windowMats) {
      if (m.emissiveIntensity !== undefined) m.emissiveIntensity = glow;
    }
    for (const g of game.lampGlows) g.visible = night;
    game.isNight = night;
    game.dayFactor = dayFactor;
  }
  return { update };
}

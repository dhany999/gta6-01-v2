// MINIMAP — the round radar: districts as coloured ground, roads as lines, the
// player as a white arrow, police search cones in red, the waypoint in amber,
// and activity icons. North is up, always.
import { DISTRICTS } from './tuning.js';

export function createMinimap(game) {
  const canvas = document.getElementById('minimap');
  const ctx = canvas.getContext('2d');
  const SIZE = 184;
  const HALF = 272;
  const scale = SIZE / (HALF * 2);

  function toMap(x, z) {
    return [(x + HALF) * scale, (z + HALF) * scale];
  }

  function draw() {
    const s = game.state;
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = 'rgba(8,14,22,0.9)';
    ctx.fillRect(0, 0, SIZE, SIZE);
    for (const d of DISTRICTS) {
      const [x0, z0, x1, z1] = d.bounds;
      ctx.fillStyle = d.palette[0] + '44';
      ctx.fillRect((x0 + HALF) * scale, (z0 + HALF) * scale, (x1 - x0) * scale, (z1 - z0) * scale);
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1;
    for (let i = -5; i <= 5; i += 1) {
      const c = (i * 52 + HALF) * scale;
      ctx.beginPath(); ctx.moveTo(c, 0); ctx.lineTo(c, SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, c); ctx.lineTo(SIZE, c); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(40,140,200,0.8)';
    ctx.fillRect(0, SIZE - 12, SIZE, 12);
    if (s.wanted > 0 && game.lastKnown) {
      const [lx, lz] = toMap(game.lastKnown.x, game.lastKnown.z);
      ctx.fillStyle = 'rgba(255,59,48,0.25)';
      ctx.beginPath(); ctx.arc(lx, lz, 26, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ff3b30';
      ctx.beginPath(); ctx.arc(lx, lz, 26, 0, Math.PI * 2); ctx.stroke();
    }
    if (s.waypoint) {
      const [wx, wz] = toMap(s.waypoint.x, s.waypoint.z);
      ctx.fillStyle = '#ffb02e';
      ctx.beginPath(); ctx.arc(wx, wz, 5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.beginPath(); ctx.arc(wx, wz, 8, 0, Math.PI * 2); ctx.stroke();
    }
    for (const car of game.trafficCars || []) {
      const [cx, cz] = toMap(car.x, car.z);
      ctx.fillStyle = 'rgba(200,200,200,0.8)';
      ctx.fillRect(cx - 1.5, cz - 1.5, 3, 3);
    }
    for (const c of game.cruisers || []) {
      if (c.dead) continue;
      const [cx, cz] = toMap(c.x, c.z);
      ctx.fillStyle = '#ff3b30';
      ctx.beginPath(); ctx.arc(cx, cz, 3.5, 0, Math.PI * 2); ctx.fill();
    }
    const [px, pz] = toMap(game.player.x, game.player.z);
    ctx.save();
    ctx.translate(px, pz);
    ctx.rotate(game.player.heading);
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(5, 6); ctx.lineTo(-5, 6); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 1, 0, Math.PI * 2); ctx.stroke();
  }

  game.minimap = { draw };
  return game.minimap;
}

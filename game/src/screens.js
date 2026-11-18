// SCREENS — pause, the big city map, mission briefing, gun shop and garage.
// One overlay family, one typographic style, each screen a real product screen
// rather than a debug panel.
import { DISTRICTS, LANDMARKS } from './tuning.js';
import { saveGame } from './save.js';

export function createScreens(game) {
  const ids = ['title', 'pause', 'map', 'briefing', 'shop', 'garage', 'over'];
  const els = {};
  for (const id of ids) els[id] = document.getElementById(`screen-${id}`);

  function hideAll() {
    for (const id of ids) if (els[id]) els[id].classList.add('hidden');
  }

  function show(name) {
    hideAll();
    if (name && els[name]) els[name].classList.remove('hidden');
    game.hud.show(name === null);
  }

  function showBriefing(m) {
    document.getElementById('brief-portrait').textContent = m.portrait;
    document.getElementById('brief-speaker').textContent = m.speaker;
    document.getElementById('brief-act').textContent = m.act;
    document.getElementById('brief-title').textContent = m.title;
    document.getElementById('brief-text').textContent = m.text;
    document.getElementById('brief-pay').textContent = `$${m.pay.toLocaleString()}`;
    document.getElementById('brief-fail').textContent = m.fail;
    show('briefing');
  }

  function drawBigMap() {
    const canvas = document.getElementById('bigmap');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.fillStyle = '#0a1420';
    ctx.fillRect(0, 0, W, H);
    const sx = W / 560;
    const sz = H / 560;
    for (const d of DISTRICTS) {
      const [x0, z0, x1, z1] = d.bounds;
      ctx.fillStyle = d.palette[0];
      ctx.globalAlpha = 0.55;
      ctx.fillRect((x0 + 280) * sx, (z0 + 280) * sz, (x1 - x0) * sx, (z1 - z0) * sz);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillText(d.name, (x0 + 280) * sx + 6, (z0 + 280) * sz + 18);
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    for (let i = -5; i <= 5; i += 1) {
      const c = (i * 52 + 280) * sx;
      ctx.beginPath(); ctx.moveTo(c, 0); ctx.lineTo(c, H); ctx.stroke();
      const r = (i * 52 + 280) * sz;
      ctx.beginPath(); ctx.moveTo(0, r); ctx.lineTo(W, r); ctx.stroke();
    }
    ctx.fillStyle = '#1d6f8e';
    ctx.fillRect(0, H - 18, W, 18);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px system-ui, sans-serif';
    for (const lm of LANDMARKS) {
      const x = (lm.x + 280) * sx;
      const z = (lm.z + 280) * sz;
      ctx.fillStyle = '#ffb02e';
      ctx.beginPath(); ctx.arc(x, z, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillText(lm.name, x + 8, z + 4);
    }
    const px = (game.player.x + 280) * sx;
    const pz = (game.player.z + 280) * sz;
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(px, pz, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillText('TEO', px + 9, pz + 4);
  }

  function renderShop() {
    const list = document.getElementById('shop-list');
    const money = document.getElementById('shop-money');
    if (money) money.textContent = `$${game.state.money.toLocaleString()}`;
    if (!list) return;
    list.innerHTML = '';
    for (const item of game.shops.list) {
      const row = document.createElement('div');
      row.className = 'shop-row';
      row.innerHTML = `<div><b>${item.label}</b><small>${item.desc}</small></div><span class="price">$${item.price.toLocaleString()}</span>`;
      const btn = document.createElement('button');
      btn.className = 'menu-btn';
      btn.textContent = 'BELI';
      btn.addEventListener('click', () => { game.shops.buy(item.id); renderShop(); });
      row.appendChild(btn);
      list.appendChild(row);
    }
  }

  function renderGarage() {
    const list = document.getElementById('garage-list');
    const money = document.getElementById('garage-money');
    if (money) money.textContent = `$${game.state.money.toLocaleString()}`;
    if (!list) return;
    list.innerHTML = '';
    const type = game.state.vehicleType || game.state.ownedCars[0] || 'sedan';
    for (const mod of game.garage.list) {
      const owned = (game.state.garageMods[type] || {})[mod.id];
      const row = document.createElement('div');
      row.className = 'garage-row';
      row.innerHTML = `<div><b>${mod.label}</b><small>${mod.desc} — untuk ${type}</small></div><span class="price">${owned ? 'TERPASANG ✓' : '$' + mod.price.toLocaleString()}</span>`;
      const btn = document.createElement('button');
      btn.className = 'menu-btn';
      btn.textContent = owned ? 'OK' : 'PASANG';
      btn.disabled = !!owned;
      btn.addEventListener('click', () => { game.garage.buyMod(type, mod.id); renderGarage(); });
      row.appendChild(btn);
      list.appendChild(row);
    }
  }

  function bindButtons() {
    const on = (id, fn) => { const b = document.getElementById(id); if (b) b.addEventListener('click', fn); };
    on('btn-continue', () => game.startGame(false));
    on('btn-new', () => game.startGame(true));
    on('btn-how', () => document.getElementById('howto').classList.toggle('hidden'));
    on('btn-resume', () => game.resumeGame());
    on('btn-map', () => { drawBigMap(); show('map'); });
    on('btn-close-map', () => game.resumeGame());
    on('btn-save', () => { saveGame(game); game.notifications.toast('Permainan tersimpan.', 'good'); });
    on('btn-quit-title', () => game.toTitle());
    on('btn-start-mission', () => { show(null); game.state.screen = 'play'; game.missionRunner.start(); });
    on('btn-later-mission', () => { show(null); game.state.screen = 'play'; });
    on('btn-close-shop', () => game.shops.close());
    on('btn-close-garage', () => game.garage.close());
    on('btn-retry', () => game.startGame(false));
    on('btn-over-title', () => game.toTitle());
  }

  game.screens = { show, showBriefing, drawBigMap, renderShop, renderGarage, bindButtons };
  return game.screens;
}

// HUD — money, health, armor, stars, speed, clock, weather, weapon and district.
// Every number on screen comes from the single state; this module only paints.
import { WEAPONS } from './tuning.js';
import { clockText, debtLeft } from './state.js';

export function createHud(game) {
  const el = (id) => document.getElementById(id);
  const money = el('money');
  const debt = el('debt');
  const healthFill = el('health-fill');
  const armorFill = el('armor-fill');
  const stars = el('stars');
  const clock = el('clock');
  const weatherIcon = el('weather-icon');
  const weatherLabel = el('weather-label');
  const district = el('district');
  const missionAct = el('mission-act');
  const missionName = el('mission-name');
  const objective = el('objective-text');
  const speedValue = el('speed-value');
  const weaponIcon = el('weapon-icon');
  const weaponName = el('weapon-name');
  const ammo = el('ammo');
  const vehicleName = el('vehicle-name');
  const timerChip = el('timer-chip');
  const timerValue = el('timer-value');
  const hud = el('hud');

  const WEATHER_ICONS = { 'Cerah': '☀', 'Hujan ringan': '🌧', 'Hujan lebat': '⛈' };

  function update() {
    const s = game.state;
    if (money) money.textContent = s.money.toLocaleString();
    if (debt) debt.textContent = ` / utang $${debtLeft(s).toLocaleString()}`;
    if (healthFill) healthFill.style.width = `${s.health}%`;
    if (armorFill) armorFill.style.width = `${s.armor}%`;
    if (stars) {
      const spans = stars.children;
      for (let i = 0; i < spans.length; i += 1) {
        spans[i].classList.toggle('lit', i < s.wanted);
        spans[i].classList.toggle('hot', i < s.wanted && s.wanted >= 4);
      }
    }
    if (clock) clock.textContent = clockText(s);
    if (weatherLabel) weatherLabel.textContent = s.weather;
    if (weatherIcon) weatherIcon.textContent = WEATHER_ICONS[s.weather] || '☀';
    if (district) district.textContent = s.district;
    const m = game.missionRunner ? game.missionRunner.current() : null;
    if (m) {
      if (missionAct) missionAct.textContent = m.act;
      if (missionName) missionName.textContent = m.title;
    }
    if (objective) objective.textContent = s.objective;
    if (speedValue) speedValue.textContent = String(Math.round(s.speedKmh));
    const w = WEAPONS[s.weapon];
    if (weaponName) weaponName.textContent = w ? w.label : 'Pukulan';
    if (weaponIcon) weaponIcon.textContent = w ? w.icon : '✊';
    if (ammo) ammo.textContent = `${s.ammo[s.weapon] ?? 0} / ${w ? w.mag : '—'}`;
    if (vehicleName) {
      vehicleName.textContent = s.inCar
        ? `${game.vehicles.current ? game.vehicles.current.type : 'Mobil'} — ${Math.round(s.vehicleDamage * 100)}% rusak`
        : (game.safehouse && game.safehouse.isNear() ? 'Safehouse — tekan E untuk tidur' : 'Jalan kaki');
    }
    if (timerChip) {
      const show = s.timer > 0 && (s.missionStage === 'active' || s.activity === 'courier');
      timerChip.classList.toggle('hidden', !show);
      if (show && timerValue) {
        const t = Math.ceil(s.timer);
        timerValue.textContent = `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
      }
    }
  }

  function show(on) {
    if (hud) hud.classList.toggle('hidden', !on);
  }

  game.hud = { update, show };
  return game.hud;
}

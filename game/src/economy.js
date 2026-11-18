// ECONOMY — the wallet: every dollar in and out, prices, ownership and the
// $40,000 debt to Orlando Vasco. Mission pay, race wins, taxi fares and courier
// runs all land here; guns, armor, cars and mods all leave from here.
import { TUNING } from './tuning.js';

export function createEconomy(game) {
  function earn(amount, reason) {
    game.state.money += amount;
    game.notifications.toast(`+$${amount.toLocaleString()} — ${reason}`, 'good');
    game.audio.cash();
  }

  function spend(amount, reason) {
    const s = game.state;
    if (s.money < amount) {
      game.notifications.toast(`Uang kurang — butuh $${amount.toLocaleString()}.`, 'bad');
      return false;
    }
    s.money -= amount;
    if (reason) game.notifications.toast(`-$${amount.toLocaleString()} — ${reason}`);
    return true;
  }

  function payDebt(amount) {
    const s = game.state;
    const due = Math.min(amount, TUNING.debtTotal - s.debtPaid, s.money);
    if (due <= 0) return 0;
    s.money -= due;
    s.debtPaid += due;
    game.notifications.toast(`Utang dibayar $${due.toLocaleString()} — sisa $${(TUNING.debtTotal - s.debtPaid).toLocaleString()}.`, 'good');
    if (s.debtPaid >= TUNING.debtTotal) {
      game.notifications.toast('UTANG LUNAS. Dani bebas — Vasco kalah.', 'good');
      game.subtitles.say('Teo', 'Selesai, Vasco. Dani pulang malam ini.');
    }
    return due;
  }

  function buyCar(type, price) {
    const s = game.state;
    if (s.ownedCars.includes(type)) return true;
    if (!spend(price, `Membeli mobil ${type}`)) return false;
    s.ownedCars.push(type);
    return true;
  }

  game.economy = { earn, spend, payDebt, buyCar };
  return game.economy;
}

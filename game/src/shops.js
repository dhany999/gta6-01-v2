// SHOPS — the “El Faro” gun shop: SMG, shotgun, ammo by the box and body armor.
// Buying is instant; the shop screen lists prices against the wallet so the
// player can see the economy working.
import { SHOP_ITEMS } from './tuning.js';

export function createShops(game) {
  function buy(itemId) {
    const s = game.state;
    const item = SHOP_ITEMS.find((i) => i.id === itemId);
    if (!item) return false;
    if (itemId === 'smg' || itemId === 'shotgun') {
      if (s.ownedWeapons.includes(itemId)) {
        game.notifications.toast('Senjata itu sudah kau miliki.', 'bad');
        return false;
      }
      if (!game.economy.spend(item.price, item.label)) return false;
      s.ownedWeapons.push(itemId);
      s.ammo[itemId] = itemId === 'smg' ? 60 : 12;
      game.notifications.toast(`${item.label} dibeli — tekan 2/3 untuk pakai.`, 'good');
      return true;
    }
    if (itemId === 'armor') {
      if (!game.economy.spend(item.price, item.label)) return false;
      s.armor = 100;
      game.notifications.toast('Rompi antipeluru terpasang — armor 100.', 'good');
      return true;
    }
    const map = { 'ammo-smg': ['smg', 60], 'ammo-shotgun': ['shotgun', 24], 'ammo-pistol': ['pistol', 24] };
    const [weapon, amount] = map[itemId] || [];
    if (!weapon) return false;
    if (!game.economy.spend(item.price, item.label)) return false;
    s.ammo[weapon] = (s.ammo[weapon] || 0) + amount;
    game.notifications.toast(`+${amount} peluru ${weapon}.`, 'good');
    return true;
  }

  function open() {
    game.state.screen = 'shop';
    game.screens.show('shop');
  }

  function close() {
    game.state.screen = 'play';
    game.screens.show(null);
  }

  game.shops = { buy, open, close, list: SHOP_ITEMS };
  return game.shops;
}

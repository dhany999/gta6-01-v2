// NOTIFICATIONS — toast queue for mission completions, star rises and payouts.
// One toast at a time on screen, three seconds, then it fades out on its own.
export function createNotifications(game) {
  const box = document.getElementById('toasts');
  let queue = [];

  function toast(message, kind = '') {
    if (!box) return;
    const div = document.createElement('div');
    div.className = `toast ${kind}`;
    div.textContent = message;
    box.appendChild(div);
    queue.push(div);
    window.setTimeout(() => {
      div.remove();
      queue = queue.filter((d) => d !== div);
    }, 3400);
    while (queue.length > 3) {
      const old = queue.shift();
      if (old) old.remove();
    }
  }

  game.notifications = { toast };
  return game.notifications;
}

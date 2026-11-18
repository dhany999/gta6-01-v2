// SUBTITLES — dialogue lines with the speaker's name, shown low on screen for
// a few seconds. Mission entry and exit lines, Vasco's threats and Cami's
// advice all pass through here.
export function createSubtitles(game) {
  const el = document.getElementById('subtitle');
  let timer = null;

  function say(speaker, line, seconds = 4.5) {
    if (!el) return;
    el.textContent = `${speaker}: “${line}”`;
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => { el.textContent = ''; }, seconds * 1000);
  }

  function clear() {
    if (el) el.textContent = '';
    if (timer) window.clearTimeout(timer);
  }

  game.subtitles = { say, clear };
  return game.subtitles;
}

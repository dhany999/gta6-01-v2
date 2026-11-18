// BOOT — loading screen and resource warm-up before the city appears. Progress is
// reported honestly: each build step ticks the bar, then the title screen opens.
export function createBoot(game) {
  const fill = document.getElementById('load-fill');
  const text = document.getElementById('load-text');
  const overlay = document.getElementById('loading');
  let progress = 0;

  function setProgress(value, label) {
    progress = Math.max(progress, Math.min(100, value));
    if (fill) fill.style.width = `${progress}%`;
    if (label && text) text.textContent = label;
  }

  function finish() {
    setProgress(100, 'Puerto Cobalto siap.');
    if (overlay) {
      overlay.classList.add('gone');
      window.setTimeout(() => overlay.remove(), 600);
    }
  }

  return { setProgress, finish };
}

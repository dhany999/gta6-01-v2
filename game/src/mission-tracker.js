// MISSION-TRACKER — the mission list panel: done, active and locked missions
// with their act. Ten rows that prove the story has volume at a glance.
import { MISSIONS } from './story-arc.js';

export function createMissionTracker(game) {
  const list = document.getElementById('mission-list');

  function render() {
    if (!list) return;
    const s = game.state;
    let html = '<h3>MISI — VELA NEGRA</h3>';
    for (let i = 0; i < MISSIONS.length; i += 1) {
      const m = MISSIONS[i];
      const cls = s.missionDone.includes(m.id) ? 'done' : i === s.missionIndex ? 'active' : 'locked';
      const mark = s.missionDone.includes(m.id) ? '✓ ' : i === s.missionIndex ? '▶ ' : '· ';
      html += `<div class="${cls}">${mark}${m.title}</div>`;
    }
    html += `<div style="margin-top:6px;color:#ffb02e">Utang: $${(40000 - s.debtPaid).toLocaleString()} lagi</div>`;
    list.innerHTML = html;
  }

  game.missionTracker = { render };
  return game.missionTracker;
}

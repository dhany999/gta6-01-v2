// AUDIO — synthesized sound, no audio files: engine hum, gunshots, sirens,
// rain noise, cash-register chimes and a small adaptive radio loop. Everything
// is guarded so a silent browser never breaks the game.
export function createAudio(game) {
  let ctx = null;
  let engineOsc = null;
  let engineGain = null;
  let rainNode = null;

  function ensure() {
    if (ctx) return ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
      rainNode = ctx.createBufferSource();
      rainNode.buffer = buffer;
      rainNode.loop = true;
      const rainGain = ctx.createGain();
      rainGain.gain.value = 0;
      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.value = 900;
      rainNode.connect(rainFilter).connect(rainGain).connect(ctx.destination);
      rainNode.start();
      rainNode._gain = rainGain;
      engineOsc = ctx.createOscillator();
      engineOsc.type = 'sawtooth';
      engineOsc.frequency.value = 55;
      engineGain = ctx.createGain();
      engineGain.gain.value = 0;
      engineOsc.connect(engineGain).connect(ctx.destination);
      engineOsc.start();
    } catch {
      ctx = null;
    }
    return ctx;
  }

  function blip(freq, dur, type = 'square', vol = 0.12) {
    if (!ensure() || game.state.muted) return;
    try {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(vol, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + dur);
    } catch { /* sound is optional */ }
  }

  function noiseBurst(dur, vol, freq = 1200) {
    if (!ensure() || game.state.muted) return;
    try {
      const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = vol;
      src.connect(filter).connect(g).connect(ctx.destination);
      src.start();
    } catch { /* sound is optional */ }
  }

  function gunshot(weapon) {
    noiseBurst(weapon === 'shotgun' ? 0.28 : 0.12, weapon === 'shotgun' ? 0.5 : 0.3, weapon === 'smg' ? 2400 : 1500);
  }
  function siren() { blip(660, 0.3, 'sine', 0.06); blip(880, 0.3, 'sine', 0.06); }
  function cash() { blip(880, 0.12, 'sine', 0.12); window.setTimeout(() => blip(1320, 0.18, 'sine', 0.12), 90); }
  function click() { blip(440, 0.06, 'square', 0.07); }
  function thud() { noiseBurst(0.18, 0.35, 300); }
  function door() { blip(220, 0.1, 'triangle', 0.1); }
  function raceHorn() { blip(523, 0.4, 'square', 0.1); window.setTimeout(() => blip(523, 0.4, 'square', 0.1), 450); }

  function update() {
    if (!ctx) return;
    try {
      const s = game.state;
      if (engineGain) {
        const target = s.inCar ? 0.03 + Math.abs(s.speedKmh) / 2200 : 0;
        engineGain.gain.setTargetAtTime(s.muted ? 0 : target, ctx.currentTime, 0.1);
        if (engineOsc) engineOsc.frequency.setTargetAtTime(50 + Math.abs(s.speedKmh) * 0.9, ctx.currentTime, 0.1);
      }
      if (rainNode && rainNode._gain) {
        rainNode._gain.gain.setTargetAtTime(s.muted ? 0 : s.rainAmount * 0.05, ctx.currentTime, 0.5);
      }
    } catch { /* sound is optional */ }
  }

  game.audio = { gunshot, siren, cash, click, thud, door, raceHorn, update, ensure };
  return game.audio;
}

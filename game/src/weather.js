// WEATHER — rain as a camera-attached particle layer, wet asphalt via material
// swap, thin fog and the occasional lightning flash. Rain comes and goes on a
// slow timer, never as a one-off effect.
import * as THREE from 'three';

export function createWeather(game) {
  const count = 900;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 90;
    positions[i * 3 + 1] = Math.random() * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 90;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0xaac4e8, size: 0.28, transparent: true, opacity: 0.75 });
  const rain = new THREE.Points(geo, mat);
  rain.visible = false;
  game.scene.add(rain);

  let timer = 40;
  let flash = 0;
  const layer = document.getElementById('rain-layer');

  function setRain(amount, label) {
    game.state.rainAmount = amount;
    game.state.weather = amount > 0.66 ? 'Hujan lebat' : amount > 0.25 ? 'Hujan ringan' : 'Cerah';
    rain.visible = amount > 0.05;
    if (layer) layer.classList.toggle('on', amount > 0.25);
    if (game.roadMat) {
      game.roadMat.color.set(amount > 0.25 ? 0x14161c : 0x23262c);
    }
    if (game.scene.fog) game.scene.fog.far = amount > 0.25 ? 380 : 620;
  }

  function update(dt) {
    const s = game.state;
    if (!game.frozenWeather) {
      timer -= dt;
      if (timer <= 0) {
        timer = game.rng.range(35, 90);
        const next = s.rainAmount > 0.3 ? 0 : game.rng.pick([0.5, 0.85]);
        setRain(next);
      }
    }
    if (rain.visible) {
      const pos = geo.attributes.position;
      for (let i = 0; i < count; i += 1) {
        let y = pos.getY(i) - dt * 34;
        if (y < 0) y = 40;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
      rain.position.set(game.camera.position.x, 0, game.camera.position.z);
      if (s.rainAmount > 0.6 && Math.random() < dt * 0.06) flash = 0.22;
    }
    if (flash > 0) {
      flash -= dt;
      game.ambient.intensity = 0.55 + flash * 2.2;
    }
  }

  return { update, setRain };
}

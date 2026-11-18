// CAMERA — orbit chase, shoulder aim, vehicle chase and a short cinematic on a
// hard crash. The mouse drags the orbit; the wheel pulls the chase closer.
import * as THREE from 'three';

export function createCamera(game) {
  let yaw = Math.PI;
  let pitch = 0.32;
  let distance = 11;
  let shake = 0;
  let cinematic = 0;
  let lastX = 0;
  let lastY = 0;
  let dragging = false;

  const canvas = document.getElementById('scene');
  canvas.addEventListener('mousedown', (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; });
  window.addEventListener('mouseup', () => { dragging = false; });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    yaw -= (e.clientX - lastX) * 0.005;
    pitch = Math.max(0.05, Math.min(1.1, pitch + (e.clientY - lastY) * 0.004));
    lastX = e.clientX;
    lastY = e.clientY;
  });
  canvas.addEventListener('wheel', (e) => {
    distance = Math.max(6, Math.min(22, distance + Math.sign(e.deltaY) * 1.5));
    e.preventDefault();
  }, { passive: false });

  function addShake(amount) {
    shake = Math.min(1.2, shake + amount);
  }

  function crashCut() {
    cinematic = 0.9;
  }

  function update(dt) {
    const s = game.state;
    const p = game.player;
    const v = game.vehicles ? game.vehicles.current : null;
    let tx;
    let tz;
    let ty;
    if (v) { tx = v.x; tz = v.z; ty = 1.6; }
    else { tx = p.x; tz = p.z; ty = 1.7; }
    game.cameraYaw = yaw;
    if (cinematic > 0) {
      cinematic -= dt;
      const a = yaw + 1.1;
      game.camera.position.set(tx + Math.sin(a) * 7, 2.2, tz + Math.cos(a) * 7);
      game.camera.lookAt(tx, 1.2, tz);
      return;
    }
    const aiming = !v && game.input.mouseDown;
    const dist = aiming ? 5.5 : distance + (v ? 3 : 0);
    const pit = aiming ? 0.22 : pitch;
    const cx = tx - Math.sin(yaw) * Math.cos(pit) * dist;
    const cz = tz - Math.cos(yaw) * Math.cos(pit) * dist;
    const cy = ty + Math.sin(pit) * dist + (v ? 1.2 : 0.6);
    const k = 1 - Math.pow(0.0001, dt);
    game.camera.position.x += (cx - game.camera.position.x) * k;
    game.camera.position.y += (cy - game.camera.position.y) * k;
    game.camera.position.z += (cz - game.camera.position.z) * k;
    if (shake > 0) {
      shake = Math.max(0, shake - dt * 2.4);
      game.camera.position.x += (Math.random() - 0.5) * shake * 0.5;
      game.camera.position.y += (Math.random() - 0.5) * shake * 0.4;
    }
    game.camera.lookAt(tx, ty + (aiming ? 0.2 : 0.4), tz);
    if (s.inCar !== !!v) s.inCar = !!v;
  }

  function snapBehind(x, z, heading) {
    yaw = heading + Math.PI;
    game.camera.position.set(x - Math.sin(yaw) * 12, 5, z - Math.cos(yaw) * 12);
  }

  return { update, addShake, crashCut, snapBehind, get yaw() { return yaw; }, set yaw(v) { yaw = v; } };
}

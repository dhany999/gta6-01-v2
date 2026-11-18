// INPUT — keyboard and mouse. Held keys steer; one-shot presses queue as action
// flags the loop takes once, so a press between frames is never lost or double-counted.
export const ACT_CONFIRM = 1;
export const ACT_PAUSE = 2;
export const ACT_MAP = 4;
export const ACT_GARAGE = 8;
export const ACT_SHOP = 16;
export const ACT_ENTER = 32;
export const ACT_WEAPON1 = 64;
export const ACT_WEAPON2 = 128;
export const ACT_WEAPON3 = 256;
export const ACT_HORN = 512;

const KEYS = {
  KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down',
  KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right',
  ShiftLeft: 'run', ShiftRight: 'run', Space: 'brake',
};

export function createInput(canvas) {
  const held = new Set();
  let actions = 0;
  let mouseX = 0;
  let mouseY = 0;
  let mouseDown = false;
  let mouseDownEdge = false;
  let pointerLocked = false;

  window.addEventListener('keydown', (event) => {
    const key = KEYS[event.code];
    if (key) {
      held.add(key);
      event.preventDefault();
      return;
    }
    if (event.repeat) return;
    if (event.code === 'Space' || event.code === 'Enter') { actions |= ACT_CONFIRM; event.preventDefault(); }
    else if (event.code === 'KeyP' || event.code === 'Escape') actions |= ACT_PAUSE;
    else if (event.code === 'KeyM') actions |= ACT_MAP;
    else if (event.code === 'KeyG') actions |= ACT_GARAGE;
    else if (event.code === 'KeyB') actions |= ACT_SHOP;
    else if (event.code === 'KeyE') actions |= ACT_ENTER;
    else if (event.code === 'Digit1') actions |= ACT_WEAPON1;
    else if (event.code === 'Digit2') actions |= ACT_WEAPON2;
    else if (event.code === 'Digit3') actions |= ACT_WEAPON3;
    else if (event.code === 'KeyH') actions |= ACT_HORN;
  });
  window.addEventListener('keyup', (event) => {
    const key = KEYS[event.code];
    if (key) held.delete(key);
  });
  window.addEventListener('blur', () => held.clear());
  canvas.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });
  canvas.addEventListener('mousedown', (event) => {
    if (event.button === 0) { mouseDown = true; mouseDownEdge = true; }
  });
  window.addEventListener('mouseup', () => { mouseDown = false; });
  canvas.addEventListener('click', () => {
    if (document.pointerLockElement !== canvas) {
      try { canvas.requestPointerLock(); pointerLocked = true; } catch { /* pointer lock is optional */ }
    }
  });
  document.addEventListener('pointerlockchange', () => {
    pointerLocked = document.pointerLockElement === canvas;
  });

  return {
    held,
    takeActions() { const a = actions; actions = 0; return a; },
    takeMouseEdge() { const e = mouseDownEdge; mouseDownEdge = false; return e; },
    get mouseDown() { return mouseDown; },
    get mouseX() { return mouseX; },
    get mouseY() { return mouseY; },
    get pointerLocked() { return pointerLocked; },
    axis() {
      let x = 0;
      let y = 0;
      if (held.has('left')) x -= 1;
      if (held.has('right')) x += 1;
      if (held.has('up')) y += 1;
      if (held.has('down')) y -= 1;
      return { x, y };
    },
  };
}

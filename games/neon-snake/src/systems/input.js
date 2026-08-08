/**
 * One input layer for keyboard, mouse and touch.
 *
 * The game never asks "is the A key down". It asks "is `left` down", and this
 * module answers from whichever hardware the player actually has. That is the
 * whole reason the same build plays on a desktop and on a phone: the touch
 * controls feed the same action set the keyboard does, so no game code branches
 * on the device.
 *
 * Keys are binary and good controls are not, so `axis()` ramps a held key
 * toward full over ~0.2s and returns it to neutral on release. The virtual
 * stick is genuinely analog and bypasses the ramp.
 */

import { unlock } from './audio.js';

/**
 * Action → key codes. `event.code`, not `event.key`: code is the physical key,
 * so WASD keeps working on an AZERTY keyboard and the layout does not silently
 * break the game for half of Europe.
 */
export const BINDINGS = {
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
  up: ['ArrowUp', 'KeyW'],
  down: ['ArrowDown', 'KeyS'],
  fire: ['Space'],
  pause: ['KeyP', 'Escape'],
  guide: ['KeyH'],
  story: ['KeyT'],
  scores: ['KeyK'],
  mute: ['KeyM'],
  restart: ['KeyR'],
};

/** Keys the browser would otherwise scroll, zoom or activate a link with. */
const SWALLOW = new Set([
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'Tab',
]);

const DEADZONE = 0.22;
const AXIS_HYSTERESIS = 0.1;

const down = new Set(); // actions currently held
const fresh = new Set(); // actions that went down since the last endFrame()
const listeners = new Map(); // action → Set<callback>, for one-shot UI actions
const axes = new Map(); // axis name → current ramped value

const stick = { active: false, x: 0, y: 0 }; // analog, from the virtual stick
export const pointer = { x: 0, y: 0, down: false };

let touchLayer = null;
let stickCardinal = null;
let audioUnlockCleanup = null;
// When a DOM panel is open, Tab/Space must reach the dialog for focus and
// button activation — not be swallowed as game chrome keys.
let uiModal = false;

/** Tell the input layer a dialog owns the keyboard (panels call this). */
export function setUiModal(open) {
  uiModal = !!open;
}

/* ------------------------------------------------------------- the model -- */

function press(action) {
  if (!action) return;
  // Rising edge only. The keyboard path is already edge-shaped (keydown filters
  // `event.repeat`), but the virtual stick calls press() on every pointermove
  // while a direction is held. Dispatching on every call meant onPress('up')
  // fired once from a key and dozens of times per second from a thumb — the
  // device-dependent divergence this whole module exists to prevent.
  if (down.has(action)) return;
  fresh.add(action);
  down.add(action);
  const bound = listeners.get(action);
  if (bound) bound.forEach((fn) => fn());
}

function release(action) {
  if (action) down.delete(action);
}

function actionFor(code) {
  for (const [action, codes] of Object.entries(BINDINGS)) {
    if (codes.includes(code)) return action;
  }
  return null;
}

/** Held right now — the question a movement loop asks. */
export function isDown(action) {
  return down.has(action);
}

/** Went down since the last frame — the question a jump or a menu asks. */
export function pressed(action) {
  return fresh.has(action);
}

/**
 * Subscribe to an action instead of polling it. Panels, mute and pause use this
 * so they work while the game loop is paused and not running `update()`.
 */
export function onPress(action, callback) {
  if (!listeners.has(action)) listeners.set(action, new Set());
  listeners.get(action).add(callback);
  return () => listeners.get(action)?.delete(callback);
}

/**
 * A ramped -1..1 axis from two opposing actions.
 *
 * `rise` is how long a held key takes to reach full, `fall` how long release
 * takes to return to neutral. Wiring a key straight to full deflection is what
 * makes a flying or driving game unflyable — it snaps to the stop on a tap.
 * The virtual stick is already analog, so it overrides the ramp outright.
 */
export function axis(name, negative, positive, dt, { rise = 0.2, fall = 0.12 } = {}) {
  if (stick.active) {
    const live = name === 'y' ? stick.y : stick.x;
    axes.set(name, live);
    return live;
  }

  const target = (isDown(positive) ? 1 : 0) - (isDown(negative) ? 1 : 0);
  const current = axes.get(name) ?? 0;
  const rate = target === 0 ? 1 / fall : 1 / rise;
  const step = rate * dt;

  let next;
  if (current < target) next = Math.min(target, current + step);
  else if (current > target) next = Math.max(target, current - step);
  else next = target;

  axes.set(name, next);
  return next;
}

/** Instant, unramped direction — right for grid and arcade movement. */
export function vector() {
  if (stick.active) return { x: stick.x, y: stick.y };
  return {
    x: (isDown('right') ? 1 : 0) - (isDown('left') ? 1 : 0),
    y: (isDown('down') ? 1 : 0) - (isDown('up') ? 1 : 0),
  };
}

/** Call once at the end of every scene update, after reading `pressed()`. */
export function endFrame() {
  fresh.clear();
}

/** Drop every held key. Bound to blur, so alt-tab does not leave you running. */
export function clear() {
  down.clear();
  fresh.clear();
  axes.clear();
  stick.active = false;
  stick.x = 0;
  stick.y = 0;
  stickCardinal = null;
}

/**
 * Convert one stick sample into at most one cardinal action. The held axis wins
 * until the other axis exceeds it by a small margin, preventing diagonal jitter
 * while still allowing an intentional later axis crossing.
 */
function quantizeStick(x, y) {
  const ax = Math.abs(x);
  const ay = Math.abs(y);
  if (Math.max(ax, ay) < DEADZONE) {
    stickCardinal = null;
    return null;
  }

  let axis;
  if (!stickCardinal) axis = ax >= ay ? 'x' : 'y';
  else if (stickCardinal.axis === 'x') {
    axis = (ax < DEADZONE && ay >= DEADZONE) || ay > ax + AXIS_HYSTERESIS ? 'y' : 'x';
  } else {
    axis = (ay < DEADZONE && ax >= DEADZONE) || ax > ay + AXIS_HYSTERESIS ? 'x' : 'y';
  }

  const action = axis === 'x'
    ? (x < 0 ? 'left' : 'right')
    : (y < 0 ? 'up' : 'down');
  stickCardinal = { axis, action };
  return action;
}

/**
 * Does this device want on-screen controls?
 *
 * `?touch=1` forces them on. A desktop browser reports a fine pointer even when
 * emulating a phone, so without an override the screenshot pass could never see
 * the touch layer it is supposed to be checking — and it is how you look at the
 * mobile controls without picking up a phone.
 */
export function isTouch() {
  const forced = new URLSearchParams(window.location.search).get('touch');
  if (forced === '1') return true;
  if (forced === '0') return false;
  return window.matchMedia?.('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
}

/* -------------------------------------------------------------- keyboard -- */

function bindAudioUnlock() {
  if (audioUnlockCleanup) return;
  const onGesture = () => {
    // Capture runs before DOM button handlers. Calling unlock directly in the
    // trusted event keeps Web Audio eligible; no timer, microtask, or await.
    if (!unlock()) return;
    audioUnlockCleanup?.();
  };
  const cleanup = () => {
    document.removeEventListener('pointerdown', onGesture, true);
    document.removeEventListener('keydown', onGesture, true);
    if (audioUnlockCleanup === cleanup) audioUnlockCleanup = null;
  };
  audioUnlockCleanup = cleanup;
  document.addEventListener('pointerdown', onGesture, true);
  document.addEventListener('keydown', onGesture, true);
}

function bindKeyboard() {
  window.addEventListener(
    'keydown',
    (event) => {
      unlock(); // first real gesture: this is where audio is allowed to start
      if (event.repeat) return;
      // While a panel is open, leave Tab (focus) and Space (activate) alone so
      // keyboard and AT users can move through dialog actions.
      const leaveForDialog = uiModal && (event.code === 'Tab' || event.code === 'Space');
      if (SWALLOW.has(event.code) && !leaveForDialog) event.preventDefault();
      if (leaveForDialog) return;
      press(actionFor(event.code));
    },
    { passive: false },
  );

  window.addEventListener('keyup', (event) => release(actionFor(event.code)));
  window.addEventListener('blur', clear);
}

/* --------------------------------------------------------------- pointer -- */

function bindPointer(host) {
  const track = (event) => {
    const box = host.getBoundingClientRect();
    pointer.x = event.clientX - box.left;
    pointer.y = event.clientY - box.top;
  };

  host.addEventListener('pointerdown', (event) => {
    unlock();
    pointer.down = true;
    track(event);
  });
  host.addEventListener('pointermove', track);
  window.addEventListener('pointerup', () => {
    pointer.down = false;
  });
  window.addEventListener('pointercancel', () => {
    pointer.down = false;
  });
}

/* ----------------------------------------------------------------- touch -- */

/**
 * The on-screen controls, built only on a device that has no keyboard.
 *
 * `buttons` is `[{ action, label, title }]` — whatever this game actually needs.
 * A game with nothing to fire ships no fire button rather than a dead one.
 */
export function buildTouchControls(root, { stick: wantStick = true, buttons = [] } = {}) {
  if (!isTouch()) return null;

  root.hidden = false;
  root.innerHTML = '';
  touchLayer = root;

  if (wantStick) {
    const base = document.createElement('div');
    base.className = 'stick';
    base.setAttribute('aria-hidden', 'true');
    const knob = document.createElement('div');
    knob.className = 'knob';
    base.append(knob);
    root.append(base);

    // Live from layout so CSS media queries that shrink .stick (short landscape)
    // keep the knob travel matched to the visible pad.
    const stickRadius = () => Math.max(1, base.getBoundingClientRect().width / 2);
    let id = null;

    const move = (event) => {
      if (id !== event.pointerId) return;
      const box = base.getBoundingClientRect();
      const radius = stickRadius();
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height / 2);
      const distance = Math.hypot(dx, dy) || 1;
      const clamped = Math.min(distance, radius) / radius;

      stick.x = (dx / distance) * clamped;
      stick.y = (dy / distance) * clamped;
      stick.active = clamped > DEADZONE;

      // Exactly one dominant cardinal action is held for each sample. Releasing
      // the other three before pressing also makes an axis crossing one ordered
      // turn rather than a horizontal+vertical burst on the same pointermove.
      const cardinal = quantizeStick(stick.x, stick.y);
      for (const action of ['left', 'right', 'up', 'down']) {
        if (action !== cardinal) release(action);
      }
      if (cardinal) press(cardinal);

      knob.style.transform = `translate(${stick.x * radius}px, ${stick.y * radius}px)`;
    };

    base.addEventListener('pointerdown', (event) => {
      unlock();
      id = event.pointerId;
      base.setPointerCapture(event.pointerId);
      move(event);
    });
    base.addEventListener('pointermove', move);

    const drop = (event) => {
      if (id !== event.pointerId) return;
      id = null;
      stick.active = false;
      stick.x = 0;
      stick.y = 0;
      stickCardinal = null;
      ['left', 'right', 'up', 'down'].forEach(release);
      knob.style.transform = '';
    };
    base.addEventListener('pointerup', drop);
    base.addEventListener('pointercancel', drop);
  }

  if (buttons.length) {
    const pad = document.createElement('div');
    pad.className = 'pad';
    for (const { action, label, title } of buttons) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn';
      button.textContent = label;
      button.setAttribute('aria-label', title || action);
      button.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        unlock();
        press(action);
      });
      const up = (event) => {
        event.preventDefault();
        release(action);
      };
      button.addEventListener('pointerup', up);
      button.addEventListener('pointercancel', up);
      button.addEventListener('pointerleave', up);
      pad.append(button);
    }
    root.append(pad);
  }

  return root;
}

/** Hide the touch controls while a panel is open, so they cannot be tapped
 *  through it and cannot cover what the panel is trying to say. */
export function setTouchVisible(visible) {
  if (touchLayer) touchLayer.classList.toggle('faded', !visible);
}

/** Wire everything up once, from main.js. */
export function initInput(host) {
  bindAudioUnlock();
  bindKeyboard();
  bindPointer(host);
}

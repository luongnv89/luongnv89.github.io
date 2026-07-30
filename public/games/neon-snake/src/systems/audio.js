/**
 * Generated sound. No audio files, no network, no library — an oscillator and a
 * gain envelope cover every noise an arcade game needs.
 *
 * The context is created on the first real gesture. Browsers suspend one built
 * at page load, and a suspended context plays nothing while reporting no error,
 * which is the single most common way a web game ends up silent.
 */

import { settings, saveSettings } from './save.js';

let ctx = null;
let master = null;
let muted = settings().muted;
let volume = settings().volume;

/** Called from the first keydown / pointerdown. Idempotent. */
export function unlock() {
  if (!ctx) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null; // no Web Audio: the game stays silent and still runs
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : volume;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function isMuted() {
  return muted;
}

export function setMuted(next) {
  muted = next;
  if (master && ctx) master.gain.setTargetAtTime(muted ? 0 : volume, ctx.currentTime, 0.01);
  saveSettings({ muted });
  return muted;
}

export function toggleMute() {
  return setMuted(!muted);
}

export function setVolume(next) {
  volume = Math.min(1, Math.max(0, next));
  if (master && ctx && !muted) master.gain.setTargetAtTime(volume, ctx.currentTime, 0.01);
  saveSettings({ volume });
  return volume;
}

/**
 * The whole synth: one voice, one envelope.
 *
 * `type` is any OscillatorNode type, or 'noise' for a filtered noise burst —
 * impacts, explosions and wind are all noise.
 */
function voice({ type = 'square', freq = 440, to = freq, dur = 0.12, gain = 0.3, sweep = 0 }) {
  if (!ctx || muted) return;
  const now = ctx.currentTime;
  const env = ctx.createGain();

  // A hard start clicks. 8ms of attack and an exponential tail is the whole
  // difference between "a sound" and "a pop".
  env.gain.setValueAtTime(0.0001, now);
  env.gain.exponentialRampToValueAtTime(gain, now + 0.008);
  env.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  env.connect(master);

  let source;
  if (type === 'noise') {
    const frames = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) data[i] = Math.random() * 2 - 1;
    source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq, now);
    if (sweep) filter.frequency.exponentialRampToValueAtTime(Math.max(40, to), now + dur);
    source.connect(filter).connect(env);
  } else {
    source = ctx.createOscillator();
    source.type = type;
    source.frequency.setValueAtTime(freq, now);
    if (to !== freq) source.frequency.exponentialRampToValueAtTime(Math.max(20, to), now + dur);
    source.connect(env);
  }

  source.start(now);
  source.stop(now + dur + 0.02);
}

/**
 * The bank. Five sounds that land beat twenty that blur — every entry here is
 * an acknowledgement of something the player did or something that happened to
 * them, never decoration.
 */
/**
 * The bank. Sound names match what the game calls via sfx(). Every sound
 * acknowledges something the player did, never decoration.
 */
const BANK = {
  // Food eaten — short bright chirp
  pickup: () => voice({ type: 'square', freq: 660, to: 1180, dur: 0.08, gain: 0.18 }),
  // Shield block / power-up collect — quick rising tone
  boost: () => voice({ type: 'triangle', freq: 400, to: 900, dur: 0.12, gain: 0.15 }),
  // Core drop / death — noise burst
  drop: () => voice({ type: 'noise', freq: 900, to: 120, dur: 0.28, gain: 0.3, sweep: 1 }),
  // Level complete / victory — rising arpeggio
  win: () => {
    voice({ type: 'triangle', freq: 523, dur: 0.12, gain: 0.2 });
    window.setTimeout(() => voice({ type: 'triangle', freq: 784, dur: 0.15, gain: 0.2 }), 120);
    window.setTimeout(() => voice({ type: 'triangle', freq: 1047, dur: 0.25, gain: 0.2 }), 240);
  },
  // Losing a life — descending tone
  lose: () => voice({ type: 'sawtooth', freq: 300, to: 70, dur: 0.45, gain: 0.22 }),
  // UI click — tiny pip
  ui: () => voice({ type: 'square', freq: 380, dur: 0.05, gain: 0.1 }),
  // Hunter nearby — low warning pulse
  alert: () => {
    voice({ type: 'square', freq: 140, dur: 0.08, gain: 0.1 });
    window.setTimeout(() => voice({ type: 'square', freq: 120, dur: 0.08, gain: 0.1 }), 200);
  },
  // Exit opened — bright ascending sweep
  exit: () => voice({ type: 'sine', freq: 800, to: 1600, dur: 0.3, gain: 0.15 }),
};

/**
 * Play one. Pitch drifts a few percent per call so a run of pickups does not
 * turn into the same sample hammering at you.
 */
export function sfx(name) {
  const play = BANK[name];
  if (!play || !ctx || muted) return;
  play();
}

/** Ramp anything looping to silence — pause, death, and the end of a run. */
export function silence() {
  if (ctx && master) master.gain.setTargetAtTime(0, ctx.currentTime, 0.02);
}

export function restore() {
  if (ctx && master && !muted) master.gain.setTargetAtTime(volume, ctx.currentTime, 0.02);
}

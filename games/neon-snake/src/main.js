/**
 * Boot. Wires the input layer to the page, then hands the canvas to Phaser.
 *
 * Nothing is loaded over the network: Phaser comes from the bundle and every
 * texture is drawn in code at boot, so the built game runs on a static host, in
 * an offline tab, or from a folder on a phone.
 */

import Phaser from 'phaser';
import './style.css';
import { HEX, VIEW } from './config.js';
import { PlayScene } from './scenes/PlayScene.js';
import { initInput } from './systems/input.js';

/**
 * A crash is never allowed to be a blank screen.
 *
 * An uncaught exception inside a Phaser scene stops the game with no visible
 * sign and, importantly, headless Chrome does not report it on the console the
 * way it reports console.error — so a screenshot pass sees a black rectangle and
 * has nothing to blame. Routing it here makes the failure loud in both places:
 * on screen for the player, and on the console for the build pipeline.
 */
function reportCrash(source, error) {
  const message = error?.stack || error?.message || String(error);
  console.error(`[crash:${source}] ${message}`);

  let box = document.getElementById('crash');
  if (!box) {
    box = document.createElement('pre');
    box.id = 'crash';
    document.getElementById('ui')?.append(box);
  }
  box.textContent = `The game crashed (${source}).\n\n${message}`;
}

window.addEventListener('error', (event) => reportCrash('error', event.error || event.message));
window.addEventListener('unhandledrejection', (event) => reportCrash('promise', event.reason));

const host = document.getElementById('game');
initInput(host);

new Phaser.Game({
  type: Phaser.AUTO,
  parent: host,
  width: VIEW.width,
  height: VIEW.height,
  backgroundColor: HEX.ink,
  // FIT letterboxes the design resolution into whatever viewport it is given,
  // so one build fills a desktop window and a phone in landscape without the
  // game code knowing anything about either.
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false },
  },
  // Phaser's own input is left off: everything routes through systems/input.js
  // so the keyboard and the touch controls stay one code path.
  input: { keyboard: false },
  banner: false,
  scene: [PlayScene],
});

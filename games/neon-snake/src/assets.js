/**
 * Neon Snake assets. Every procedural texture is baked once at boot so the
 * frame loop only tints and positions cheap GPU textures.
 */

import { PALETTE } from './config.js';
import { makeTexture } from './systems/textures.js';

export function buildAssets(scene) {
  // A visible but quiet floor: deterministic dither plus alternating scanlines.
  makeTexture(scene, 'floor-noise', 64, 64, (ctx, w, h) => {
    ctx.fillStyle = PALETTE.ground;
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 2) {
      ctx.fillStyle = y % 4 === 0 ? 'rgba(0,229,255,0.055)' : 'rgba(10,10,10,0.12)';
      ctx.fillRect(0, y, w, 1);
    }
    for (let y = 3; y < h; y += 8) {
      for (let x = (y * 7) % 11; x < w; x += 13) {
        ctx.fillStyle = 'rgba(0,255,65,0.045)';
        ctx.fillRect(x, y, 1, 1);
      }
    }
  });

  // White-hot center accepts per-emitter tint without introducing palette keys.
  makeTexture(scene, 'spark', 12, 12, (ctx, w, h) => {
    const glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    glow.addColorStop(0, 'rgba(255,255,255,1)');
    glow.addColorStop(0.25, 'rgba(255,255,255,0.9)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
  });

  makeTexture(scene, 'glow', 32, 32, (ctx, w, h) => {
    const glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    glow.addColorStop(0, 'rgba(255,255,255,0.7)');
    glow.addColorStop(0.3, 'rgba(255,255,255,0.26)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
  });

  makeTexture(scene, 'ring-spark', 16, 16, (ctx, w, h) => {
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w * 0.28, 0, Math.PI * 2);
    ctx.stroke();
  });
}

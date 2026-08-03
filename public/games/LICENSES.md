# Third-party licenses — `/games/`

The games under `public/games/` ship third-party code as part of their static output.
This file is the attribution notice for that redistribution, as required by the MIT
license and by Apache-2.0 §4(d). It ships alongside the games under `public/games/`,
so it travels with every copy of them.

An explicit copyleft scan of every shipped bundle found no GPL, AGPL, LGPL or MPL
code. Everything below is permissive.

| Project | License | Where it ships | Upstream |
| --- | --- | --- | --- |
| three.js (r185) | MIT | bundled into `open-skies/assets/open-skies-*.js` and `codex-of-duty/assets/index-*.js`; vendored under `mortal-combat/vendor/` | <https://github.com/mrdoob/three.js> |
| Rapier (dimforge) | Apache-2.0 | `rapier_wasm3d_bg.wasm`, base64-inlined into `codex-of-duty/assets/index-*.js` | <https://github.com/dimforge/rapier> |
| Phaser (3.90.0) | MIT | bundled into `santos-chaos/assets/index-*.js`, `orbital-linefall/assets/index-*.js`, and `co-toan-3d/assets/index-*.js` | <https://github.com/phaserjs/phaser> |

The full Apache License 2.0 text is at <https://www.apache.org/licenses/LICENSE-2.0>.
Rapier is redistributed unmodified, as compiled WebAssembly and its generated
JavaScript loader.

Google Draco and Basis Universal were previously listed here. Codex of Duty imported
three.js's `DRACOLoader` and `KTX2Loader` without ever wiring them to a loader or
shipping any compressed asset, so the build emitted ~1.84 MB of decoder blobs that
were never fetched at runtime. Those imports are gone and neither project's code is
redistributed here any more.

## Vendored three.js

`mortal-combat/vendor/` holds a pinned copy of three.js r185, downloaded from
`https://unpkg.com/three@0.185.1/build/` and served from this origin rather than fetched
from a CDN at runtime. The Open Skies Vite build bundles the same release into its local
`assets/open-skies-*.js` chunk. Nothing is fetched from a third-party runtime origin.

| File | Bytes | SHA-256 |
| --- | --- | --- |
| `three.module.min.js` | 365552 | `86bcee248b64f44bcfc23c331ae74619061957d59cab040171dcb6fb5900beb6` |
| `three.core.min.js` | 385386 | `05b2609338c76cd65daf74f3ac515bc9a5045e1b3b33edc07d8c9bd55250fa90` |

Both digests match the `content-digest` header unpkg served for the pinned version, so
the vendored copies are byte-identical to upstream. `three.module.min.js` imports
`./three.core.min.js` from the same folder — the two are one split bundle and neither
works alone.

### three.js — MIT License

```
The MIT License

Copyright © 2010-2026 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

### Phaser — MIT License

Phaser 3.90.0 is bundled into `santos-chaos/assets/index-*.js` and
`orbital-linefall/assets/index-*.js` by Vite. The build strips its `@license`
banner during minification, so this notice is the only copy of it that travels
with the redistribution.

```
The MIT License (MIT)

Copyright (c) 2024 Richard Davey, Phaser Studio Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

## Game sources

The game code itself is the repository owner's own work.

- **Codex of Duty** — built from <https://github.com/luongnv89/codex-of-duty>. The
  vendored dependencies above are its build output, not hand-added files.
- **Arcade Bloodline** (`mortal-combat`) — written for this site; a single file plus
  vendored three.js.
- **Open Skies** — written for this site with game-forge; a Vite/Three.js build with six escalating combat sorties, bundled locally for offline play.
- **Neon Snake** — written for this site; self-contained, no third-party code.
- **Switch Heist** (`santos-chaos`) — written for this site with game-forge; a Vite
  build whose only third-party dependency is Phaser, bundled into the JS asset above.
- **Orbital Linefall** (`orbital-linefall`) — written for this site with game-forge;
  same shape as Switch Heist, Phaser its only third-party dependency. Built from a
  source folder named `tetris`; the game carries no Tetris code, assets or branding.
- **Night Spin** (`night-spin`) — written for this site with game-forge; party
  roulette tool (numbers, actions, presets). Phaser is its only third-party
  dependency, bundled into the JS asset.
- **Cờ Toán: Bàn Cờ Sống** (`co-toan-3d`) — written for this site with
  game-forge; an angled tabletop adaptation of Cờ Toán Việt Nam. Phaser is its
  only third-party dependency, bundled into the JS asset.

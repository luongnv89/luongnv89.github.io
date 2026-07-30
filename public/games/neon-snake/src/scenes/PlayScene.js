/**
 * Neon Snake — Maze Runner. Complete game scene.
 *
 * Grid-based snake with 8 maze levels, power-ups, a Hunter AI, moving
 * barriers, crumbling tiles, and speed zones. Everything is drawn with
 * Phaser Graphics — no sprite objects for the board elements.
 */

import Phaser from 'phaser';
import { HEX, META, TUNING, VIEW } from '../config.js';
import { buildAssets } from '../assets.js';
import * as Input from '../systems/input.js';
import { sfx } from '../systems/audio.js';
import { recordScore, bestScore, saveRun, loadRun, clearRun, persistOnExit } from '../systems/save.js';
import * as UI from '../ui/panels.js';

// ── Level Data ────────────────────────────────────────────────────
// '.'=empty, '#'=wall, 'S'=snake start, 'H'=hunter start, 'E'=exit,
// 'C'=crumbling tile, '>'=speed zone (fast clockwise), '^'=fast up,
// 'B'=moving barrier path marker (barrier toggles here)

const LEVELS = [{
  name: 'The Cradle',
  grid: [
    '####################',
    '#..................#',
    '#..##....S....##..#',
    '#..#.#........#.#.#',
    '#..##..........##.#',
    '#.................#',
    '#.....#....#.....#',
    '#.....#....#.....#',
    '#..........#.....#',
    '#..........#.....#',
    '#..........#.....#',
    '#.....#....#.....#',
    '#.....#....#.....#',
    '#................E#',
    '#..##..........##.#',
    '#..#.#........#.#.#',
    '#..##.....##..##.#',
    '#.................#',
    '#..................#',
    '####################',
  ],
  targetFood: 5,
  hunterEnabled: false,
  barriers: [],
}, {
  name: 'The Corridor',
  // Soft first-Hunter lesson: wide lanes, open loops, few chokepoints.
  grid: [
    '####################',
    '#..................#',
    '#..##....##....##..#',
    '#..##....##....##..#',
    '#..................#',
    '#......####........#',
    '#......####........#',
    '#..................#',
    '#..##..........##..#',
    '#..##....S.....##..#',
    '#..................#',
    '#........##........#',
    '#........##........#',
    '#..................#',
    '#..##..........##.E#',
    '#..##..........##..#',
    '#..................#',
    '#......####........#',
    '#........H.........#',
    '####################',
  ],
  targetFood: 4,
  hunterEnabled: true,
  hunterCount: 1,
  barriers: [],
}, {
  name: 'The Fortress',
  // Softer concentric lesson: open ring routes and wide gaps so the player can
  // circle the Hunter instead of getting trapped in nested one-cell corridors.
  grid: [
    '####################',
    '#..................#',
    '#..##############..#',
    '#..#............#..#',
    '#..#..########..#..#',
    '#..#..#......#..#..#',
    '#..#..#......#..#..#',
    '#..#..#......#..#..#',
    '#..#............#..#',
    '#..................#',
    '#S................E#',
    '#..................#',
    '#..#............#..#',
    '#..#..#......#..#..#',
    '#..#..#......#..#..#',
    '#..#..#......#..#..#',
    '#..#..########..#..#',
    '#..#............#..#',
    '#..######H#######..#',
    '####################',
  ],
  targetFood: 5,
  hunterEnabled: true,
  hunterCount: 1,
  barriers: [],
}, {
  name: 'The Crossroads',
  grid: [
    '####################',
    '#..................#',
    '#..##..##..##..##.#',
    '#..##..##..##..##.#',
    '#..................#',
    '#..##..##..##..##.#',
    '#..##..##..##..##.#',
    '#..................#',
    '#..##..##..##..##.#',
    '#..##..S...##..##.#',
    '#..##..E...##..##.#',
    '#..##..##..##..##.#',
    '#..................#',
    '#..##..##..##..##.#',
    '#..##..##..##..##.#',
    '#..................#',
    '#..##..##..##..##.#',
    '#..##..##..###.##.#',
    '#.......H.........#',
    '####################',
  ],
  targetFood: 6,
  hunterEnabled: true,
  hunterStartX: 10,
  hunterStartY: 18,
  barriers: [],
}, {
  name: 'The Pendulum',
  grid: [
    '####################',
    '#..................#',
    '#..................#',
    '#..#..........#...#',
    '#..#..........#...#',
    '#..#..........#...#',
    '#..#..........#...#',
    '#..#..........#...#',
    '#..................#',
    '#......S..........#',
    '#.........E.......#',
    '#..................#',
    '#..#..........#...#',
    '#..#..........#...#',
    '#..#..........#...#',
    '#..#..........#...#',
    '#..#..........#...#',
    '#..................#',
    '#.......H.........#',
    '####################',
  ],
  targetFood: 6,
  hunterEnabled: true,
  hunterStartX: 8,
  hunterStartY: 18,
  barriers: [
    // { x, y, dx, dy, len } — barriers patrol horizontally or vertically
    { y: 3, x1: 3, x2: 16, dir: 1 },
    { y: 13, x1: 3, x2: 16, dir: -1 },
  ],
}, {
  name: 'The Quarry',
  grid: [
    '####################',
    '#.C.C.C.C.C.C.C.C.#',
    '#..................#',
    '#.C.C.C.C.C.C.C.C.#',
    '#..S..............#',
    '#.C.C.C.C.C.C.C.C.#',
    '#..................#',
    '#.C.C.C.C.C.C.C.C.#',
    '#..................#',
    '#.C.C.C.C.C.C.C.C.#',
    '#..................#',
    '#.C.C.C.C.C.C.C.C.#',
    '#..........H......#',
    '#.C.C.C.C.C.C.C.C.#',
    '#.........E.......#',
    '#.C.C.C.C.C.C.C.C.#',
    '#..................#',
    '#.C.C.C.C.C.C.C.C.#',
    '#..................#',
    '####################',
  ],
  targetFood: 7,
  hunterEnabled: true,
  hunterCount: 2,
  hunterStartX: 14,
  hunterStartY: 12,
  barriers: [],
}, {
  name: 'The Throat',
  grid: [
    '####################',
    '#..................#',
    '####.####.####.####',
    '#..................#',
    '####..####..#######',
    '#....>>.......>>..#',
    '####.####.####.####',
    '#..................#',
    '#####..#####..#####',
    '#....>>..S..>>....#',
    '#####..#####..#####',
    '#..................#',
    '####.####.####.####',
    '#....>>..E..>>....#',
    '####.####.####.####',
    '#..................#',
    '#####..#####..#####',
    '#..........H.......#',
    '#..................#',
    '####################',
  ],
  targetFood: 7,
  hunterEnabled: true,
  hunterCount: 2,
  hunterStartX: 15,
  hunterStartY: 17,
  barriers: [
    { y: 3, x1: 2, x2: 17, dir: 1 },
    { y: 15, x1: 2, x2: 17, dir: -1 },
  ],
}, {
  name: 'The Core',
  grid: [
    '####################',
    '#..C..C..C..C..C..#',
    '#.####.######.####.#',
    '#.#..........#...#.#',
    '#.#..##..##..#.#.#.#',
    '#.C..>>..>>..C.#.C.#',
    '#.#..##..##..#.#.#.#',
    '#.#..........#...#.#',
    '#.####..S...######.#',
    '#.C..>>..E..>>..C..#',
    '#.######..####..#.#',
    '#.#...#..........#.#',
    '#.#.#.#..##..##..#.#',
    '#.C.#.C..>>..>>..C.#',
    '#.#.#.#..##..##..#.#',
    '#.#...#.....H....#.#',
    '#.######.######.####',
    '#..C..C..C..C..C..#',
    '#..................#',
    '####################',
  ],
  targetFood: 8,
  hunterEnabled: true,
  hunterCount: 2,
  hunterStartX: 14,
  hunterStartY: 15,
  barriers: [
    { y: 8, x1: 3, x2: 16, dir: 1 },
    { y: 14, x1: 3, x2: 16, dir: -1 },
  ],
}];

// ── Power-up types ────────────────────────────────────────────────
const POWER_TYPES = ['shield', 'speed', 'magnet', 'shrink', 'ghost'];
const mixColor = (a, b, amount) => {
  const ar = (a >> 16) & 0xff;
  const ag = (a >> 8) & 0xff;
  const ab = a & 0xff;
  const br = (b >> 16) & 0xff;
  const bg = (b >> 8) & 0xff;
  const bb = b & 0xff;
  const t = Math.max(0, Math.min(1, amount));
  return (Math.round(ar + (br - ar) * t) << 16) |
    (Math.round(ag + (bg - ag) * t) << 8) |
    Math.round(ab + (bb - ab) * t);
};
// Highlights stay inside the six-color system by blending toward the cyan
// accent rather than introducing a seventh white base color.
const shadeColor = (color, amount) => mixColor(color, amount >= 0 ? HEX.accent : HEX.ink, Math.abs(amount));
const POWER_COLORS = Object.freeze({
  shield: HEX.accent,
  speed: mixColor(HEX.player, HEX.accent, 0.35),
  magnet: mixColor(HEX.threat, HEX.accent, 0.5),
  shrink: shadeColor(HEX.threat, 0.28),
  ghost: shadeColor(HEX.surface, 0.45),
});
const FOOD_COLOR = shadeColor(HEX.accent, 0.35);
const EXIT_COLOR = mixColor(HEX.accent, HEX.threat, 0.18);
const PLAYER_DARK = mixColor(HEX.player, HEX.ink, 0.42);
const WALL_EDGE = mixColor(HEX.accent, HEX.surface, 0.35);
const LANE_GLOW = mixColor(HEX.accent, HEX.ground, 0.55);
const CARDINAL_DIRS = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];

function normalizeLevelRow(rawRow, size) {
  const row = String(rawRow ?? '');
  const first = row[0] ?? '#';
  const last = row[row.length - 1] ?? '#';
  const interior = row.slice(1, -1).slice(0, size - 2).padEnd(size - 2, '.');
  return `${first}${interior}${last}`;
}

// ── PlayScene ─────────────────────────────────────────────────────
export class PlayScene extends Phaser.Scene {
  constructor() {
    super('play');
  }

  create() {
    buildAssets(this);

    // Grid geometry
    this.CELL = TUNING.cellPixels;
    this.GRID = TUNING.gridSize;
    this.BOARD = this.CELL * this.GRID;
    this.BOARD_X = Math.floor((VIEW.width - this.BOARD) / 2);
    this.BOARD_Y = Math.floor((VIEW.height - this.BOARD) / 2);

    // Retained static layers sit below the small dynamic redraw surface.
    this.bgGfx = this.add.graphics().setDepth(0);
    this.floorTile = this.add.tileSprite(
      this.BOARD_X, this.BOARD_Y, this.BOARD, this.BOARD, 'floor-noise',
    ).setOrigin(0).setDepth(1);
    this.staticGfx = this.add.graphics().setDepth(2);
    this.terrainGfx = this.add.graphics().setDepth(3);
    this.trailGfx = this.add.graphics().setDepth(4);
    this.actorGfx = this.add.graphics().setDepth(5);
    this.effectsGfx = this.add.graphics().setDepth(6);

    const emitter = (texture, tint, speed, lifespan, maxParticles) =>
      this.add.particles(0, 0, texture, {
        speed,
        lifespan,
        tint,
        maxParticles,
        scale: { start: 1.15, end: 0 },
        blendMode: 'ADD',
        emitting: false,
      }).setDepth(7);
    this.foodParticles = emitter('spark', FOOD_COLOR, { min: 35, max: 110 }, 320, 42);
    this.powerParticles = emitter('ring-spark', HEX.accent, { min: 45, max: 130 }, 380, 36);
    this.exitParticles = emitter('spark', EXIT_COLOR, { min: 55, max: 155 }, 450, 48);
    this.hitParticles = emitter('spark', HEX.threat, { min: 80, max: 210 }, 420, 56);

    this.demoMode = new URLSearchParams(window.location.search).get('autoplay') === '1';
    this.inputDisposers = [
      Input.onPress('left', () => this.queueDirection({ x: -1, y: 0 })),
      Input.onPress('right', () => this.queueDirection({ x: 1, y: 0 })),
      Input.onPress('up', () => this.queueDirection({ x: 0, y: -1 })),
      Input.onPress('down', () => this.queueDirection({ x: 0, y: 1 })),
    ];
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.inputDisposers.forEach(dispose => dispose());
      this.cancelLevelTransition();
      this.hitCall?.remove(false);
      this.impactCall?.remove(false);
    });

    // Build touch first: opening the guide can now hide an existing joystick.
    Input.buildTouchControls(document.getElementById('touch'), {
      stick: true,
      buttons: [],
    });

    // ── Mount UI ──
    UI.mountUI({
      onStart: () => this.begin(),
      onPause: () => this.setPaused(true),
      onResume: () => this.setPaused(false),
      onRestart: () => {
        UI.closePanel();
        this.resetRun();
        this.begin();
      },
    });

    // ── Restore or start fresh ──
    const saved = loadRun();
    this.resetRun();
    if (saved) this.restoreRun(saved);

    persistOnExit(() => (this.state === 'over' ? null : this.snapshot()));

    this.refreshHud();
  }

  // ── State Management ────────────────────────────────────────────

  cancelLevelTransition() {
    this.transitionGeneration = (this.transitionGeneration ?? 0) + 1;
    this.transitionCall?.remove(false);
    this.transitionCall = null;
    this.transitioning = false;
    this.transitionPanelPaused = false;

    // Reset only the fade effect owned here; unrelated camera listeners and
    // other FX remain intact. Alpha is explicit so restart can never inherit a
    // fully black camera from an interrupted fade-out.
    const camera = this.cameras?.main;
    camera?.fadeEffect?.reset();
    camera?.setAlpha(1);
  }

  resetRun() {
    this.cancelLevelTransition();
    this.hitCall?.remove(false);
    this.hitCall = null;
    this.impactCall?.remove(false);
    this.impactCall = null;
    this.impactMarker = null;
    this.pendingHitCause = null;
    this.hitPanelPaused = false;
    this.state = 'ready';
    if (this.physics) this.physics.world.isPaused = true;
    this.currentLevel = 0;
    this.score = 0;
    this.lives = TUNING.lives;
    this.totalEaten = 0;
    this.elapsed = 0;
    this.powerUpActive = null;
    this.powerUpTimer = 0;
    this.animTime = 0;
    this.levelComplete = false;
    this.victory = false;
    this.hudKey = '';
    this.lastPowerSecond = null;
    clearRun();
    this.loadLevel(0);
  }

  begin() {
    if (this.state === 'over') return;
    this.state = 'playing';
    this.physics.world.isPaused = false;
    UI.markStarted();
    this.refreshHud();
  }

  setPaused(paused) {
    if (this.state === 'over' || this.state === 'ready') return;
    // Hit and transition beats finish on wall-clock time; a panel controls the
    // state they resolve into rather than cancelling the beat underneath it.
    if (this.state === 'hit') {
      this.hitPanelPaused = paused;
      this.physics.world.isPaused = paused;
      return;
    }
    if (this.state === 'transition') {
      this.transitionPanelPaused = paused;
      this.physics.world.isPaused = paused;
      return;
    }
    this.state = paused ? 'paused' : 'playing';
    this.physics.world.isPaused = paused;
    if (paused) saveRun(this.snapshot());
  }

  snapshot() {
    return {
      currentLevel: this.currentLevel,
      score: this.score,
      lives: this.lives,
      totalEaten: this.totalEaten,
      elapsed: this.elapsed,
      snake: this.snake,
      dir: this.dir,
      pendingDirs: this.pendingDirs,
      food: this.food,
      foodEaten: this.foodEaten,
      exitOpen: this.exitOpen,
      exitPos: this.exitPos ? { ...this.exitPos } : null,
      powerUpPickup: this.powerUp ? { ...this.powerUp } : null,
      activePowerUp: this.powerUpActive ? {
        type: this.powerUpActive,
        timer: this.powerUpTimer,
      } : null,
      hunters: this.hunters.map(hunter => ({
        ...hunter,
        dir: hunter.dir ? { ...hunter.dir } : null,
      })),
      barrierTimer: this.barrierTimer,
      barrierStates: this.barriers.map(b => ({
        x: b.x, y: b.y, dir: b.dir, phase: b.phase,
      })),
      crumbleStates: this.crumbleTiles.map(c => ({
        x: c.x, y: c.y,
        state: c.state,
        timer: c.timer,
      })),
    };
  }

  restoreRun(saved) {
    this.currentLevel = saved.currentLevel ?? 0;
    this.score = saved.score ?? 0;
    this.lives = saved.lives ?? TUNING.lives;
    this.totalEaten = saved.totalEaten ?? 0;
    this.elapsed = saved.elapsed ?? 0;
    this.loadLevel(this.currentLevel);

    if (saved.snake) this.snake = saved.snake.map(s => ({ ...s }));
    if (saved.dir) this.dir = { ...saved.dir };
    if (saved.pendingDirs) this.pendingDirs = saved.pendingDirs.map(d => ({ ...d }));
    this.foodEaten = saved.foodEaten ?? 0;
    this.exitOpen = saved.exitOpen ?? false;

    if (Object.prototype.hasOwnProperty.call(saved, 'exitPos')) {
      this.exitPos = saved.exitPos ? { ...saved.exitPos } : null;
    }
    if (Object.prototype.hasOwnProperty.call(saved, 'powerUpPickup')) {
      this.powerUp = saved.powerUpPickup ? { ...saved.powerUpPickup } : null;
    }
    const active = saved.activePowerUp ??
      (saved.powerUp?.timer !== undefined && saved.powerUp?.x === undefined ? saved.powerUp : null);
    this.powerUpActive = active?.type ?? null;
    this.powerUpTimer = active?.timer ?? 0;

    if (this.hunterEnabled) {
      const restoredHunters = saved.hunters ?? (saved.hunter ? [saved.hunter] : null);
      if (restoredHunters) {
        for (let i = 0; i < this.hunters.length && i < restoredHunters.length; i++) {
          this.hunters[i] = {
            ...this.hunters[i],
            ...restoredHunters[i],
            dir: restoredHunters[i].dir ? { ...restoredHunters[i].dir } : null,
          };
        }
      }
    }
    this.barrierTimer = saved.barrierTimer ?? 0;

    if (saved.barrierStates) {
      for (let i = 0; i < this.barriers.length && i < saved.barrierStates.length; i++) {
        const restored = saved.barrierStates[i];
        this.barriers[i].x = restored.x ?? this.barriers[i].x;
        this.barriers[i].y = restored.y ?? this.barriers[i].y;
        this.barriers[i].dir = restored.dir ?? this.barriers[i].dir;
        this.barriers[i].phase = restored.phase ?? this.barriers[i].phase;
      }
    }
    if (saved.crumbleStates) {
      for (let i = 0; i < this.crumbleTiles.length && i < saved.crumbleStates.length; i++) {
        this.crumbleTiles[i].state = saved.crumbleStates[i].state;
        this.crumbleTiles[i].timer = saved.crumbleStates[i].timer;
      }
    }

    this.ensureReachableExit();
    if (Object.prototype.hasOwnProperty.call(saved, 'food')) {
      this.food = saved.food ? { ...saved.food } : null;
    }
    if (!this.food || !this.isValidPlacement(this.food, { ignoreFood: true })) {
      this.food = null;
      this.placeFood();
    }
    if (this.powerUp && !this.isValidPlacement(this.powerUp, { ignorePowerUp: true })) {
      this.powerUp = null;
    }
    this.stepAcc = 0;
    this.stepInterval = this.getStepInterval();
    this.terrainDirty = true;
    this.actorsDirty = true;
    this.effectsDirty = true;
    this.renderLayers(true);
  }

  // ── Level Loading ───────────────────────────────────────────────

  loadLevel(index) {
    const data = LEVELS[index];
    if (!data) return;

    this.levelRows = Array.from(
      { length: this.GRID },
      (_, y) => normalizeLevelRow(data.grid[y] ?? '#'.repeat(this.GRID), this.GRID),
    );

    // Initialize every mutable level system before any placement helper runs.
    this.powerUp = null;
    this.powerUpActive = null;
    this.powerUpTimer = 0;
    this.vacatedTrail = [];
    this.impactMarker = null;
    this.impactCall?.remove(false);
    this.impactCall = null;
    this.hunterEnabled = Boolean(data.hunterEnabled);
    this.hunters = [];
    this.hunterStarts = [];
    this.barriers = [];
    this.barrierTimer = 0;
    this.crumbleTiles = [];
    this.speedZones = [];
    this.food = null;
    this.exitPos = null;

    this.grid = this.levelRows.map(row => row.split('').map(ch => (ch === '#' ? 1 : 0)));

    let startX = 10;
    let startY = 10;
    for (let y = 0; y < this.GRID; y++) {
      for (let x = 0; x < this.GRID; x++) {
        const ch = this.levelRows[y][x];
        if (ch === 'S') { startX = x; startY = y; }
        if (ch === 'E') this.exitPos = { x, y };
        if (ch === 'H') this.hunterStarts.push({ x, y });
        if (ch === 'C') this.crumbleTiles.push({ x, y, state: 'solid', timer: 0 });
        if (ch === '>' || ch === '^') {
          this.speedZones.push({ x, y, dir: ch === '>' ? 'cw' : 'up' });
        }
      }
    }

    for (const authored of data.barriers ?? []) {
      if (authored.y === undefined) continue;
      const len = 3;
      this.barriers.push({
        x: authored.dir > 0 ? authored.x1 : authored.x2 - len + 1,
        y: authored.y,
        x1: authored.x1,
        x2: authored.x2,
        dir: authored.dir,
        phase: 0,
        len,
        type: 'h',
      });
    }

    if (this.hunterStarts.length === 0 && data.hunterStartX !== undefined) {
      this.hunterStarts.push({ x: data.hunterStartX, y: data.hunterStartY });
    }

    const start = this.chooseStart(startX, startY);
    this.startSnake = start.snake.map(segment => ({ ...segment }));
    this.startDir = { ...start.dir };
    this.snake = start.snake.map(segment => ({ ...segment }));
    this.dir = { ...start.dir };
    this.pendingDirs = [];
    this.createHunters(data.hunterCount ?? (this.hunterEnabled ? 1 : 0));

    this.foodEaten = 0;
    this.targetFood = data.targetFood;
    this.exitOpen = false;
    this.stepAcc = 0;
    this.stepInterval = this.getStepInterval();
    this.levelComplete = false;
    this.transitioning = false;
    this.transitionPanelPaused = false;
    this.lastPowerSecond = null;
    this.terrainDirty = true;
    this.actorsDirty = true;
    this.effectsDirty = true;
    this.nextCosmeticDraw = 0;

    this.ensureReachableExit();
    this.drawStaticLevel();
    this.placeFood();
    this.renderLayers(true);
  }

  hunterInterval() {
    return Math.max(
      TUNING.hunterMinInterval,
      TUNING.hunterBaseSpeed - this.currentLevel * TUNING.hunterSpeedUp,
    );
  }

  createHunters(count) {
    if (!this.hunterEnabled || count <= 0) return;
    for (let id = 0; id < count; id++) {
      const preferred = this.hunterStarts[id] ?? null;
      const spawn = this.findHunterSpawn(preferred);
      if (!spawn) break;
      this.hunters.push({
        id,
        x: spawn.x,
        y: spawn.y,
        startX: spawn.x,
        startY: spawn.y,
        dir: { x: -1, y: 0 },
        stepAcc: 0,
        stepInterval: this.hunterInterval(),
        active: true,
        respawnTimer: 0,
      });
    }
  }

  findHunterSpawn(preferred = null, hunterId = -1) {
    const blocked = new Set(this.snake.map(segment => `${segment.x},${segment.y}`));
    for (const hunter of this.hunters) {
      if (hunter.id !== hunterId && hunter.active) blocked.add(`${hunter.x},${hunter.y}`);
    }
    const valid = cell => cell && this.isWalkable(cell.x, cell.y, false) &&
      !blocked.has(`${cell.x},${cell.y}`) &&
      (!this.exitPos || cell.x !== this.exitPos.x || cell.y !== this.exitPos.y);
    if (valid(preferred)) return { ...preferred };

    const head = this.snake[0];
    const cells = [];
    for (let y = 1; y < this.GRID - 1; y++) {
      for (let x = 1; x < this.GRID - 1; x++) {
        const cell = { x, y };
        if (valid(cell)) cells.push(cell);
      }
    }
    cells.sort((a, b) =>
      (Math.abs(b.x - head.x) + Math.abs(b.y - head.y)) -
      (Math.abs(a.x - head.x) + Math.abs(a.y - head.y)) || a.y - b.y || a.x - b.x);
    return cells[0] ?? null;
  }

  chooseStart(startX, startY) {
    for (const dir of CARDINAL_DIRS) {
      const snake = Array.from({ length: 3 }, (_, i) => ({
        x: startX - i * dir.x,
        y: startY - i * dir.y,
      }));
      if (snake.every(segment => this.isWalkable(segment.x, segment.y, false))) {
        return { snake, dir };
      }
    }
    throw new Error(`Level ${this.currentLevel + 1} has no valid three-cell snake start`);
  }

  getStepInterval() {
    // Level is the primary speed driver: each maze is a clear step faster.
    const levelIndex = Math.max(0, Math.min(this.currentLevel, LEVELS.length - 1));
    const levelSpan = Math.max(1, LEVELS.length - 1);
    const levelCurve = levelIndex / levelSpan; // 0 at L1 → 1 at L8
    // Ease-in so early mazes stay readable while late mazes feel urgent.
    const levelBoost = TUNING.intervalPerLevel * levelIndex * (1 + 0.35 * levelCurve);
    const foodPenalty = this.foodEaten * TUNING.intervalPerFood;
    let interval = TUNING.baseInterval - levelBoost - foodPenalty;
    // Speed zone bonus
    if (this.speedZoneActive()) {
      interval = Math.floor(interval * 0.72);
    }
    // Power-up speed boost
    if (this.powerUpActive === 'speed') {
      interval = Math.floor(interval * 0.62);
    }
    return Math.max(TUNING.minInterval, Math.round(interval));
  }

  speedZoneActive() {
    if (!this.snake || this.snake.length === 0) return false;
    const head = this.snake[0];
    return this.speedZones.some(z => z.x === head.x && z.y === head.y);
  }

  // ── Food ────────────────────────────────────────────────────────

  placeFood() {
    const previous = this.food;
    this.food = null;
    const free = this.getEmptyCells();
    const different = previous
      ? free.filter(cell => cell.x !== previous.x || cell.y !== previous.y)
      : free;
    const pool = different.length > 0 ? different : free;
    if (pool.length === 0) return;
    const pos = pool[Math.floor(Math.random() * pool.length)];
    this.food = { x: pos.x, y: pos.y };
    this.terrainDirty = true;
    this.effectsDirty = true;
  }

  spawnPowerUp() {
    if (this.currentLevel < 2 || this.powerUp || Math.random() > TUNING.powerUpSpawnChance) return;
    const free = this.getEmptyCells();
    if (free.length === 0) return;
    const pos = free[Math.floor(Math.random() * free.length)];
    const type = POWER_TYPES[Math.floor(Math.random() * POWER_TYPES.length)];
    this.powerUp = { x: pos.x, y: pos.y, type };
    this.terrainDirty = true;
    this.effectsDirty = true;
  }

  barrierOccupies(x, y) {
    return this.barriers.some(barrier => {
      for (let i = 0; i < barrier.len; i++) {
        const bx = barrier.type === 'h' ? barrier.x + i : barrier.x;
        const by = barrier.type === 'h' ? barrier.y : barrier.y + i;
        if (bx === x && by === y) return true;
      }
      return false;
    });
  }

  isWalkable(x, y, ghost = this.powerUpActive === 'ghost') {
    if (x <= 0 || x >= this.GRID - 1 || y <= 0 || y >= this.GRID - 1) return false;
    if (ghost) return true;
    if (this.grid[y][x] === 1 || this.barrierOccupies(x, y)) return false;
    return !this.crumbleTiles.some(tile =>
      tile.x === x && tile.y === y && tile.state === 'crumbled');
  }

  reachableCellSet(start = this.snake?.[0]) {
    const reachable = new Set();
    if (!start) return reachable;
    const queue = [{ x: start.x, y: start.y }];
    reachable.add(`${start.x},${start.y}`);
    for (let i = 0; i < queue.length; i++) {
      const cell = queue[i];
      for (const dir of CARDINAL_DIRS) {
        const next = { x: cell.x + dir.x, y: cell.y + dir.y };
        const key = `${next.x},${next.y}`;
        if (reachable.has(key) || !this.isWalkable(next.x, next.y, false)) continue;
        reachable.add(key);
        queue.push(next);
      }
    }
    return reachable;
  }

  placementOccupied({ ignoreFood = false, ignorePowerUp = false, ignoreExit = false } = {}) {
    const occupied = new Set(this.snake.map(segment => `${segment.x},${segment.y}`));
    if (this.food && !ignoreFood) occupied.add(`${this.food.x},${this.food.y}`);
    if (this.powerUp && !ignorePowerUp) occupied.add(`${this.powerUp.x},${this.powerUp.y}`);
    if (this.exitPos && !ignoreExit) occupied.add(`${this.exitPos.x},${this.exitPos.y}`);
    for (const hunter of this.hunters) {
      if (hunter.active) occupied.add(`${hunter.x},${hunter.y}`);
    }
    for (const barrier of this.barriers) {
      for (let i = 0; i < barrier.len; i++) {
        const x = barrier.type === 'h' ? barrier.x + i : barrier.x;
        const y = barrier.type === 'h' ? barrier.y : barrier.y + i;
        occupied.add(`${x},${y}`);
      }
    }
    return occupied;
  }

  getEmptyCells() {
    const reachable = this.reachableCellSet();
    const occupied = this.placementOccupied();
    const cells = [];
    for (const key of reachable) {
      const [x, y] = key.split(',').map(Number);
      if (!occupied.has(key) && this.isWalkable(x, y, false)) cells.push({ x, y });
    }
    return cells;
  }

  isValidPlacement(cell, options = {}) {
    if (!cell || !this.isWalkable(cell.x, cell.y, false)) return false;
    if (!this.reachableCellSet().has(`${cell.x},${cell.y}`)) return false;
    return !this.placementOccupied(options).has(`${cell.x},${cell.y}`);
  }

  ensureReachableExit() {
    const reachable = this.reachableCellSet();
    if (this.exitPos && reachable.has(`${this.exitPos.x},${this.exitPos.y}`)) return;

    const occupied = this.placementOccupied({ ignoreExit: true });
    const head = this.snake[0];
    const candidates = [...reachable]
      .map(key => {
        const [x, y] = key.split(',').map(Number);
        return { x, y };
      })
      .filter(cell => this.isWalkable(cell.x, cell.y, false) &&
        !occupied.has(`${cell.x},${cell.y}`))
      .sort((a, b) =>
        (Math.abs(b.x - head.x) + Math.abs(b.y - head.y)) -
        (Math.abs(a.x - head.x) + Math.abs(a.y - head.y)) ||
        a.y - b.y || a.x - b.x);

    if (candidates.length === 0) {
      throw new Error(`Level ${this.currentLevel + 1} has no reachable exit cell`);
    }
    this.exitPos = candidates[0];
  }

  collectPowerUp(type) {
    const head = this.snake[0];
    const px = this.BOARD_X + head.x * this.CELL + this.CELL / 2;
    const py = this.BOARD_Y + head.y * this.CELL + this.CELL / 2;
    this.powerUp = null;
    this.terrainDirty = true;
    this.effectsDirty = true;
    sfx('boost');
    if (!UI.reducedMotion()) this.powerParticles.emitParticleAt(px, py, 12);
    if (type === 'shrink') {
      const removable = Math.min(TUNING.shrinkAmount, Math.max(0, this.snake.length - 3));
      if (removable > 0) {
        const removed = this.snake.splice(this.snake.length - removable, removable);
        removed.forEach(cell => this.recordVacatedCell(cell));
        this.actorsDirty = true;
      }
      return;
    }
    this.powerUpActive = type;
    this.powerUpTimer = type === 'shield' ? 0 : TUNING.powerUpDuration;
    this.stepInterval = this.getStepInterval();
    this.actorsDirty = true;
    this.effectsDirty = true;
  }

  moveFoodWithMagnet() {
    if (this.powerUpActive !== 'magnet' || !this.food) return;
    const head = this.snake[0];
    const distance = Math.abs(this.food.x - head.x) + Math.abs(this.food.y - head.y);
    if (distance > 4 || distance === 0) return;

    const reachable = this.reachableCellSet();
    const occupied = this.placementOccupied({ ignoreFood: true });
    const candidates = CARDINAL_DIRS
      .map(dir => ({ x: this.food.x + dir.x, y: this.food.y + dir.y }))
      .filter(cell =>
        Math.abs(cell.x - head.x) + Math.abs(cell.y - head.y) < distance &&
        this.isWalkable(cell.x, cell.y, false) &&
        reachable.has(`${cell.x},${cell.y}`) &&
        !occupied.has(`${cell.x},${cell.y}`));
    if (candidates.length > 0) {
      this.food = candidates[0];
      this.terrainDirty = true;
      this.effectsDirty = true;
    }
  }

  // ── Game Step ───────────────────────────────────────────────────

  recordVacatedCell(cell) {
    if (!cell) return;
    this.vacatedTrail.push({ x: cell.x, y: cell.y, at: this.time.now });
    if (this.vacatedTrail.length > 40) this.vacatedTrail.splice(0, this.vacatedTrail.length - 40);
    this.effectsDirty = true;
  }

  collisionCauseAt(x, y) {
    if (x <= 0 || x >= this.GRID - 1 || y <= 0 || y >= this.GRID - 1) return 'wall';
    if (this.powerUpActive === 'ghost') return null;
    if (this.grid[y][x] === 1) return 'wall';
    if (this.barrierOccupies(x, y)) return 'barrier';
    if (this.crumbleTiles.some(tile => tile.x === x && tile.y === y && tile.state === 'crumbled')) {
      return 'collapsed tile';
    }
    return null;
  }

  gameStep() {
    const head = this.snake[0];
    const newHead = { x: head.x + this.dir.x, y: head.y + this.dir.y };
    const terrainCause = this.collisionCauseAt(newHead.x, newHead.y);
    if (terrainCause) {
      this.onDeath(terrainCause, newHead);
      return true;
    }
    for (let i = 0; i < this.snake.length - 1; i++) {
      if (this.snake[i].x === newHead.x && this.snake[i].y === newHead.y) {
        this.onDeath('tail', newHead);
        return true;
      }
    }
    if (this.hunters.some(hunter => hunter.active &&
      newHead.x === hunter.x && newHead.y === hunter.y)) {
      this.onDeath('Hunter', newHead);
      return true;
    }

    const ate = Boolean(this.food && newHead.x === this.food.x && newHead.y === this.food.y);
    this.snake.unshift(newHead);
    if (!ate) this.recordVacatedCell(this.snake.pop());
    this.actorsDirty = true;

    if (this.powerUp && newHead.x === this.powerUp.x && newHead.y === this.powerUp.y) {
      this.collectPowerUp(this.powerUp.type);
    }

    if (ate) {
      this.food = null;
      this.foodEaten++;
      this.totalEaten++;
      this.score += TUNING.foodScore;
      sfx('pickup');
      if (!UI.reducedMotion()) {
        const px = this.BOARD_X + newHead.x * this.CELL + this.CELL / 2;
        const py = this.BOARD_Y + newHead.y * this.CELL + this.CELL / 2;
        this.foodParticles.emitParticleAt(px, py, 10);
      }
      if (this.foodEaten >= this.targetFood && !this.exitOpen) {
        this.exitOpen = true;
        this.terrainDirty = true;
        this.effectsDirty = true;
        sfx('exit');
        if (!UI.reducedMotion() && this.exitPos) {
          const ex = this.BOARD_X + this.exitPos.x * this.CELL + this.CELL / 2;
          const ey = this.BOARD_Y + this.exitPos.y * this.CELL + this.CELL / 2;
          this.exitParticles.emitParticleAt(ex, ey, 16);
        }
      }
      this.spawnPowerUp();
      this.placeFood();
      this.stepInterval = this.getStepInterval();
    }

    this.moveFoodWithMagnet();

    if (this.exitOpen && this.exitPos &&
        newHead.x === this.exitPos.x && newHead.y === this.exitPos.y) {
      this.onLevelComplete();
      return true;
    }

    for (const tile of this.crumbleTiles) {
      if (tile.x === newHead.x && tile.y === newHead.y && tile.state === 'solid') {
        tile.state = 'triggered';
        tile.timer = TUNING.crumbleDelayMs;
        this.terrainDirty = true;
      }
    }

    this.refreshHud();
    return false;
  }

  hunterStep(hunter) {
    if (!hunter?.active || !this.hunterEnabled) return false;

    const head = this.snake[0];
    const predicted = {
      x: head.x + this.dir.x * TUNING.hunterPredictSteps,
      y: head.y + this.dir.y * TUNING.hunterPredictSteps,
    };
    let candidates = CARDINAL_DIRS
      .map(dir => ({ dir, x: hunter.x + dir.x, y: hunter.y + dir.y }))
      .filter(cell => this.isWalkable(cell.x, cell.y, false) &&
        !this.hunters.some(other => other !== hunter && other.active &&
          other.x === cell.x && other.y === cell.y));

    if (hunter.dir && candidates.length > 1) {
      const forward = candidates.filter(cell =>
        cell.dir.x !== -hunter.dir.x || cell.dir.y !== -hunter.dir.y);
      if (forward.length > 0) candidates = forward;
    }
    candidates.sort((a, b) =>
      (Math.abs(a.x - predicted.x) + Math.abs(a.y - predicted.y)) -
      (Math.abs(b.x - predicted.x) + Math.abs(b.y - predicted.y)) ||
      CARDINAL_DIRS.indexOf(a.dir) - CARDINAL_DIRS.indexOf(b.dir));
    if (candidates.length === 0) return false;

    const previous = { x: hunter.x, y: hunter.y };
    const next = candidates[0];
    hunter.x = next.x;
    hunter.y = next.y;
    hunter.dir = { ...next.dir };
    this.actorsDirty = true;

    if (this.snake.some(segment => segment.x === next.x && segment.y === next.y)) {
      const absorbed = this.onDeath('Hunter', next);
      if (absorbed) {
        hunter.x = previous.x;
        hunter.y = previous.y;
      }
      return true;
    }
    return false;
  }

  updateBarriers(dt) {
    if (this.barriers.length === 0) return false;
    this.barrierTimer += dt;
    if (this.barrierTimer < TUNING.barrierShiftMs) return false;
    this.barrierTimer -= TUNING.barrierShiftMs;

    const previous = this.barriers.map(barrier => ({ x: barrier.x, dir: barrier.dir }));
    for (const barrier of this.barriers) {
      if (barrier.type !== 'h') continue;
      barrier.x += barrier.dir;
      if (barrier.x >= barrier.x2 - barrier.len + 1) barrier.dir = -1;
      if (barrier.x <= barrier.x1) barrier.dir = 1;
    }
    this.terrainDirty = true;

    const impactCell = this.powerUpActive !== 'ghost'
      ? this.snake.find(segment => this.barrierOccupies(segment.x, segment.y))
      : null;
    const hitSnake = Boolean(impactCell);
    if (!hitSnake) return false;

    const absorbed = this.onDeath('barrier', impactCell);
    if (absorbed) {
      this.barriers.forEach((barrier, index) => {
        barrier.x = previous[index].x;
        barrier.dir = previous[index].dir;
      });
      this.terrainDirty = true;
    }
    return true;
  }

  updateCrumbleTiles(dt) {
    for (const tile of this.crumbleTiles) {
      if (tile.state === 'triggered') {
        tile.timer -= dt;
        if (tile.timer <= 0) {
          tile.state = 'crumbled';
          tile.timer = TUNING.crumbleRestoreMs;
          this.terrainDirty = true;
          const hitSnake = this.powerUpActive !== 'ghost' && this.snake.some(segment =>
            segment.x === tile.x && segment.y === tile.y);
          if (hitSnake) {
            const absorbed = this.onDeath('collapsed tile', tile);
            if (absorbed) {
              tile.state = 'solid';
              tile.timer = 0;
              this.terrainDirty = true;
            }
            return true;
          }
          for (const hunter of this.hunters) {
            if (hunter.active && hunter.x === tile.x && hunter.y === tile.y) {
              hunter.active = false;
              hunter.respawnTimer = 3000;
              this.actorsDirty = true;
            }
          }
        }
      } else if (tile.state === 'crumbled') {
        tile.timer -= dt;
        if (tile.timer <= 0) {
          tile.state = 'solid';
          tile.timer = 0;
          this.terrainDirty = true;
        }
      }
    }

    for (const hunter of this.hunters) {
      if (hunter.active || hunter.respawnTimer <= 0) continue;
      hunter.respawnTimer -= dt;
      if (hunter.respawnTimer <= 0) {
        const spawn = this.findHunterSpawn({ x: hunter.startX, y: hunter.startY }, hunter.id);
        if (spawn) {
          hunter.x = spawn.x;
          hunter.y = spawn.y;
          hunter.dir = { x: -1, y: 0 };
          hunter.stepAcc = 0;
          hunter.active = true;
          hunter.respawnTimer = 0;
          this.actorsDirty = true;
        } else {
          hunter.respawnTimer = 250;
        }
      }
    }
    return false;
  }

  updatePowerUp(dt) {
    if (!this.powerUpActive || this.powerUpActive === 'shield') return;
    this.powerUpTimer -= dt;
    const displayedSecond = Math.max(0, Math.ceil(this.powerUpTimer / 1000));
    if (displayedSecond !== this.lastPowerSecond) this.refreshHud();
    if (this.powerUpTimer <= 0) {
      this.powerUpActive = null;
      this.powerUpTimer = 0;
      this.stepInterval = this.getStepInterval();
      this.actorsDirty = true;
      this.effectsDirty = true;
      this.refreshHud(true);
    }
  }

  // ── Death and Level Completion ──────────────────────────────────

  showImpactMarker(cause, cell = this.snake?.[0]) {
    const x = Phaser.Math.Clamp(cell?.x ?? this.snake[0].x, 0, this.GRID - 1);
    const y = Phaser.Math.Clamp(cell?.y ?? this.snake[0].y, 0, this.GRID - 1);
    this.impactMarker = { x, y, cause, at: this.time.now };
    this.effectsDirty = true;
    this.renderEffects(this.time.now);

    this.impactCall?.remove(false);
    this.impactCall = this.time.delayedCall(TUNING.impactMarkerMs, () => {
      this.impactCall = null;
      this.impactMarker = null;
      this.effectsDirty = true;
      this.renderEffects(this.time.now);
    });
    return { x, y };
  }

  onDeath(cause, impactCell = this.snake?.[0]) {
    if (this.levelComplete || this.state === 'hit') return false;
    const impact = this.showImpactMarker(cause, impactCell);
    if (this.powerUpActive === 'shield') {
      this.powerUpActive = null;
      this.powerUpTimer = 0;
      this.actorsDirty = true;
      this.effectsDirty = true;
      sfx('boost');
      if (!UI.reducedMotion()) this.cameras.main.shake(90, 0.003);
      this.refreshHud();
      return true;
    }

    this.powerUpActive = null;
    this.powerUpTimer = 0;
    this.lives--;
    this.pendingHitCause = cause;
    this.state = 'hit';
    this.physics.world.isPaused = true;
    sfx('lose');

    const px = this.BOARD_X + impact.x * this.CELL + this.CELL / 2;
    const py = this.BOARD_Y + impact.y * this.CELL + this.CELL / 2;
    if (!UI.reducedMotion()) this.cameras.main.shake(TUNING.hitDelayMs, 0.008);
    // The shape marker remains for reduced motion; particles are supplementary.
    if (!UI.reducedMotion()) this.hitParticles.emitParticleAt(px, py, this.lives <= 0 ? 24 : 16);
    this.refreshHud();

    this.hitCall?.remove(false);
    this.hitCall = this.time.delayedCall(TUNING.hitDelayMs, () => {
      this.hitCall = null;
      const finalCause = this.pendingHitCause;
      this.pendingHitCause = null;
      if (this.state !== 'hit') return;
      if (this.lives <= 0) {
        this.gameOver(finalCause);
        return;
      }
      this.respawnSnake();
      const paused = this.hitPanelPaused || UI.isPanelOpen();
      this.hitPanelPaused = false;
      this.state = paused ? 'paused' : 'playing';
      this.physics.world.isPaused = paused;
      this.refreshHud();
    });
    return false;
  }

  respawnSnake() {
    const head = this.startSnake[0];
    const candidates = [];
    for (let y = 1; y < this.GRID - 1; y++) {
      for (let x = 1; x < this.GRID - 1; x++) {
        const snake = Array.from({ length: 3 }, (_, i) => ({
          x: x - i * this.startDir.x,
          y: y - i * this.startDir.y,
        }));
        const safe = snake.every(segment =>
          this.isWalkable(segment.x, segment.y, false) &&
          !this.hunters.some(hunter => hunter.active &&
            segment.x === hunter.x && segment.y === hunter.y));
        if (safe) candidates.push({ snake, distance: Math.abs(x - head.x) + Math.abs(y - head.y) });
      }
    }
    candidates.sort((a, b) => a.distance - b.distance);
    this.snake = (candidates[0]?.snake ?? this.startSnake).map(segment => ({ ...segment }));
    this.dir = { ...this.startDir };
    this.pendingDirs = [];
    this.vacatedTrail = [];
    this.stepAcc = 0;
    this.actorsDirty = true;
    this.effectsDirty = true;

    const overlapsSnake = cell => cell && this.snake.some(segment =>
      segment.x === cell.x && segment.y === cell.y);
    if (overlapsSnake(this.food)) {
      this.food = null;
      this.placeFood();
    }
    if (overlapsSnake(this.powerUp)) this.powerUp = null;
  }

  onLevelComplete() {
    this.levelComplete = true;
    this.state = 'transition';
    this.score += TUNING.levelCompleteBonus;

    if (this.currentLevel >= LEVELS.length - 1) {
      this.onVictory();
      return;
    }

    sfx('win');
    this.cancelLevelTransition();
    this.transitioning = true;
    this.transitionPanelPaused = false;
    const generation = this.transitionGeneration;
    const reduced = UI.reducedMotion();
    const transitionMs = reduced ? 100 : 420;
    if (!reduced) this.cameras.main.fadeOut(transitionMs, 10, 10, 10);
    this.transitionCall = this.time.delayedCall(transitionMs, () => {
      // Restart/reset invalidates this owned timer before it can load stale data.
      if (generation !== this.transitionGeneration) return;
      this.transitionCall = null;
      this.cameras.main.fadeEffect?.reset();
      this.cameras.main.setAlpha(1);
      const paused = this.transitionPanelPaused || UI.isPanelOpen();
      this.currentLevel++;
      this.loadLevel(this.currentLevel);
      if (!reduced) this.cameras.main.fadeIn(240, 10, 10, 10);
      this.transitionPanelPaused = false;
      this.state = paused ? 'paused' : 'playing';
      this.physics.world.isPaused = paused;
      this.transitioning = false;
      this.refreshHud(true);
    });
  }

  onVictory() {
    this.state = 'over';
    this.victory = true;
    this.vacatedTrail = [];
    this.effectsDirty = true;
    this.score += this.lives * TUNING.livesBonusPerRemaining;
    clearRun();
    sfx('win');

    const { rank } = recordScore(this.score, {
      won: true,
      levels: LEVELS.length,
      seconds: Math.round(this.elapsed),
    });

    UI.showGameOver({
      title: 'All Mazes Cleared',
      reason: `All ${LEVELS.length} levels conquered with ${this.lives} lives remaining.`,
      objective: rank === 1 ? 'New best score!' : `Best: ${bestScore()}`,
      rank,
    });
    this.refreshHud();
  }

  gameOver(cause = 'wall') {
    this.state = 'over';
    this.vacatedTrail = [];
    this.effectsDirty = true;
    clearRun();
    sfx('lose');

    let rank = -1;
    if (this.score > 0) {
      ({ rank } = recordScore(this.score, {
        won: false,
        level: this.currentLevel + 1,
        seconds: Math.round(this.elapsed),
      }));
    }

    const causeLabel = {
      wall: 'wall',
      tail: 'tail',
      Hunter: 'Hunter',
      barrier: 'moving barrier',
      'collapsed tile': 'collapsed tile',
    }[cause] ?? cause;
    UI.showGameOver({
      title: 'Run Over',
      reason: `A ${causeLabel} ended your run on level ${this.currentLevel + 1}: ${LEVELS[this.currentLevel].name}.`,
      objective: rank === 1 && this.score > 0
        ? 'New best score!'
        : this.score > 0 ? `Best: ${bestScore()}` : 'No score recorded.',
      rank,
    });
    this.refreshHud(true);
  }

  // ── Input ───────────────────────────────────────────────────────

  queueDirection(ndir) {
    if (this.state !== 'playing' || this.pendingDirs.length >= 2) return false;
    const last = this.pendingDirs.at(-1) ?? this.dir;
    const same = ndir.x === last.x && ndir.y === last.y;
    const reverse = ndir.x === -last.x && ndir.y === -last.y;
    if (same || reverse) return false;
    this.pendingDirs.push({ x: ndir.x, y: ndir.y });
    return true;
  }

  commitQueuedDirection() {
    if (this.pendingDirs.length === 0) return;
    const next = this.pendingDirs.shift();
    if (next.x !== -this.dir.x || next.y !== -this.dir.y) this.dir = next;
  }

  queueDemoDirection() {
    const target = this.exitOpen ? this.exitPos : this.food;
    if (!target || this.pendingDirs.length >= 2) return;
    const head = this.snake[0];
    const blocked = new Set(this.snake.slice(1).map(segment => `${segment.x},${segment.y}`));
    for (const hunter of this.hunters) {
      if (!hunter.active) continue;
      blocked.add(`${hunter.x},${hunter.y}`);
      for (const dir of CARDINAL_DIRS) blocked.add(`${hunter.x + dir.x},${hunter.y + dir.y}`);
    }
    blocked.delete(`${target.x},${target.y}`);

    const seen = new Set([`${head.x},${head.y}`]);
    const queue = [{ x: head.x, y: head.y, first: null }];
    let chosen = null;
    for (let i = 0; i < queue.length; i++) {
      const cell = queue[i];
      if (cell.x === target.x && cell.y === target.y) {
        chosen = cell.first;
        break;
      }
      for (const dir of CARDINAL_DIRS) {
        if (!cell.first && dir.x === -this.dir.x && dir.y === -this.dir.y) continue;
        const x = cell.x + dir.x;
        const y = cell.y + dir.y;
        const key = `${x},${y}`;
        if (seen.has(key) || blocked.has(key) || !this.isWalkable(x, y, false)) continue;
        seen.add(key);
        queue.push({ x, y, first: cell.first ?? dir });
      }
    }

    if (!chosen) {
      chosen = CARDINAL_DIRS.find(dir => {
        if (dir.x === -this.dir.x && dir.y === -this.dir.y) return false;
        const x = head.x + dir.x;
        const y = head.y + dir.y;
        return this.isWalkable(x, y, false) && !blocked.has(`${x},${y}`);
      }) ?? null;
    }
    if (chosen) this.queueDirection(chosen);
  }

  // ── Rendering ───────────────────────────────────────────────────

  drawStaticLevel() {
    this.bgGfx.clear();
    this.bgGfx.fillStyle(HEX.ink, 1);
    this.bgGfx.fillRect(0, 0, VIEW.width, VIEW.height);
    this.bgGfx.fillStyle(HEX.ground, 1);
    this.bgGfx.fillRect(this.BOARD_X, this.BOARD_Y, this.BOARD, this.BOARD);

    this.floorTile.setPosition(this.BOARD_X, this.BOARD_Y);
    this.floorTile.setSize(this.BOARD, this.BOARD);
    this.staticGfx.clear();
    const { CELL, BOARD_X, BOARD_Y, GRID } = this;

    // Layered grid lighting: quiet cell lines with a larger luminous cadence.
    this.staticGfx.lineStyle(1, HEX.surface, 0.32);
    for (let i = 0; i <= GRID; i++) {
      const x = BOARD_X + i * CELL;
      const y = BOARD_Y + i * CELL;
      this.staticGfx.beginPath();
      this.staticGfx.moveTo(x, BOARD_Y);
      this.staticGfx.lineTo(x, BOARD_Y + this.BOARD);
      this.staticGfx.moveTo(BOARD_X, y);
      this.staticGfx.lineTo(BOARD_X + this.BOARD, y);
      this.staticGfx.strokePath();
    }
    this.staticGfx.lineStyle(1, HEX.accent, 0.13);
    for (let i = 0; i <= GRID; i += 5) {
      const x = BOARD_X + i * CELL;
      const y = BOARD_Y + i * CELL;
      this.staticGfx.beginPath();
      this.staticGfx.moveTo(x, BOARD_Y);
      this.staticGfx.lineTo(x, BOARD_Y + this.BOARD);
      this.staticGfx.moveTo(BOARD_X, y);
      this.staticGfx.lineTo(BOARD_X + this.BOARD, y);
      this.staticGfx.strokePath();
    }

    // Board frame and walls use hot cyan/surface only. Player green is reserved
    // for the snake so classic Snake identity reads in one glance.
    this.staticGfx.lineStyle(7, HEX.accent, 0.28);
    this.staticGfx.strokeRect(BOARD_X - 5, BOARD_Y - 5, this.BOARD + 10, this.BOARD + 10);
    this.staticGfx.lineStyle(2, HEX.accent, 0.95);
    this.staticGfx.strokeRect(BOARD_X - 1, BOARD_Y - 1, this.BOARD + 2, this.BOARD + 2);

    // Cyan corridor wash under open cells sells CE DX lane energy without green.
    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        if (this.grid[y][x] === 1) continue;
        const px = BOARD_X + x * CELL;
        const py = BOARD_Y + y * CELL;
        const lane = ((x + y) & 1) === 0 ? 0.14 : 0.08;
        this.staticGfx.fillStyle(LANE_GLOW, lane);
        this.staticGfx.fillRect(px + 1, py + 1, CELL - 2, CELL - 2);
        this.staticGfx.fillStyle(HEX.accent, 0.035);
        this.staticGfx.fillRect(px + 3, py + CELL / 2 - 1, CELL - 6, 2);
      }
    }

    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        if (this.grid[y][x] !== 1) continue;
        const px = BOARD_X + x * CELL;
        const py = BOARD_Y + y * CELL;
        this.staticGfx.fillStyle(HEX.surface, 1);
        this.staticGfx.fillRect(px + 1, py + 1, CELL - 2, CELL - 2);
        this.staticGfx.lineStyle(4, HEX.accent, 0.58);
        this.staticGfx.strokeRect(px + 1, py + 1, CELL - 2, CELL - 2);
        this.staticGfx.lineStyle(2, WALL_EDGE, 0.95);
        this.staticGfx.strokeRect(px + 4, py + 4, CELL - 8, CELL - 8);
      }
    }
  }

  drawPowerShape(g, type, x, y, radius, color, alpha) {
    g.fillStyle(color, alpha);
    g.lineStyle(2, color, alpha);
    g.beginPath();
    if (type === 'shield') {
      g.moveTo(x, y - radius);
      g.lineTo(x + radius * 0.8, y - radius * 0.35);
      g.lineTo(x + radius * 0.55, y + radius * 0.7);
      g.lineTo(x, y + radius);
      g.lineTo(x - radius * 0.55, y + radius * 0.7);
      g.lineTo(x - radius * 0.8, y - radius * 0.35);
      g.closePath();
      g.strokePath();
    } else if (type === 'speed') {
      g.moveTo(x + radius * 0.15, y - radius);
      g.lineTo(x - radius * 0.7, y + radius * 0.1);
      g.lineTo(x - radius * 0.05, y + radius * 0.05);
      g.lineTo(x - radius * 0.25, y + radius);
      g.lineTo(x + radius * 0.72, y - radius * 0.2);
      g.lineTo(x + radius * 0.05, y - radius * 0.12);
      g.closePath();
      g.fillPath();
    } else if (type === 'magnet') {
      g.lineStyle(3, color, alpha);
      g.moveTo(x - radius * 0.75, y - radius * 0.7);
      g.lineTo(x - radius * 0.75, y + radius * 0.35);
      g.lineTo(x - radius * 0.4, y + radius * 0.75);
      g.lineTo(x + radius * 0.4, y + radius * 0.75);
      g.lineTo(x + radius * 0.75, y + radius * 0.35);
      g.lineTo(x + radius * 0.75, y - radius * 0.7);
      g.strokePath();
    } else if (type === 'shrink') {
      g.strokeRect(x - radius * 0.75, y - radius * 0.75, radius * 1.5, radius * 1.5);
      g.lineStyle(3, color, alpha);
      g.beginPath();
      g.moveTo(x - radius * 0.48, y);
      g.lineTo(x + radius * 0.48, y);
      g.strokePath();
    } else {
      g.strokeCircle(x, y, radius * 0.82);
      g.fillCircle(x - radius * 0.25, y - radius * 0.12, radius * 0.12);
      g.fillCircle(x + radius * 0.25, y - radius * 0.12, radius * 0.12);
      g.beginPath();
      g.moveTo(x - radius * 0.35, y + radius * 0.32);
      g.lineTo(x, y + radius * 0.5);
      g.lineTo(x + radius * 0.35, y + radius * 0.32);
      g.strokePath();
    }
  }

  drawTerrain() {
    const g = this.terrainGfx;
    g.clear();
    if (!this.grid) return;
    const { CELL, BOARD_X, BOARD_Y } = this;

    for (const z of this.speedZones) {
      const x = BOARD_X + z.x * CELL;
      const y = BOARD_Y + z.y * CELL;
      g.fillStyle(HEX.accent, 0.1);
      g.fillRect(x + 2, y + 2, CELL - 4, CELL - 4);
      g.lineStyle(1, HEX.player, 0.3);
      g.strokeRect(x + 3, y + 3, CELL - 6, CELL - 6);
    }

    for (const c of this.crumbleTiles) {
      const px = BOARD_X + c.x * CELL;
      const py = BOARD_Y + c.y * CELL;
      if (c.state === 'solid') {
        g.fillStyle(HEX.surface, 0.56);
        g.fillRect(px + 2, py + 2, CELL - 4, CELL - 4);
        g.lineStyle(1, HEX.accent, 0.42);
        g.beginPath();
        g.moveTo(px + 4, py + 5);
        g.lineTo(px + CELL / 2, py + CELL * 0.7);
        g.lineTo(px + CELL - 4, py + 4);
        g.strokePath();
      } else if (c.state === 'triggered') {
        g.fillStyle(HEX.threat, 0.48);
        g.fillRect(px + 2, py + 2, CELL - 4, CELL - 4);
        g.lineStyle(2, HEX.threat, 0.92);
        g.strokeRect(px + 2, py + 2, CELL - 4, CELL - 4);
      } else {
        g.fillStyle(HEX.ink, 0.96);
        g.fillRect(px + 2, py + 2, CELL - 4, CELL - 4);
        g.lineStyle(1, HEX.threat, 0.42);
        g.strokeRect(px + 3, py + 3, CELL - 6, CELL - 6);
      }
    }

    for (const b of this.barriers) {
      g.fillStyle(mixColor(HEX.threat, HEX.surface, 0.45), 0.98);
      g.lineStyle(2, HEX.threat, 0.9);
      for (let i = 0; i < b.len; i++) {
        const bx = b.type === 'h' ? BOARD_X + (b.x + i) * CELL : BOARD_X + b.x * CELL;
        const by = b.type === 'h' ? BOARD_Y + b.y * CELL : BOARD_Y + (b.y + i) * CELL;
        g.fillRect(bx + 2, by + 2, CELL - 4, CELL - 4);
        g.strokeRect(bx + 2, by + 2, CELL - 4, CELL - 4);
      }
    }

    // Core: hot cyan diamond with ring — matches guide ◆ silhouette.
    if (this.food) {
      const x = BOARD_X + this.food.x * CELL + CELL / 2;
      const y = BOARD_Y + this.food.y * CELL + CELL / 2;
      const r = Math.min(CELL * 0.4, 12);
      g.lineStyle(2, FOOD_COLOR, 0.95);
      g.strokeCircle(x, y, Math.min(CELL * 0.48, 14));
      g.fillStyle(HEX.accent, 1);
      g.beginPath();
      g.moveTo(x, y - r);
      g.lineTo(x + r, y);
      g.lineTo(x, y + r);
      g.lineTo(x - r, y);
      g.closePath();
      g.fillPath();
      g.lineStyle(2, FOOD_COLOR, 1);
      g.strokePath();
      g.fillStyle(HEX.ink, 0.35);
      g.beginPath();
      g.moveTo(x, y - r * 0.55);
      g.lineTo(x + r * 0.55, y);
      g.lineTo(x, y + r * 0.55);
      g.lineTo(x - r * 0.55, y);
      g.closePath();
      g.fillPath();
      g.fillStyle(FOOD_COLOR, 1);
      g.fillCircle(x, y, Math.max(2.2, CELL * 0.1));
    }

    if (this.powerUp) {
      const x = BOARD_X + this.powerUp.x * CELL + CELL / 2;
      const y = BOARD_Y + this.powerUp.y * CELL + CELL / 2;
      this.drawPowerShape(g, this.powerUp.type, x, y, Math.min(CELL * 0.34, 10),
        POWER_COLORS[this.powerUp.type], 0.98);
    }

    if (this.exitPos) {
      const x = BOARD_X + this.exitPos.x * CELL + CELL / 2;
      const y = BOARD_Y + this.exitPos.y * CELL + CELL / 2;
      const r = Math.min(CELL * 0.44, 13);
      g.beginPath();
      g.moveTo(x, y - r);
      g.lineTo(x + r, y);
      g.lineTo(x, y + r);
      g.lineTo(x - r, y);
      g.closePath();
      if (this.exitOpen) {
        // Open gate: filled hot diamond + double ring. Accent only — no player green.
        g.fillStyle(EXIT_COLOR, 1);
        g.fillPath();
        g.lineStyle(3, HEX.accent, 1);
        g.strokePath();
        g.lineStyle(2, FOOD_COLOR, 0.95);
        g.strokeCircle(x, y, Math.min(CELL * 0.5, 15));
        g.lineStyle(2, HEX.accent, 1);
        g.strokeCircle(x, y, Math.min(CELL * 0.3, 9));
        g.fillStyle(HEX.ink, 0.55);
        g.fillCircle(x, y, Math.max(2.5, CELL * 0.12));
        g.fillStyle(FOOD_COLOR, 1);
        g.fillCircle(x, y, Math.max(1.8, CELL * 0.07));
      } else {
        // Closed gate: solid diamond + lock/bar, guide ◇ silhouette.
        g.fillStyle(mixColor(HEX.surface, HEX.threat, 0.22), 1);
        g.fillPath();
        g.lineStyle(3, HEX.threat, 0.95);
        g.strokePath();
        g.lineStyle(2, WALL_EDGE, 0.95);
        g.strokeCircle(x, y - CELL * 0.05, CELL * 0.14);
        g.fillStyle(HEX.ink, 0.98);
        g.fillRect(x - CELL * 0.22, y - CELL * 0.01, CELL * 0.44, CELL * 0.26);
        g.lineStyle(2, HEX.threat, 0.98);
        g.strokeRect(x - CELL * 0.22, y - CELL * 0.01, CELL * 0.44, CELL * 0.26);
        g.beginPath();
        g.moveTo(x - CELL * 0.12, y + CELL * 0.12);
        g.lineTo(x + CELL * 0.12, y + CELL * 0.12);
        g.moveTo(x, y + CELL * 0.04);
        g.lineTo(x, y + CELL * 0.18);
        g.strokePath();
      }
    }
    this.terrainDirty = false;
  }

  drawActors() {
    const g = this.actorGfx;
    g.clear();
    if (!this.snake?.length) return;
    const { CELL, BOARD_X, BOARD_Y } = this;

    for (const hunter of this.hunters) {
      if (!hunter.active) continue;
      const x = BOARD_X + hunter.x * CELL + CELL / 2;
      const y = BOARD_Y + hunter.y * CELL + CELL / 2;
      const dx = hunter.dir?.x ?? -1;
      const dy = hunter.dir?.y ?? 0;
      const px = -dy;
      const py = dx;
      const r = Math.min(CELL * 0.5, 14);
      // Spiked directional threat — matches guide ✦ and reads mid-chase.
      g.fillStyle(HEX.threat, 1);
      g.beginPath();
      g.moveTo(x + dx * r, y + dy * r);
      g.lineTo(x + px * r * 0.55 + dx * r * 0.2, y + py * r * 0.55 + dy * r * 0.2);
      g.lineTo(x + px * r * 0.85 - dx * r * 0.05, y + py * r * 0.85 - dy * r * 0.05);
      g.lineTo(x + px * r * 0.28 - dx * r * 0.35, y + py * r * 0.28 - dy * r * 0.35);
      g.lineTo(x + px * r * 0.45 - dx * r * 0.85, y + py * r * 0.45 - dy * r * 0.85);
      g.lineTo(x - dx * r * 0.55, y - dy * r * 0.55);
      g.lineTo(x - px * r * 0.45 - dx * r * 0.85, y - py * r * 0.45 - dy * r * 0.85);
      g.lineTo(x - px * r * 0.28 - dx * r * 0.35, y - py * r * 0.28 - dy * r * 0.35);
      g.lineTo(x - px * r * 0.85 - dx * r * 0.05, y - py * r * 0.85 - dy * r * 0.05);
      g.lineTo(x - px * r * 0.55 + dx * r * 0.2, y - py * r * 0.55 + dy * r * 0.2);
      g.closePath();
      g.fillPath();
      g.lineStyle(2, shadeColor(HEX.threat, 0.45), 1);
      g.strokePath();
      g.fillStyle(HEX.ink, 0.98);
      g.fillCircle(x + dx * r * 0.22 + px * r * 0.2, y + dy * r * 0.22 + py * r * 0.2, 2.2);
      g.fillCircle(x + dx * r * 0.22 - px * r * 0.2, y + dy * r * 0.22 - py * r * 0.2, 2.2);
      g.fillStyle(HEX.threat, 1);
      g.fillCircle(x + dx * r * 0.22 + px * r * 0.2, y + dy * r * 0.22 + py * r * 0.2, 0.9);
      g.fillCircle(x + dx * r * 0.22 - px * r * 0.2, y + dy * r * 0.22 - py * r * 0.2, 0.9);
    }

    const snakeAlpha = this.powerUpActive === 'ghost' ? 0.48 : 1;
    // Continuous luminous spine first: the body must read as one worm, not dots.
    if (this.snake.length > 1) {
      g.lineStyle(CELL * 0.78, HEX.player, 0.16 * snakeAlpha);
      g.beginPath();
      for (let i = 0; i < this.snake.length; i++) {
        const seg = this.snake[i];
        const x = BOARD_X + seg.x * CELL + CELL / 2;
        const y = BOARD_Y + seg.y * CELL + CELL / 2;
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.strokePath();

      g.lineStyle(CELL * 0.52, PLAYER_DARK, 0.98 * snakeAlpha);
      g.beginPath();
      for (let i = 0; i < this.snake.length; i++) {
        const seg = this.snake[i];
        const x = BOARD_X + seg.x * CELL + CELL / 2;
        const y = BOARD_Y + seg.y * CELL + CELL / 2;
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.strokePath();

      g.lineStyle(CELL * 0.22, HEX.player, 0.92 * snakeAlpha);
      g.beginPath();
      for (let i = 0; i < this.snake.length; i++) {
        const seg = this.snake[i];
        const x = BOARD_X + seg.x * CELL + CELL / 2;
        const y = BOARD_Y + seg.y * CELL + CELL / 2;
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.strokePath();
    }

    const snakeLen = this.snake.length;
    for (let i = snakeLen - 1; i >= 0; i--) {
      const seg = this.snake[i];
      const t = snakeLen <= 1 ? 1 : 1 - i / snakeLen;
      g.fillStyle(mixColor(PLAYER_DARK, HEX.player, 0.35 + t * 0.65), snakeAlpha);
      g.fillCircle(
        BOARD_X + seg.x * CELL + CELL / 2,
        BOARD_Y + seg.y * CELL + CELL / 2,
        Math.min(CELL * (0.3 + t * 0.08), 11),
      );
    }

    const head = this.snake[0];
    const hx = BOARD_X + head.x * CELL + CELL / 2;
    const hy = BOARD_Y + head.y * CELL + CELL / 2;
    // Large chevron head: classic Snake direction, obvious at phone size.
    const dx = this.dir.x;
    const dy = this.dir.y;
    const px = -dy;
    const py = dx;
    const hr = Math.min(CELL * 0.52, 14);
    g.fillStyle(HEX.player, snakeAlpha);
    g.beginPath();
    g.moveTo(hx + dx * hr, hy + dy * hr);
    g.lineTo(hx - dx * hr * 0.55 + px * hr * 0.85, hy - dy * hr * 0.55 + py * hr * 0.85);
    g.lineTo(hx - dx * hr * 0.2, hy - dy * hr * 0.2);
    g.lineTo(hx - dx * hr * 0.55 - px * hr * 0.85, hy - dy * hr * 0.55 - py * hr * 0.85);
    g.closePath();
    g.fillPath();
    g.lineStyle(2, PLAYER_DARK, 0.9 * snakeAlpha);
    g.strokePath();
    g.fillStyle(HEX.ink, snakeAlpha);
    g.fillCircle(hx + dx * hr * 0.12 + px * hr * 0.28, hy + dy * hr * 0.12 + py * hr * 0.28, Math.max(1.6, CELL * 0.06));
    g.fillCircle(hx + dx * hr * 0.12 - px * hr * 0.28, hy + dy * hr * 0.12 - py * hr * 0.28, Math.max(1.6, CELL * 0.06));
    this.actorsDirty = false;
  }

  drawTrail(now) {
    const g = this.trailGfx;
    g.clear();
    const cutoff = now - TUNING.trailLifetimeMs;
    while (this.vacatedTrail.length && this.vacatedTrail[0].at < cutoff) this.vacatedTrail.shift();
    if (!this.vacatedTrail.length || !this.snake?.length) return;

    // Continuous ribbon: vacated cells plus the current tail form one fading path
    // behind the body instead of buried discrete dots.
    const points = this.vacatedTrail.map(cell => ({
      x: this.BOARD_X + cell.x * this.CELL + this.CELL / 2,
      y: this.BOARD_Y + cell.y * this.CELL + this.CELL / 2,
      life: 1 - (now - cell.at) / TUNING.trailLifetimeMs,
    })).filter(point => point.life > 0);
    if (!points.length) return;

    const tail = this.snake[this.snake.length - 1];
    points.push({
      x: this.BOARD_X + tail.x * this.CELL + this.CELL / 2,
      y: this.BOARD_Y + tail.y * this.CELL + this.CELL / 2,
      life: 1,
    });

    // Outer bloom + solid core make the ribbon read as a luminous CE DX wake.
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      const life = Math.max(0.12, (a.life + b.life) * 0.5);
      g.lineStyle(this.CELL * (0.58 + life * 0.28), HEX.player, 0.18 + life * 0.42);
      g.beginPath();
      g.moveTo(a.x, a.y);
      g.lineTo(b.x, b.y);
      g.strokePath();
      g.lineStyle(this.CELL * (0.28 + life * 0.12), HEX.player, 0.35 + life * 0.55);
      g.beginPath();
      g.moveTo(a.x, a.y);
      g.lineTo(b.x, b.y);
      g.strokePath();
      g.fillStyle(HEX.player, 0.18 + life * 0.35);
      g.fillCircle(a.x, a.y, this.CELL * (0.14 + life * 0.08));
    }
  }

  renderEffects(now = this.time.now) {
    const g = this.effectsGfx;
    g.clear();
    if (!this.grid) return;
    const reduced = UI.reducedMotion();
    const pulseAt = (period, phase = 0) => reduced ? 0.55 : 0.5 + 0.5 * Math.sin(now / period + phase);
    const { CELL, BOARD_X, BOARD_Y } = this;

    if (this.food) {
      const x = BOARD_X + this.food.x * CELL + CELL / 2;
      const y = BOARD_Y + this.food.y * CELL + CELL / 2;
      const pulse = pulseAt(240);
      g.fillStyle(FOOD_COLOR, 0.12 + pulse * 0.18);
      g.fillCircle(x, y, Math.min(CELL * (0.7 + pulse * 0.16), 22));
      g.lineStyle(1, HEX.accent, 0.25 + pulse * 0.2);
      g.strokeCircle(x, y, Math.min(CELL * (0.52 + pulse * 0.08), 16));
    }
    if (this.powerUp) {
      const x = BOARD_X + this.powerUp.x * CELL + CELL / 2;
      const y = BOARD_Y + this.powerUp.y * CELL + CELL / 2;
      const pulse = pulseAt(230);
      g.fillStyle(POWER_COLORS[this.powerUp.type], 0.1 + pulse * 0.14);
      g.fillCircle(x, y, Math.min(CELL * (0.52 + pulse * 0.12), 18));
    }
    if (this.exitOpen && this.exitPos) {
      const x = BOARD_X + this.exitPos.x * CELL + CELL / 2;
      const y = BOARD_Y + this.exitPos.y * CELL + CELL / 2;
      const pulse = pulseAt(320);
      g.fillStyle(EXIT_COLOR, 0.14 + pulse * 0.18);
      g.fillCircle(x, y, Math.min(CELL * (0.68 + pulse * 0.14), 22));
      g.lineStyle(2, HEX.accent, 0.35 + pulse * 0.25);
      g.strokeCircle(x, y, Math.min(CELL * (0.55 + pulse * 0.08), 17));
    } else if (this.exitPos) {
      const x = BOARD_X + this.exitPos.x * CELL + CELL / 2;
      const y = BOARD_Y + this.exitPos.y * CELL + CELL / 2;
      g.fillStyle(HEX.threat, 0.08);
      g.fillCircle(x, y, Math.min(CELL * 0.5, 15));
    }
    for (const hunter of this.hunters) {
      if (!hunter.active) continue;
      const pulse = pulseAt(200, hunter.id);
      g.fillStyle(HEX.threat, 0.12 + pulse * 0.14);
      g.fillCircle(
        BOARD_X + hunter.x * CELL + CELL / 2,
        BOARD_Y + hunter.y * CELL + CELL / 2,
        Math.min(CELL * (0.58 + pulse * 0.1), 18),
      );
    }

    if (this.snake?.length) {
      const head = this.snake[0];
      const x = BOARD_X + head.x * CELL + CELL / 2;
      const y = BOARD_Y + head.y * CELL + CELL / 2;
      const alpha = this.powerUpActive === 'ghost' ? 0.48 : 1;
      const pulse = pulseAt(280);
      g.fillStyle(HEX.player, (0.14 + pulse * 0.08) * alpha);
      g.fillCircle(x, y, Math.min(CELL * (0.55 + pulse * 0.06), 17));
      if (this.powerUpActive) {
        g.lineStyle(2, POWER_COLORS[this.powerUpActive], 0.75 + pulse * 0.2);
        g.strokeCircle(x, y, Math.min(CELL * (0.43 + pulse * 0.04), 14));
      }
    }

    // Shape-first impact feedback is never removed by reduced-motion settings.
    if (this.impactMarker) {
      const x = BOARD_X + this.impactMarker.x * CELL + CELL / 2;
      const y = BOARD_Y + this.impactMarker.y * CELL + CELL / 2;
      const r = Math.min(CELL * 0.46, 13);
      g.fillStyle(HEX.threat, 0.94);
      g.beginPath();
      g.moveTo(x, y - r);
      g.lineTo(x + r, y);
      g.lineTo(x, y + r);
      g.lineTo(x - r, y);
      g.closePath();
      g.fillPath();
      g.lineStyle(2, HEX.accent, 1);
      g.strokePath();
      g.lineStyle(3, HEX.ink, 1);
      g.beginPath();
      g.moveTo(x - r * 0.42, y - r * 0.42);
      g.lineTo(x + r * 0.42, y + r * 0.42);
      g.moveTo(x + r * 0.42, y - r * 0.42);
      g.lineTo(x - r * 0.42, y + r * 0.42);
      g.strokePath();
    }
    this.effectsDirty = false;
  }

  renderLayers(force = false) {
    if (!this.grid) return;
    const now = this.time.now;
    if (force || this.terrainDirty) this.drawTerrain();
    if (force || this.actorsDirty) this.drawActors();

    // Simulation dirties draw immediately. Pure cosmetic pulses and trail fades
    // are capped at ~13Hz, avoiding a full vector rebuild on every RAF.
    const cosmeticDue = this.state === 'playing' && now >= this.nextCosmeticDraw;
    if (force || this.effectsDirty || cosmeticDue) {
      this.drawTrail(now);
      this.renderEffects(now);
      this.nextCosmeticDraw = now + 75;
    }
  }

  // ── HUD Refresh ─────────────────────────────────────────────────

  refreshHud(force = false) {
    const levelNum = Math.min(this.currentLevel + 1, LEVELS.length);
    const levelName = LEVELS[Math.min(this.currentLevel, LEVELS.length - 1)]?.name ?? '';
    const cleared = this.victory ? LEVELS.length : Math.min(this.currentLevel, LEVELS.length);
    const cores = this.victory ? this.targetFood : this.foodEaten;
    const powerSecond = this.powerUpActive === 'shield'
      ? 'ready'
      : Math.max(0, Math.ceil(this.powerUpTimer / 1000));
    const stepMs = this.getStepInterval();
    const key = [levelNum, cleared, cores, this.targetFood, this.score, this.lives,
      this.powerUpActive, powerSecond, this.exitOpen ? 1 : 0, this.victory ? 1 : 0, stepMs].join('|');
    if (!force && key === this.hudKey) return;
    this.hudKey = key;
    this.lastPowerSecond = typeof powerSecond === 'number' ? powerSecond : null;

    // bestScore() can touch localStorage, so keep it behind the HUD dirty gate.
    const best = bestScore();
    UI.setObjective(
      META.objective,
      `Mazes cleared ${cleared}/${LEVELS.length} · Level ${levelNum}: ${levelName} · Cores ${cores}/${this.targetFood}`,
    );
    UI.setLevelProgress({
      current: cores,
      target: this.targetFood || 1,
      exitOpen: Boolean(this.exitOpen) || this.victory,
      levelName,
      done: Boolean(this.victory),
    });
    UI.setStats({
      Score: this.score,
      Lives: '❤'.repeat(Math.max(0, this.lives)),
      Speed: `${stepMs}ms`,
      Power: this.powerUpActive
        ? `${this.powerUpActive} ${powerSecond === 'ready' ? powerSecond : `${powerSecond}s`}`
        : '—',
      Best: best,
    });
  }

  // ── Update Loop ─────────────────────────────────────────────────

  update(time, deltaMs) {
    const dt = Math.min(deltaMs, 100);
    this.animTime = time;
    this.renderLayers();

    if (this.state !== 'playing') {
      Input.endFrame();
      return;
    }

    this.elapsed += dt / 1000;

    if (this.updateBarriers(dt) || this.state !== 'playing') {
      Input.endFrame();
      return;
    }
    if (this.updateCrumbleTiles(dt) || this.state !== 'playing') {
      Input.endFrame();
      return;
    }
    this.updatePowerUp(dt);
    if (this.state !== 'playing') {
      Input.endFrame();
      return;
    }

    this.stepInterval = this.getStepInterval();
    this.stepAcc += dt;
    while (this.stepAcc >= this.stepInterval) {
      this.stepAcc -= this.stepInterval;
      let interrupted = false;

      // One ordered turn is committed at the fixed-tick edge. Hunter prediction
      // sees that direction, and gameStep cannot consume a second turn.
      if (this.demoMode) this.queueDemoDirection();
      this.commitQueuedDirection();

      if (this.hunterEnabled) {
        for (const hunter of this.hunters) {
          if (!hunter.active) continue;
          hunter.stepAcc += this.stepInterval;
          const hunterInterval = hunter.stepInterval || this.hunterInterval();
          while (hunter.active && hunter.stepAcc >= hunterInterval) {
            hunter.stepAcc -= hunterInterval;
            if (this.hunterStep(hunter) || this.state !== 'playing') {
              interrupted = true;
              break;
            }
          }
          if (interrupted) break;
        }
      }

      if (interrupted || this.state !== 'playing' || this.gameStep()) break;
    }

    this.renderLayers();
    Input.endFrame();
  }
}

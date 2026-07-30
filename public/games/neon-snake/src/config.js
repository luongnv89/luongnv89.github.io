/**
 * Neon Snake — Maze Runner: game identity and tuning.
 *
 * META is the single source of truth for the HUD, guide, story, and terminal
 * print at Step 7. One source so the objective in three places cannot diverge.
 */

export const SLUG = 'neon-snake';

export const META = Object.freeze({
  title: 'Neon Snake — Maze Runner',

  objective: 'Clear all 8 maze levels before losing all three lives.',

  premise: 'Deep beneath the neon spire, eight sealed mazes hold the energy cores that power the city above. You guide a luminous snake through each arena, gathering the required cores until its exit opens. The first maze teaches the route; then predictive Hunter drones, moving barriers, speed zones, and collapsing floor tiles tighten the chase. Three lives power the entire run. Reach the surface before they are spent.',

  ending: 'A run ends when you clear all 8 mazes, or when you run out of lives. Scores and unfinished runs are saved on this device.',

  legend: [
    { mark: '◆', label: 'Core', text: 'Cyan diamond — collect enough to open the maze gate.', tone: 'accent' },
    { mark: '◇', label: 'Gate', text: 'Locked diamond with bar; opens into a bright filled gate.', tone: 'threat' },
    { mark: '✦', label: 'Hunter', text: 'Orange spiked drone that predicts your route.', tone: 'threat' },
    { mark: '━', label: 'Snake', text: 'Bright green continuous body — only the player uses green.', tone: 'player' },
  ],

  controls: [
    { keys: '← →  /  A D', touch: 'left stick', does: 'Steer the snake' },
    { keys: '↑  /  W', touch: 'left stick up', does: 'Steer up' },
    { keys: '↓  /  S', touch: 'left stick down', does: 'Steer down' },
    { keys: 'P  /  Esc', touch: '❚❚', does: 'Pause and resume' },
    { keys: 'H', touch: '?', does: 'How to play / guide' },
    { keys: 'T', touch: '✦', does: 'The story' },
    { keys: 'K', touch: '★', does: 'High scores' },
    { keys: 'M', touch: '♪', does: 'Mute' },
    { keys: 'R', touch: 'Play again', does: 'Restart the run' },
  ],
});

export const PALETTE = {
  ink: '#0a0a0a',       // deepest background
  ground: '#111111',     // floor, panels
  surface: '#1b2b34',    // walls, obstacles
  player: '#00ff41',     // the snake — bright green, highest contrast
  threat: '#ff9500',     // Hunters and collision warnings
  accent: '#00e5ff',     // cores, gates, and power-up energy
};

export const HEX = Object.fromEntries(
  Object.entries(PALETTE).map(([name, value]) => [name, Number.parseInt(value.slice(1), 16)]),
);

export const VIEW = { width: 640, height: 640 };

export const ORIENTATION = 'any';

export const TUNING = {
  // Grid
  gridSize: 20,
  cellPixels: 27, // 20×27 = 540, with readable margins in the square view

  // Snake movement — later mazes feel clearly faster.
  baseInterval: 170,      // ms per step at level 1 (The Cradle)
  minInterval: 62,        // floor for level 8 + speed power-up / zones
  intervalPerLevel: 12,   // ms faster per maze (L1 170 → L8 86 before food)
  intervalPerFood: 1.5,   // mild within-level ramp so cores still matter

  // Levels
  levelCount: 8,
  targetFoodPerLevel: 6,  // food to eat before exit opens

  // Lives
  lives: 3,

  // Power-ups
  powerUpDuration: 5000,  // ms
  powerUpSpawnChance: 0.3, // chance per food eaten
  shieldActive: false,
  speedMultiplier: 1.6,   // speed boost multiplier
  shrinkAmount: 3,         // segments removed on shrink

  // Hunter
  hunterBaseSpeed: 330,    // ms per step before level pressure is applied
  hunterMinInterval: 145,  // Hunters never update faster than this
  hunterSpeedUp: 24,       // ms faster per level
  hunterPredictSteps: 3,   // how many steps ahead the Hunter predicts

  // Impact beat
  hitDelayMs: 125,         // named hit state before respawn or game over
  impactMarkerMs: 220,     // shape-first collision marker, including reduced motion
  trailLifetimeMs: 1100,   // continuous vacated ribbon remains readable behind the snake

  // Moving barriers
  barrierShiftMs: 3000,    // ms between barrier shifts

  // Crumbling tiles
  crumbleDelayMs: 1000,    // ms before a crumble tile collapses
  crumbleRestoreMs: 5000,  // ms before a crumbled tile restores

  // Score
  foodScore: 100,
  levelCompleteBonus: 500,
  livesBonusPerRemaining: 200,
};

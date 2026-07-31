# Neon Snake — Maze Runner

### Premise

Deep beneath the neon spire, eight sealed mazes hold the energy cores that power the city above. You guide a luminous snake through each arena, gathering the required cores until its exit opens. The first maze teaches the route; then predictive Hunter drones, moving barriers, speed zones, and collapsing floor tiles tighten the chase. Three lives power the entire run. Reach the surface before they are spent.

### Design

- **Genre:** Maze / Arcade Snake
- **Objective:** Clear all 8 maze levels before losing all three lives.
- **Dimension:** 2D
- **Perspective:** Fixed board, top-down, full grid always visible
- **Controls:** ←/→ or A/D · ←/→ buttons · steer horizontally
                 ↑ or W · ↑ Forward button · steer up
                 ↓ or S · ↓ Backward button · steer down
                 P or Esc · ❚❚ · pause and resume
                 H · ? · guide / how to play
                 T · ✦ · the story
                 K · ★ · high scores
                 M · ♪ · mute
                 R · Play again · restart after a run
- **Art direction:** A strict six-colour neon vector system: ink #0a0a0a, ground #111111, surface #1b2b34, player #00ff41, threat #ff9500, and accent #00e5ff. Player green is reserved for the snake body and its continuous trail ribbon; maze walls, lane washes, cores, and gates use cyan/surface/threat only. The noise-and-scanline floor, layered grid lighting, double-edged cyan walls, connected directional snake, and restrained additive sparks create depth without obscuring the maze.
- **Orientation:** landscape — the board stays unobstructed between compact HUD side rails, with a rotate prompt in portrait
- **Reference:** Classic Snake (Nokia) meets Pac-Man Championship Edition DX (speed, neon trails, rhythmic flow) with maze-puzzle level design

### Core Loop

Enter a maze with its exit visibly sealed. Steer on fixed movement ticks, collect the required number of cores, grow, and avoid walls, your tail, Hunter drones, moving barriers, and collapsed tiles. The exit changes from a dim closed diamond to an accent-bright gate when the core target is met. Reach it to earn a completion bonus and continue with the same run lives. Power-ups can appear from level 3 onward: Shield absorbs one collision, Speed accelerates the snake temporarily, Magnet draws a nearby core closer, Shrink removes up to three tail segments, and Ghost phases through internal terrain temporarily.

### Challenge and Progression

The game contains exactly 8 hand-authored 20×20 mazes:

1. **The Cradle** — open tutorial arena; no Hunter and no power-ups.
2. **The Corridor** — open-loop lesson with one deliberately slow Hunter; wide lanes leave room to dodge.
3. **The Fortress** — soft concentric rings with wide escape gaps; power-ups begin and one Hunter predicts ahead.
4. **The Crossroads** — narrow quadrant links test queued edge turns against one faster Hunter.
5. **The Pendulum** — two moving three-cell barriers patrol the maze.
6. **The Quarry** — collapsing tiles and two independently moving Hunters.
7. **The Throat** — speed zones, moving barriers, narrow passages, and two Hunters.
8. **The Core** — collapsing tiles, speed zones, moving barriers, and two Hunters combine in the finale.

Hunter movement intervals shorten on later levels but stop at a fixed minimum interval. Each Hunter predicts several cells ahead of the snake's newly committed direction. A Hunter that stands on a collapsing tile disappears briefly, then respawns at a safe open position.

### Winning, Losing and Replay

- **Winning:** Open and enter all eight exits. Remaining run lives add a final score bonus.
- **Losing a life:** Hitting a wall, tail, Hunter, moving barrier, or collapsed tile triggers a short hit beat, names the hazard at game over, and respawns a three-segment snake if a life remains. A Shield absorbs one such collision instead.
- **Run structure:** The player starts with three lives for the whole run, not three lives per level. Level and core progress survive ordinary respawns.
- **Replay:** Scores greater than zero can enter the persistent local top-ten table. The current run, including both Hunters and obstacle states, is saved locally for resume; restart creates a clean three-life run.

### Look and Sound

- **Visual:** The retained floor, grid, border, and immutable maze walls are built once per level. Terrain redraws only when it changes; actor movement redraws immediately while cosmetic pulses are capped at 12–15Hz. The connected snake leaves a continuous luminous ribbon of vacated cells, collisions leave a shape-first impact marker, cores use faceted cyan diamonds, gates advertise closed lock vs open filled diamond, Hunters use spiked directional silhouettes, and the five power-ups use different shapes. Food, power-up, exit, and hit events use separate bounded particle systems. Camera shake, particles, pulses, and fades honor reduced-motion preference while impact markers remain visible.
- **Sound:** Generated Web Audio cues acknowledge core pickup, power-up pickup or Shield block, exit opening, losing a life, level completion, victory, and UI actions. Audio starts only after a real gesture, can be muted, and has no ambient loop.
- **UI:** DOM overlays provide guide, story, scores, pause, and game-over panels. The HUD shows the objective verbatim, followed by separate live progress in the form `Mazes cleared 0/8 · Level 1: The Cradle · Cores 0/5`, plus a cores progress bar that fills toward the next level and flips to an “Exit open” state when the gate unlocks. Every guide row shows its keyboard and touch forms together, followed by a compact legend whose marks match board silhouettes (core ◆, gate ◇, Hunter ✦, snake ━) and the run-ending replay note. Stats are dirty-updated (including a live step-speed readout), and a power-up countdown changes once per displayed second. On mobile landscape screens, the objective/progress, four-button direction pad, controls, and stats occupy separate side rails no wider than the real gutter outside the centered square maze; portrait shows a rotate prompt instead of covering the board.

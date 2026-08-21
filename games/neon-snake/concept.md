# Concepts — Neon Snake

## 1. Maze Runner — level-by-level with power-ups and AI chase

A 2D top-down snake game where each level is a hand-crafted maze with walls, corridors, and obstacles. The player grows by eating energy cores and must collect the level's target count to open its visible exit gate. A collision costs one of three lives carried across the whole run; if a life remains, a short snake respawns without erasing level progress. From level 3 onward, five power-ups can appear: **Shield** (absorb one collision), **Speed** (temporarily accelerate), **Magnet** (draw nearby food closer), **Shrink** (remove up to three tail segments), and **Ghost** (temporarily phase through internal terrain). Predictive Hunter drones begin slowly on level 2, with two independent Hunters active on levels 6–8. Later mazes combine moving barriers, crumbling tiles, and speed zones.

**Mechanics:** queue up to two non-reversing edge turns; eat the required cores to open and reach the exit; use five shape-coded power-ups; evade predictive Hunters with a bounded late-game movement interval; avoid moving barriers and one-second collapse tiles; preserve an eight-level run and high scores in local storage

## 2. Puzzle Snake — obstacles, switches, and keys

A 2D top-down snake game built around spatial puzzles. Instead of just eating food, the player must activate coloured switches by crossing them, collect keys to unlock blocked passages, and push blocks by growing around them. The snake's own body is a tool — you position it to hold switches down or block hazards. Each level has a single clear goal (e.g. "reach the star") that requires planning your path so your growing body doesn't trap you. Fixed-board perspective with full-grid visibility.

**Mechanics:** coloured switches toggle gates open/closed; keys unlock doors (consumed on use); pushable blocks slide when the snake's head touches them; timed platforms stay lit for 2s after being crossed; hazards (spikes, crushers) kill on contact

## 3. Arena Runner — endless survival with power-ups

A 2D top-down snake game in a bounded arena with AI-controlled rival snakes and hazards. The player competes for food against 1–3 computer snakes that grow and die independently. Power-ups spawn periodically: speed boost, shield (pass through yourself once), magnet (attract nearby food), shrink (shorten your tail). The goal is to survive as long as possible — every rival snake you outlast adds to your score multiplier. The arena shrinks over time, forcing encounters. Fixed-board top-down view.

**Mechanics:** rival AI snakes with simple chase/wander behaviour; five power-up types (speed, shield, magnet, shrink, score multiplier); arena walls close in every 15s; food spawns in clusters after a rival dies; survival timer with bonus at each 30s mark

---

## Chosen: 1. Maze Runner — level-by-level with power-ups and AI chase

Picked by you.
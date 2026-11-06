# Add letter stroke animation

Implement a first version of animated stroke-order guidance for uppercase letters A, B, C, D, and E in the existing letter tracing experience. Do not add accounts, cloud sync, ads, tracking, external assets, or new dependencies.

## Inspect first
Read PLAN.md, README.md and the current letter tracing implementation, including canvas layers, tracing input, accuracy/completion logic, star awards, accessibility announcements and reduced-motion handling. Reuse existing patterns and styles. If equivalent functionality already exists, report instead of duplicating it.

## Goal
Before tracing a supported uppercase letter, children can watch a short animated demonstration of the correct stroke order, then trace the letter themselves. The animation should be clear, brief and non-blocking.

## Scope
- Support uppercase A, B, C, D, and E only in this first version.
- Define each letter as one or more ordered strokes using normalized 0-1 coordinates so the animation scales with the canvas.
- Add a visible "Watch how to write [letter]" control before or beside tracing.
- Animate each stroke progressively with requestAnimationFrame; use smooth curves or interpolated points rather than obvious straight-line segments where appropriate.
- Show the current stroke number, such as "Stroke 1 of 3", and mark each starting point clearly.
- After the animation, return to the normal tracing flow without changing existing accuracy, completion, star, or progression behavior.
- Provide a Replay control so children can watch again.

## Animation behavior
- Keep each stroke approximately 1-2.5 seconds and the complete letter demonstration under 5 seconds where practical.
- Pause tracing validation while the demonstration is playing.
- After completion, retain or clearly fade the demonstration without obscuring the child's tracing area.
- Respect `prefers-reduced-motion`: provide a non-animated or manually advanced stroke-order view instead of automatic motion.
- Do not use sound as the only feedback; visual cues must be sufficient.

## UI expectations
- Use an unobtrusive control consistent with the existing tracing UI.
- Clearly distinguish the demonstration from the child's ink; preferably use a separate guide/overlay canvas or layer.
- Show numbered starting points and stroke order without relying on color alone.
- Preserve mobile usability at 320px width with no horizontal overflow.
- Ensure controls are keyboard accessible and have visible focus states.

## Data structure
Use a maintainable in-repo JavaScript data structure, for example:

```js
const UPPERCASE_STROKE_ORDER = {
  A: [
    [[0.20, 0.85], [0.50, 0.15], [0.80, 0.85]],
    [[0.32, 0.60], [0.68, 0.60]]
  ]
};
```

Normalize coordinates to the letter guide area, scale them at render time, and keep the data separate from drawing/input logic so future letters can be added without refactoring.

## Regression protection
Do not change existing letter tracing validation, star scoring, Write My Name, Word Practice, navigation/hash routing, cache-busting strings, or existing localStorage keys and formats. Preserve GitHub Pages paths under `/kids-tracing/`. Avoid broad refactoring.

## Documentation and tests
Update PLAN.md and README.md. Add concise manual regression steps covering:
1. Each supported letter shows the correct number and order of strokes.
2. Animation can be replayed and does not block or corrupt the child's tracing ink.
3. Tracing validation, stars, and progression still work after watching the animation.
4. Reduced-motion preference provides a usable non-animated or manually advanced alternative.
5. Keyboard access and visible focus work for the watch/replay controls.
6. Layout remains usable at 320px width with no horizontal overflow.
7. Existing Word Practice, Write My Name, and saved progress remain unchanged.

## Deliverables
Create a new branch and pull request titled "Add letter stroke animation". Do not reopen or reuse previous PR branches. Do not automatically merge. List changed files, actual tests performed, and any limitations. Never claim unperformed tests passed.
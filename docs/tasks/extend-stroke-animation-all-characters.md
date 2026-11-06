# Extend stroke animation to all characters

Extend the letter stroke animation introduced for uppercase A-E in PR #25 to every supported uppercase letter, lowercase letter, and digit. Do not add accounts, cloud sync, ads, tracking, external assets, or new dependencies.

## Prerequisite
PR #25, "Add letter stroke animation", must be merged into the default branch before starting this task. Reuse its stroke-order data structure, animation approach, UI controls, accessibility behavior, and styling. Do not reopen or reuse its branch.

## Inspect first
Read PLAN.md, README.md and the current tracing implementation, including the stroke-order data introduced by PR #25, canvas layers, tracing input, accuracy/completion logic, star awards, reduced-motion handling, and accessibility announcements. If the prerequisite animation system is absent or incomplete, report that instead of inventing a different system.

## Goal
Every supported character available for tracing has a clear, consistent, replayable stroke-order demonstration before the child traces it.

## Scope
- Cover all 26 uppercase letters A-Z.
- Cover all 26 lowercase letters a-z.
- Cover all 10 digits 0-9.
- Total: 62 characters.
- Use the existing stroke-order data structure and normalized 0-1 coordinates so animations scale correctly across canvas sizes.
- Preserve the existing "Watch how to write [character]" and Replay controls.
- Preserve existing tracing validation, accuracy, completion, stars, progression, navigation, and saved progress behavior.

## Stroke-order expectations
- Define a sensible, educationally standard stroke order for every character.
- Use one or more ordered strokes per character; use smooth interpolated paths for curved characters such as C, S, O, a, e, g, and 8.
- Clearly mark every stroke starting point and show the current stroke number.
- Keep each stroke approximately 1-2.5 seconds and keep complete demonstrations concise.
- Ensure lowercase ascenders and descenders, digit proportions, and character positioning remain visually correct within the existing guide area.
- Be consistent: once a stroke-order convention is chosen for a character, use it consistently across uppercase, lowercase, and digit views.

## Animation and accessibility
- Continue using requestAnimationFrame for progressive stroke animation.
- Pause tracing validation during playback.
- Provide Replay for every character.
- Respect `prefers-reduced-motion` with a non-animated or manually advanced stroke-order view.
- Do not rely on color alone; use numbered starting points, stroke labels, and clear visual contrast.
- Keep controls keyboard accessible with visible focus states.
- Preserve mobile usability at 320px width with no horizontal overflow.

## Regression protection
Do not change existing tracing validation, star scoring, Write My Name, Word Practice, daily challenge, sticker collection, daily goal, navigation/hash routing, cache-busting strings, or existing localStorage keys and formats. Preserve GitHub Pages paths under `/kids-tracing/`. Avoid broad refactoring.

## Documentation and tests
Update PLAN.md and README.md. Add concise manual regression steps covering:
1. Every uppercase letter, lowercase letter, and digit has a stroke-order demonstration.
2. A representative sample including A, G, Q, a, g, q, 4, 5, 7, and 8 shows correct stroke count, direction, and proportions.
3. Animation can be replayed without corrupting the child's tracing ink.
4. Tracing validation, stars, and progression still work after watching an animation.
5. Reduced-motion preference provides a usable non-animated or manually advanced alternative.
6. Keyboard access and visible focus work for watch/replay controls.
7. Layout remains usable at 320px width with no horizontal overflow.
8. Existing Word Practice, Write My Name, daily challenge, sticker collection, daily goal, and saved progress remain unchanged.

## Deliverables
Create a new branch and pull request titled "Extend stroke animation to all characters". Do not reopen or reuse previous PR branches. Do not automatically merge. List changed files, the characters covered, actual tests performed, and any limitations. Never claim unperformed tests passed.
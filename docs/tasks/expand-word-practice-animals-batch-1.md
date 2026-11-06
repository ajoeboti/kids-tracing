# Word Practice expansion — batch 1: Animals

Implement only the first batch of docs/tasks/expand-word-practice-library.md. Add BEE, FOX, FROG, DUCK, FISH and LION to the existing CAT, DOG and PIG animals. Do not implement the Food, Nature or Everyday things/home batches in this PR. The library should go from 6 to 12 words, with 9 Animals and 3 existing Everyday things.

## Inspect first
Read the parent task, PLAN.md, README.md and the current main implementation of WORDS, category filters/counts, word session/history validation, stickers, daily goal and daily challenge. Verify that the six proposed animal IDs are not already present. If this branch has become stale, update it from main before implementing without overwriting unrelated changes.

## Content and UI
- Add six unique uppercase IDs: BEE, FOX, FROG, DUCK, FISH, LION; keep CAT, DOG, PIG, BUS, CAR, HAT and their existing IDs/data intact.
- Supply a suitable animal emoji and accurate pronunciation/phonics cue in the current format for each new word. Avoid misleading letter-by-letter claims for irregular spellings; labels must remain readable without the emoji.
- Reuse existing Animals cards, filter and tracing flow. Make All Words and Animals counts accurate (12 and 9); Everyday things remains 3.
- Preserve one-character-at-a-time tracing and existing confirmation when switching a partially completed word.

## Compatibility and daily challenge
- Keep all existing localStorage keys and formats; valid saved sessions, completion history, stickers and daily goal must survive refresh and continue to work. New word IDs must be accepted where appropriate; unknown IDs remain rejected and duplicates ignored. New words must not start as completed or automatically earn stickers.
- Before expanding WORDS, inspect dailyChallengeWordForDate() and dailyChallengeChoicesFor(). The current date mapping derives from Object.keys(WORDS); adding six words changes the modulo and can change today's target. Avoid silently replacing a challenge already in progress, and ensure same-day refresh yields a consistent target and three distinct valid choices. Document and test the chosen compatibility solution without changing streak or completion rules.
- Keep the sticker shelf usable with 12 words, using minimal responsive changes if necessary; leave the 30-word shelf redesign to a later batch unless required now.

## Regression protection
Do not change standalone letter/number tracing, stroke demos, star or accuracy rules, Write My Name, navigation/hash routing, existing storage formats, or GitHub Pages paths. No new dependencies, accounts, external assets, broad refactors or automatic merging.

## Verification and deliverables
Update PLAN.md and README.md to reflect this batch's actual 12-word library, without claiming all 30 words have shipped. Report changed files, tests actually run and limitations. Test or provide reproducible manual steps for: six new Animals cards and accurate filter counts; BEE and FROG tracing; an existing word's saved partial session and completed history after refresh; first-time sticker and daily goal once only; same-day daily challenge choice stability across refresh and valid distinct options; malformed/unavailable storage; keyboard labels and 320px layout. Only open a PR for this batch after implementation, targeting main; do not auto-merge.

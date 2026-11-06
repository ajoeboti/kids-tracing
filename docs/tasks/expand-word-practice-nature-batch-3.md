# Word Practice expansion — batch 3: Nature

Implement only the third batch of docs/tasks/expand-word-practice-library.md. Add SUN, MOON, STAR and TREE as a new Nature category. Do not implement the Everyday things/home batch in this PR. The library should go from 18 to 22 words, with 9 Animals, 6 Food, 4 Nature, and 3 Everyday things.

## Prerequisite
This batch must start from a branch containing the completed batch 1 Animals expansion (BEE, FOX, FROG, DUCK, FISH, LION) and batch 2 Food expansion (EGG, MILK, CAKE, APPLE, BREAD, JUICE). Verify both batches are present before making changes; if either is missing, stop and report rather than duplicating or guessing at the implementation.

## Inspect first
Read the parent task, PLAN.md, README.md, current WORDS data, category filters/counts, phonics/speech presentation, tracing, word history, stickers, daily goal and daily challenge. Verify SUN, MOON, STAR and TREE are not already present.

## Content and UI
- Add four unique uppercase IDs: SUN, MOON, STAR, TREE; keep all existing eighteen IDs and their data intact.
- Supply suitable nature emoji and accurate pronunciation/phonics cues in the current format. Keep labels readable without emoji.
- Add a Nature filter/category control using existing UI patterns. All Words must show 22; Animals 9; Food 6; Nature 4; Everyday things 3. Preserve accurate accessible labels and counts.
- Preserve one-character-at-a-time tracing and existing confirmation when switching a partially completed word. Ensure all four words fit without horizontal overflow at 320px width.

## Compatibility and daily challenge
- Keep all existing localStorage keys and formats; valid saved sessions, completion history, stickers and daily goal must survive refresh and continue to work. New word IDs must be accepted where appropriate; unknown IDs remain rejected and duplicates ignored. New words must not start as completed or automatically earn stickers.
- Inspect dailyChallengeWordForDate() and dailyChallengeChoicesFor(). The date mapping derives from Object.keys(WORDS), so expanding the list can change the word selected for the same date. Avoid silently replacing a challenge already in progress; ensure same-day refresh yields a consistent target and three distinct valid choices. Document and test the compatibility solution without changing streak or completion rules.
- Keep the sticker shelf usable with 22 words; use minimal responsive changes if needed, and defer the full 30-word shelf redesign to the final batch unless necessary now.

## Regression protection
Do not change standalone letter/number tracing, stroke demos, star or accuracy rules, Write My Name, navigation/hash routing, existing storage formats, or GitHub Pages paths. No new dependencies, accounts, external assets, broad refactors or automatic merging.

## Verification and deliverables
Update PLAN.md and README.md to reflect this batch's actual 22-word library, without claiming all 30 words have shipped. Report changed files, tests actually run and limitations. Test or provide reproducible manual steps for: four new Nature cards and accurate filter counts; SUN and TREE tracing; existing Animals and Food words' saved partial session and completed history after refresh; first-time sticker and daily goal once only; same-day daily challenge choice stability across refresh and valid distinct options; malformed/unavailable storage; keyboard labels and 320px layout. Only open a PR for this batch after implementation, targeting main; do not auto-merge.

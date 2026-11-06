# Word Practice expansion — batch 2: Food

Implement only the second batch of docs/tasks/expand-word-practice-library.md. Add EGG, MILK, CAKE, APPLE, BREAD and JUICE as a new Food category. Do not implement the Nature or Everyday things/home batches in this PR. The library should go from 12 to 18 words, with 9 Animals, 6 Food, and 3 Everyday things.

## Prerequisite
This batch must start from a branch containing the completed batch 1 Animals expansion (BEE, FOX, FROG, DUCK, FISH, LION). Verify the current branch contains those six words before making changes; if it does not, stop and report rather than duplicating or guessing at the implementation.

## Inspect first
Read the parent task, PLAN.md, README.md, current WORDS data, category filters/counts, phonics/speech presentation, tracing, word history, stickers, daily goal and daily challenge. Verify EGG, MILK, CAKE, APPLE, BREAD and JUICE are not already present.

## Content and UI
- Add six unique uppercase IDs: EGG, MILK, CAKE, APPLE, BREAD, JUICE; keep all existing twelve IDs and their data intact.
- Supply suitable food emoji and accurate pronunciation/phonics cues in the current format. Do not falsely present BREAD or JUICE as simple letter-by-letter decoding; use a clear pronunciation cue where the current format cannot accurately convey the phonics. Keep labels readable without emoji.
- Add a Food filter/category control using existing UI patterns. All Words must show 18; Animals 9; Food 6; Everyday things 3. Preserve accurate accessible labels and counts.
- Preserve one-character-at-a-time tracing and existing confirmation when switching a partially completed word. Ensure four- and five-letter words fit without horizontal overflow at 320px width.

## Compatibility and daily challenge
- Keep all existing localStorage keys and formats; valid saved sessions, completion history, stickers and daily goal must survive refresh and continue to work. New word IDs must be accepted where appropriate; unknown IDs remain rejected and duplicates ignored. New words must not start as completed or automatically earn stickers.
- Inspect dailyChallengeWordForDate() and dailyChallengeChoicesFor(). The date mapping derives from Object.keys(WORDS), so expanding the list can change the word selected for the same date. Avoid silently replacing a challenge already in progress; ensure same-day refresh yields a consistent target and three distinct valid choices. Document and test the compatibility solution without changing streak or completion rules.
- Keep the sticker shelf usable with 18 words; use minimal responsive changes if needed, and defer the full 30-word shelf redesign to a later batch unless necessary now.

## Regression protection
Do not change standalone letter/number tracing, stroke demos, star or accuracy rules, Write My Name, navigation/hash routing, existing storage formats, or GitHub Pages paths. No new dependencies, accounts, external assets, broad refactors or automatic merging.

## Verification and deliverables
Update PLAN.md and README.md to reflect this batch's actual 18-word library, without claiming all 30 words have shipped. Report changed files, tests actually run and limitations. Test or provide reproducible manual steps for: six new Food cards and accurate filter counts; APPLE and BREAD tracing; existing Animals words' saved partial session and completed history after refresh; first-time sticker and daily goal once only; same-day daily challenge choice stability across refresh and valid distinct options; malformed/unavailable storage; keyboard labels and 320px layout. Only open a PR for this batch after implementation, targeting main; do not auto-merge.

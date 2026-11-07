# Word Practice expansion — batch 4: Everyday things

Implement only the fourth and final batch of docs/tasks/expand-word-practice-library.md. Add BALL, BOOK, SHOE, SOCK, CUP, BED, CHAIR and CLOCK to the existing Everyday things category (or its existing display label). Do not re-add previous batches' words. The library should grow from 22 to 30 unique words, with 9 Animals, 6 Food, 4 Nature and 11 Everyday things.

## Prerequisites
Before implementing, confirm that the current working branch includes the completed Animals, Food and Nature batches. If main does not yet have all three, update this branch from main after they have landed; stop and report rather than implementing against stale code or duplicating missing batches. This task file can be prepared in advance, but the fourth-batch implementation should not start until its prerequisites are present.

## Inspect first
Read the parent task, PLAN.md, README.md, current WORDS data, category filters/counts, pronunciation display and speech, tracing, word history, stickers, daily goal, daily challenge and storage validation. Verify none of the eight proposed IDs is already present and confirm the actual current counts before changing code.

## Words and UI
- Add unique uppercase IDs BALL, BOOK, SHOE, SOCK, CUP, BED, CHAIR and CLOCK, preserving all 22 existing IDs and their data. All eight words have 3–5 letters; avoid repeating the erroneous exception wording in the parent task.
- Provide child-friendly emoji, readable text labels and accurate pronunciation/phonics cues in the current format. For OO, SH, CH and CK, do not pretend every letter maps to a separate sound. Add short example sentences only if the current UI has a suitable place without redesign.
- Reuse existing card and Everyday things filter patterns. All Words must show 30; Animals 9; Food 6; Nature 4; Everyday things 11. If the existing category key is `things`, preserve it and change only the display label if needed.
- Preserve one-character-at-a-time tracing and the confirmation on switching a partially completed word. Check CHAIR and CLOCK at 320px width without horizontal overflow.
- Make the sticker shelf usable for 30 words with a compact or progressively disclosed view, while retaining access to all earned and locked stickers and clear accessibility labels.

## Compatibility and daily challenge
- Preserve all existing localStorage keys and formats. Existing sessions, completed-word history, stickers, daily goal and daily challenge must still load after refresh; new IDs are validated appropriately, unknown IDs rejected and duplicates ignored. Do not award stickers or historical completion to newly added words automatically.
- Inspect the current daily challenge mapping and choice generation before changing WORDS. Expanding its size can change the target on the same date; preserve any in-progress target where feasible, and ensure three distinct valid choices and stable behavior across refresh. Document and test any compatibility handling without changing streak/completion rules.

## Regression protection
Do not change standalone letter/number tracing, stroke demos, star/accuracy scoring, Write My Name, navigation/hash routing, existing storage formats, or GitHub Pages paths. No new dependencies, accounts, external assets, broad refactors or automatic merging.

## Verification and deliverables
Update PLAN.md and README.md to reflect the actual 30-word library and category counts. Report changed files, tests actually run and limitations. Test or give reproducible manual steps for: 30 unique cards and all filter counts; CUP, BOOK, CHAIR and CLOCK tracing; previously saved partial sessions and completion history after refresh; stickers and daily goal awarded once on first completion; same-day challenge stability and distinct choices; invalid/unavailable storage; 320px layout, keyboard access and screen-reader labels. Open a PR targeting main only after implementation, and do not auto-merge.
# Persist completion history for every Word Practice word

PR #21 is abandoned and closed. Do not reopen it or continue its branch. Start implementation from the latest default branch in a new branch and PR.

## Inspect first
Read PLAN.md and the complete current implementation: WORDS, wordSession, loadWordSession(), persistWordSession(), renderWordSelection(), completion handlers, replay and word-selection behaviour. Verify whether completion badges still depend only on the current session. If already fixed, report rather than duplicate work.

## Goal
After completing CAT and starting DOG, CAT remains Completed. History survives refresh and browser restart when localStorage is available. Preserve the active session separately.

## Scope
Support CAT, DOG, PIG, BUS, CAR, HAT. Add persistent completion history, card indicators, legacy-session migration, documentation and tests. No redesign, new words, scoring rules, rewards or dependencies.

## Storage
Preserve kids-tracing-word-session-v1 and its compatible format. Use separate key kids-tracing-word-history-v1 with structure {"version":1,"completedWords":["CAT","DOG"]}. Validate IDs against WORDS, deduplicate, ignore unknown IDs, and recover from malformed JSON or invalid data shapes. Maintain history in memory if storage is unavailable; never falsely claim successful saving. Do not store handwriting or modify letter/name storage.

## Migration
Add the word from an existing valid saved session only if all positions are complete. Never migrate a partial session as complete or invent unrecoverable history. Migration must be idempotent.

## Completion
Record history only after all positions complete. Repeated Done clicks or completion-screen renders must not duplicate entries. Replay and starting another word must preserve history. Preserve existing drawing validation and accuracy requirements. Update actual completion handlers, not only screen rendering.

## Selection cards
Separate historical completion from current-session progress. Previously completed inactive CAT shows Completed. Partial active DOG shows In progress and actual count. Replayed CAT retains historical completion indication alongside fresh replay progress. Never-completed inactive words show New word. Do not fill current-session indicators based only on history. Reuse styles with minimal changes.

## Regression protection
Do not change navigation/hash routing, cache-busting strings, site-wide layout, accuracy/scoring, letter stars, Write My Name or existing saved sessions. Inspect current status of PR #17 navigation work; do not duplicate or revert it. Preserve GitHub Pages paths under /kids-tracing/. Avoid broad refactoring.

## Acceptance tests
1. Complete CAT, start DOG, return: CAT remains Completed.
2. Refresh preserves CAT history.
3. Partial DOG progress survives refresh.
4. Replay CAT preserves history and starts fresh progress.
5. Repeated CAT completions create one history entry.
6. Fully completed legacy session migrates.
7. Partial legacy session does not migrate as completed.
8. Malformed JSON, invalid shapes, duplicate and unknown IDs do not crash; only valid data is used.
9. Unavailable storage works in memory without claiming successful saving.
10. Existing letter and name data remain unchanged.

## Deliverables
Minimal implementation; update PLAN.md and README.md; use existing test tooling or provide reproducible manual steps without a large new toolchain. List changed files, actual test results and limitations. Never claim unperformed tests passed. Create a new PR titled "Persist completion history for every Word Practice word". Do not reopen PR #21 or automatically merge.

# Add sticker collection and daily word goal

Implement a small, local-only reward system for Word Practice. Do not add accounts, cloud sync, ads, tracking, external assets, or new dependencies.

## Inspect first
Read PLAN.md, README.md and the current Word Practice implementation, including word history (`kids-tracing-word-history-v1`), word session storage, selection cards, completion handlers and accessibility announcements. Reuse existing patterns and styles. If equivalent functionality already exists, report instead of duplicating it.

## Goal
Give children a simple reason to return daily: completing a word earns a sticker, and completing one word on a calendar day completes the daily goal. Keep the experience encouraging, lightweight and suitable for ages 3-7.

## Scope
- Add a sticker collection for the six existing words: CAT, DOG, PIG, BUS, CAR, HAT.
- Add a daily goal: complete any one word on a calendar day.
- Show progress and rewards in Word Practice without disrupting tracing, navigation or existing progress.
- Use only local browser storage and existing local assets or inline SVG/CSS. Do not add external images, fonts or libraries.

## Storage
Use separate localStorage keys; do not alter existing keys or data formats.
- `kids-tracing-word-stickers-v1`: `{"version":1,"stickers":["CAT"]}`
- `kids-tracing-daily-goal-v1`: `{"version":1,"lastCompletedDate":"YYYY-MM-DD","streak":1}`

Validate and sanitize loaded data. Ignore unknown word IDs and duplicates. Recover safely from malformed JSON, invalid versions, wrong types or unavailable storage. If storage is unavailable, keep state in memory and clearly indicate that progress could not be saved; never claim a save succeeded.

## Sticker rules
- Award a sticker the first time a word is completed.
- Replaying or re-completing a word must not duplicate its sticker.
- Stickers should be visually distinct and child-friendly; use emoji or inline SVG consistent with the existing design.
- Add a compact sticker shelf or collection area in Word Practice, showing earned and locked stickers.
- Use accessible labels and avoid relying on color alone.

## Daily goal rules
- Use the user's local calendar date.
- Completing any word for the first time on a date marks that day complete.
- Show today's goal as complete or remaining; do not pressure children with countdowns or penalties.
- Maintain a simple consecutive-day streak only when the previous calendar day was completed; otherwise reset to 1 on a new completed day.
- Do not create multiple goal completions for repeated completions on the same day.

## UI expectations
- Add a small, unobtrusive daily-goal indicator in Word Practice.
- On first completion of a word, show a brief celebratory confirmation and identify the earned sticker.
- Ensure celebration is brief, respects `prefers-reduced-motion`, and does not block tracing or navigation.
- Keep mobile layout usable at 320px width and avoid horizontal overflow.

## Regression protection
Do not change existing word history behavior, letter stars, Write My Name, scoring, accuracy checks, navigation/hash routing, cache-busting strings or existing storage keys. Preserve GitHub Pages paths under `/kids-tracing/`. Avoid broad refactoring.

## Documentation and tests
Update PLAN.md and README.md. Add concise manual regression steps covering:
1. First completion awards one sticker and completes the daily goal.
2. Repeated completion does not duplicate the sticker or goal.
3. Completing another word on the same day does not create a second daily completion.
4. A new calendar day resets the visible daily goal; consecutive completion increments streak, while a gap resets it to 1.
5. Malformed, invalid or unavailable storage does not crash and does not falsely report saved progress.
6. Existing word history, letter progress and Write My Name data remain unchanged.

## Deliverables
Create a new branch and pull request titled "Add sticker collection and daily word goal". Do not reopen or reuse previous PR branches. Do not automatically merge. List changed files, actual tests performed, and any limitations. Never claim unperformed tests passed.
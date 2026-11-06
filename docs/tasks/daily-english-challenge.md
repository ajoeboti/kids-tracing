# Add daily English challenge

Implement a small, local-only daily English challenge for Word Practice. Do not add accounts, cloud sync, ads, tracking, external assets, or new dependencies.

## Inspect first
Read PLAN.md, README.md and the current Word Practice implementation, including word history, sticker collection, daily goal, word session storage, selection cards, completion handlers and accessibility announcements. Reuse existing patterns, styles and word data. If equivalent functionality already exists, report instead of duplicating it.

## Goal
Give children one short English activity each day: listen to a word, choose the matching picture, then trace that word. Completing the challenge earns a daily challenge badge and maintains a simple streak.

## Scope
- Support the six existing words: CAT, DOG, PIG, BUS, CAR, HAT.
- Select today's challenge word deterministically from the user's local calendar date, so refreshing or reopening on the same day shows the same word.
- Challenge flow: play the word pronunciation, present three picture/word choices including the correct answer, require the correct choice, then send the child to the existing tracing flow for that word.
- A challenge is complete only after the correct choice and the word tracing are completed on the same calendar day.
- Show a compact "Today's Challenge" card in Word Practice with today's word, completion state, and streak.

## Storage
Use a separate localStorage key and do not alter existing keys or formats:
- `kids-tracing-daily-challenge-v1`: `{"version":1,"lastCompletedDate":"YYYY-MM-DD","streak":1,"completedWords":["CAT"]}`

Validate and sanitize loaded data. Ignore unknown word IDs and duplicates. Recover safely from malformed JSON, invalid versions, wrong types, or unavailable storage. If storage is unavailable, keep state in memory and clearly indicate that progress could not be saved; never claim a save succeeded.

## Challenge rules
- Use the user's local calendar date.
- Completing the challenge once per day marks that date complete.
- Repeated tracing or revisiting the challenge on the same day must not duplicate the completion or increment the streak again.
- Maintain a consecutive-day streak only when the previous calendar day was completed; otherwise reset to 1 on a new completed day.
- Do not use countdowns, penalties, or pressure tactics.

## UI expectations
- Add an unobtrusive daily challenge card to Word Practice.
- On completion, show a brief celebratory confirmation naming the completed word and earned badge.
- Respect `prefers-reduced-motion`; celebrations must be brief and must not block tracing or navigation.
- Keep the layout usable at 320px width with no horizontal overflow.
- Use accessible labels, focus states, and do not rely on color alone.

## Regression protection
Do not change existing word history, sticker collection, daily goal, letter stars, Write My Name, scoring, accuracy checks, navigation/hash routing, cache-busting strings, or existing storage keys. Preserve GitHub Pages paths under `/kids-tracing/`. Avoid broad refactoring.

## Documentation and tests
Update PLAN.md and README.md. Add concise manual regression steps covering:
1. The same challenge word appears throughout one local calendar day.
2. Correct choice followed by tracing completes the challenge once.
3. Wrong choice does not complete the challenge.
4. Repeated completion on the same day does not duplicate the badge or increment the streak.
5. A new calendar day selects/permits a new challenge; consecutive completion increments streak, while a gap resets it to 1.
6. Malformed, invalid, or unavailable storage does not crash and does not falsely report saved progress.
7. Existing word history, stickers, daily goal, letter progress, and Write My Name data remain unchanged.

## Deliverables
Create a new branch and pull request titled "Add daily English challenge". Do not reopen or reuse previous PR branches. Do not automatically merge. List changed files, actual tests performed, and any limitations. Never claim unperformed tests passed.
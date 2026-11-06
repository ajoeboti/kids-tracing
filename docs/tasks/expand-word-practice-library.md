# Expand Word Practice library to 30 beginner words

Add 24 age-appropriate words to the existing six-word Word Practice library, for 30 words total. Keep this a content-focused change; do not add a new game, reward system, dependency, account, or external asset.

## Inspect first
Read PLAN.md, README.md, current WORDS data, word selection categories and filters, phonics/speech presentation, tracing, word history, stickers, daily goal and daily challenge. Check current main rather than relying on mockups or older task files. Document the existing six IDs and categories before changing anything.

## Word list
Preserve CAT, DOG, PIG, BUS, CAR, HAT and their existing data. Add these 24 unique uppercase words (do not insert the existing six again):
- Animals: BEE, FOX, FROG, DUCK, FISH, LION.
- Food: EGG, MILK, CAKE, APPLE, BREAD, JUICE.
- Nature: SUN, MOON, STAR, TREE.
- Everyday things/home: BALL, BOOK, SHOE, SOCK, CUP, BED, CHAIR, CLOCK.

The final categories and counts should be Animals 9, Food 6, Nature 4, Everyday things/home 11; total 30. Retain the current six IDs, including BUS/CAR/HAT under their existing category, unless the current UI requires only a display-label change. The new list contains 3- to 5-letter words except CHAIR, CLOCK and BREAD (5 letters); verify length and uniqueness in implementation.

## Content quality
For each new word provide an appropriate child-friendly emoji, phonics/pronunciation cue in the existing format, and a short age-appropriate example sentence if the current UI can display it without redesign. Ensure every emoji reasonably matches its word; for items with ambiguous emoji, use a readable label as well. Check phonics against the app's current pronunciation convention; do not claim irregular words such as BREAD, JUICE or ONE have simple letter-by-letter decoding. If the current format cannot accurately convey a word's phonics, prefer a plain pronunciation cue over misleading phonemes. Do not alter existing six-word phonics without explaining why. Avoid audio file dependencies.

## Selection and tracing
Show the added words in the existing Word Practice cards and support filtering by category. Keep All Words working; add the minimum category controls necessary for Animals, Food, Nature and Everyday things/home, with accurate counts and accessible names. Prefer existing card styles and responsive layout. All 30 words must be traceable one character at a time using the existing flow; handle five-letter words without overflow at 320px width. Preserve existing session replacement confirmation and progress labels.

## Storage and rewards
Keep the existing localStorage keys and formats unchanged. Previously saved sessions, history, stickers, daily goal and daily challenge must still load. New IDs should be accepted by existing validation where appropriate; unknown IDs still rejected and duplicates ignored. Sticker shelf must scale to 30 without becoming an overwhelming first-screen wall: use a compact/category-based or progressively disclosed view while retaining access to all earned and locked stickers. Do not silently award stickers or mark history completed just because a new word exists.

Inspect the daily challenge's date-to-word mapping: changing Object.keys(WORDS) length or order can change the chosen word for the same date. Preserve the currently selected daily challenge word for any in-progress challenge where feasible; if that requires a migration, document and test it. Avoid changing daily goal or streak rules.

## Regression protection
Do not change standalone letter/number tracing, stroke-order demonstrations, star scoring, accuracy checks, Write My Name, navigation/hash routing, cache-busting strings or GitHub Pages paths under /kids-tracing/. No broad refactor or new dependency.

## Documentation and verification
Update PLAN.md and README.md with the exact 30-word list and category counts. Use existing test tooling if present; otherwise provide reproducible manual checks. At minimum verify:
1. All 30 unique IDs appear under All Words and correct category filters/counts.
2. New three-, four- and five-letter examples trace and complete, including mobile 320px.
3. Existing CAT/DOG/PIG/BUS/CAR/HAT sessions, completion history and stickers remain intact after refresh.
4. New completions award one sticker and update history and daily goal once; replay does not duplicate rewards.
5. Daily challenge still offers valid distinct choices and behaves consistently across refresh and migration/in-progress states.
6. Malformed or unavailable storage fails safely without claiming successful saving.
7. Keyboard access, focus visibility, screen-reader labels and reduced-motion behavior remain usable.

## Deliverables
Create a new implementation branch and PR titled "Expand Word Practice library to 30 beginner words" when asked to execute this task. Do not automatically merge. List changed files, actual tests run and limitations; never claim unperformed tests passed.

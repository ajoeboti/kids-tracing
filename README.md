# Kids Tracing Practice

A static, browser-based tracing website built with plain HTML, CSS, JavaScript,
and Canvas. It runs without a backend, account, analytics, or external runtime
dependencies and can be published from the repository root with GitHub Pages.

## Features

- Practise uppercase letters, lowercase letters, and numbers with mouse,
  touch, or stylus input.
- Write a name one character at a time using the same handwriting canvas as
  letter and number practice.
- Trace short words one letter at a time, with saved progress for the selected
  word session.
- Keep saved practice progress in the browser.
- Watch and replay animated stroke-order demonstrations for all uppercase
  letters, lowercase letters, and digits before tracing; reduced-motion users
  can reveal each stroke manually.

## Word Practice

Choose **Word Practice** in the navigation or open `#words` to pick a short
word. The first set includes CAT, DOG, PIG, BUS, CAR, and HAT, grouped into
animals and everyday things. Word cards and their progress indicators are
rendered from the word data. Trace each grey letter and press **Done** to mark
it complete; **Next** moves through the word and returns to any unfinished
letter before showing the Write My Name completion layout. The shared canvas
uses grey-character tracing only, without dots, stroke numbers, or markers.
Progress resumes from browser storage and is independent of letter practice
and Write My Name.

Word-session data is stored under `kids-tracing-word-session-v1`. It contains
only the selected word, current letter position, and completion flags. One word
session is stored at a time; choosing another word after progress requires
confirmation and replaces the previous session. Handwriting strokes and
canvas images are never saved.

Word Practice also has a local sticker collection and a one-word daily goal.
Completing each word for the first time earns its sticker; completing any word
marks the local calendar day complete and updates a consecutive-day streak.
The collection and goal use separate `kids-tracing-word-stickers-v1` and
`kids-tracing-daily-goal-v1` keys. If browser storage is unavailable, the
rewards work in memory for the open page and the site indicates they could not
be saved.

The **Today's Challenge** card selects one of the six words deterministically
from the local calendar date. Listen to the spoken word, choose its picture,
then complete the existing word tracing to earn that day's challenge badge.
The card keeps the answer hidden until the challenge is complete so the
listening choice remains meaningful.
Challenge completion and its streak are stored separately under
`kids-tracing-daily-challenge-v1`; its `completedWords` list contains distinct
word badges. The challenge uses the shared tracing view without changing the
existing saved word session, sticker collection, or daily goal; only its
dedicated key records challenge rewards. Invalid saved data is ignored, and
unavailable browser storage keeps challenge progress in memory with a visible
save warning.

## Write My Name

Choose **Write My Name** in the navigation. The site uses the existing
hash-navigation pattern: `#name` opens name entry, tracing, or the completed
state depending on the current session. The name is not included in the URL.
**Back to letter practice** returns to the existing `#practice` view.

V1 accepts 1–20 English letters (`A-Z` and `a-z`), trims only leading and
trailing whitespace, and preserves letter case. Spaces within a name, digits,
punctuation, and other scripts are not supported. Each character *position*
has its own completion status, so duplicate letters remain separate tasks.
Done records that the child made a drawing attempt; it does not judge
handwriting accuracy.

Name-session data is stored separately under
`kids-tracing-name-session-v1`. It contains only the name, current position,
and completion flags. Handwriting strokes and canvas images are never saved.
If browser storage is unavailable or the saved record is invalid, the feature
continues to work without restoring that session. Existing letter/number
progress uses its existing storage and is not modified by name tracing.

## Letter stroke demonstrations

Standalone practice offers an optional stroke-order demonstration for all 62
characters (A–Z, a–z, and 0–9). The data uses normalized points and a separate
canvas layer, so it scales with the tracing area and does not change the child's
ink or scoring. Each stroke has a numbered starting point and a visible stroke
count. Use **Watch how to write [character]** to start and **Replay
demonstration** to play it again. With reduced motion enabled, use **Show next
stroke** to reveal the order without animation. Name and Word Practice remain
unchanged.

## Development and deployment

No build step or package installation is required. Serve the repository root
with any static HTTP server for local browser testing, or open `index.html`
directly. GitHub Pages can publish the repository root; relative asset paths
and hash routes also work beneath `/kids-tracing/`.

The HTML exports in `docs/designs/word-practice/` are design references, not
production pages. The live feature uses the existing website navigation,
styles, local fonts, and shared tracing canvas.

## Manual smoke checks

- Open `#name`; confirm empty and unsupported input cannot start, while
  `Jamie` previews and traces as `J`, `a`, `m`, `i`, `e`.
- Try `Anna`; complete one `n` and confirm the other `n` remains incomplete.
- Confirm Done rejects an empty canvas or tap, Clear keeps the guide letter,
  and Previous/Next do not wrap. Finish should return to the first incomplete
  position until every position is complete.
- Complete a name, refresh `#name`, and confirm progress restores with a blank
  canvas. Try **Write my name again** and **Try another name**.
- Repeat at a narrow viewport (320px) and with a 20-letter name; confirm the
  tiles wrap and the page has no horizontal overflow.
- In Word Practice, finish CAT for the first time; confirm one CAT sticker is
  earned, the daily goal is complete, and the completion screen names the
  sticker.
- Trace CAT again; confirm its sticker is not duplicated and the daily goal is
  still one completed word. Finish DOG on the same day and confirm the goal
  remains one per day.
- Complete a word on consecutive local calendar days and confirm the streak
  increments; skip a day and confirm the next completion starts a streak of 1.
  The date can be changed in the browser's saved daily-goal record for testing.
- Try malformed or invalid reward records and unavailable localStorage; confirm
  Word Practice still works and reports when rewards could not be saved.
- Compare `kids-tracing-word-history-v1`, `kids-tracing-progress`, and
  `kids-tracing-name-session-v1` before and after reward testing; they should
  remain unchanged.
- In Word Practice, refresh or reopen the page on the same local date; confirm
  the daily challenge word remains the same.
- Listen, choose the correct picture, complete the word tracing, and confirm the
  daily badge appears once. Choose a wrong picture first and confirm no tracing
  starts and no challenge completion is recorded.
- Revisit or retrace the challenge on the same date; confirm the badge is not
  duplicated and the streak does not increase again.
- Complete challenges on consecutive local dates and confirm the streak grows;
  skip a date and confirm the next completed challenge starts at 1. The
  challenge key can be edited in browser storage for these checks.
- Try malformed JSON, an invalid version/date, wrong field types, duplicate or
  unknown completed words, and unavailable localStorage for the challenge key;
  confirm the page remains usable, badges are sanitized, and failed saves are
  clearly reported.
- At 320px width and with reduced motion enabled, confirm there is no horizontal
  overflow and the completion confirmation remains brief and non-blocking.
- Compare `kids-tracing-word-session-v1`, `kids-tracing-word-stickers-v1`,
  `kids-tracing-daily-goal-v1`, `kids-tracing-progress`, and
  `kids-tracing-name-session-v1` before and after challenge testing; existing
  word history, stickers, daily goal, letter progress, and Write My Name data
  should remain unchanged.
- In standalone practice, confirm every uppercase letter, lowercase letter,
  and digit has a demonstration. Check A (3 strokes), G (1), Q (2), a (2),
  g (2), q (2), 4 (3), 5 (1), 7 (2), and 8 (2) for stroke count, direction,
  and proportions.
- Replay each representative demonstration and confirm the animation does not
  erase, add to, or cover the child's tracing ink.
- After watching a demonstration, trace the character and confirm validation,
  stars, and progression still work.
- Enable reduced motion and confirm each stroke can be revealed manually
  without animation.
- Use only the keyboard to reach and activate watch/replay controls; confirm
  they work and focus remains visible.
- At 320px width, confirm the layout and watch/replay controls have no
  horizontal overflow.
- Confirm Word Practice, Write My Name, daily challenge, sticker collection,
  daily goal, navigation, and saved progress remain unchanged.

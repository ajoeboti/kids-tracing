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
  word session and a separate history of completed words.
- Keep saved practice progress in the browser.

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

Completed words are stored separately under `kids-tracing-word-history-v1` as
`{"version":1,"completedWords":["CAT"]}`. Only CAT, DOG, PIG, BUS, CAR, and
HAT are accepted, and duplicate or unknown IDs are ignored. A valid saved word
session is migrated only when every letter is complete. Replaying a word resets
its active letter progress while retaining its historical completion. If
browser storage is unavailable, the page keeps history in memory and reports
when it cannot save it.

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

## Word history regression checks

- Start with empty word-session and word-history keys. Complete CAT using the
  tracing controls, choose DOG, then return to the picker. CAT should say
  **Completed**; partial DOG should show **In progress** with its real count.
- Refresh the page. CAT's badge and DOG's active progress should remain.
- Choose CAT and select **Trace this word again**. The CAT card should retain
  **Completed**, while its fresh progress dots remain empty and its status also
  shows the in-progress count. Complete CAT again and confirm the history has
  only one CAT entry.
- For migration, set `kids-tracing-word-session-v1` in browser developer tools
  to `{"word":"CAT","currentIndex":2,"completed":[true,true,true]}`, remove the
  history key, and reload. The history key should contain CAT. Repeat with
  `[true,false,true]`; CAT must not be added.
- Set the history key to malformed JSON, then to
  `{"version":1,"completedWords":["CAT","CAT","NOT-A-WORD"]}`. Reload in each
  case: the page should not crash, and valid history should be deduplicated with
  unknown IDs ignored. Invalid versions or non-array `completedWords` should
  contribute no history.
- With browser storage blocked (or with `Storage.prototype.setItem` temporarily
  made to throw in developer tools), complete a word. Progress should still
  work in the current page, and the live announcement should state that history
  could not be saved.
- Compare `kids-tracing-progress` and `kids-tracing-name-session-v1` before and
  after word practice; their values should remain unchanged.

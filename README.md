# Kids Tracing Practice

A static, browser-based tracing website built with plain HTML, CSS, JavaScript,
and Canvas. It runs without a backend, account, analytics, or external runtime
dependencies and can be published from the repository root with GitHub Pages.

## Features

- Practise uppercase letters, lowercase letters, and numbers with mouse,
  touch, or stylus input.
- Write a name one character at a time using the same handwriting canvas as
  letter and number practice.
- Keep saved practice progress in the browser.

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

The approved visual reference image files were not present in the checkout
when this feature was implemented, so the feature uses the layouts described
in the project request and the website's existing visual system.

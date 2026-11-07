# Kids Tracing Practice — Website Plan

## 1. Project Overview

**Kids Tracing Practice** is a free, browser-based website that helps young
children practise writing English letters and numbers, their own name, or
short words one letter at a time.

Children can trace uppercase letters, lowercase letters, and numbers using
a mouse, trackpad, finger, or stylus. The website will be simple, friendly,
and safe for young children.

This is a **static website**, not a mobile app.

It will be hosted on GitHub Pages and opened directly in a web browser.

## 2. Goals

- Help children practise A-Z, a-z, and 0-9
- Let children trace the letters in short words
- Provide a simple, enjoyable tracing experience
- Work on desktop, tablet, and mobile browsers
- Require no login, installation, or payment
- Remain easy for a parent to open and use
- Be deployable as a static website on GitHub Pages

## 3. Target Users

- Children aged approximately 3 to 7
- Parents, guardians, and teachers
- Beginners learning letter and number shapes

## 4. Website Structure

The website currently uses one static HTML page with hash-based views:

```text
/                  → Home view
/#practice         → Letter and number tracing
/#name             → Name entry, tracing, or completion
/#words            → Word selection, tracing, or completion
/#word-selection   → Choose a word without changing the saved session
/#parents          → Parent information section on Home
```

Name state stays in browser storage rather than in the hash, so a child's name
is never placed in the URL. The same routes work under the GitHub Pages
`/kids-tracing/` repository path.

### Future Pages

These pages may be added later:

```text
/worksheets.html  → Printable tracing worksheets
/numbers.html     → Number-focused practice
/letters.html     → Letter-focused practice
```

## 5. Home Page

The home page introduces the website and encourages the child or parent to
start practising.

### Sections

1. **Header**
   - Website name: “Kids Tracing Practice”
   - Simple navigation:
     - Home
     - Practice
     - About

2. **Hero Section**
   - Main title: “Kids Tracing Practice”
   - Subtitle: “Practise A-Z, a-z and 0-9 by tracing with your finger or mouse.”
   - Large call-to-action button: “Start Practising”
   - Button links to `/practice.html`
   - A friendly illustration or simple visual showing a child tracing a letter

3. **Feature Cards**
   - Three simple cards:
     - “Trace Letters”
     - “Practise Numbers”
     - “Earn Stars”
   - Each card should have a short description and a small icon or illustration

4. **Parent Information**
   - Short section explaining that the website is free, browser-based, and does not require an account
   - Mention that progress is saved only in the child’s browser using localStorage

5. **Footer**
   - Website name
   - Short copyright line
   - Link to About page

## 6. Practice Page

The practice page is the main interactive page.

### Layout

```text
┌────────────────────────────────────────┐
│  Kids Tracing Practice        Home     │
│                                        │
│  Progress: 3 / 62                      │
│  ███████░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  │                A                 │  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│                                        │
│              ★★☆                       │
│            Great job!                  │
│                                        │
│   [←]      [Clear]      [Done]   [→]  │
└────────────────────────────────────────┘
```

### Sections

1. **Header**
   - Website name
   - Link back to Home
   - Optional progress indicator

2. **Progress Area**
   - Text: “3 / 62”
   - Thin progress bar
   - Shows how many characters have been completed

3. **Tracing Card**
   - Large white rounded card
   - One large light-grey character in the centre
   - HTML Canvas overlay for handwriting
   - Canvas must cover the character area

4. **Result Area**
   - Three stars
   - Friendly feedback message
   - Examples:
     - “Great job!”
     - “Well done!”
     - “Try again!”

5. **Controls**
   - `←` Previous
   - `Clear`
   - `Done`
   - `→` Next

## 7. Character Set

Use the following characters in this exact order:

```text
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
a b c d e f g h i j k l m n o p q r s t u v w x y z
0 1 2 3 4 5 6 7 8 9
```

Total: 62 characters.

### Navigation Rules

- Start at `A`
- `Next` moves to the following character
- `Previous` moves to the previous character
- Navigation wraps around:
  - From `Z` to `a`
  - From `z` to `0`
  - From `9` to `A`
  - From `A` to `9`

## 8. Tracing Behaviour

The tracing area must use an HTML `<canvas>` element positioned above the
large character.

### Input Support

- Mouse
- Trackpad
- Touch
- Stylus

### Drawing Rules

- Start drawing on `pointerdown`
- Continue drawing on `pointermove`
- Stop drawing on `pointerup` or `pointercancel`
- Use smooth, rounded lines
- Prevent page scrolling while drawing on touch devices
- Clear the canvas automatically when changing character
- Resize the canvas correctly when the browser window changes size
- Use `devicePixelRatio` for sharp handwriting on high-DPI screens

### V1 Tracing Method

V1 uses **grey-character tracing only**. Children trace directly over one
large light-grey reference character on the writing guide lines. Standalone
practice for all uppercase letters, lowercase letters, and digits also offers
an optional stroke-order demonstration before tracing; the demonstration uses
its own overlay and does not change the grey guide or validate the child's
stroke order.

The following are **out of scope for V1**:

- Dotted tracing guides
- Stroke-order validation
- Direction arrows
- Start/end markers outside the optional stroke-order demonstration

The demonstration covers all 62 characters with normalized stroke paths,
numbered starting points, and a visible current-stroke indicator. It can be
replayed, and reduced-motion users can reveal one complete stroke at a time.
The demonstration is instructional only; the practice instruction remains:
"Trace over the grey letter or number."

## 9. Scoring Rules

For V1, scoring should be simple and positive.

When the child presses `Done`, compare the drawn strokes with the rendered
character guide. Measure both the percentage of the child's ink near the guide
(accuracy) and the percentage of the guide followed by the child's ink
(coverage). Allow a small distance tolerance for normal variation in children's
handwriting, and score using the lower of the two percentages so scribbling or
tracing only a small part of a character cannot earn a high score.

| Lower of accuracy and coverage | Stars |
|---|---|
| Below 40% | 1 star |
| 40% to 69% | 2 stars |
| 70% or above | 3 stars |

### Rules

- Do not penalise slow writing
- Do not require perfect handwriting
- Do not show negative feedback
- Do not award stars for an empty canvas
- Allow the child to retry the same character
- Save the best star result for each character in localStorage

## 10. Progress and Storage

Use `localStorage` to save progress locally in the browser.

### Stored Data

- Current character index
- Best stars earned for each character
- List of completed characters
- Last played date

### Example Data

```json
{
  "currentIndex": 5,
  "stars": {
    "A": 3,
    "B": 2,
    "C": 1
  },
  "completed": [
    "A",
    "B",
    "C"
  ],
  "lastPlayed": "2026-11-04"
}
```

### Storage Key

```text
kids-tracing-progress
```

If localStorage is unavailable, the website must still work normally.
Progress simply will not be saved.

### Name Tracing Session

Name tracing is independent of the existing `kids-tracing-progress` letter,
number, and star record. It uses the versioned key
`kids-tracing-name-session-v1` and stores only the entered name, current
character position, and a completion flag for each position. It never saves
canvas pixels or stroke data. Storage failures and invalid saved records do
not prevent the feature from loading.

V1 accepts 1–20 English letters (`A-Z` and `a-z`) after trimming leading and
trailing whitespace. Case is preserved. Spaces inside a name, digits,
punctuation, and other scripts are not supported. Each character position is
a separate task, including duplicate letters. A position is complete only
after a child makes a drawing attempt and presses Done; this is not a
handwriting accuracy score.

Name tracing shares the existing practice page's canvas, pointer events,
resize handling, and drawing renderer. Its temporary handwriting stays only
in memory and is cleared when changing positions; saved completion flags
remain available after refresh.

### Word Tracing Session

Word Practice uses `#words` for the selection, tracing, or completion view.
`#word-selection` opens the selection view directly. Animals batch 1 has 12
words: animals CAT, DOG, PIG, BEE, FOX, FROG, DUCK, FISH, and LION, plus
everyday things BUS, CAR, and HAT. Filters report All Words (12), Animals (9),
and Everyday things (3). The later food, nature, and extra home words are not
in this batch.
Children trace each word one letter at a time using the same grey-character
guide and shared handwriting canvas as Write My Name; tracing dots, stroke
numbers, and start/end markers are not used.

Word-session data is independent of letter/number and name progress. The
versioned key `kids-tracing-word-session-v1` stores only the selected word,
current character position, and completion flags for each position. It never
saves canvas pixels or stroke data. Only one word session is stored at a time;
starting a different word after making progress asks for confirmation before
replacing that session. Word completion uses the existing Write My Name
completion layout.

Word Practice rewards use two additional local-only keys:
`kids-tracing-word-stickers-v1` stores earned stickers for the 12 current
words, and `kids-tracing-daily-goal-v1` stores the most recently
completed local calendar date and consecutive-day streak. Completing a word
earns its sticker once; completing any word completes that date's one-word
goal. New words start without a sticker. Invalid saved reward data is ignored,
and unavailable storage falls back to in-memory progress with a visible save
warning. The sticker shelf lists all 12 words; a fuller 30-word shelf is left
for a later batch.

Phonics stay in the existing slash style. BEE uses `/b/ /iː/` because ee is one
vowel. FOX ends in `/ks/`. DUCK uses `/d/ /ʌ/ /k/` because ck is one sound.
FISH uses `/f/ /ɪ/ /ʃ/` because sh is one sound. LION uses the whole-word
pronunciation `/ˈlaɪən/` so the io spelling is not presented as four separate
letter sounds. FROG is `/f/ /r/ /ɒ/ /ɡ/`. Existing CAT, DOG, PIG, BUS, CAR, and
HAT cues are unchanged.

The Today's Challenge card still selects one of the original six words — CAT,
DOG, PIG, BUS, CAR, and HAT — from the user's local calendar date. That
rotation is fixed in `DAILY_CHALLENGE_WORDS` instead of `Object.keys(WORDS)`.
Adding library words would otherwise change the day-number modulo and could
replace a challenge already in progress. The same date therefore keeps the
same target and the same three distinct picture choices across refresh. Streak
and once-per-day completion rules are unchanged. The child listens to the
spoken word, chooses its picture, and completes that word in the shared tracing
flow. A separate `kids-tracing-daily-challenge-v1` record stores the last
completed date, streak, and distinct completed word badges. The challenge can
be completed only once per date, and only after the correct choice and tracing
are completed that day. Badge progress is counted out of those six challenge
words.
The answer stays hidden on the challenge card until completion.
Invalid data is sanitized or ignored; unavailable storage keeps progress in
memory and reports that it could not be saved. Existing word sessions and
rewards remain independent: the challenge uses the shared tracing view but
writes only its dedicated storage key.

The README's manual smoke checks include same-day selection, correct and wrong
choices, once-per-day completion, streak continuity and reset, storage failures,
responsive layout, reduced motion, and regression checks for existing progress.

## 11. Visual Design

### General Style

- Light mode only
- Clean, friendly, child-friendly design
- Large fonts and large tap targets
- Rounded corners
- Soft shadows
- Plenty of whitespace
- No dark mode
- No hover colour changes
- No ads
- No external links
- No complicated navigation

### Colours

| Element | Colour |
|---|---|
| Page background | `#f5f5f7` |
| Card background | `#ffffff` |
| Card border | `1px solid #dddddd` |
| Primary accent | `#3b82f6` |
| Success colour | `#22c55e` |
| Tracing character | `rgba(0, 0, 0, 0.12)` |
| Handwriting colour | `#1e3a8a` |

### Typography

- Use a clear, rounded, highly readable font
- Large headings
- Large buttons
- Large tracing character
- Avoid small text

## 12. Accessibility and Child Safety

- Use large buttons and clear labels
- Avoid time pressure
- Avoid failure sounds
- Avoid ads
- Avoid external links
- Avoid collecting personal data
- Avoid requiring an account
- Ensure the website works without internet after first load
- Ensure the website is usable on small phone screens

## 13. Technical Requirements

### Tech Stack

- Plain HTML
- Plain CSS
- Vanilla JavaScript
- HTML Canvas
- Pointer Events
- localStorage

### Constraints

- No frontend framework
- No build tools
- No external JavaScript libraries
- No external CSS frameworks
- No backend
- No database
- No authentication
- No analytics
- No third-party fonts required
- Must work when opened directly in a browser
- Must work on GitHub Pages
- Must work on mobile Safari and mobile Chrome

### File Structure

```text
/
├── index.html
├── practice.html
├── about.html
├── 404.html
├── css/
│   └── style.css
├── js/
│   ├── home.js
│   ├── practice.js
│   └── shared.js
├── assets/
│   └── images/
├── PLAN.md
└── README.md
```

## 14. GitHub Pages Deployment

The website will be deployed using GitHub Pages.

### Requirements

- Repository must be public for GitHub Free users
- The main entry file must be `index.html`
- Deploy from the `main` branch
- Use the repository root (`/`) as the publishing folder

### Deployment Steps

1. Push all website files to the `main` branch.
2. Open the GitHub repository.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, set:
   - Source: **Deploy from a branch**
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**.
6. Wait for GitHub Pages to build and publish the website.
7. Open the published URL.

### Expected URL

```text
[https://your-github-username.github.io/kids-tracing/](https://your-github-username.github.io/kids-tracing/)
```

## 15. Development Tasks

Implement the website in the following order.
Complete and test one task before moving to the next.

### Task 1: Project Setup

Create the basic website structure.

Requirements:

- `index.html`
- `practice.html`
- `about.html`
- `404.html`
- `css/style.css`
- `js/shared.js`
- Basic header and footer
- Basic responsive layout
- Light mode styling

### Task 2: Home Page

Build the home page.

Requirements:

- Hero section
- “Start Practising” button linking to `/practice.html`
- Three feature cards
- Parent information section
- Footer

### Task 3: Practice Page Layout

Build the practice page layout.

Requirements:

- Progress area
- Tracing card
- Large light-grey character
- Star result area
- Previous, Clear, Done, and Next buttons
- Responsive layout

### Task 4: Character Navigation

Add character navigation.

Requirements:

- Full A-Z, a-z, and 0-9 character list
- Start at `A`
- Previous and Next buttons work
- Navigation wraps around
- Progress text updates
- Canvas clears when changing character

### Task 5: Canvas Tracing

Add handwriting support.

Requirements:

- Canvas overlays the character
- Supports mouse, trackpad, touch, and stylus
- Smooth rounded line
- Clear button clears the canvas
- Canvas resizes correctly
- Page does not scroll while drawing on touch devices

### Task 6: Star Scoring

Add simple scoring.

Requirements:

- `Done` button calculates basic tracing coverage
- Awards 1-3 stars
- Shows stars after completion
- Saves best result in localStorage
- Allows retry

### Task 7: Feedback

Add positive feedback.

Requirements:

- Completion sound
- Star animation
- Friendly success message
- No negative feedback

### Task 8: Polish and Test

Improve usability and test the website.

Requirements:

- Test on desktop Chrome, Safari, and Edge
- Test on mobile Safari and Chrome
- Test portrait and landscape orientations
- Ensure progress restores after refresh
- Ensure no console errors
- Ensure all pages work on GitHub Pages

## 16. Acceptance Criteria

V1 is complete when:

- The website has a Home page, Practice page, About page, and 404 page
- A child can trace A-Z, a-z, and 0-9
- Mouse, trackpad, touch, and stylus input work
- Previous, Next, Clear, and Done buttons work
- Canvas clears when moving to another character
- Progress is displayed correctly
- Stars are awarded after completion
- Best stars are saved after page refresh
- The website works on GitHub Pages
- The website works without a backend
- The website has no console errors
- The layout is usable on desktop, tablet, and mobile

## 17. Future Ideas

These features are not part of V1, but may be added later:

- Printable worksheet generator
- Chinese character tracing
- Stroke-order animation
- Letter adventure map
- Pet collection
- Parent progress report
- Multiple child profiles
- Cantonese or English audio instructions
- Themed backgrounds and characters

## 18. GitHub Copilot Instructions

When using GitHub Copilot:

- Implement one task at a time
- Do not add features outside the current task
- Keep the code plain, readable, and well organised
- Use clear function and variable names
- Avoid unnecessary dependencies
- Avoid over-engineering
- Keep all website text in English for V1
- Ensure the website works without internet
- Test after every task
- Do not create a mobile app, React app, or backend unless explicitly requested

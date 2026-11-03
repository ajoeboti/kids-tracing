# Kids Tracing Practice — Project Plan

## 1. Project Goal

Build a simple, mobile-first web app that helps young children practise writing
English letters and numbers through tracing.

The first version should be fun, easy to use, and playable on a phone or tablet.
The child should be able to trace A-Z, a-z and 0-9 with a finger, mouse, or stylus.

The app must be simple enough for a parent to open and use immediately,
without registration, installation, or setup.

## 2. Target Users

- Children aged approximately 3 to 7
- Parents or guardians who operate the app with the child
- Beginners who are learning letter and number shapes

## 3. Core Experience

The child sees one large, light-grey character in the centre of the screen.

They trace over the character using their finger, mouse, or stylus.

After completing a character, the app gives simple positive feedback:
stars, a sound, and a short animation.

The child can then move to the next character.

## 4. MVP Scope

### Included in V1

- Uppercase letters: A-Z
- Lowercase letters: a-z
- Numbers: 0-9
- One character displayed at a time
- Large light-grey tracing character
- Canvas overlay for handwriting
- Support for touch, mouse, and stylus input
- Previous / Next navigation
- Clear button
- Progress indicator
- Simple star scoring
- Completion sound and animation
- Progress saved in localStorage
- Mobile-first responsive layout
- Works offline as a static website

### Not Included in V1

- Chinese characters
- Stroke-order validation
- Handwriting recognition
- User accounts
- Cloud sync
- Parent dashboard
- Leaderboards
- Multiplayer features
- Ads
- Analytics
- Backend server
- Database

## 5. Technical Requirements

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
- No third-party fonts required
- Must work when opened directly in a browser
- Must work on mobile Safari and mobile Chrome
- Must support both portrait and landscape mobile screens

### File Structure

```text
/
├── index.html
├── style.css
├── app.js
├── PLAN.md
└── README.md
```

## 6. Character Set

The app should contain the following characters in this order:

```text
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
a b c d e f g h i j k l m n o p q r s t u v w x y z
0 1 2 3 4 5 6 7 8 9
```

Total: 62 characters.

Navigation rules:

- The app starts at `A`
- `Next` moves to the following character
- `Previous` moves to the previous character
- Navigation wraps around:
  - From `Z`, `Next` goes to `a`
  - From `z`, `Next` goes to `0`
  - From `9`, `Next` goes to `A`
  - From `A`, `Previous` goes to `9`

## 7. UI Design

### Layout

The app should use a single-page layout:

```text
┌────────────────────────────┐
│  Kids Tracing Practice     │
│                            │
│  Progress: 3 / 62          │
│                            │
│  ┌──────────────────────┐  │
│  │                      │  │
│  │         A            │  │
│  │                      │  │
│  └──────────────────────┘  │
│                            │
│  ★★☆                       │
│                            │
│  [←]     [Clear]     [→]   │
└────────────────────────────┘
```

### Visual Style

- Light mode only
- Page background: light grey, for example `#f5f5f5`
- Main card background: white `#ffffff`
- Card border: `1px solid #dddddd`
- Rounded corners for cards and buttons
- Large, clear typography
- Large touch-friendly buttons
- Tracing character colour: light grey, for example `rgba(0, 0, 0, 0.12)`
- Handwriting colour: dark blue or dark grey
- No hover colour changes
- No dark mode

### Buttons

The app needs three main buttons:

| Button | Action |
|---|---|
| `←` | Go to previous character |
| `Clear` | Clear the current handwriting |
| `→` | Go to next character |

Buttons must be large enough for young children to tap easily.

## 8. Canvas Behaviour

The tracing area must use an HTML `<canvas>` element positioned above the
large character.

### Drawing Rules

- Drawing starts on `pointerdown`
- Drawing continues on `pointermove`
- Drawing stops on `pointerup` or `pointercancel`
- The canvas must support touch, mouse, and stylus input
- The line should be smooth and rounded
- The line width should be suitable for children
- The canvas must resize correctly when the screen orientation changes
- Changing character must automatically clear the canvas

### Important Technical Notes

- Use `devicePixelRatio` to keep handwriting sharp on high-DPI screens
- Prevent page scrolling while drawing on the canvas
- Store handwriting only in the browser; do not upload it anywhere

## 9. Scoring Rules

For V1, scoring should be simple and positive.

When the child presses a `Done` button, or after finishing a character,
the app awards stars based on simple tracing coverage.

| Result | Stars |
|---|---|
| Character completed | 1 star |
| Good tracing coverage | 2 stars |
| Very good tracing coverage | 3 stars |

### Suggested Thresholds

These values can be adjusted after testing:

| Coverage | Stars |
|---|---|
| Below 40% | 1 star |
| 40% to 69% | 2 stars |
| 70% or above | 3 stars |

### Scoring Notes

- Do not penalise slow writing
- Do not require perfect handwriting
- Do not show negative feedback
- If the child receives 1 star, still encourage them to try again
- Save the best star result for each character in localStorage

## 10. Progress and Storage

Use `localStorage` to store:

- Current character index
- Best stars earned for each character
- Total completed characters
- Last played date

Example storage key:

```text
kids-tracing-progress
```

Example data structure:

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
  "lastPlayed": "2026-11-03"
}
```

If localStorage is unavailable, the app must still work normally.
Progress simply will not be saved.

## 11. Feedback and Rewards

### Completion Feedback

When a character is completed:

- Show 1, 2, or 3 stars
- Play a short positive sound
- Show a simple animation, such as stars appearing or a happy emoji
- Automatically enable the `Next` button
- Allow the child to retry the same character

### Sound

Use the Web Audio API or a very small local audio file.

Sounds must be:

- Short
- Gentle
- Positive
- Not scary or too loud

## 12. Accessibility and Child-Friendly Design

- Use large fonts and large tap targets
- Avoid small text
- Avoid complicated menus
- Avoid time pressure
- Avoid failure sounds
- Avoid ads
- Avoid external links
- Avoid collecting personal data
- Ensure the app works without internet after first load
- Ensure buttons are easy for small hands to press

## 13. Development Tasks

Implement the project in the following order.
Complete and test one task before moving to the next.

### Task 1: Basic Layout

Create `index.html`, `style.css`, and `app.js`.

Requirements:

- Mobile-first layout
- White main card
- Light grey page background
- Large character display area
- Previous, Clear, and Next buttons
- Progress text
- No scoring or storage yet

### Task 2: Character Navigation

Add the full character list.

Requirements:

- Start at `A`
- Previous and Next buttons work
- Navigation wraps around
- Progress text updates correctly
- Canvas clears when changing character

### Task 3: Canvas Tracing

Add handwriting support.

Requirements:

- Canvas overlays the character
- Supports touch, mouse, and stylus
- Smooth rounded line
- Clear button clears the canvas
- Canvas resizes correctly
- Page does not scroll while drawing

### Task 4: Star Scoring

Add simple scoring.

Requirements:

- Add a `Done` button
- Calculate basic tracing coverage
- Award 1-3 stars
- Show stars after completion
- Save best result in localStorage
- Allow retry

### Task 5: Feedback

Add positive feedback.

Requirements:

- Completion sound
- Star animation
- Simple success message
- No negative feedback

### Task 6: Polish

Improve usability.

Requirements:

- Test on mobile Safari and Chrome
- Fix layout issues on small screens
- Ensure canvas works after screen rotation
- Ensure progress restores after refresh
- Add README with local testing instructions

## 14. Acceptance Criteria

V1 is complete when:

- A child can trace A-Z, a-z and 0-9
- Touch, mouse, and stylus input work
- Previous, Next, and Clear buttons work
- Canvas clears when moving to another character
- Progress is displayed correctly
- Stars are awarded after completion
- Best stars are saved after page refresh
- The app works on a mobile phone without a backend
- The app has no console errors
- The layout is usable on a small phone screen

## 15. Future Ideas

These features are not part of V1, but may be added later:

- Letter adventure map
- Daily challenge
- Stickers or pet collection
- Badges
- Name tracing mode
- Chinese character tracing
- Stroke-order animation
- Printable worksheet generator
- Parent progress report
- Multiple child profiles
- Cantonese or English audio instructions
- Themed backgrounds and characters

## 16. GitHub Copilot Instructions

When using GitHub Copilot:

- Implement one task at a time
- Do not add features outside the current task
- Keep the code plain, readable, and well organised
- Use clear function and variable names
- Avoid unnecessary dependencies
- Avoid over-engineering
- Keep all UI text in English for V1
- Ensure the app works without internet
- Test after every task

# Kids Tracing Practice — Website Plan

## 1. Project Overview

**Kids Tracing Practice** is a free, browser-based website that helps young
children practise writing English letters and numbers.

Children can trace uppercase letters, lowercase letters, and numbers using
a mouse, trackpad, finger, or stylus. The website will be simple, friendly,
and safe for young children.

This is a **static website**, not a mobile app.

It will be hosted on GitHub Pages and opened directly in a web browser.

## 2. Goals

- Help children practise A-Z, a-z, and 0-9
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

The website will initially contain the following pages:

```text
/                 → Home page
/practice.html    → Tracing practice page
/about.html       → About and parent information
/404.html         → Custom not-found page
```

### Future Pages

These pages are not part of V1, but may be added later:

```text
/name.html        → Name tracing
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
large light-grey reference character on the writing guide lines.

The following are **out of scope for V1**:

- Dotted tracing guides
- Stroke numbering
- Start and end markers
- Direction arrows
- Stroke-order validation

The practice instruction is: "Trace over the grey letter or number."

## 9. Scoring Rules

For V1, scoring should be simple and positive.

When the child presses `Done`, calculate a basic tracing coverage score.

| Coverage | Stars |
|---|---|
| Below 40% | 1 star |
| 40% to 69% | 2 stars |
| 70% or above | 3 stars |

### Rules

- Do not penalise slow writing
- Do not require perfect handwriting
- Do not show negative feedback
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

- Name tracing page
- Printable worksheet generator
- Chinese character tracing
- Stroke-order animation
- Letter adventure map
- Daily challenge
- Stickers or pet collection
- Badges
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

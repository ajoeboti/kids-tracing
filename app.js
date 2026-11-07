"use strict";

var STORAGE_KEY = "kids-tracing-progress";
var NAME_STORAGE_KEY = "kids-tracing-name-session-v1";
var WORD_STORAGE_KEY = "kids-tracing-word-session-v1";
var WORD_STICKERS_KEY = "kids-tracing-word-stickers-v1";
var DAILY_GOAL_KEY = "kids-tracing-daily-goal-v1";
var DAILY_CHALLENGE_KEY = "kids-tracing-daily-challenge-v1";
var CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
var WORDS = {
  CAT: { emoji: "🐱", category: "animals", phonics: "/k/ /æ/ /t/" },
  DOG: { emoji: "🐶", category: "animals", phonics: "/d/ /ɒ/ /ɡ/" },
  PIG: { emoji: "🐷", category: "animals", phonics: "/p/ /ɪ/ /ɡ/" },
  BEE: { emoji: "🐝", category: "animals", phonics: "/b/ /iː/" },
  FOX: { emoji: "🦊", category: "animals", phonics: "/f/ /ɒ/ /ks/" },
  FROG: { emoji: "🐸", category: "animals", phonics: "/f/ /r/ /ɒ/ /ɡ/" },
  DUCK: { emoji: "🦆", category: "animals", phonics: "/d/ /ʌ/ /k/" },
  FISH: { emoji: "🐟", category: "animals", phonics: "/f/ /ɪ/ /ʃ/" },
  LION: { emoji: "🦁", category: "animals", phonics: "/ˈlaɪən/" },
  EGG: { emoji: "🥚", category: "food", phonics: "/ɛ/ /ɡ/" },
  MILK: { emoji: "🥛", category: "food", phonics: "/m/ /ɪ/ /l/ /k/" },
  CAKE: { emoji: "🍰", category: "food", phonics: "/k/ /eɪ/ /k/" },
  APPLE: { emoji: "🍎", category: "food", phonics: "/ˈæpəl/" },
  BREAD: { emoji: "🍞", category: "food", phonics: "/brɛd/" },
  JUICE: { emoji: "🧃", category: "food", phonics: "/dʒuːs/" },
  SUN: { emoji: "☀️", category: "nature", phonics: "/s/ /ʌ/ /n/" },
  MOON: { emoji: "🌙", category: "nature", phonics: "/m/ /uː/ /n/" },
  STAR: { emoji: "⭐", category: "nature", phonics: "/s/ /t/ /ɑːr/" },
  TREE: { emoji: "🌳", category: "nature", phonics: "/t/ /r/ /iː/" },
  BUS: { emoji: "🚌", category: "things", phonics: "/b/ /ʌ/ /s/" },
  CAR: { emoji: "🚗", category: "things", phonics: "/k/ /ɑːr/" },
  HAT: { emoji: "🎩", category: "things", phonics: "/h/ /æ/ /t/" },
  BALL: { emoji: "⚽", category: "things", phonics: "/b/ /ɔː/ /l/" },
  BOOK: { emoji: "📖", category: "things", phonics: "/b/ /ʊ/ /k/" },
  SHOE: { emoji: "👟", category: "things", phonics: "/ʃuː/" },
  SOCK: { emoji: "🧦", category: "things", phonics: "/s/ /ɒ/ /k/" },
  CUP: { emoji: "🥤", category: "things", phonics: "/k/ /ʌ/ /p/" },
  BED: { emoji: "🛏️", category: "things", phonics: "/b/ /ɛ/ /d/" },
  CHAIR: { emoji: "🪑", category: "things", phonics: "/tʃɛər/" },
  CLOCK: { emoji: "🕒", category: "things", phonics: "/k/ /l/ /ɒ/ /k/" }
};
// Today's Challenge keeps this original order. Object.keys(WORDS) would change
// the day-number modulo after new words are added and could replace a challenge
// already in progress. Same-day refresh stays on this fixed list.
var DAILY_CHALLENGE_WORDS = ["CAT", "DOG", "PIG", "BUS", "CAR", "HAT"];
var ACCURACY_KEY = "kids-tracing-min-accuracy-v1";
var PASTELS = ["pink", "sky", "mint"];
var PHONEMES = {
  A: "ay", B: "buh", C: "kuh", D: "duh", E: "eh", F: "fff", G: "guh",
  H: "huh", I: "ih", J: "juh", K: "kuh", L: "lll", M: "mmm", N: "nnn",
  O: "oh", P: "puh", Q: "kwuh", R: "rrr", S: "sss", T: "tuh", U: "uh",
  V: "vvv", W: "wuh", X: "ks", Y: "yuh", Z: "zzz",
  a: "ah", b: "buh", c: "kuh", d: "duh", e: "eh", f: "fff", g: "guh",
  h: "huh", i: "ih", j: "juh", k: "kuh", l: "lll", m: "mmm", n: "nnn",
  o: "oh", p: "puh", q: "kwuh", r: "rrr", s: "sss", t: "tuh", u: "uh",
  v: "vvv", w: "wuh", x: "ks", y: "yuh", z: "zzz",
  0: "zero", 1: "one", 2: "two", 3: "three", 4: "four",
  5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine"
};
var STROKE_ORDER = {
  A: [
    [[0.50, 0], [0, 1]],
    [[0.50, 0], [1, 1]],
    [[0.21, 0.64], [0.79, 0.64]]
  ],
  B: [
    [[0.15, 0], [0.15, 1]],
    [[0.15, 0.02], [0.53, 0.02], [0.81, 0.10], [0.97, 0.25], [0.97, 0.39], [0.81, 0.47], [0.53, 0.50], [0.15, 0.50]],
    [[0.15, 0.50], [0.55, 0.50], [0.83, 0.58], [1, 0.72], [1, 0.86], [0.83, 0.96], [0.55, 1], [0.15, 1]]
  ],
  C: [
    [[1, 0.16], [0.80, 0.04], [0.59, 0], [0.39, 0.06], [0.20, 0.21], [0.06, 0.42], [0, 0.63], [0.08, 0.82], [0.28, 0.96], [0.53, 1], [0.78, 0.94], [0.98, 0.84]]
  ],
  D: [
    [[0.16, 0], [0.16, 1]],
    [[0.16, 0.02], [0.53, 0.02], [0.76, 0.10], [0.91, 0.25], [1, 0.43], [1, 0.60], [0.91, 0.78], [0.76, 0.93], [0.53, 1], [0.16, 1]]
  ],
  E: [
    [[0.18, 0], [0.18, 1]],
    [[0.18, 0.02], [0.91, 0.02]],
    [[0.18, 0.50], [0.72, 0.50]],
    [[0.18, 0.98], [0.91, 0.98]]
  ],
  F: [
    [[0.18, 0], [0.18, 1]],
    [[0.18, 0.02], [0.91, 0.02]],
    [[0.18, 0.5], [0.72, 0.5]]
  ],
  G: [
    [[0.96, 0.2], [0.82, 0.08], [0.62, 0.01], [0.4, 0.02], [0.2, 0.12], [0.06, 0.3], [0.01, 0.52], [0.06, 0.75], [0.2, 0.91], [0.4, 0.99], [0.62, 0.98], [0.82, 0.87], [0.98, 0.72], [0.98, 0.55], [0.64, 0.55]]
  ],
  H: [
    [[0.16, 0], [0.16, 1]],
    [[0.84, 0], [0.84, 1]],
    [[0.16, 0.5], [0.84, 0.5]]
  ],
  I: [
    [[0.25, 0.02], [0.75, 0.02]],
    [[0.5, 0.02], [0.5, 0.98]],
    [[0.25, 0.98], [0.75, 0.98]]
  ],
  J: [
    [[0.18, 0.02], [0.86, 0.02]],
    [[0.78, 0.02], [0.78, 0.7], [0.73, 0.87], [0.6, 0.97], [0.42, 1], [0.24, 0.94], [0.15, 0.82]]
  ],
  K: [
    [[0.18, 0], [0.18, 1]],
    [[0.82, 0], [0.18, 0.51]],
    [[0.4, 0.34], [0.88, 1]]
  ],
  L: [
    [[0.2, 0], [0.2, 0.98], [0.88, 0.98]]
  ],
  M: [
    [[0.1, 1], [0.1, 0], [0.5, 0.56], [0.9, 0], [0.9, 1]]
  ],
  N: [
    [[0.14, 1], [0.14, 0]],
    [[0.14, 0], [0.86, 1]],
    [[0.86, 1], [0.86, 0]]
  ],
  O: [
    [[0.5, 0], [0.72, 0.03], [0.88, 0.15], [0.98, 0.34], [1, 0.55], [0.94, 0.75], [0.8, 0.91], [0.62, 0.99], [0.4, 0.99], [0.2, 0.9], [0.06, 0.74], [0, 0.54], [0.04, 0.33], [0.16, 0.15], [0.34, 0.03], [0.5, 0]]
  ],
  P: [
    [[0.18, 1], [0.18, 0]],
    [[0.18, 0.02], [0.58, 0.02], [0.82, 0.1], [0.96, 0.27], [0.96, 0.43], [0.82, 0.58], [0.58, 0.62], [0.18, 0.62]]
  ],
  Q: [
    [[0.5, 0], [0.72, 0.03], [0.88, 0.15], [0.98, 0.34], [1, 0.55], [0.94, 0.75], [0.8, 0.91], [0.62, 0.99], [0.4, 0.99], [0.2, 0.9], [0.06, 0.74], [0, 0.54], [0.04, 0.33], [0.16, 0.15], [0.34, 0.03], [0.5, 0]],
    [[0.63, 0.68], [0.98, 1]]
  ],
  R: [
    [[0.18, 1], [0.18, 0]],
    [[0.18, 0.02], [0.57, 0.02], [0.82, 0.1], [0.96, 0.27], [0.96, 0.43], [0.82, 0.58], [0.57, 0.62], [0.18, 0.62]],
    [[0.55, 0.62], [0.9, 1]]
  ],
  S: [
    [[0.92, 0.15], [0.78, 0.04], [0.56, 0], [0.34, 0.05], [0.14, 0.18], [0.06, 0.34], [0.14, 0.46], [0.37, 0.51], [0.66, 0.54], [0.88, 0.63], [0.96, 0.77], [0.84, 0.92], [0.63, 0.99], [0.39, 0.97], [0.17, 0.88], [0.06, 0.78]]
  ],
  T: [
    [[0.08, 0.02], [0.92, 0.02]],
    [[0.5, 0.02], [0.5, 1]]
  ],
  U: [
    [[0.14, 0], [0.14, 0.62], [0.17, 0.81], [0.28, 0.94], [0.5, 1], [0.72, 0.94], [0.83, 0.81], [0.86, 0.62], [0.86, 0]]
  ],
  V: [
    [[0.12, 0], [0.5, 1], [0.88, 0]]
  ],
  W: [
    [[0.06, 0], [0.26, 1], [0.5, 0.43], [0.74, 1], [0.94, 0]]
  ],
  X: [
    [[0.16, 0], [0.84, 1]],
    [[0.84, 0], [0.16, 1]]
  ],
  Y: [
    [[0.12, 0], [0.5, 0.5], [0.88, 0]],
    [[0.5, 0.5], [0.5, 1]]
  ],
  Z: [
    [[0.12, 0.02], [0.88, 0.02]],
    [[0.88, 0.02], [0.12, 0.98]],
    [[0.12, 0.98], [0.88, 0.98]]
  ],
  a: [
    [[0.5, 0], [0.72, 0.03], [0.89, 0.16], [0.98, 0.36], [0.97, 0.59], [0.86, 0.81], [0.67, 0.96], [0.43, 1], [0.21, 0.92], [0.07, 0.74], [0.03, 0.52], [0.1, 0.28], [0.28, 0.09], [0.5, 0], [0.72, 0.03], [0.89, 0.16]],
    [[0.88, 0.15], [0.88, 1]]
  ],
  b: [
    [[0.2, 1], [0.2, 0]],
    [[0.2, 0.56], [0.39, 0.39], [0.61, 0.35], [0.82, 0.44], [0.96, 0.62], [0.94, 0.81], [0.79, 0.95], [0.57, 1], [0.36, 0.94], [0.2, 0.8]]
  ],
  c: [
    [[0.94, 0.2], [0.79, 0.08], [0.57, 0], [0.35, 0.05], [0.15, 0.2], [0.04, 0.42], [0.04, 0.63], [0.15, 0.84], [0.35, 0.97], [0.57, 1], [0.79, 0.91], [0.94, 0.8]]
  ],
  d: [
    [[0.5, 0], [0.72, 0.03], [0.89, 0.16], [0.98, 0.36], [0.97, 0.59], [0.86, 0.81], [0.67, 0.96], [0.43, 1], [0.21, 0.92], [0.07, 0.74], [0.03, 0.52], [0.1, 0.28], [0.28, 0.09], [0.5, 0], [0.72, 0.03], [0.89, 0.16]],
    [[0.88, 1], [0.88, 0]]
  ],
  e: [
    [[0.06, 0.56], [0.28, 0.52], [0.55, 0.52], [0.79, 0.48], [0.91, 0.39], [0.86, 0.24], [0.69, 0.09], [0.47, 0.02], [0.25, 0.1], [0.09, 0.28], [0.03, 0.51], [0.1, 0.74], [0.28, 0.92], [0.52, 1], [0.75, 0.96], [0.93, 0.84]]
  ],
  f: [
    [[0.7, 0], [0.7, 0.68], [0.75, 0.84], [0.88, 1], [0.99, 0.92]],
    [[0.28, 0.42], [0.9, 0.42]]
  ],
  g: [
    [[0.5, 0], [0.72, 0.02], [0.89, 0.12], [0.98, 0.25], [0.97, 0.41], [0.86, 0.55], [0.67, 0.66], [0.43, 0.68], [0.21, 0.63], [0.07, 0.51], [0.03, 0.35], [0.1, 0.19], [0.28, 0.06], [0.5, 0]],
    [[0.88, 0.14], [0.88, 0.68], [0.82, 0.87], [0.67, 1], [0.47, 0.98], [0.29, 0.9]]
  ],
  h: [
    [[0.2, 1], [0.2, 0]],
    [[0.2, 0.58], [0.39, 0.39], [0.61, 0.35], [0.82, 0.44], [0.94, 0.61], [0.94, 1]]
  ],
  i: [
    [[0.5, 0.38], [0.5, 1]],
    [[0.5, 0], [0.52, 0.03]]
  ],
  j: [
    [[0.6, 0.12], [0.6, 0.68], [0.55, 0.86], [0.4, 1], [0.25, 0.96]],
    [[0.6, 0], [0.62, 0.03]]
  ],
  k: [
    [[0.2, 1], [0.2, 0]],
    [[0.82, 0.36], [0.2, 0.7]],
    [[0.42, 0.58], [0.88, 1]]
  ],
  l: [
    [[0.5, 0], [0.5, 1]]
  ],
  m: [
    [[0.12, 1], [0.12, 0.36], [0.31, 0.48], [0.48, 0.37], [0.52, 1], [0.52, 0.38], [0.71, 0.48], [0.88, 0.37], [0.92, 1]]
  ],
  n: [
    [[0.15, 1], [0.15, 0.36], [0.36, 0.48], [0.57, 0.36], [0.85, 0.42], [0.94, 0.59], [0.94, 1]]
  ],
  o: [
    [[0.5, 0], [0.72, 0.03], [0.89, 0.16], [0.98, 0.36], [0.97, 0.59], [0.86, 0.81], [0.67, 0.96], [0.43, 1], [0.21, 0.92], [0.07, 0.74], [0.03, 0.52], [0.1, 0.28], [0.28, 0.09], [0.5, 0]]
  ],
  p: [
    [[0.2, 0], [0.2, 1]],
    [[0.2, 0], [0.4, 0.02], [0.62, 0.12], [0.83, 0.28], [0.96, 0.45], [0.91, 0.56], [0.74, 0.65], [0.52, 0.68], [0.31, 0.63], [0.2, 0.55]]
  ],
  q: [
    [[0.5, 0], [0.72, 0.02], [0.89, 0.12], [0.98, 0.25], [0.97, 0.41], [0.86, 0.55], [0.67, 0.66], [0.43, 0.68], [0.21, 0.63], [0.07, 0.51], [0.03, 0.35], [0.1, 0.19], [0.28, 0.06], [0.5, 0]],
    [[0.88, 0.14], [0.88, 0.68], [0.82, 0.87], [0.67, 1], [0.47, 0.98], [0.29, 0.9]]
  ],
  r: [
    [[0.2, 1], [0.2, 0.36], [0.39, 0.48], [0.58, 0.38], [0.79, 0.38]]
  ],
  s: [
    [[0.9, 0.16], [0.76, 0.05], [0.55, 0], [0.34, 0.06], [0.14, 0.2], [0.08, 0.38], [0.2, 0.5], [0.5, 0.54], [0.8, 0.62], [0.93, 0.76], [0.85, 0.9], [0.64, 0.99], [0.41, 0.97], [0.19, 0.88], [0.08, 0.78]]
  ],
  t: [
    [[0.5, 0], [0.5, 1]],
    [[0.22, 0.4], [0.82, 0.4]]
  ],
  u: [
    [[0.14, 0.36], [0.14, 0.73], [0.23, 0.9], [0.43, 0.99], [0.64, 0.94], [0.84, 0.78], [0.86, 0.36], [0.86, 1]]
  ],
  v: [
    [[0.12, 0.36], [0.5, 1], [0.88, 0.36]]
  ],
  w: [
    [[0.06, 0.36], [0.25, 1], [0.5, 0.56], [0.75, 1], [0.94, 0.36]]
  ],
  x: [
    [[0.16, 0.36], [0.84, 1]],
    [[0.84, 0.36], [0.16, 1]]
  ],
  y: [
    [[0.12, 0], [0.5, 0.68], [0.88, 0], [0.76, 0.66], [0.61, 0.87], [0.43, 1], [0.25, 0.96]]
  ],
  z: [
    [[0.14, 0.38], [0.86, 0.38]],
    [[0.86, 0.38], [0.14, 1]],
    [[0.14, 1], [0.86, 1]]
  ],
  0: [
    [[0.5, 0], [0.72, 0.03], [0.88, 0.15], [0.98, 0.34], [1, 0.55], [0.94, 0.75], [0.8, 0.91], [0.62, 0.99], [0.4, 0.99], [0.2, 0.9], [0.06, 0.74], [0, 0.54], [0.04, 0.33], [0.16, 0.15], [0.34, 0.03], [0.5, 0]]
  ],
  1: [
    [[0.3, 0.24], [0.5, 0.02], [0.5, 0.98]]
  ],
  2: [
    [[0.1, 0.2], [0.23, 0.07], [0.44, 0], [0.66, 0.04], [0.85, 0.17], [0.91, 0.33], [0.84, 0.5], [0.65, 0.68], [0.42, 0.85], [0.12, 0.98], [0.9, 0.98]]
  ],
  3: [
    [[0.12, 0.12], [0.33, 0.02], [0.57, 0], [0.79, 0.09], [0.9, 0.26], [0.83, 0.43], [0.62, 0.5], [0.42, 0.5], [0.66, 0.51], [0.87, 0.62], [0.94, 0.79], [0.82, 0.93], [0.6, 1], [0.36, 0.98], [0.13, 0.87]]
  ],
  4: [
    [[0.68, 0], [0.12, 0.66]],
    [[0.68, 0], [0.68, 1]],
    [[0.12, 0.66], [0.9, 0.66]]
  ],
  5: [
    [[0.87, 0.02], [0.2, 0.02], [0.16, 0.48], [0.42, 0.41], [0.67, 0.42], [0.86, 0.55], [0.95, 0.74], [0.87, 0.9], [0.68, 0.99], [0.43, 0.99], [0.2, 0.88]]
  ],
  6: [
    [[0.84, 0.08], [0.62, 0], [0.4, 0.08], [0.2, 0.26], [0.08, 0.49], [0.07, 0.72], [0.19, 0.9], [0.4, 0.99], [0.63, 0.98], [0.83, 0.87], [0.94, 0.69], [0.89, 0.52], [0.72, 0.43], [0.49, 0.44], [0.28, 0.56], [0.12, 0.72]]
  ],
  7: [
    [[0.1, 0.02], [0.9, 0.02]],
    [[0.9, 0.02], [0.38, 1]]
  ],
  8: [
    [[0.5, 0.48], [0.7, 0.44], [0.86, 0.33], [0.91, 0.19], [0.82, 0.06], [0.65, 0], [0.44, 0.02], [0.25, 0.12], [0.17, 0.27], [0.25, 0.4], [0.5, 0.48]],
    [[0.5, 0.48], [0.73, 0.55], [0.89, 0.69], [0.9, 0.84], [0.77, 0.96], [0.55, 1], [0.32, 0.96], [0.15, 0.84], [0.12, 0.69], [0.27, 0.55], [0.5, 0.48]]
  ],
  9: [
    [[0.85, 0.48], [0.68, 0.57], [0.45, 0.56], [0.24, 0.46], [0.12, 0.29], [0.19, 0.12], [0.39, 0.02], [0.62, 0.04], [0.82, 0.17], [0.92, 0.4], [0.9, 0.65], [0.78, 0.84], [0.58, 0.97], [0.37, 1], [0.18, 0.93]]
  ]
};

var canvas = document.getElementById("trace-canvas");
var undoButton = document.getElementById("tool-undo");
var pencilButton = document.getElementById("tool-pencil");
var brushButton = document.getElementById("tool-brush");
var strokeDemoCanvas = document.getElementById("stroke-demo-canvas");
var strokeDemoContext = strokeDemoCanvas.getContext("2d");
var strokeDemoControls = document.getElementById("stroke-demo-controls");
var strokeDemoButton = document.getElementById("stroke-demo-button");
var strokeDemoStatus = document.getElementById("stroke-demo-status");
var strokeStepButton = document.getElementById("stroke-step-button");

var state = loadProgress();
var nameSession = loadNameSession();
var wordSession = loadWordSession();
var wordCategoryFilter = "all";
var wordSessionIsDailyChallenge = false;
var rewardsStorageAvailable = true;
var stickerState = loadStickerState();
var dailyGoalState = loadDailyGoal();
var dailyChallengeStorageAvailable = true;
var dailyChallengeState = loadDailyChallenge();
var completionReward = null;
var dailyChallengeCompletionWord = null;
var dailyChallengeAttempt = null;
var dailyChallengeHeard = false;
var dailyChallengeHeardDate = null;
var strokes = [];
var practiceInk = [];
var nameInk = [];
var wordInk = [];
var drawingMode = "practice";
var drawing = false;
var activeStroke = null;
var tool = "pencil";
var strokeWidth = 16;
var pickerGroup = "upper";
var saveTimer = 0;
var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var strokeDemoFrame = 0;
var strokeDemoTimer = 0;
var strokeDemoActive = false;
var strokeDemoManual = false;
var strokeDemoCurrentStroke = 0;
var strokeDemoVisibleStrokes = 0;
var strokeDemoProgress = 0;
var strokeDemoCharacter = null;
var strokeDemoStartedAt = 0;
var strokeDemoDuration = 1200;

function loadProgress() {
  var fresh = { currentIndex: 0, stars: {}, completed: [], lastPlayed: null };
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fresh;
    var data = JSON.parse(raw);
    if (!data || typeof data !== "object") return fresh;
    var idx = Number(data.currentIndex);
    if (Number.isInteger(idx) && idx >= 0 && idx < CHARACTERS.length) {
      fresh.currentIndex = idx;
    }
    if (data.stars && typeof data.stars === "object") {
      CHARACTERS.forEach(function (ch) {
        var n = Number(data.stars[ch]);
        if (n >= 1 && n <= 3) fresh.stars[ch] = Math.round(n);
      });
    }
    fresh.completed = CHARACTERS.filter(function (ch) { return !!fresh.stars[ch]; });
    if (typeof data.lastPlayed === "string") fresh.lastPlayed = data.lastPlayed.slice(0, 10);
  } catch (err) {
    return fresh;
  }
  return fresh;
}

function loadNameSession() {
  try {
    var raw = localStorage.getItem(NAME_STORAGE_KEY);
    if (!raw) return null;
    var data = JSON.parse(raw);
    if (!data || typeof data !== "object" ||
        typeof data.name !== "string" ||
        !/^[A-Za-z]{1,20}$/.test(data.name) ||
        !Number.isInteger(data.currentIndex) ||
        data.currentIndex < 0 ||
        data.currentIndex >= data.name.length ||
        !Array.isArray(data.completed) ||
        data.completed.length !== data.name.length ||
        !data.completed.every(function (done) { return typeof done === "boolean"; })) {
      return null;
    }
    return {
      name: data.name,
      currentIndex: data.currentIndex,
      completed: data.completed.slice()
    };
  } catch (err) {
    return null;
  }
}

function loadWordSession() {
  try {
    var raw = localStorage.getItem(WORD_STORAGE_KEY);
    if (!raw) return null;
    var data = JSON.parse(raw);
    if (!data || typeof data !== "object" ||
        !Object.prototype.hasOwnProperty.call(WORDS, data.word) ||
        !Number.isInteger(data.currentIndex) ||
        data.currentIndex < 0 ||
        data.currentIndex >= data.word.length ||
        !Array.isArray(data.completed) ||
        data.completed.length !== data.word.length ||
        !data.completed.every(function (done) { return typeof done === "boolean"; })) {
      return null;
    }
    return {
      word: data.word,
      currentIndex: data.currentIndex,
      completed: data.completed.slice()
    };
  } catch (err) {
    return null;
  }
}

function loadStickerState() {
  var raw;
  try {
    raw = localStorage.getItem(WORD_STICKERS_KEY);
  } catch (err) {
    rewardsStorageAvailable = false;
    return { version: 1, stickers: [] };
  }
  if (!raw) return { version: 1, stickers: [] };
  try {
    var data = JSON.parse(raw);
    if (!data || data.version !== 1 || !Array.isArray(data.stickers)) {
      return { version: 1, stickers: [] };
    }
    return {
      version: 1,
      stickers: data.stickers.filter(function (word, index, stickers) {
        return Object.prototype.hasOwnProperty.call(WORDS, word) &&
          stickers.indexOf(word) === index;
      })
    };
  } catch (err) {
    return { version: 1, stickers: [] };
  }
}

function isValidCalendarDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  var timestamp = Date.parse(value + "T00:00:00Z");
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
}

function loadDailyGoal() {
  var raw;
  try {
    raw = localStorage.getItem(DAILY_GOAL_KEY);
  } catch (err) {
    rewardsStorageAvailable = false;
    return { version: 1, lastCompletedDate: null, streak: 0 };
  }
  if (!raw) return { version: 1, lastCompletedDate: null, streak: 0 };
  try {
    var data = JSON.parse(raw);
    if (!data || data.version !== 1 ||
        !isValidCalendarDate(data.lastCompletedDate) ||
        !Number.isSafeInteger(data.streak) || data.streak < 1) {
      return { version: 1, lastCompletedDate: null, streak: 0 };
    }
    return {
      version: 1,
      lastCompletedDate: data.lastCompletedDate,
      streak: data.streak
    };
  } catch (err) {
    return { version: 1, lastCompletedDate: null, streak: 0 };
  }
}

function loadDailyChallenge() {
  var fresh = { version: 1, lastCompletedDate: null, streak: 0, completedWords: [] };
  var raw;
  try {
    raw = localStorage.getItem(DAILY_CHALLENGE_KEY);
  } catch (err) {
    dailyChallengeStorageAvailable = false;
    return fresh;
  }
  if (!raw) return fresh;
  try {
    var data = JSON.parse(raw);
    if (!data || data.version !== 1 ||
        !isValidCalendarDate(data.lastCompletedDate) ||
        !Number.isSafeInteger(data.streak) || data.streak < 1 ||
        !Array.isArray(data.completedWords)) {
      return fresh;
    }
    return {
      version: 1,
      lastCompletedDate: data.lastCompletedDate,
      streak: data.streak,
      completedWords: data.completedWords.filter(function (word, index, words) {
        return Object.prototype.hasOwnProperty.call(WORDS, word) &&
          words.indexOf(word) === index;
      })
    };
  } catch (err) {
    return fresh;
  }
}

function localCalendarDate(date) {
  return date.getFullYear() + "-" +
    String(date.getMonth() + 1).padStart(2, "0") + "-" +
    String(date.getDate()).padStart(2, "0");
}

function dailyChallengeWordForDate(date) {
  var parts = date.split("-").map(Number);
  var dayIndex = Math.floor(Date.UTC(parts[0], parts[1] - 1, parts[2]) / 86400000);
  var words = DAILY_CHALLENGE_WORDS;
  return words[((dayIndex % words.length) + words.length) % words.length];
}

function dailyChallengeChoicesFor(word, date) {
  var parts = date.split("-").map(Number);
  var seed = Math.floor(Date.UTC(parts[0], parts[1] - 1, parts[2]) / 86400000);
  var pool = DAILY_CHALLENGE_WORDS.filter(function (candidate) {
    return Object.prototype.hasOwnProperty.call(WORDS, candidate);
  });
  if (pool.indexOf(word) === -1) pool = Object.keys(WORDS);
  var distractors = pool.filter(function (candidate) {
    return candidate !== word;
  });
  var choices = [
    word,
    distractors[seed % distractors.length],
    distractors[(seed + 1) % distractors.length]
  ];
  var rotation = seed % choices.length;
  return choices.slice(rotation).concat(choices.slice(0, rotation));
}

function dailyChallengeStreakForDate(date) {
  if (dailyChallengeState.lastCompletedDate === date) return dailyChallengeState.streak;
  var yesterday = new Date();
  yesterday.setHours(0, 0, 0, 0);
  yesterday.setDate(yesterday.getDate() - 1);
  return dailyChallengeState.lastCompletedDate === localCalendarDate(yesterday)
    ? dailyChallengeState.streak
    : 0;
}

function persistDailyChallenge() {
  try {
    localStorage.setItem(DAILY_CHALLENGE_KEY, JSON.stringify(dailyChallengeState));
    dailyChallengeStorageAvailable = true;
  } catch (err) {
    dailyChallengeStorageAvailable = false;
  }
  renderDailyChallenge();
  return dailyChallengeStorageAvailable;
}

function recordDailyChallengeCompletion(word) {
  var date = localCalendarDate(new Date());
  if (!dailyChallengeAttempt || dailyChallengeAttempt.date !== date ||
      dailyChallengeAttempt.word !== word ||
      dailyChallengeState.lastCompletedDate === date) {
    dailyChallengeAttempt = null;
    return false;
  }
  var yesterday = new Date();
  yesterday.setHours(0, 0, 0, 0);
  yesterday.setDate(yesterday.getDate() - 1);
  dailyChallengeState.streak = dailyChallengeState.lastCompletedDate === localCalendarDate(yesterday)
    ? dailyChallengeState.streak + 1
    : 1;
  dailyChallengeState.lastCompletedDate = date;
  if (dailyChallengeState.completedWords.indexOf(word) === -1) {
    dailyChallengeState.completedWords.push(word);
  }
  dailyChallengeAttempt = null;
  dailyChallengeCompletionWord = word;
  persistDailyChallenge();
  return true;
}

function persistWordRewards() {
  var saved = true;
  try {
    localStorage.setItem(WORD_STICKERS_KEY, JSON.stringify(stickerState));
  } catch (err) {
    saved = false;
  }
  try {
    localStorage.setItem(DAILY_GOAL_KEY, JSON.stringify(dailyGoalState));
  } catch (err) {
    saved = false;
  }
  rewardsStorageAvailable = saved;
  renderWordRewards();
  if (!saved) {
    document.getElementById("live").textContent =
      "Your sticker and daily goal progress could not be saved in this browser.";
  }
  return saved;
}

function renderWordRewards() {
  var today = localCalendarDate(new Date());
  var isCompleteToday = dailyGoalState.lastCompletedDate === today;
  var dailyText = isCompleteToday
    ? "Daily goal complete: 1 word today" +
      " · " + dailyGoalState.streak + "-day streak"
    : "Daily goal: 1 word remaining today";
  ["word-daily-goal", "word-daily-goal-tracing", "word-daily-goal-completed"]
    .forEach(function (id) {
      var indicator = document.getElementById(id);
      if (indicator) indicator.textContent = dailyText;
    });

  ["word-storage-warning", "word-storage-warning-tracing", "word-storage-warning-completed"]
    .forEach(function (id) {
      var warning = document.getElementById(id);
      if (!warning) return;
      warning.hidden = rewardsStorageAvailable;
      warning.textContent =
        "Progress could not be saved. It will stay available only while this page is open.";
    });

  var shelf = document.getElementById("word-sticker-shelf");
  if (shelf) {
    shelf.replaceChildren();
    Object.keys(WORDS).forEach(function (word) {
      var earned = stickerState.stickers.indexOf(word) !== -1;
      var item = document.createElement("li");
      item.className = "wp-sticker" + (earned ? " is-earned" : "");
      item.setAttribute("aria-label", word + " sticker, " + (earned ? "earned" : "not earned"));

      var emoji = document.createElement("span");
      emoji.className = "wp-sticker-emoji";
      emoji.setAttribute("aria-hidden", "true");
      emoji.textContent = WORDS[word].emoji;
      var label = document.createElement("strong");
      label.textContent = word;
      var status = document.createElement("span");
      status.className = "wp-sticker-status";
      status.textContent = earned ? "Earned" : "Locked";
      item.appendChild(emoji);
      item.appendChild(label);
      item.appendChild(status);
      shelf.appendChild(item);
    });
  }

  var rewardMessage = document.getElementById("word-completion-reward");
  if (rewardMessage) {
    rewardMessage.hidden = !completionReward;
    if (completionReward) {
      rewardMessage.textContent = "You earned the " + completionReward + " sticker! " +
        WORDS[completionReward].emoji;
    }
  }
}

function scheduleRewardDateRefresh() {
  var now = new Date();
  var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  window.setTimeout(function () {
    renderWordRewards();
    renderDailyChallenge();
    scheduleRewardDateRefresh();
  }, Math.max(1000, tomorrow.getTime() - now.getTime()));
}

function recordWordCompletion(word) {
  var earnedSticker = stickerState.stickers.indexOf(word) === -1;
  if (earnedSticker) stickerState.stickers.push(word);

  var today = localCalendarDate(new Date());
  if (dailyGoalState.lastCompletedDate !== today) {
    var yesterday = new Date();
    yesterday.setHours(0, 0, 0, 0);
    yesterday.setDate(yesterday.getDate() - 1);
    dailyGoalState.streak = dailyGoalState.lastCompletedDate === localCalendarDate(yesterday)
      ? dailyGoalState.streak + 1
      : 1;
    dailyGoalState.lastCompletedDate = today;
  }
  persistWordRewards();
  return earnedSticker;
}

function persistWordSession() {
  if (!wordSession || wordSessionIsDailyChallenge) return;
  try {
    localStorage.setItem(WORD_STORAGE_KEY, JSON.stringify({
      word: wordSession.word,
      currentIndex: wordSession.currentIndex,
      completed: wordSession.completed
    }));
  } catch (err) {
    document.getElementById("live").textContent =
      "Your word practice progress could not be saved in this browser.";
  }
}

function persistNameSession() {
  if (!nameSession) return;
  try {
    localStorage.setItem(NAME_STORAGE_KEY, JSON.stringify({
      name: nameSession.name,
      currentIndex: nameSession.currentIndex,
      completed: nameSession.completed
    }));
  } catch (err) {
    document.getElementById("live").textContent =
      "Your name session could not be saved in this browser.";
  }
}

function clearNameSession() {
  nameSession = null;
  try {
    localStorage.removeItem(NAME_STORAGE_KEY);
  } catch (err) {
    document.getElementById("live").textContent =
      "The saved name session could not be removed from this browser.";
  }
}

function loadMinAccuracy() {
  try {
    var n = Number(localStorage.getItem(ACCURACY_KEY));
    if (localStorage.getItem(ACCURACY_KEY) !== null && n >= 0 && n <= 100) return Math.round(n);
  } catch (err) {}
  return 50;
}

var minAccuracy = loadMinAccuracy();

function setMinAccuracy(value) {
  minAccuracy = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  try { localStorage.setItem(ACCURACY_KEY, String(minAccuracy)); } catch (err) {}
  document.querySelectorAll(".accuracy-slider").forEach(function (el) { el.value = String(minAccuracy); });
  document.querySelectorAll(".accuracy-value").forEach(function (el) { el.textContent = minAccuracy + "%"; });
}

function showAccuracyFeedback(percent) {
  var dialog = document.getElementById("accuracy-dialog");
  document.getElementById("accuracy-dialog-message").textContent =
    "Your tracing matched " + percent + "%. This letter needs at least " +
    minAccuracy + "% to continue. Trace over the grey letter and try again!";
  dialog.showModal();
  document.getElementById("accuracy-dialog-close").focus();
}

// Returns true if the current letter passes (or is already done); otherwise warns.
function checkLetterAccuracy(session) {
  var live = document.getElementById("live");
  if (session.completed[session.currentIndex]) return true;
  if (!hasDrawingAttempt()) {
    live.textContent = "Trace the grey letter first, then tap Next.";
    return false;
  }
  var score = tracingScore();
  var percent = score ? Math.round(Math.min(score.accuracy, score.coverage) * 100) : 0;
  if (percent < minAccuracy) {
    live.textContent = "Accuracy " + percent + "% is below " + minAccuracy +
      "%. Clear and trace the letter more carefully, then tap Next.";
    showAccuracyFeedback(percent);
    return false;
  }
  session.completed[session.currentIndex] = true;
  return true;
}

function nameCompletionCount() {
  return nameSession ? nameSession.completed.filter(function (done) { return done; }).length : 0;
}

function nameIsComplete() {
  return !!nameSession && nameSession.completed.every(function (done) { return done; });
}

function wordCompletionCount() {
  return wordSession ? wordSession.completed.filter(function (done) { return done; }).length : 0;
}

function wordIsComplete() {
  return !!wordSession && wordSession.completed.every(function (done) { return done; });
}

function today() {
  var d = new Date();
  var month = String(d.getMonth() + 1);
  var day = String(d.getDate());
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return d.getFullYear() + "-" + month + "-" + day;
}

function persist() {
  state.completed = CHARACTERS.filter(function (ch) { return !!state.stars[ch]; });
  state.lastPlayed = today();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentIndex: state.currentIndex,
      stars: state.stars,
      completed: state.completed,
      lastPlayed: state.lastPlayed
    }));
    return true;
  } catch (err) {
    return false;
  }
}

function currentChar() {
  return CHARACTERS[state.currentIndex];
}

function tracingChar() {
  if (drawingMode === "word" && wordSession) {
    return wordSession.word.charAt(wordSession.currentIndex);
  }
  return currentChar();
}

function nextChar() {
  return CHARACTERS[(state.currentIndex + 1) % CHARACTERS.length];
}

function totalStars() {
  var total = 0;
  CHARACTERS.forEach(function (ch) { total += state.stars[ch] || 0; });
  return total;
}

function groupFor(ch) {
  if (ch >= "a" && ch <= "z") return "lower";
  if (ch >= "0" && ch <= "9") return "digit";
  return "upper";
}

function charsInGroup(group) {
  if (group === "lower") return CHARACTERS.slice(26, 52);
  if (group === "digit") return CHARACTERS.slice(52);
  return CHARACTERS.slice(0, 26);
}

function caseLabel(ch) {
  if (ch >= "a" && ch <= "z") return "Lowercase • " + ch.toUpperCase() + " " + ch;
  if (ch >= "0" && ch <= "9") return "Number • " + ch;
  return "Uppercase • " + ch + " " + ch.toLowerCase();
}

function renderLetter() {
  var ch = currentChar();
  var isDigit = groupFor(ch) === "digit";
  document.getElementById("guide").textContent = ch;
  document.getElementById("case-pill").textContent = caseLabel(ch);
  document.getElementById("phoneme").textContent = PHONEMES[ch] || ch;
  document.getElementById("trace-subtitle").textContent = (isDigit ? "Number " : "Letter ") + ch + " of 62 • Stars save automatically";
  canvas.setAttribute("aria-label", "Tracing canvas for " + (isDigit ? "number " : "letter ") + ch);
  hideSuccess();
  resetStrokeDemo();
  strokeDemoControls.hidden = !Object.prototype.hasOwnProperty.call(STROKE_ORDER, ch);
}

function renderProgress() {
  var done = state.completed.length;
  var stars = totalStars();
  var percent = Math.min(100, Math.round((stars / CHARACTERS.length) * 100));
  document.getElementById("nav-count").textContent = String(done);
  document.getElementById("practice-link").setAttribute("aria-label", "Practice, " + done + " of 62 characters done");
  document.getElementById("total-stars").textContent = String(stars);
  document.getElementById("stars-percent").textContent = percent + "%";
  document.getElementById("stars-fill").style.width = percent + "%";
  document.getElementById("stars-bar").setAttribute("aria-valuenow", String(percent));
  document.getElementById("done-label").textContent = done + " of 62 done";
  var meter = document.getElementById("meter-done");
  meter.style.width = (done / CHARACTERS.length) * 100 + "%";
  meter.classList.toggle("has-cap", done > 0 && done < CHARACTERS.length);
}

function updateNameEntryPreview() {
  var input = document.getElementById("name-input");
  var value = input.value.trim();
  var valid = /^[A-Za-z]{1,20}$/.test(value);
  var error = document.getElementById("name-error");
  var preview = document.getElementById("name-preview");
  var count = document.getElementById("name-preview-count");
  var message = "";

  if (!value) {
    message = "Enter 1 to 20 English letters to begin.";
  } else if (!valid) {
    message = "Use 1–20 English letters only. Spaces, numbers and symbols are not supported.";
  }
  error.textContent = message;
  input.setAttribute("aria-invalid", valid ? "false" : "true");
  document.getElementById("name-start").disabled = !valid;
  count.textContent = value.length + " " + (valid
    ? (value.length === 1 ? "letter" : "letters")
    : (value.length === 1 ? "character" : "characters"));
  preview.replaceChildren();
  Array.from(value).forEach(function (letter) {
    var tile = document.createElement("span");
    tile.className = "name-tile";
    tile.textContent = letter;
    preview.appendChild(tile);
  });
}

function setNameEntry(value) {
  document.getElementById("name-input").value = value || "";
  updateNameEntryPreview();
}

function nameTileStatus(index) {
  if (index === nameSession.currentIndex) return "current";
  if (nameSession.completed[index]) return "completed";
  return "upcoming";
}

function createNameTile(index, completedPage) {
  var letter = nameSession.name.charAt(index);
  var status = completedPage ? "completed" : nameTileStatus(index);
  var item = document.createElement(completedPage ? "span" : "li");

  if (completedPage) {
    item.className = "name-tile is-complete";
    item.textContent = letter;
    item.setAttribute("aria-label", "Letter " + (index + 1) + ", " + letter + ", completed");
    var completeMark = document.createElement("span");
    completeMark.className = "name-tile-status";
    completeMark.setAttribute("aria-hidden", "true");
    completeMark.textContent = "✓";
    item.appendChild(completeMark);
    return item;
  }

  item.className = "name-position-item";
  var isComplete = nameSession.completed[index];
  var button = document.createElement("button");
  button.type = "button";
  button.className = "name-tile" + (status === "current" ? " is-current" : "") +
    (isComplete ? " is-complete" : "");
  button.textContent = letter;
  var accessibleStatus = status === "current" && isComplete
    ? "current and completed"
    : (isComplete ? "completed" : status);
  button.setAttribute("aria-label", "Letter " + (index + 1) + " of " +
    nameSession.name.length + ", " + letter + ", " + accessibleStatus);
  if (status === "current") button.setAttribute("aria-current", "step");
  if (isComplete) {
    var statusMark = document.createElement("span");
    statusMark.className = "name-tile-status";
    statusMark.setAttribute("aria-hidden", "true");
    statusMark.textContent = "✓";
    button.appendChild(statusMark);
  }
  item.appendChild(button);
  return item;
}

function renderNameProgress() {
  if (!nameSession) return;
  document.getElementById("word-daily-goal-tracing").hidden = true;
  document.getElementById("word-storage-warning-tracing").hidden = true;
  var total = nameSession.name.length;
  var complete = nameCompletionCount();
  var percentage = (complete / total) * 100;
  var position = nameSession.currentIndex + 1;
  var previousButton = document.getElementById("prev-button");

  document.getElementById("name-tracing-title").textContent =
    "Write your name, " + nameSession.name + "!";
  document.getElementById("name-position").textContent =
    "Letter " + position + " of " + total;
  document.getElementById("name-overall-count").textContent =
    complete + " of " + total + " " + (total === 1 ? "letter" : "letters") + " completed";
  document.getElementById("name-progress-fill").style.width = percentage + "%";
  document.getElementById("name-progress-track").setAttribute("aria-valuenow", String(percentage));
  document.getElementById("name-done-count").textContent =
    complete + " of " + total + " " + (total === 1 ? "letter" : "letters") + " completed";
  document.getElementById("name-panel-meter").style.width = percentage + "%";
  document.getElementById("progress-title").textContent = "Your name";
  document.getElementById("name-progress-tiles").setAttribute("aria-label", "Letters in your name");
  document.getElementById("name-progress-track").setAttribute("aria-label", "Name tracing progress");
  document.getElementById("name-progress-card").setAttribute("aria-label", "Name progress");
  document.getElementById("change-name").textContent = "Change name";
  document.getElementById("name-encouragement").textContent =
    nameSession.completed[nameSession.currentIndex]
      ? "Lovely try! This letter is complete."
      : "Every letter is a little step. Keep going!";

  document.getElementById("guide").textContent = nameSession.name.charAt(nameSession.currentIndex);
  document.getElementById("follow-copy").textContent = "Trace over the grey letter.";
  canvas.setAttribute("aria-label", "Tracing canvas for letter " +
    nameSession.name.charAt(nameSession.currentIndex));

  previousButton.disabled = nameSession.currentIndex === 0;
  document.getElementById("previous-copy").textContent = "Previous";
  document.getElementById("clear-copy").textContent = "Clear";
  document.getElementById("done-copy").textContent = "Done";
  document.getElementById("next-copy").textContent =
    nameSession.currentIndex === total - 1 ? "Finish" : "Next";
  document.getElementById("next-arrow").textContent =
    nameSession.currentIndex === total - 1 ? "✓" : "→";

  var tiles = document.getElementById("name-progress-tiles");
  tiles.replaceChildren();
  for (var index = 0; index < total; index += 1) {
    tiles.appendChild(createNameTile(index, false));
  }
}

function renderNameCompleted() {
  if (!nameSession) return;
  document.getElementById("completed-name").textContent = nameSession.name;
  document.getElementById("completed-full-name").textContent = nameSession.name;
  var tiles = document.getElementById("completed-tiles");
  tiles.replaceChildren();
  for (var index = 0; index < nameSession.name.length; index += 1) {
    tiles.appendChild(createNameTile(index, true));
  }
}

function wordTileStatus(index) {
  if (index === wordSession.currentIndex) return "current";
  if (wordSession.completed[index]) return "completed";
  return "upcoming";
}

function renderDailyChallenge() {
  var date = localCalendarDate(new Date());
  if (dailyChallengeHeardDate !== date) {
    dailyChallengeHeard = false;
    dailyChallengeHeardDate = date;
    dailyChallengeAttempt = null;
  }
  var word = dailyChallengeWordForDate(date);
  var complete = dailyChallengeState.lastCompletedDate === date;
  var streak = dailyChallengeStreakForDate(date);
  document.getElementById("daily-challenge-word").textContent =
    complete ? word : "Listen to find out";
  document.getElementById("daily-challenge-emoji").textContent =
    complete ? WORDS[word].emoji : "🎧";
  document.getElementById("daily-challenge-status").textContent = complete
    ? "Complete today! Your daily badge is earned."
    : "Listen to the word, choose its picture, then trace it.";
  document.getElementById("daily-challenge-streak").textContent =
    "Streak: " + streak + " " + (streak === 1 ? "day" : "days");
  document.getElementById("daily-challenge-badges").textContent =
    "Word badges: " + dailyChallengeState.completedWords.length + " of " +
    DAILY_CHALLENGE_WORDS.length;
  document.getElementById("daily-challenge-listen").hidden = complete;

  var choices = document.getElementById("daily-challenge-choices");
  choices.replaceChildren();
  dailyChallengeChoicesFor(word, date).forEach(function (choice) {
    var button = document.createElement("button");
    var emoji = document.createElement("span");
    var label = document.createElement("span");
    button.type = "button";
    button.className = "daily-challenge-choice";
    button.setAttribute("data-daily-challenge-word", choice);
    button.setAttribute("aria-label", choice + " picture");
    emoji.className = "daily-challenge-choice-emoji";
    emoji.setAttribute("aria-hidden", "true");
    emoji.textContent = WORDS[choice].emoji;
    label.className = "daily-challenge-choice-word";
    label.textContent = choice;
    button.appendChild(emoji);
    button.appendChild(label);
    choices.appendChild(button);
  });
  choices.hidden = complete || !dailyChallengeHeard;
  document.getElementById("daily-challenge-feedback").textContent = "";
  var warning = document.getElementById("daily-challenge-storage-warning");
  warning.hidden = dailyChallengeStorageAvailable;
  warning.textContent =
    "Daily challenge progress could not be saved. It will stay available only while this page is open.";
}

function wordCountsByCategory() {
  var counts = { all: 0, animals: 0, food: 0, nature: 0, things: 0 };
  Object.keys(WORDS).forEach(function (word) {
    counts.all += 1;
    var category = WORDS[word].category;
    if (Object.prototype.hasOwnProperty.call(counts, category)) counts[category] += 1;
  });
  return counts;
}

function renderWordFilters() {
  var counts = wordCountsByCategory();
  var labels = {
    all: "All Words (" + counts.all + ")",
    animals: "Animals (" + counts.animals + ")",
    food: "Food (" + counts.food + ")",
    nature: "Nature (" + counts.nature + ")",
    things: "Everyday things (" + counts.things + ")"
  };
  Object.keys(labels).forEach(function (key) {
    var button = document.querySelector('[data-word-filter="' + key + '"]');
    if (!button) return;
    var selected = wordCategoryFilter === key;
    button.textContent = labels[key];
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", selected ? "true" : "false");
  });
  var animalsSection = document.getElementById("word-animals-section");
  var foodSection = document.getElementById("word-food-section");
  var natureSection = document.getElementById("word-nature-section");
  var thingsSection = document.getElementById("word-things-section");
  if (animalsSection) animalsSection.hidden = wordCategoryFilter !== "all" && wordCategoryFilter !== "animals";
  if (foodSection) foodSection.hidden = wordCategoryFilter !== "all" && wordCategoryFilter !== "food";
  if (natureSection) natureSection.hidden = wordCategoryFilter !== "all" && wordCategoryFilter !== "nature";
  if (thingsSection) thingsSection.hidden = wordCategoryFilter !== "all" && wordCategoryFilter !== "things";
  var animalsCount = document.getElementById("word-animals-count");
  var foodCount = document.getElementById("word-food-count");
  var natureCount = document.getElementById("word-nature-count");
  var thingsCount = document.getElementById("word-things-count");
  if (animalsCount) animalsCount.textContent = "(" + counts.animals + ")";
  if (foodCount) foodCount.textContent = "(" + counts.food + ")";
  if (natureCount) natureCount.textContent = "(" + counts.nature + ")";
  if (thingsCount) thingsCount.textContent = "(" + counts.things + ")";
}

function setWordCategoryFilter(next) {
  if (next !== "all" && next !== "animals" && next !== "food" && next !== "nature" && next !== "things") return;
  wordCategoryFilter = next;
  renderWordFilters();
  var button = document.querySelector('[data-word-filter="' + next + '"]');
  if (button) {
    document.getElementById("live").textContent = "Showing " + button.textContent + ".";
  }
}

function renderWordSelection() {
  renderWordRewards();
  renderDailyChallenge();
  renderWordFilters();
  var groups = {
    animals: document.getElementById("word-animals"),
    food: document.getElementById("word-food"),
    nature: document.getElementById("word-nature"),
    things: document.getElementById("word-things")
  };
  Object.keys(groups).forEach(function (category) {
    groups[category].replaceChildren();
  });

  Object.keys(WORDS).forEach(function (word) {
    var data = WORDS[word];
    var activeSession = wordSession && wordSession.word === word ? wordSession : null;
    var completed = activeSession
      ? activeSession.completed.filter(function (done) { return done; }).length
      : 0;
    var status = !activeSession ? "New word" :
      (completed === word.length ? "Completed" :
        "In progress · " + completed + " of " + word.length);
    var item = document.createElement("li");
    var button = document.createElement("button");
    var stage = document.createElement("span");
    var emoji = document.createElement("span");
    var badge = document.createElement("span");
    var name = document.createElement("span");
    var details = document.createElement("span");
    var phonics = document.createElement("span");
    var progress = document.createElement("span");

    button.type = "button";
    button.className = "wp-card";
    button.setAttribute("data-word", word);
    stage.className = "wp-card-stage";
    emoji.className = "wp-card-emoji";
    emoji.setAttribute("aria-hidden", "true");
    emoji.textContent = data.emoji;
    badge.className = "wp-card-status" +
      (activeSession && completed === word.length ? " is-complete" : "");
    badge.textContent = status;
    stage.appendChild(emoji);
    stage.appendChild(badge);
    name.className = "wp-card-word";
    name.textContent = word;
    details.className = "wp-card-meta";
    details.textContent = word.length + " letters · " + Array.from(word).join(" · ");
    phonics.className = "wp-card-phonics";
    phonics.textContent = "Phonics: " + data.phonics;
    progress.className = "wp-card-progress";
    progress.setAttribute("aria-hidden", "true");
    for (var index = 0; index < word.length; index += 1) {
      var dot = document.createElement("span");
      dot.className = "wp-progress-dot" +
        (activeSession && activeSession.completed[index] ? " is-complete" : "");
      progress.appendChild(dot);
    }

    var action = document.createElement("span");
    action.className = "wp-card-action";
    action.textContent = "Trace " + word + " →";
    button.appendChild(stage);
    button.appendChild(name);
    button.appendChild(details);
    button.appendChild(phonics);
    button.appendChild(progress);
    button.appendChild(action);
    item.appendChild(button);
    groups[data.category].appendChild(item);
  });
}

function renderWordProgress() {
  if (!wordSession) return;
  renderWordRewards();
  var challengeWarning = document.getElementById("daily-challenge-storage-warning-tracing");
  challengeWarning.hidden = dailyChallengeStorageAvailable;
  challengeWarning.textContent =
    "Daily challenge progress could not be saved. It will stay available only while this page is open.";
  document.getElementById("word-daily-goal-tracing").hidden = false;
  document.getElementById("word-storage-warning-tracing").hidden = rewardsStorageAvailable;
  var total = wordSession.word.length;
  var complete = wordCompletionCount();
  var percentage = (complete / total) * 100;
  var position = wordSession.currentIndex + 1;
  var letter = wordSession.word.charAt(wordSession.currentIndex);

  document.getElementById("name-tracing-title").textContent =
    "Let’s write " + wordSession.word + "!";
  document.getElementById("name-position").textContent =
    "Letter " + position + " of " + total;
  document.getElementById("name-overall-count").textContent =
    complete + " of " + total + " letters completed";
  document.getElementById("name-progress-fill").style.width = percentage + "%";
  document.getElementById("name-progress-track").setAttribute("aria-valuenow", String(percentage));
  document.getElementById("name-progress-track").setAttribute("aria-label", "Word tracing progress");
  document.getElementById("name-done-count").textContent =
    complete + " of " + total + " letters completed";
  document.getElementById("name-panel-meter").style.width = percentage + "%";
  document.getElementById("name-encouragement").textContent =
    wordSession.completed[wordSession.currentIndex]
      ? "Lovely try! This letter is complete."
      : "Trace each letter to finish your word!";
  document.getElementById("progress-title").textContent = "Your word";
  document.getElementById("name-progress-tiles").setAttribute("aria-label", "Letters in " + wordSession.word);
  document.getElementById("name-progress-card").setAttribute("aria-label", "Word progress");
  document.getElementById("change-name").textContent = "Choose another word";
  document.getElementById("guide").textContent = letter;
  document.getElementById("follow-copy").textContent = "Trace over the grey letter.";
  canvas.setAttribute("aria-label", "Tracing canvas for letter " + letter + " in " + wordSession.word);

  var previousButton = document.getElementById("prev-button");
  previousButton.disabled = wordSession.currentIndex === 0;
  document.getElementById("previous-copy").textContent = "Previous";
  document.getElementById("clear-copy").textContent = "Clear";
  document.getElementById("done-copy").textContent = "Done";
  document.getElementById("next-copy").textContent =
    wordSession.currentIndex === total - 1 ? "Finish" : "Next";
  document.getElementById("next-arrow").textContent =
    wordSession.currentIndex === total - 1 ? "✓" : "→";

  var tiles = document.getElementById("name-progress-tiles");
  tiles.replaceChildren();
  for (var index = 0; index < total; index += 1) {
    var status = wordTileStatus(index);
    var item = document.createElement("li");
    item.className = "name-position-item";
    var button = document.createElement("button");
    button.type = "button";
    button.className = "name-tile" + (status === "current" ? " is-current" : "") +
      (wordSession.completed[index] ? " is-complete" : "");
    button.textContent = wordSession.word.charAt(index);
    button.setAttribute("aria-label", "Letter " + (index + 1) + " of " +
      total + ", " + wordSession.word.charAt(index) + ", " + status);
    if (status === "current") button.setAttribute("aria-current", "step");
    if (wordSession.completed[index]) {
      var mark = document.createElement("span");
      mark.className = "name-tile-status";
      mark.setAttribute("aria-hidden", "true");
      mark.textContent = "✓";
      button.appendChild(mark);
    }
    item.appendChild(button);
    tiles.appendChild(item);
  }
}

function renderWordCompleted() {
  if (!wordSession) return;
  renderWordRewards();
  document.getElementById("daily-challenge-completion").hidden =
    dailyChallengeCompletionWord === null;
  if (dailyChallengeCompletionWord) {
    document.getElementById("daily-challenge-completion").textContent =
      "You completed " + dailyChallengeCompletionWord +
      " and earned today's daily challenge badge!";
  }
  var challengeWarning = document.getElementById("daily-challenge-storage-warning-completed");
  challengeWarning.hidden = dailyChallengeStorageAvailable;
  challengeWarning.textContent =
    "Daily challenge progress could not be saved. It will stay available only while this page is open.";
  document.getElementById("word-completed-name").textContent = wordSession.word;
  document.getElementById("word-completed-full-name").textContent = wordSession.word;
  document.getElementById("word-completed-emoji").textContent = WORDS[wordSession.word].emoji;
  var tiles = document.getElementById("word-completed-tiles");
  tiles.replaceChildren();
  Array.from(wordSession.word).forEach(function (letter, index) {
    var tile = document.createElement("span");
    tile.className = "name-tile is-complete";
    tile.textContent = letter;
    tile.setAttribute("aria-label", "Letter " + (index + 1) + ", " + letter + ", completed");
    var mark = document.createElement("span");
    mark.className = "name-tile-status";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = "✓";
    tile.appendChild(mark);
    tiles.appendChild(tile);
  });
}

function renderPicker(keepSelectedGroup) {
  var wanted = keepSelectedGroup ? pickerGroup : groupFor(currentChar());
  pickerGroup = wanted;
  document.querySelectorAll("[data-group]").forEach(function (tab) {
    var on = tab.getAttribute("data-group") === pickerGroup;
    tab.classList.toggle("is-active", on);
    tab.setAttribute("aria-selected", on ? "true" : "false");
  });
  var activeTab = document.querySelector('[data-group="' + pickerGroup + '"]');
  if (activeTab) {
    document.getElementById("letter-grid").setAttribute("aria-labelledby", activeTab.id);
  }
  var grid = document.getElementById("letter-grid");
  var html = "";
  charsInGroup(pickerGroup).forEach(function (ch) {
    var stars = state.stars[ch] || 0;
    var cls = "letter-key";
    if (ch === currentChar()) cls += " is-current";
    else if (stars === 3) cls += " is-star3";
    else if (stars === 2) cls += " is-star2";
    else if (stars === 1) cls += " is-star1";
    html += '<button type="button" class="' + cls + '" data-char="' + ch + '" aria-label="' + (groupFor(ch) === "digit" ? "Number " : "Letter ") + ch + (stars ? ", " + stars + " stars" : "") + '">' +
      ch +
      (stars ? '<span class="key-stars" aria-hidden="true">★' + stars + "</span>" : "") +
      "</button>";
  });
  grid.innerHTML = html;
  var active = grid.querySelector(".is-current");
  if (active) {
    var top = active.offsetTop;
    var bottom = top + active.offsetHeight;
    if (top < grid.scrollTop) grid.scrollTop = Math.max(0, top - 8);
    else if (bottom > grid.scrollTop + grid.clientHeight) {
      grid.scrollTop = bottom - grid.clientHeight + 8;
    }
  }
}

function renderChart() {
  var chart = document.getElementById("full-chart");
  var html = "";
  CHARACTERS.forEach(function (ch, index) {
    var pastel = PASTELS[index % PASTELS.length];
    var cls = "tile " + pastel;
    if (ch === currentChar()) cls += " is-current";
    if (state.stars[ch]) cls += " has-stars";
    var label = "Practise " + ch;
    if (state.stars[ch]) label += ", " + state.stars[ch] + " stars";
    html += '<button type="button" class="' + cls + '" data-char="' + ch + '" aria-label="' + label + '">' + ch + "</button>";
  });
  chart.innerHTML = html;
}

function setChartOpen(open) {
  var chart = document.getElementById("full-chart");
  chart.hidden = !open;
  var link = document.getElementById("open-chart");
  var more = document.getElementById("more-tile");
  link.setAttribute("aria-expanded", open ? "true" : "false");
  more.setAttribute("aria-expanded", open ? "true" : "false");
  link.textContent = open ? "Hide full chart" : "Open full A-Z chart";
  more.innerHTML = open ? "Less" : "+52<br>more";
}

function resizeCanvas() {
  var rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  var width = Math.max(1, Math.round(rect.width * dpr));
  var height = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  paint();
  resizeStrokeDemoCanvas();
}

function resizeStrokeDemoCanvas() {
  var rect = strokeDemoCanvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  var width = Math.max(1, Math.round(rect.width * dpr));
  var height = Math.max(1, Math.round(rect.height * dpr));
  if (strokeDemoCanvas.width !== width || strokeDemoCanvas.height !== height) {
    strokeDemoCanvas.width = width;
    strokeDemoCanvas.height = height;
    var completedCount = strokeDemoActive && !strokeDemoManual
      ? strokeDemoCurrentStroke
      : strokeDemoVisibleStrokes;
    var activeIndex = strokeDemoActive && !strokeDemoManual
      ? strokeDemoCurrentStroke
      : -1;
    drawStrokeDemoFrame(completedCount, activeIndex, strokeDemoProgress);
  }
}

function drawStrokeDemoFrame(completedCount, activeIndex, progress) {
  var paths = STROKE_ORDER[strokeDemoCharacter];
  var rect = strokeDemoCanvas.getBoundingClientRect();
  if (!strokeDemoContext || !paths || !rect.width || !rect.height) return;
  var dpr = strokeDemoCanvas.width / rect.width;
  var ctx = strokeDemoContext;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);
  paths.forEach(function (points, index) {
    if (index < completedCount) drawDemoStroke(ctx, points, 1, rect.width, rect.height);
    else if (index === activeIndex) drawDemoStroke(ctx, points, progress, rect.width, rect.height);
  });
  paths.forEach(function (points, index) {
    drawDemoStart(ctx, points[0], index + 1, rect.width, rect.height, index, paths);
  });
}

function drawDemoStroke(ctx, points, progress, width, height) {
  if (!points || points.length < 2 || progress <= 0) return;
  var lengths = [];
  var totalLength = 0;
  var i;
  for (i = 1; i < points.length; i += 1) {
    var from = strokeDemoPoint(points[i - 1], width, height);
    var to = strokeDemoPoint(points[i], width, height);
    var dx = to.x - from.x;
    var dy = to.y - from.y;
    var length = Math.sqrt(dx * dx + dy * dy);
    lengths.push(length);
    totalLength += length;
  }
  var remaining = totalLength * Math.min(progress, 1);
  var start = strokeDemoPoint(points[0], width, height);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  for (i = 0; i < lengths.length && remaining > 0; i += 1) {
    var segmentLength = lengths[i];
    var fraction = segmentLength ? Math.min(1, remaining / segmentLength) : 1;
    var segmentStart = strokeDemoPoint(points[i], width, height);
    var segmentEnd = strokeDemoPoint(points[i + 1], width, height);
    ctx.lineTo(
      segmentStart.x + (segmentEnd.x - segmentStart.x) * fraction,
      segmentStart.y + (segmentEnd.y - segmentStart.y) * fraction
    );
    remaining -= segmentLength * fraction;
    if (fraction < 1) break;
  }
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#16877f";
  ctx.stroke();
}

function strokeDemoPoint(point, width, height) {
  var character = strokeDemoCharacter || currentChar();
  var lower = groupFor(character) === "lower";
  var ascenders = "bdfhklt";
  var descenders = "fgjpqy";
  var top = lower && ascenders.indexOf(character) === -1 ? 0.37 : 0.25;
  var y = lower && descenders.indexOf(character) !== -1
    ? (point[1] <= 0.68
      ? top + point[1] / 0.68 * (0.71 - top)
      : 0.71 + (point[1] - 0.68) / 0.32 * 0.05)
    : top + point[1] * (0.71 - top);
  return {
    x: (0.33 + point[0] * 0.34) * width,
    y: y * height
  };
}

function drawDemoStart(ctx, point, number, width, height, index, paths) {
  var position = strokeDemoPoint(point, width, height);
  var x = position.x;
  var y = position.y;
  var markerX = x;
  var markerY = y;
  var overlapsPrevious = paths.slice(0, index).some(function (stroke) {
    var earlier = strokeDemoPoint(stroke[0], width, height);
    return Math.sqrt(Math.pow(earlier.x - x, 2) + Math.pow(earlier.y - y, 2)) < 26;
  });
  if (overlapsPrevious) markerX += 26;
  if (overlapsPrevious) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(markerX, markerY);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#245b58";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#245b58";
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(markerX, markerY, 12, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#245b58";
  ctx.stroke();
  ctx.fillStyle = "#173f3d";
  ctx.font = "700 13px Quicksand, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(number), markerX, markerY + 0.5);
}

function resetStrokeDemo() {
  if (strokeDemoFrame) window.cancelAnimationFrame(strokeDemoFrame);
  window.clearTimeout(strokeDemoTimer);
  strokeDemoFrame = 0;
  strokeDemoTimer = 0;
  strokeDemoActive = false;
  strokeDemoManual = false;
  strokeDemoCurrentStroke = 0;
  strokeDemoVisibleStrokes = 0;
  strokeDemoProgress = 0;
  strokeDemoCharacter = null;
  strokeDemoCanvas.classList.remove("is-fading");
  strokeDemoContext.clearRect(0, 0, strokeDemoCanvas.width, strokeDemoCanvas.height);
  strokeDemoStatus.hidden = true;
  strokeDemoStatus.textContent = "";
  var live = document.getElementById("live");
  if (live.textContent.indexOf("Stroke ") === 0 ||
      live.textContent === "Demonstration complete. You can trace the character now.") {
    live.textContent = "";
  }
  strokeStepButton.hidden = true;
  strokeDemoButton.textContent = "Watch how to write " + currentChar();
  document.getElementById("done-button").disabled = document.body.dataset.view !== "practice";
}

function startStrokeDemo() {
  var character = currentChar();
  var paths = STROKE_ORDER[character];
  if (!paths) return;
  resetStrokeDemo();
  strokeDemoCharacter = character;
  strokeDemoActive = true;
  strokeDemoButton.textContent = "Replay demonstration";
  strokeDemoStatus.hidden = false;
  document.getElementById("done-button").disabled = true;
  if (prefersReduced) {
    strokeDemoManual = true;
    strokeDemoVisibleStrokes = 1;
    drawStrokeDemoFrame(1, -1, 0);
    updateStrokeDemoStatus(1, paths.length);
    strokeStepButton.textContent = paths.length > 1 ? "Show next stroke" : "Finish demonstration";
    strokeStepButton.hidden = false;
    return;
  }
  strokeDemoCurrentStroke = 0;
  strokeDemoStartedAt = performance.now();
  updateStrokeDemoStatus(1, paths.length);
  strokeDemoFrame = window.requestAnimationFrame(animateStrokeDemo);
}

function updateStrokeDemoStatus(number, total) {
  var text = "Stroke " + number + " of " + total;
  strokeDemoStatus.textContent = text;
  var type = groupFor(strokeDemoCharacter) === "digit" ? "number " : "letter ";
  document.getElementById("live").textContent = text + " for " + type + strokeDemoCharacter + ".";
}

function animateStrokeDemo(now) {
  var paths = STROKE_ORDER[strokeDemoCharacter];
  if (!strokeDemoActive || !paths) return;
  var elapsed = now - strokeDemoStartedAt;
  strokeDemoProgress = Math.min(1, elapsed / strokeDemoDuration);
  drawStrokeDemoFrame(strokeDemoCurrentStroke, strokeDemoCurrentStroke, strokeDemoProgress);
  if (strokeDemoProgress >= 1) {
    strokeDemoCurrentStroke += 1;
    if (strokeDemoCurrentStroke >= paths.length) {
      drawStrokeDemoFrame(paths.length, -1, 0);
      finishStrokeDemo();
      return;
    }
    strokeDemoStartedAt = now;
    updateStrokeDemoStatus(strokeDemoCurrentStroke + 1, paths.length);
  }
  strokeDemoFrame = window.requestAnimationFrame(animateStrokeDemo);
}

function advanceStrokeDemo() {
  if (!strokeDemoManual || !strokeDemoActive) return;
  var paths = STROKE_ORDER[strokeDemoCharacter];
  if (strokeDemoVisibleStrokes < paths.length) {
    strokeDemoVisibleStrokes += 1;
    drawStrokeDemoFrame(strokeDemoVisibleStrokes, -1, 0);
    updateStrokeDemoStatus(strokeDemoVisibleStrokes, paths.length);
    strokeStepButton.textContent = strokeDemoVisibleStrokes < paths.length
      ? "Show next stroke"
      : "Finish demonstration";
    return;
  }
  finishStrokeDemo();
}

function finishStrokeDemo() {
  var paths = STROKE_ORDER[strokeDemoCharacter];
  strokeDemoActive = false;
  strokeDemoManual = false;
  strokeDemoFrame = 0;
  strokeDemoVisibleStrokes = paths.length;
  strokeDemoCurrentStroke = -1;
  strokeDemoProgress = 0;
  strokeStepButton.hidden = true;
  strokeDemoStatus.textContent = "Demonstration complete. You can trace the character now.";
  document.getElementById("live").textContent = strokeDemoStatus.textContent;
  document.getElementById("done-button").disabled = false;
  strokeDemoTimer = window.setTimeout(function () {
    strokeDemoCanvas.classList.add("is-fading");
    strokeDemoTimer = window.setTimeout(function () {
      strokeDemoContext.clearRect(0, 0, strokeDemoCanvas.width, strokeDemoCanvas.height);
      strokeDemoCanvas.classList.remove("is-fading");
      strokeDemoTimer = 0;
    }, 1000);
  }, 1000);
}

function paint() {
  var rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  var ctx = canvas.getContext("2d");
  if (!ctx) return;
  var dpr = canvas.width / rect.width;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);
  strokes.forEach(function (stroke) {
    drawStroke(ctx, stroke);
  });
}

function drawStroke(ctx, stroke) {
  var points = stroke.points;
  if (!points.length) return;
  ctx.lineWidth = stroke.width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#FF5A39";
  ctx.fillStyle = "#FF5A39";
  if (points.length === 1) {
    ctx.beginPath();
    ctx.arc(points[0].x, points[0].y, stroke.width / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  var i;
  for (i = 1; i < points.length - 1; i += 1) {
    var midX = (points[i].x + points[i + 1].x) / 2;
    var midY = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
  }
  var last = points[points.length - 1];
  ctx.lineTo(last.x, last.y);
  ctx.stroke();
}

function pointerPos(event) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function syncTools() {
  pencilButton.classList.toggle("is-on", tool === "pencil");
  brushButton.classList.toggle("is-on", tool === "brush");
  pencilButton.setAttribute("aria-pressed", tool === "pencil" ? "true" : "false");
  brushButton.setAttribute("aria-pressed", tool === "brush" ? "true" : "false");
  undoButton.disabled = strokes.length === 0;
}

function selectTool(nextTool, width) {
  tool = nextTool;
  strokeWidth = width;
  syncTools();
}

function clearInk() {
  strokes = [];
  if (drawingMode === "name") nameInk = strokes;
  else if (drawingMode === "word") wordInk = strokes;
  else practiceInk = strokes;
  activeStroke = null;
  drawing = false;
  paint();
  syncTools();
}

function switchDrawingMode(nextMode) {
  if (drawingMode === nextMode) return;
  if (drawingMode === "name") nameInk = strokes;
  else if (drawingMode === "word") wordInk = strokes;
  else practiceInk = strokes;
  drawingMode = nextMode;
  strokes = drawingMode === "name" ? nameInk :
    (drawingMode === "word" ? wordInk : practiceInk);
  activeStroke = null;
  drawing = false;
  paint();
  syncTools();
}

function goTo(index) {
  var len = CHARACTERS.length;
  state.currentIndex = ((index % len) + len) % len;
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  clearInk();
  renderAll();
  persist();
}

function openPracticeAt(ch) {
  var index = CHARACTERS.indexOf(ch);
  if (index >= 0) {
    state.currentIndex = index;
    clearInk();
    renderAll();
    persist();
  }
  if ((location.hash || "#home") === "#practice") {
    showView("practice");
    window.scrollTo(0, 0);
  } else {
    location.hash = "practice";
  }
}

function startNameSession() {
  var name = document.getElementById("name-input").value.trim();
  if (!/^[A-Za-z]{1,20}$/.test(name)) {
    updateNameEntryPreview();
    return;
  }
  if (nameSession && nameSession.name !== name &&
      (nameSession.currentIndex > 0 || nameCompletionCount() > 0) &&
      !window.confirm("Start a new name and leave this name session? Your completed letters will be cleared.")) {
    return;
  }
  nameSession = {
    name: name,
    currentIndex: 0,
    completed: Array.from(name).map(function () { return false; })
  };
  persistNameSession();
  if (location.hash === "#name") applyRoute();
  else location.hash = "name";
}

function startWordSession(word, options) {
  if (!Object.prototype.hasOwnProperty.call(WORDS, word)) return false;
  if (wordSession && wordSession.word !== word &&
      (wordSession.currentIndex > 0 || wordCompletionCount() > 0) &&
      !window.confirm("Start a new word and leave this word session? Your completed letters will be cleared.")) {
    return false;
  }
  if (!wordSession || wordSession.word !== word) {
    wordSession = {
      word: word,
      currentIndex: 0,
      completed: Array.from(word).map(function () { return false; })
    };
  } else if (options && options.dailyChallenge && wordIsComplete()) {
    wordSession.currentIndex = 0;
    wordSession.completed = Array.from(word).map(function () { return false; });
  }
  if (!options || !options.dailyChallenge) dailyChallengeAttempt = null;
  wordSessionIsDailyChallenge = !!(options && options.dailyChallenge);
  completionReward = null;
  dailyChallengeCompletionWord = null;
  persistWordSession();
  wordInk = [];
  clearInk();
  if (location.hash === "#words") applyRoute();
  else location.hash = "words";
  return true;
}

function navigateWordTo(index) {
  if (!wordSession || index < 0 || index >= wordSession.word.length ||
      index === wordSession.currentIndex) return;
  wordSession.currentIndex = index;
  persistWordSession();
  clearInk();
  renderWordProgress();
  resizeCanvas();
}

function hasDrawingAttempt() {
  return strokes.some(function (stroke) {
    if (stroke.points.length < 2) return false;
    var distance = 0;
    for (var pointIndex = 1; pointIndex < stroke.points.length; pointIndex += 1) {
      var previous = stroke.points[pointIndex - 1];
      var point = stroke.points[pointIndex];
      distance += Math.hypot(point.x - previous.x, point.y - previous.y);
    }
    return distance > 2;
  });
}

function navigateNameTo(index) {
  if (!nameSession || index < 0 || index >= nameSession.name.length ||
      index === nameSession.currentIndex) return;
  nameSession.currentIndex = index;
  persistNameSession();
  clearInk();
  renderNameProgress();
  resizeCanvas();
}

function onNameDone() {
  if (!nameSession) return;
  if (!hasDrawingAttempt()) {
    document.getElementById("live").textContent =
      "Trace the grey letter first, then tap Done.";
    return;
  }
  var letter = nameSession.name.charAt(nameSession.currentIndex);
  if (nameSession.completed[nameSession.currentIndex]) {
    document.getElementById("live").textContent =
      "You already completed this letter. Keep going!";
    return;
  }
  nameSession.completed[nameSession.currentIndex] = true;
  persistNameSession();
  renderNameProgress();
  document.getElementById("live").textContent =
    "Well done! You completed letter " + letter + ".";
}

function onWordDone() {
  if (!wordSession) return;
  if (!hasDrawingAttempt()) {
    document.getElementById("live").textContent =
      "Trace the grey letter first, then tap Done.";
    return;
  }
  if (wordSession.completed[wordSession.currentIndex]) {
    document.getElementById("live").textContent =
      "You already completed this letter. Keep going!";
    return;
  }
  var letter = wordSession.word.charAt(wordSession.currentIndex);
  wordSession.completed[wordSession.currentIndex] = true;
  persistWordSession();
  renderWordProgress();
  document.getElementById("live").textContent =
    "Well done! You completed letter " + letter + " in " + wordSession.word + ".";
}

function onNameNext() {
  if (!nameSession) return;
  if (!checkLetterAccuracy(nameSession)) return;
  persistNameSession();
  renderNameProgress();
  var lastIndex = nameSession.name.length - 1;
  if (nameSession.currentIndex < lastIndex) {
    navigateNameTo(nameSession.currentIndex + 1);
    return;
  }
  if (nameIsComplete()) {
    if (location.hash === "#name") applyRoute();
    return;
  }
  var incomplete = nameSession.completed.indexOf(false);
  document.getElementById("live").textContent =
    "A few letters are still waiting. Let’s visit the first one you have not completed.";
  navigateNameTo(incomplete);
}

function onWordNext() {
  if (!wordSession) return;
  if (!checkLetterAccuracy(wordSession)) return;
  persistWordSession();
  renderWordProgress();
  var lastIndex = wordSession.word.length - 1;
  if (wordSession.currentIndex < lastIndex) {
    navigateWordTo(wordSession.currentIndex + 1);
    return;
  }
  if (wordIsComplete()) {
    completionReward = wordSessionIsDailyChallenge
      ? null
      : (recordWordCompletion(wordSession.word) ? wordSession.word : null);
    var challengeCompleted = recordDailyChallengeCompletion(wordSession.word);
    if (location.hash === "#words") applyRoute();
    else location.hash = "words";
    var completionMessage = completionReward
      ? "You earned the " + completionReward + " sticker! "
      : "Word complete. ";
    if (!wordSessionIsDailyChallenge) completionMessage += "Today's daily goal is complete.";
    if (challengeCompleted) {
      completionMessage +=
        " You completed " + wordSession.word + " and earned today's daily challenge badge.";
      if (!dailyChallengeStorageAvailable) {
        completionMessage += " Your daily challenge progress could not be saved.";
      }
    }
    if (!rewardsStorageAvailable) {
      completionMessage += " Your sticker and daily goal progress could not be saved.";
    }
    document.getElementById("live").textContent = completionMessage;
    return;
  }
  var incomplete = wordSession.completed.indexOf(false);
  document.getElementById("live").textContent =
    "A few letters are still waiting. Let’s visit the first one you have not completed.";
  navigateWordTo(incomplete);
}

function chooseAnotherWord() {
  location.hash = "word-selection";
}

function traceWordAgain() {
  if (!wordSession) return;
  completionReward = null;
  dailyChallengeCompletionWord = null;
  dailyChallengeAttempt = null;
  wordSession.currentIndex = 0;
  wordSession.completed = Array.from(wordSession.word).map(function () { return false; });
  wordInk = [];
  persistWordSession();
  clearInk();
  if (location.hash === "#words") applyRoute();
  else location.hash = "words";
}

function changeName() {
  if (!nameSession) return;
  if (!window.confirm("Change your name? Your progress in this session will be cleared.")) {
    return;
  }
  var currentName = nameSession.name;
  clearNameSession();
  clearInk();
  setNameEntry(currentName);
  showView("name-entry");
  document.getElementById("name-input").focus();
}

function tryAnotherName() {
  clearNameSession();
  nameInk = [];
  clearInk();
  setNameEntry("");
  showView("name-entry");
  document.getElementById("name-input").focus();
}

function writeNameAgain() {
  if (!nameSession) return;
  nameSession.currentIndex = 0;
  nameSession.completed = Array.from(nameSession.name).map(function () { return false; });
  persistNameSession();
  nameInk = [];
  if (drawingMode === "name") clearInk();
  if (location.hash === "#name") applyRoute();
}

function tracingScore() {
  var rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height || !strokes.length) return null;

  var width = 220;
  var height = Math.max(1, Math.round(width * rect.height / rect.width));
  var scaleX = width / rect.width;
  var scaleY = height / rect.height;
  var targetCanvas = document.createElement("canvas");
  var inkCanvas = document.createElement("canvas");
  targetCanvas.width = width;
  targetCanvas.height = height;
  inkCanvas.width = width;
  inkCanvas.height = height;

  var targetContext = targetCanvas.getContext("2d");
  var inkContext = inkCanvas.getContext("2d");
  var guide = document.getElementById("guide");
  var stageRect = document.getElementById("stage").getBoundingClientRect();
  var guideRect = guide.getBoundingClientRect();
  var guideStyle = window.getComputedStyle(guide);
  var fontSize = parseFloat(guideStyle.fontSize);
  var font = [
    guideStyle.fontStyle,
    guideStyle.fontVariant,
    guideStyle.fontWeight,
    fontSize * scaleX + "px",
    guideStyle.fontFamily
  ].join(" ");

  targetContext.fillStyle = "#000";
  targetContext.font = font;
  targetContext.textAlign = "center";
  targetContext.textBaseline = "alphabetic";
  var character = tracingChar();
  var metrics = targetContext.measureText(character);
  var baseline = (guideRect.top - stageRect.top + guideRect.height / 2) * scaleY +
    (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) * scaleY / scaleX / 2;
  targetContext.fillText(
    character,
    (guideRect.left - stageRect.left + guideRect.width / 2) * scaleX,
    baseline
  );

  inkContext.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  strokes.forEach(function (stroke) {
    drawStroke(inkContext, stroke);
  });

  var target = maskFromCanvas(targetContext, width, height);
  var ink = maskFromCanvas(inkContext, width, height);
  var targetCount = countMask(target);
  var inkCount = countMask(ink);
  if (!targetCount || !inkCount) return null;

  var tolerance = Math.max(2, Math.round(6 * scaleX));
  var nearbyTarget = dilateMask(target, width, height, tolerance);
  var nearbyInk = dilateMask(ink, width, height, tolerance);
  var matchingInk = 0;
  var coveredTarget = 0;
  var i;
  for (i = 0; i < target.length; i += 1) {
    if (ink[i] && nearbyTarget[i]) matchingInk += 1;
    if (target[i] && nearbyInk[i]) coveredTarget += 1;
  }

  var accuracy = matchingInk / inkCount;
  var coverage = coveredTarget / targetCount;
  return {
    accuracy: accuracy,
    coverage: coverage,
    stars: starsForMatch(Math.min(accuracy, coverage))
  };
}

function maskFromCanvas(context, width, height) {
  var pixels = context.getImageData(0, 0, width, height).data;
  var mask = new Uint8Array(width * height);
  var i;
  for (i = 0; i < mask.length; i += 1) {
    if (pixels[i * 4 + 3] > 24) mask[i] = 1;
  }
  return mask;
}

function countMask(mask) {
  var count = 0;
  var i;
  for (i = 0; i < mask.length; i += 1) {
    if (mask[i]) count += 1;
  }
  return count;
}

function dilateMask(mask, width, height, radius) {
  var expanded = new Uint8Array(mask.length);
  var radiusSquared = radius * radius;
  var y;
  var x;
  for (y = 0; y < height; y += 1) {
    for (x = 0; x < width; x += 1) {
      if (!mask[y * width + x]) continue;
      var dy;
      var dx;
      for (dy = -radius; dy <= radius; dy += 1) {
        for (dx = -radius; dx <= radius; dx += 1) {
          if (dx * dx + dy * dy > radiusSquared) continue;
          var nearX = x + dx;
          var nearY = y + dy;
          if (nearX >= 0 && nearX < width && nearY >= 0 && nearY < height) {
            expanded[nearY * width + nearX] = 1;
          }
        }
      }
    }
  }
  return expanded;
}

function starsForMatch(match) {
  if (match >= 0.7) return 3;
  if (match >= 0.4) return 2;
  return 1;
}

function praise(stars) {
  if (stars >= 3) return { kicker: "Amazing!", award: "+3 stars" };
  if (stars === 2) return { kicker: "Great job!", award: "+2 stars" };
  return { kicker: "Nice tracing!", award: "+1 star" };
}

function detailFor(upcoming, score) {
  return "Guide match: " + Math.round(score.accuracy * 100) + "% accuracy, " +
    Math.round(score.coverage * 100) + "% coverage. Next: " + upcoming;
}

function hideSuccess() {
  document.getElementById("success-card").hidden = true;
}

function showSuccess(score, ch) {
  var upcoming = nextChar();
  var title = praise(score.stars);
  var detail = detailFor(upcoming, score);
  document.getElementById("success-kicker").textContent = title.kicker;
  document.getElementById("success-award").textContent = title.award;
  document.getElementById("success-detail").textContent = detail;
  document.getElementById("success-card").hidden = false;
  document.getElementById("live").textContent = title.kicker + " " + title.award + ". " + detail;
  chime();
  if (window.matchMedia("(max-width: 980px)").matches) {
    document.getElementById("success-card").scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "nearest"
    });
  }
}

function onDone() {
  if (strokeDemoActive) return;
  var ch = currentChar();
  var score = tracingScore();
  if (!score) {
    document.getElementById("live").textContent = "Trace the guide first, then tap Done to earn stars.";
    return;
  }
  var best = state.stars[ch] || 0;
  if (score.stars > best) state.stars[ch] = score.stars;
  state.completed = CHARACTERS.filter(function (letter) { return !!state.stars[letter]; });
  persist();
  renderProgress();
  renderPicker();
  renderChart();
  showSuccess(score, ch);
}

function chime() {
  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  try {
    var ctx = new AudioCtx();
    var now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach(function (freq, index) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now);
      var start = now + index * 0.08;
      gain.gain.exponentialRampToValueAtTime(0.06, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.3);
    });
    window.setTimeout(function () {
      if (ctx.close) ctx.close();
    }, 700);
  } catch (err) {
    return;
  }
}

function speakPhoneme() {
  if (!window.speechSynthesis) return;
  var ch = currentChar();
  var utterance = new SpeechSynthesisUtterance(PHONEMES[ch] || ch);
  utterance.rate = 0.86;
  utterance.pitch = 1.15;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function listenToDailyChallengeWord() {
  var date = localCalendarDate(new Date());
  if (dailyChallengeState.lastCompletedDate === date) return;
  var word = dailyChallengeWordForDate(date);
  dailyChallengeHeard = true;
  dailyChallengeHeardDate = date;
  renderDailyChallenge();
  var live = document.getElementById("live");
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
    live.textContent =
      "Audio is not available in this browser. You can still choose the matching picture.";
    return;
  }
  try {
    var utterance = new window.SpeechSynthesisUtterance(word.toLowerCase());
    utterance.rate = 0.82;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    live.textContent = "Listen to the word, then choose the matching picture.";
  } catch (err) {
    live.textContent =
      "Audio could not play in this browser. You can still choose the matching picture.";
  }
}

function chooseDailyChallengeWord(word) {
  var date = localCalendarDate(new Date());
  var correctWord = dailyChallengeWordForDate(date);
  if (dailyChallengeState.lastCompletedDate === date) {
    document.getElementById("live").textContent = "Today's challenge is already complete.";
    return;
  }
  if (!dailyChallengeHeard || dailyChallengeHeardDate !== date) {
    document.getElementById("live").textContent = "Listen to today's word before choosing a picture.";
    return;
  }
  if (word !== correctWord) {
    document.getElementById("daily-challenge-feedback").textContent =
      "Not that picture. Listen again and try another choice.";
    document.getElementById("live").textContent =
      "Not that picture. Listen again and try another choice.";
    return;
  }
  document.getElementById("daily-challenge-feedback").textContent =
    "That's right! Now trace " + correctWord + ".";
  if (!startWordSession(correctWord, { dailyChallenge: true })) return;
  dailyChallengeAttempt = { date: date, word: correctWord };
  dailyChallengeHeard = false;
  document.getElementById("live").textContent =
    "That's right! Now trace " + correctWord + " one letter at a time.";
}

function renderAll() {
  renderLetter();
  renderProgress();
  renderPicker();
  renderChart();
  syncTools();
  if (!document.getElementById("view-practice").hidden) resizeCanvas();
}

function showView(name) {
  var previousView = document.body.dataset.view;
  var practice = name === "practice";
  var nameTracing = name === "name-tracing";
  var wordTracing = name === "word-tracing";
  var nameEntry = name === "name-entry";
  var nameCompleted = name === "name-completed";
  var wordSelection = name === "word-selection";
  var wordCompleted = name === "word-completed";
  var inPractice = practice || nameTracing || wordTracing;
  var navName = wordTracing || wordSelection || wordCompleted ? "words" :
    (nameTracing || nameEntry || nameCompleted ? "name" : (practice ? "practice" : "home"));
  var guidedTracing = nameTracing || wordTracing;

  var nextDrawingMode = nameTracing ? "name" : (wordTracing ? "word" : "practice");
  if (drawingMode !== nextDrawingMode) {
    switchDrawingMode(nextDrawingMode);
  }
  document.getElementById("view-home").hidden =
    inPractice || nameEntry || nameCompleted || wordSelection || wordCompleted;
  document.getElementById("view-practice").hidden = !inPractice;
  document.getElementById("done-button").hidden = guidedTracing;
  document.getElementById("view-name").hidden = !nameEntry && !nameCompleted;
  document.getElementById("name-entry-view").hidden = !nameEntry;
  document.getElementById("name-completed-view").hidden = !nameCompleted;
  document.getElementById("view-word-selection").hidden = !wordSelection;
  document.getElementById("view-word-completed").hidden = !wordCompleted;
  document.getElementById("name-tracing-head").hidden = !guidedTracing;
  document.getElementById("practice-head").hidden = guidedTracing;
  document.querySelector(".picker-card").hidden = guidedTracing;
  document.getElementById("name-progress-card").hidden = !guidedTracing;
  document.querySelector(".practice-side").setAttribute("aria-label",
    nameTracing ? "Name progress" : (wordTracing ? "Word progress" : "Character picker"));
  document.body.dataset.view = name;
  document.body.classList.toggle("name-tracing", guidedTracing);
  document.body.classList.toggle("word-tracing", wordTracing);
  strokeDemoControls.hidden = !practice ||
    !Object.prototype.hasOwnProperty.call(STROKE_ORDER, currentChar());
  if (strokeDemoControls.hidden) resetStrokeDemo();
  document.getElementById("done-button").disabled = guidedTracing || strokeDemoActive;
  document.title = wordSelection || wordTracing || wordCompleted ? "Word Practice • Kids Tracing" :
    (nameTracing ? "Write My Name • Kids Tracing" :
    (nameEntry || nameCompleted ? "Write My Name • Kids Tracing" :
      (practice ? "Practice • Kids Tracing" : "Kids Tracing Practice")));
  if (practice && typeof previousView === "string" &&
      (previousView.indexOf("name-") === 0 || previousView.indexOf("word-") === 0)) {
    renderLetter();
  }
  document.querySelectorAll("[data-nav]").forEach(function (link) {
    var on = link.getAttribute("data-nav") === navName;
    link.classList.toggle("is-active", on);
    if (on) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  if (inPractice) window.requestAnimationFrame(resizeCanvas);
}

function applyRoute() {
  var hash = (location.hash || "#home").replace("#", "");
  if (hash === "practice") {
    showView("practice");
    window.scrollTo(0, 0);
    return;
  }
  if (hash === "name") {
    if (nameSession && nameIsComplete()) {
      showView("name-completed");
      renderNameCompleted();
    } else if (nameSession) {
      showView("name-tracing");
      renderNameProgress();
    } else {
      showView("name-entry");
      updateNameEntryPreview();
    }
    window.scrollTo(0, 0);
    return;
  }
  if (hash === "words") {
    if (wordSession && wordIsComplete()) {
      showView("word-completed");
      renderWordCompleted();
    } else if (wordSession) {
      showView("word-tracing");
      renderWordProgress();
    } else {
      showView("word-selection");
      renderWordSelection();
    }
    window.scrollTo(0, 0);
    return;
  }
  if (hash === "word-selection") {
    showView("word-selection");
    renderWordSelection();
    window.scrollTo(0, 0);
    return;
  }
  showView("home");
  if (hash === "parents") {
    var note = document.getElementById("parents-note");
    window.setTimeout(function () {
      note.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
    }, 40);
    note.classList.add("is-highlight");
    window.setTimeout(function () { note.classList.remove("is-highlight"); }, 1800);
    return;
  }
  if (hash === "home") window.scrollTo(0, 0);
}

function onSave() {
  var button = document.getElementById("save-button");
  var ok = persist();
  button.textContent = ok ? "Saved" : "Save unavailable";
  document.getElementById("live").textContent = ok
    ? "Progress saved in this browser."
    : "Progress could not be saved in this browser.";
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(function () {
    button.textContent = "Save progress";
  }, 1600);
}

canvas.addEventListener("pointerdown", function (event) {
  if (strokeDemoActive) return;
  if (event.pointerType === "mouse" && event.button !== 0) return;
  canvas.setPointerCapture(event.pointerId);
  drawing = true;
  activeStroke = { width: strokeWidth, points: [pointerPos(event)] };
  strokes.push(activeStroke);
  paint();
  syncTools();
  event.preventDefault();
});

canvas.addEventListener("pointermove", function (event) {
  if (!drawing || !activeStroke) return;
  activeStroke.points.push(pointerPos(event));
  paint();
  event.preventDefault();
});

function endDraw(event) {
  if (!drawing) return;
  drawing = false;
  activeStroke = null;
  syncTools();
  if (event && event.preventDefault) event.preventDefault();
}

canvas.addEventListener("pointerup", endDraw);
canvas.addEventListener("pointercancel", endDraw);
canvas.addEventListener("contextmenu", function (event) { event.preventDefault(); });

document.getElementById("tool-pencil").addEventListener("click", function () {
  selectTool("pencil", 16);
});
document.getElementById("tool-brush").addEventListener("click", function () {
  selectTool("brush", 28);
});
document.getElementById("tool-thinner").addEventListener("click", function () {
  strokeWidth = Math.max(8, strokeWidth - 6);
});
undoButton.addEventListener("click", function () {
  strokes.pop();
  paint();
  syncTools();
});

document.getElementById("prev-button").addEventListener("click", function () {
  if (document.body.dataset.view === "name-tracing") {
    navigateNameTo(nameSession.currentIndex - 1);
    return;
  }
  if (document.body.dataset.view === "word-tracing") {
    navigateWordTo(wordSession.currentIndex - 1);
    return;
  }
  goTo(state.currentIndex - 1);
});
document.getElementById("next-button").addEventListener("click", function () {
  if (document.body.dataset.view === "name-tracing") {
    onNameNext();
    return;
  }
  if (document.body.dataset.view === "word-tracing") {
    onWordNext();
    return;
  }
  goTo(state.currentIndex + 1);
});
document.getElementById("clear-button").addEventListener("click", clearInk);
document.getElementById("accuracy-dialog-close").addEventListener("click", function () {
  document.getElementById("accuracy-dialog").close();
});
document.getElementById("done-button").addEventListener("click", function () {
  if (strokeDemoActive) return;
  if (document.body.dataset.view === "name-tracing") onNameDone();
  else if (document.body.dataset.view === "word-tracing") onWordDone();
  else onDone();
});
strokeDemoButton.addEventListener("click", startStrokeDemo);
strokeStepButton.addEventListener("click", advanceStrokeDemo);
document.getElementById("keep-going").addEventListener("click", function () {
  goTo(state.currentIndex + 1);
});
document.getElementById("hear-button").addEventListener("click", speakPhoneme);
document.getElementById("back-home").addEventListener("click", function () {
  location.hash = "home";
});
document.getElementById("save-button").addEventListener("click", onSave);
document.getElementById("name-input").addEventListener("input", updateNameEntryPreview);
document.querySelectorAll(".accuracy-slider").forEach(function (el) {
  el.addEventListener("input", function () { setMinAccuracy(el.value); });
});
setMinAccuracy(minAccuracy);
document.getElementById("name-clear").addEventListener("click", function () {
  setNameEntry("");
  document.getElementById("name-input").focus();
});
document.getElementById("name-start").addEventListener("click", startNameSession);
document.getElementById("change-name").addEventListener("click", function () {
  if (document.body.dataset.view === "word-tracing") chooseAnotherWord();
  else changeName();
});
document.getElementById("try-another-name").addEventListener("click", tryAnotherName);
document.getElementById("write-again").addEventListener("click", writeNameAgain);
document.getElementById("word-again").addEventListener("click", traceWordAgain);
document.getElementById("choose-another-word").addEventListener("click", chooseAnotherWord);
document.getElementById("name-progress-tiles").addEventListener("click", function (event) {
  var button = event.target.closest("button");
  if (!button) return;
  var tile = button.parentElement;
  var index = Array.prototype.indexOf.call(tile.parentElement.children, tile);
  if (document.body.dataset.view === "word-tracing") navigateWordTo(index);
  else navigateNameTo(index);
  var activeTile = document.querySelectorAll("#name-progress-tiles li")[index];
  if (activeTile) activeTile.querySelector("button").focus();
});
document.getElementById("view-word-selection").addEventListener("click", function (event) {
  var filter = event.target.closest("[data-word-filter]");
  if (filter && event.currentTarget.contains(filter)) {
    setWordCategoryFilter(filter.getAttribute("data-word-filter"));
    return;
  }
  var card = event.target.closest("[data-word]");
  if (card && event.currentTarget.contains(card)) startWordSession(card.getAttribute("data-word"));
});
document.getElementById("daily-challenge-listen").addEventListener("click", listenToDailyChallengeWord);
document.getElementById("daily-challenge-choices").addEventListener("click", function (event) {
  var choice = event.target.closest("[data-daily-challenge-word]");
  if (choice && event.currentTarget.contains(choice)) {
    chooseDailyChallengeWord(choice.getAttribute("data-daily-challenge-word"));
  }
});
document.getElementById("how-button").addEventListener("click", function () {
  if ((location.hash || "#home") !== "#home" && location.hash !== "") {
    location.hash = "home";
  }
  window.setTimeout(function () {
    document.getElementById("how-it-works").scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start"
    });
  }, 30);
});

document.getElementById("open-chart").addEventListener("click", function () {
  setChartOpen(document.getElementById("full-chart").hidden);
});
document.getElementById("more-tile").addEventListener("click", function () {
  setChartOpen(document.getElementById("full-chart").hidden);
});

document.getElementById("preview-tiles").addEventListener("click", function (event) {
  var tile = event.target.closest("[data-char]");
  if (!tile || !document.getElementById("preview-tiles").contains(tile)) return;
  openPracticeAt(tile.getAttribute("data-char"));
});
document.getElementById("full-chart").addEventListener("click", function (event) {
  var tile = event.target.closest("[data-char]");
  if (!tile) return;
  openPracticeAt(tile.getAttribute("data-char"));
});
document.getElementById("letter-grid").addEventListener("click", function (event) {
  var key = event.target.closest("[data-char]");
  if (!key) return;
  goTo(CHARACTERS.indexOf(key.getAttribute("data-char")));
});

document.querySelectorAll("[data-group]").forEach(function (tab) {
  tab.addEventListener("click", function () {
    pickerGroup = tab.getAttribute("data-group");
    renderPicker(true);
  });
});

window.addEventListener("hashchange", applyRoute);
window.addEventListener("resize", function () {
  if (!document.getElementById("view-practice").hidden) resizeCanvas();
});

if (window.ResizeObserver) {
  var observer = new ResizeObserver(function () {
    if (!document.getElementById("view-practice").hidden) resizeCanvas();
  });
  observer.observe(document.getElementById("stage"));
}

renderAll();
applyRoute();
scheduleRewardDateRefresh();

"use strict";

var STORAGE_KEY = "kids-tracing-progress";
var CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
var PASTELS = ["pink", "sky", "mint"];
var LETTER_STROKES = {
  A: [[[10, 90], [50, 10], [90, 90]], [[28, 60], [72, 60]]],
  B: [[[15, 90], [15, 10]], [[15, 10], [62, 10], [82, 20], [82, 34], [65, 47], [15, 47]], [[15, 47], [66, 47], [86, 60], [86, 77], [67, 90], [15, 90]]],
  C: [[[86, 20], [70, 10], [45, 10], [25, 22], [15, 42], [15, 62], [27, 80], [47, 90], [70, 88], [86, 78]]],
  D: [[[15, 90], [15, 10]], [[15, 10], [52, 10], [75, 22], [87, 42], [87, 60], [75, 79], [52, 90], [15, 90]]],
  E: [[[82, 10], [15, 10], [15, 90], [84, 90]], [[15, 49], [68, 49]]],
  F: [[[15, 90], [15, 10], [84, 10]], [[15, 49], [68, 49]]],
  G: [[[84, 22], [68, 10], [45, 10], [25, 22], [15, 42], [15, 62], [27, 80], [48, 90], [72, 86], [86, 74], [86, 55], [58, 55]]],
  H: [[[15, 10], [15, 90]], [[85, 10], [85, 90]], [[15, 50], [85, 50]]],
  I: [[[15, 10], [85, 10]], [[50, 10], [50, 90]], [[15, 90], [85, 90]]],
  J: [[[70, 10], [84, 10], [84, 67], [76, 84], [59, 90], [38, 90], [22, 80], [16, 67]]],
  K: [[[15, 10], [15, 90]], [[83, 10], [18, 53], [86, 90]]],
  L: [[[15, 10], [15, 90], [85, 90]]],
  M: [[[12, 90], [12, 10], [50, 52], [88, 10], [88, 90]]],
  N: [[[15, 90], [15, 10], [85, 90], [85, 10]]],
  O: [[[50, 10], [72, 12], [87, 30], [90, 50], [86, 70], [70, 87], [50, 90], [30, 87], [14, 70], [10, 50], [14, 30], [30, 12], [50, 10]]],
  P: [[[15, 90], [15, 10]], [[15, 10], [63, 10], [83, 22], [83, 38], [65, 50], [15, 50]]],
  Q: [[[50, 10], [72, 12], [87, 30], [90, 50], [86, 70], [70, 87], [50, 90], [30, 87], [14, 70], [10, 50], [14, 30], [30, 12], [50, 10]], [[62, 70], [88, 92]]],
  R: [[[15, 90], [15, 10]], [[15, 10], [63, 10], [83, 22], [83, 37], [66, 50], [15, 50]], [[52, 50], [86, 90]]],
  S: [[[84, 18], [68, 10], [43, 10], [24, 21], [17, 36], [28, 47], [50, 51], [73, 56], [84, 68], [77, 82], [58, 90], [34, 89], [16, 80]]],
  T: [[[12, 10], [88, 10]], [[50, 10], [50, 90]]],
  U: [[[15, 10], [15, 65], [23, 82], [40, 90], [60, 90], [78, 82], [85, 65], [85, 10]]],
  V: [[[12, 10], [50, 90], [88, 10]]],
  W: [[[10, 10], [25, 90], [50, 48], [75, 90], [90, 10]]],
  X: [[[15, 10], [85, 90]], [[85, 10], [15, 90]]],
  Y: [[[15, 10], [50, 48], [85, 10]], [[50, 48], [50, 90]]],
  Z: [[[15, 10], [85, 10], [15, 90], [85, 90]]],
  a: [[[72, 36], [60, 27], [42, 27], [26, 37], [18, 53], [20, 70], [32, 83], [49, 87], [65, 80], [72, 68]], [[72, 28], [72, 87]]],
  b: [[[25, 10], [25, 90]], [[25, 58], [36, 36], [53, 29], [69, 34], [80, 48], [80, 66], [70, 81], [54, 87], [38, 81], [25, 67]]],
  c: [[[80, 38], [65, 28], [46, 28], [29, 38], [20, 54], [24, 71], [39, 84], [59, 87], [78, 78]]],
  d: [[[75, 10], [75, 87]], [[75, 58], [64, 36], [47, 29], [31, 35], [21, 49], [21, 67], [31, 81], [48, 87], [64, 80], [75, 67]]],
  e: [[[20, 56], [78, 56], [76, 43], [65, 32], [49, 28], [33, 35], [22, 49], [21, 66], [32, 81], [49, 87], [67, 83], [79, 74]]],
  f: [[[68, 10], [55, 10], [45, 20], [45, 90]], [[27, 40], [68, 40]]],
  g: [[[73, 36], [61, 28], [44, 29], [29, 38], [21, 53], [23, 68], [34, 80], [50, 84], [66, 77], [73, 65]], [[73, 30], [73, 83], [67, 97], [53, 100], [37, 97], [28, 90]]],
  h: [[[24, 10], [24, 90]], [[24, 53], [36, 36], [52, 29], [67, 33], [76, 46], [76, 90]]],
  i: [[[50, 40], [50, 88]], [[50, 10], [56, 12], [58, 16], [55, 20], [49, 20], [46, 16], [50, 10]]],
  j: [[[54, 40], [54, 83], [49, 96], [37, 100], [26, 94]], [[54, 10], [60, 12], [62, 16], [59, 20], [53, 20], [50, 16], [54, 10]]],
  k: [[[25, 10], [25, 90]], [[76, 31], [27, 59], [80, 89]]],
  l: [[[50, 10], [50, 90]]],
  m: [[[15, 90], [15, 30]], [[15, 50], [26, 36], [40, 30], [52, 36], [56, 49], [56, 90]], [[56, 50], [68, 36], [81, 31], [91, 38], [94, 52], [94, 90]]],
  n: [[[22, 90], [22, 30]], [[22, 52], [35, 36], [52, 30], [68, 34], [78, 47], [78, 90]]],
  o: [[[50, 28], [68, 31], [80, 44], [82, 61], [73, 77], [57, 86], [40, 84], [25, 74], [19, 58], [24, 42], [37, 31], [50, 28]]],
  p: [[[25, 30], [25, 100]], [[25, 54], [36, 36], [52, 30], [68, 35], [78, 49], [78, 66], [68, 81], [52, 87], [36, 81], [25, 67]]],
  q: [[[75, 30], [75, 100]], [[75, 55], [64, 37], [48, 30], [32, 35], [22, 49], [22, 66], [32, 81], [48, 87], [64, 81], [75, 67]]],
  r: [[[25, 90], [25, 30]], [[25, 53], [39, 36], [56, 31], [75, 36]]],
  s: [[[77, 36], [64, 29], [46, 29], [31, 37], [30, 47], [43, 54], [62, 58], [76, 66], [73, 77], [58, 85], [39, 85], [24, 78]]],
  t: [[[50, 15], [50, 73], [55, 85], [68, 88], [78, 82]], [[30, 40], [72, 40]]],
  u: [[[23, 30], [23, 66], [30, 81], [44, 87], [59, 81], [74, 65]], [[74, 30], [74, 88]]],
  v: [[[18, 30], [50, 88], [82, 30]]],
  w: [[[12, 30], [27, 88], [50, 55], [73, 88], [88, 30]]],
  x: [[[22, 30], [78, 88]], [[78, 30], [22, 88]]],
  y: [[[18, 30], [49, 76], [80, 30]], [[49, 76], [39, 96], [25, 100]]],
  z: [[[10, 12], [90, 12]], [[90, 12], [10, 88]], [[10, 88], [90, 88]]],
  0: [[[50, 10], [70, 14], [85, 30], [90, 50], [85, 70], [70, 86], [50, 90], [30, 86], [15, 70], [10, 50], [15, 30], [30, 14], [50, 10]]],
  1: [[[32, 26], [50, 10], [50, 90]]],
  2: [[[15, 25], [27, 12], [50, 10], [72, 16], [85, 30], [83, 44], [70, 56], [15, 90], [85, 90]]],
  3: [[[20, 15], [50, 10], [75, 15], [85, 30], [78, 43], [60, 50], [75, 55], [86, 69], [80, 83], [60, 90], [30, 88], [15, 80]]],
  4: [[[65, 90], [65, 10], [15, 60], [85, 60]]],
  5: [[[80, 10], [20, 10], [18, 45], [55, 42], [75, 50], [85, 66], [80, 81], [62, 90], [38, 90], [18, 82]]],
  6: [[[75, 15], [57, 10], [38, 18], [22, 36], [15, 59], [18, 76], [32, 87], [54, 90], [73, 82], [85, 66], [80, 52], [64, 45], [42, 47], [20, 60]]],
  7: [[[15, 12], [85, 12], [40, 90]]],
  8: [[[50, 50], [70, 46], [82, 32], [76, 18], [60, 10], [40, 10], [24, 18], [18, 32], [28, 44], [50, 50], [70, 55], [83, 68], [75, 83], [58, 90], [40, 90], [22, 82], [17, 68], [30, 55], [50, 50]]],
  9: [[[75, 50], [62, 57], [42, 58], [25, 49], [18, 35], [22, 20], [39, 11], [60, 12], [76, 23], [83, 40], [80, 62], [68, 80], [50, 90]]]
};

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

var canvas = document.getElementById("trace-canvas");
var guideDots = document.getElementById("guide-dots");
var undoButton = document.getElementById("tool-undo");
var pencilButton = document.getElementById("tool-pencil");
var brushButton = document.getElementById("tool-brush");

var state = loadProgress();
var strokes = [];
var drawing = false;
var activeStroke = null;
var tool = "pencil";
var strokeWidth = 16;
var pickerGroup = "upper";
var saveTimer = 0;
var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

function renderGuide(ch) {
  var guide = document.getElementById("guide");
  var svg = guideDots;
  var bounds = svg.getBoundingClientRect();
  var range = document.createRange();
  range.selectNodeContents(guide);
  var textBounds = range.getBoundingClientRect();
  var scale = 2;
  var mask = document.createElement("canvas");
  mask.width = Math.max(1, Math.ceil(bounds.width * scale));
  mask.height = Math.max(1, Math.ceil(bounds.height * scale));
  var ctx = mask.getContext("2d");
  var dotsMatrix = svg.getScreenCTM();
  if (!ctx || !dotsMatrix || !bounds.width || !bounds.height || !textBounds.width) {
    guideDots.innerHTML = "";
    return;
  }

  var style = window.getComputedStyle(guide);
  ctx.scale(scale, scale);
  ctx.font = [style.fontStyle, style.fontWeight, style.fontSize, style.fontFamily].join(" ");
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#000";
  var metrics = ctx.measureText(ch);
  var anchorX = textBounds.left - bounds.left;
  var fontAscent = metrics.fontBoundingBoxAscent || parseFloat(style.fontSize);
  var baselineY = textBounds.top - bounds.top + fontAscent;
  ctx.fillText(ch, anchorX, baselineY);

  var pixels = ctx.getImageData(0, 0, mask.width, mask.height);
  var glyphLeft = Math.max(0, Math.floor((anchorX - metrics.actualBoundingBoxLeft) * scale));
  var glyphRight = Math.min(mask.width, Math.ceil((anchorX + metrics.actualBoundingBoxRight) * scale));
  var glyphTop = Math.max(0, Math.floor((baselineY - metrics.actualBoundingBoxAscent) * scale));
  var glyphBottom = Math.min(mask.height, Math.ceil((baselineY + metrics.actualBoundingBoxDescent) * scale));
  var markup = "";
  var point = svg.createSVGPoint();
  var inverse = dotsMatrix.inverse();

  function toLocal(x, y) {
    point.x = bounds.left + x;
    point.y = bounds.top + y;
    return point.matrixTransform(inverse);
  }

  function addDot(x, y, isStart) {
    var local = toLocal(x, y);
    markup += '<circle cx="' + local.x.toFixed(2) + '" cy="' + local.y.toFixed(2) +
      '" r="' + (isStart ? "2.5" : "1.15") + '" fill="' +
      (isStart ? "none" : "#12B3A6") + '"' +
      (isStart ? ' stroke="#FF4F37" stroke-width="1.15"' : "") + '/>';
    if (isStart) {
      markup += '<circle cx="' + local.x.toFixed(2) + '" cy="' + local.y.toFixed(2) +
        '" r="0.75" fill="#FF4F37"/>';
    }
  }

  function addEndDot(x, y) {
    var local = toLocal(x, y);
    markup += '<circle cx="' + local.x.toFixed(2) + '" cy="' + local.y.toFixed(2) +
      '" r="2.5" fill="#FFB020" stroke="#fff" stroke-width="0.8"/>';
  }

  function addStep(points, number) {
    var segments = [];
    var distance = 0;
    var segmentIndex;
    for (segmentIndex = 1; segmentIndex < points.length; segmentIndex += 1) {
      var segmentLength = Math.sqrt(
        Math.pow(points[segmentIndex][0] - points[segmentIndex - 1][0], 2) +
        Math.pow(points[segmentIndex][1] - points[segmentIndex - 1][1], 2)
      );
      segments.push({ length: segmentLength, start: distance });
      distance += segmentLength;
    }
    var count = Math.max(2, Math.floor(distance / 14));
    var i;
    for (i = 0; i <= count; i += 1) {
      var target = distance * i / count;
      var segment = segments[segments.length - 1];
      var j;
      for (j = 0; j < segments.length; j += 1) {
        if (target <= segments[j].start + segments[j].length) {
          segment = segments[j];
          break;
        }
      }
      var ratio = segment.length ? (target - segment.start) / segment.length : 0;
      var start = points[segments.indexOf(segment)];
      var end = points[segments.indexOf(segment) + 1];
      addDot(
        start[0] + (end[0] - start[0]) * ratio,
        start[1] + (end[1] - start[1]) * ratio,
        i === 0
      );
    }
    var first = points[0];
    var last = points[points.length - 1];
    addEndDot(last[0], last[1]);
    var badge = toLocal(first[0], first[1]);
    var radius = 7 / Math.sqrt(dotsMatrix.a * dotsMatrix.a + dotsMatrix.b * dotsMatrix.b);
    var fontSize = radius * 1.2;
    markup += '<circle cx="' + badge.x.toFixed(2) + '" cy="' + badge.y.toFixed(2) +
      '" r="' + radius.toFixed(2) + '" fill="#2E2118" stroke="#fff" stroke-width="' +
      (1 / Math.sqrt(dotsMatrix.a * dotsMatrix.a + dotsMatrix.b * dotsMatrix.b)).toFixed(2) + '"/>';
    markup += '<text x="' + badge.x.toFixed(2) + '" y="' + badge.y.toFixed(2) +
      '" text-anchor="middle" dominant-baseline="central" fill="#fff" font-family="sans-serif" font-size="' +
      fontSize.toFixed(2) + '" font-weight="700">' + number + '</text>';
  }

  if (Object.prototype.hasOwnProperty.call(LETTER_STROKES, ch)) {
    var glyphWidth = (metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight);
    var glyphHeight = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);
    if (glyphWidth > 0 && glyphHeight > 0) {
      LETTER_STROKES[ch].forEach(function (stroke, index) {
        var points = stroke.map(function (coords) {
          return [
            anchorX - metrics.actualBoundingBoxLeft + glyphWidth * coords[0] / 100,
            baselineY - metrics.actualBoundingBoxAscent + glyphHeight * coords[1] / 100
          ];
        });
        addStep(points, index + 1);
      });
    }
    guideDots.innerHTML = markup;
    return;
  }

  var bandCount = 8;
  var band;
  var endX = 0;
  var endY = 0;

  for (band = 0; band < bandCount; band += 1) {
    var bandTop = glyphTop + Math.floor((glyphBottom - glyphTop) * band / bandCount);
    var bandBottom = glyphTop + Math.floor((glyphBottom - glyphTop) * (band + 1) / bandCount);
    var bestY = -1;
    var bestWidth = 0;
    var bestLeft = 0;
    var bestRight = 0;
    var row;
    for (row = bandTop; row < bandBottom; row += 1) {
      var first = -1;
      var last = -1;
      var col;
      for (col = glyphLeft; col < glyphRight; col += 1) {
        if (pixels.data[(row * mask.width + col) * 4 + 3] > 64) {
          if (first < 0) first = col;
          last = col;
        }
      }
      if (first >= 0 && last - first > bestWidth) {
        bestY = row;
        bestWidth = last - first;
        bestLeft = first;
        bestRight = last;
      }
    }
    if (bestY < 0) continue;

    var edgeOrder = band % 2 === 0 ? [bestLeft, bestRight] : [bestRight, bestLeft];
    edgeOrder.forEach(function (x) {
      addDot((x + 0.5) / scale, (bestY + 0.5) / scale, markup === "");
      endX = (x + 0.5) / scale;
      endY = (bestY + 0.5) / scale;
    });
  }
  if (markup) addEndDot(endX, endY);
  guideDots.innerHTML = markup;
}

function renderLetter() {
  var ch = currentChar();
  var isDigit = groupFor(ch) === "digit";
  document.getElementById("guide").textContent = ch;
  document.getElementById("case-pill").textContent = caseLabel(ch);
  document.getElementById("phoneme").textContent = PHONEMES[ch] || ch;
  document.getElementById("trace-subtitle").textContent = (isDigit ? "Number " : "Letter ") + ch + " of 62 • Stars save automatically";
  canvas.setAttribute("aria-label", "Tracing canvas for " + (isDigit ? "number " : "letter ") + ch);
  document.getElementById("follow-copy").textContent = LETTER_STROKES[ch]
    ? "Follow each numbered stroke — start at red, finish at gold!"
    : "Follow the dots — red start, gold finish!";
  renderGuide(ch);
  hideSuccess();
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

function strokeLength() {
  var total = 0;
  strokes.forEach(function (stroke) {
    var points = stroke.points;
    var i;
    for (i = 1; i < points.length; i += 1) {
      var dx = points[i].x - points[i - 1].x;
      var dy = points[i].y - points[i - 1].y;
      total += Math.sqrt(dx * dx + dy * dy);
    }
  });
  return total;
}

function starsForLength(length) {
  if (length < 90) return 1;
  if (length < 240) return 2;
  return 3;
}

function praise(stars) {
  if (stars >= 3) return { kicker: "Amazing!", award: "+3 stars" };
  if (stars === 2) return { kicker: "Great job!", award: "+2 stars" };
  return { kicker: "Nice tracing!", award: "+1 star" };
}

function detailFor(stars, ch, upcoming) {
  if (stars >= 3) return "You traced " + ch + " perfectly. Next: " + upcoming;
  if (stars === 2) return "You traced " + ch + " really well. Next: " + upcoming;
  return "You traced " + ch + ". Next: " + upcoming;
}

function hideSuccess() {
  document.getElementById("success-card").hidden = true;
}

function showSuccess(stars, ch) {
  var upcoming = nextChar();
  var title = praise(stars);
  var detail = detailFor(stars, ch, upcoming);
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
  var ch = currentChar();
  var earned = starsForLength(strokeLength());
  var best = state.stars[ch] || 0;
  if (earned > best) state.stars[ch] = earned;
  state.completed = CHARACTERS.filter(function (letter) { return !!state.stars[letter]; });
  persist();
  renderProgress();
  renderPicker();
  renderChart();
  showSuccess(earned, ch);
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

function renderAll() {
  renderLetter();
  renderProgress();
  renderPicker();
  renderChart();
  syncTools();
  if (!document.getElementById("view-practice").hidden) resizeCanvas();
}

function showView(name) {
  var practice = name === "practice";
  document.getElementById("view-home").hidden = practice;
  document.getElementById("view-practice").hidden = !practice;
  document.body.dataset.view = practice ? "practice" : "home";
  document.title = practice ? "Practice • Kids Tracing" : "Kids Tracing Practice";
  document.querySelectorAll("[data-nav]").forEach(function (link) {
    var on = link.getAttribute("data-nav") === (practice ? "practice" : "home");
    link.classList.toggle("is-active", on);
    if (on) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  if (practice) {
    renderGuide(currentChar());
    window.requestAnimationFrame(resizeCanvas);
  }
}

function applyRoute() {
  var hash = (location.hash || "#home").replace("#", "");
  if (hash === "practice") {
    showView("practice");
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
  goTo(state.currentIndex - 1);
});
document.getElementById("next-button").addEventListener("click", function () {
  goTo(state.currentIndex + 1);
});
document.getElementById("clear-button").addEventListener("click", clearInk);
document.getElementById("done-button").addEventListener("click", onDone);
document.getElementById("keep-going").addEventListener("click", function () {
  goTo(state.currentIndex + 1);
});
document.getElementById("hear-button").addEventListener("click", speakPhoneme);
document.getElementById("back-home").addEventListener("click", function () {
  location.hash = "home";
});
document.getElementById("save-button").addEventListener("click", onSave);
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

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(function () {
    if (!document.getElementById("view-practice").hidden) renderGuide(currentChar());
  });
}

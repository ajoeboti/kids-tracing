"use strict";

var STORAGE_KEY = "kids-tracing-progress";
var CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
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
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000";
  ctx.fillText(ch, textBounds.left - bounds.left, (textBounds.top + textBounds.bottom) / 2 - bounds.top);

  var pixels = ctx.getImageData(0, 0, mask.width, mask.height);
  var left = Math.max(0, Math.floor((textBounds.left - bounds.left) * scale));
  var right = Math.min(mask.width, Math.ceil((textBounds.right - bounds.left) * scale));
  var top = Math.max(0, Math.floor((textBounds.top - bounds.top) * scale));
  var bottom = Math.min(mask.height, Math.ceil((textBounds.bottom - bounds.top) * scale));
  var markup = "";
  var point = svg.createSVGPoint();
  var inverse = dotsMatrix.inverse();
  var bandCount = 8;
  var band;

  for (band = 0; band < bandCount; band += 1) {
    var bandTop = top + Math.floor((bottom - top) * band / bandCount);
    var bandBottom = top + Math.floor((bottom - top) * (band + 1) / bandCount);
    var bestY = -1;
    var bestWidth = 0;
    var bestLeft = 0;
    var bestRight = 0;
    var row;
    for (row = bandTop; row < bandBottom; row += 1) {
      var first = -1;
      var last = -1;
      var col;
      for (col = left; col < right; col += 1) {
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
      point.x = bounds.left + (x + 0.5) / scale;
      point.y = bounds.top + (bestY + 0.5) / scale;
      var local = point.matrixTransform(inverse);
      var isStart = markup === "";
      markup += '<circle cx="' + local.x.toFixed(2) + '" cy="' + local.y.toFixed(2) +
        '" r="' + (isStart ? "2.5" : "1.15") + '" fill="' +
        (isStart ? "none" : "#12B3A6") + '"' +
        (isStart ? ' stroke="#FF4F37" stroke-width="1.15"' : "") + '/>';
      if (isStart) {
        markup += '<circle cx="' + local.x.toFixed(2) + '" cy="' + local.y.toFixed(2) +
          '" r="0.75" fill="#FF4F37"/>';
      }
    });
  }
  guideDots.innerHTML = markup;
}

function renderLetter() {
  var ch = currentChar();
  document.getElementById("guide").textContent = ch;
  document.getElementById("case-pill").textContent = caseLabel(ch);
  document.getElementById("phoneme").textContent = PHONEMES[ch] || ch;
  document.getElementById("trace-subtitle").textContent = "Letter " + ch + " of 62 • Stars save automatically";
  canvas.setAttribute("aria-label", "Tracing canvas for letter " + ch);
  renderGuide(ch);
  hideSuccess();
}

function renderProgress() {
  var done = state.completed.length;
  var stars = totalStars();
  var percent = Math.min(100, Math.round((stars / CHARACTERS.length) * 100));
  document.getElementById("nav-count").textContent = String(done);
  document.getElementById("practice-link").setAttribute("aria-label", "Practice, " + done + " of 62 letters done");
  document.getElementById("total-stars").textContent = String(stars);
  document.getElementById("stars-percent").textContent = percent + "%";
  document.getElementById("stars-fill").style.width = percent + "%";
  document.getElementById("stars-bar").setAttribute("aria-valuenow", String(percent));
  document.getElementById("done-label").textContent = done + " of 62 done";
  var meter = document.getElementById("meter-done");
  meter.style.width = (done / CHARACTERS.length) * 100 + "%";
  meter.classList.toggle("has-cap", done > 0 && done < CHARACTERS.length);
}

function renderPicker() {
  var wanted = groupFor(currentChar());
  if (wanted !== pickerGroup) {
    pickerGroup = wanted;
    document.querySelectorAll("[data-group]").forEach(function (tab) {
      var on = tab.getAttribute("data-group") === pickerGroup;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
    });
  }
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
    html += '<button type="button" class="' + cls + '" data-char="' + ch + '" aria-label="Letter ' + ch + (stars ? ", " + stars + " stars" : "") + '">' +
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
    document.querySelectorAll("[data-group]").forEach(function (button) {
      var on = button === tab;
      button.classList.toggle("is-active", on);
      button.setAttribute("aria-selected", on ? "true" : "false");
    });
    document.getElementById("letter-grid").setAttribute("aria-labelledby", tab.id);
    var grid = document.getElementById("letter-grid");
    var html = "";
    charsInGroup(pickerGroup).forEach(function (ch) {
      var stars = state.stars[ch] || 0;
      var cls = "letter-key";
      if (ch === currentChar()) cls += " is-current";
      else if (stars === 3) cls += " is-star3";
      else if (stars === 2) cls += " is-star2";
      else if (stars === 1) cls += " is-star1";
      html += '<button type="button" class="' + cls + '" data-char="' + ch + '" aria-label="Letter ' + ch + (stars ? ", " + stars + " stars" : "") + '">' +
        ch +
        (stars ? '<span class="key-stars" aria-hidden="true">★' + stars + "</span>" : "") +
        "</button>";
    });
    grid.innerHTML = html;
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

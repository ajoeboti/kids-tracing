"use strict";

var STORAGE_KEY = "kids-tracing-progress";
var NAME_STORAGE_KEY = "kids-tracing-name-session-v1";
var WORD_STORAGE_KEY = "kids-tracing-word-session-v1";
var CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
var WORDS = {
  CAT: { emoji: "🐱", category: "animals", phonics: "/k/ /æ/ /t/" },
  DOG: { emoji: "🐶", category: "animals", phonics: "/d/ /ɒ/ /ɡ/" },
  PIG: { emoji: "🐷", category: "animals", phonics: "/p/ /ɪ/ /ɡ/" },
  BUS: { emoji: "🚌", category: "things", phonics: "/b/ /ʌ/ /s/" },
  CAR: { emoji: "🚗", category: "things", phonics: "/k/ /ɑːr/" },
  HAT: { emoji: "🎩", category: "things", phonics: "/h/ /æ/ /t/" }
};
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

var canvas = document.getElementById("trace-canvas");
var undoButton = document.getElementById("tool-undo");
var pencilButton = document.getElementById("tool-pencil");
var brushButton = document.getElementById("tool-brush");

var state = loadProgress();
var nameSession = loadNameSession();
var wordSession = loadWordSession();
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

function persistWordSession() {
  if (!wordSession) return;
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

function renderWordSelection() {
  var groups = {
    animals: document.getElementById("word-animals"),
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

function startWordSession(word) {
  if (!Object.prototype.hasOwnProperty.call(WORDS, word)) return;
  if (wordSession && wordSession.word !== word &&
      (wordSession.currentIndex > 0 || wordCompletionCount() > 0) &&
      !window.confirm("Start a new word and leave this word session? Your completed letters will be cleared.")) {
    return;
  }
  if (!wordSession || wordSession.word !== word) {
    wordSession = {
      word: word,
      currentIndex: 0,
      completed: Array.from(word).map(function () { return false; })
    };
  }
  persistWordSession();
  wordInk = [];
  clearInk();
  if (location.hash === "#words") applyRoute();
  else location.hash = "words";
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
    if (location.hash === "#words") applyRoute();
    else location.hash = "words";
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
  if (document.body.dataset.view === "name-tracing") onNameDone();
  else if (document.body.dataset.view === "word-tracing") onWordDone();
  else onDone();
});
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
  var card = event.target.closest("[data-word]");
  if (card && event.currentTarget.contains(card)) startWordSession(card.getAttribute("data-word"));
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

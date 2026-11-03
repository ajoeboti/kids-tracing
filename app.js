"use strict";

var guide = document.getElementById("guide");
var progress = document.getElementById("progress");
var canvas = document.getElementById("trace-canvas");
var prevButton = document.getElementById("prev-button");
var clearButton = document.getElementById("clear-button");
var nextButton = document.getElementById("next-button");

function showStaticPractice() {
  guide.textContent = "A";
  progress.textContent = "1 / 62";
}

function onPrevious() {}

function onNext() {}

function onClear() {
  var context = canvas.getContext("2d");
  if (!context) {
    return;
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
}

prevButton.addEventListener("click", onPrevious);
clearButton.addEventListener("click", onClear);
nextButton.addEventListener("click", onNext);

showStaticPractice();

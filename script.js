const wordDisplay = document.getElementById("wordDisplay");
const hintText = document.getElementById("hintText");
const hintImage = document.getElementById("hintImage");
const guessInput = document.getElementById("guessInput");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const timerEl = document.getElementById("timer");
const levelSelect = document.getElementById("level");
const restartBtn = document.getElementById("restartBtn");
const speakBtn = document.getElementById("speakBtn");

let currentWord = "";
let guessedLetters = [];
let score = 0;
let timer = 10;
let timerInterval;

// Load sounds
const correctSound = new Audio("sounds/correct.mp3");
const wrongSound = new Audio("sounds/wrong.mp3");

function startGame() {
  clearInterval(timerInterval);
  timer = 10;
  timerEl.textContent = timer;
  guessedLetters = [];

  const level = levelSelect.value;
  const list = words[level];
  const item = list[Math.floor(Math.random() * list.length)];
  currentWord = item.word.toLowerCase();

  hintText.textContent = "🖼️ হিন্ট: " + item.hint;
  hintImage.src = item.image;

  updateDisplay();
  startTimer();
}

function updateDisplay() {
  wordDisplay.textContent = currentWord
    .split("")
    .map((ch) => (guessedLetters.includes(ch) ? ch : "_"))
    .join(" ");
}

function startTimer() {
  timerInterval = setInterval(() => {
    timer--;
    timerEl.textContent = timer;
    if (timer <= 0) {
      clearInterval(timerInterval);
      wrongSound.play();
      alert(`⏰ সময় শেষ! শব্দ ছিল: ${currentWord}`);
      startGame();
    }
  }, 1000);
}

guessInput.addEventListener("input", () => {
  const letter = guessInput.value.toLowerCase();
  guessInput.value = "";

  if (letter && !guessedLetters.includes(letter)) {
    guessedLetters.push(letter);
    if (currentWord.includes(letter)) {
      correctSound.play();
      wordDisplay.classList.add("correct");
      setTimeout(() => wordDisplay.classList.remove("correct"), 500);
    } else {
      wrongSound.play();
      wordDisplay.classList.add("wrong");
      setTimeout(() => wordDisplay.classList.remove("wrong"), 500);
    }

    updateDisplay();

    if (currentWord.split("").every((ch) => guessedLetters.includes(ch))) {
      score++;
      scoreEl.textContent = score;
      updateHighScore();
      startGame();
    }
  }
});

function updateHighScore() {
  const high = parseInt(localStorage.getItem("guessHighScore") || "0");
  if (score > high) {
    localStorage.setItem("guessHighScore", score);
    highScoreEl.textContent = score;
  }
}

speakBtn.addEventListener("click", () => {
  const utter = new SpeechSynthesisUtterance(currentWord);
  utter.lang = "en-US";
  speechSynthesis.speak(utter);
});

restartBtn.addEventListener("click", () => {
  score = 0;
  scoreEl.textContent = score;
  startGame();
});

// Initial Setup
highScoreEl.textContent = localStorage.getItem("guessHighScore") || "0";
startGame();

const exitBtn = document.getElementById("exitBtn");

exitBtn.addEventListener("click", () => {
  clearInterval(timerInterval); // টাইমার বন্ধ
  guessInput.disabled = true;   // ইনপুট বন্ধ
  wordDisplay.textContent = "✅ ধন্যবাদ! আপনি গেমটি বন্ধ করেছেন।";
  hintText.textContent = "";
  hintImage.src = "";
});

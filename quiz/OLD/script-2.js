"use strict";

const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");

const questionNumberElement = document.getElementById("question-number");
const scoreElement = document.getElementById("score");
const correctButtonElement = document.querySelector(".btn");

let shuffledQuestions, currentQuestionIndex;
let items;
let numberOfCorrectAnswers = 0;

let questions;

fetch("questions.json")
  .then((response) => response.json())
  .then((data) => {
    questions = data;
    startButton.disabled = false; // Enable start button once questions are loaded
  })
  .catch((error) => console.error("Error loading questions:", error));

startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;

  setNextQuestion();
});

function startGame() {
  if (!questions) {
    console.error("Questions not loaded yet");
    return;
  }
  startButton.classList.add("hide");
  shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);

  numberOfCorrectAnswers = 0;
  scoreElement.innerText = `Poäng: ${numberOfCorrectAnswers} `;
  currentQuestionIndex = 0;
  questionContainerElement.classList.remove("hide");
  setNextQuestion();
}

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

function showQuestion(question) {
  questionElement.innerText = question.question;
  questionNumberElement.innerText = `Fråga ${currentQuestionIndex + 1} av ${
    shuffledQuestions.length
  }`;

  shuffleArray(question.answers).forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");

    if (answer.correct) {
      button.dataset.correct = answer.correct;
      console.log(button.dataset.correct, answer.correct);
      console.log(numberOfCorrectAnswers);
    }
    button.addEventListener("click", selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

function resetState() {
  clearStatusClass(document.body);
  nextButton.classList.add("hide");
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct;
  if (correct) {
    numberOfCorrectAnswers++;
  }
  console.log("correct: " + correct);
  setStatusClass(document.body, correct);
  Array.from(answerButtonsElement.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct);
    button.disabled = true;
  });
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
  } else {
    startButton.innerText = "Slut på quizet - Vill du starta om?";
    startButton.style.fontSize = "2rem";
    startButton.classList.remove("hide");
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element);

  if (correct) {
    element.classList.add("correct");
    scoreElement.innerText = `Poäng: ${numberOfCorrectAnswers} `;
  } else {
    element.classList.add("wrong");
  }
}

function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}

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
    //HERE

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

/*const questions = [
  {
    question: "När skapades WWW",
    answers: [
      { text: "Början av 90-talet", correct: false },
      { text: "Slutet av 90-talet", correct: false },
      { text: "Slutet av 80-talet", correct: true },
    ],
  },
  {
    question: "Vad heter den första populära grafiska webbläsaren?",
    answers: [
      { text: "Netscape", correct: false },
      { text: " Mosaic", correct: true },
      { text: " Internet Explorer", correct: false },
    ],
  },
  {
    question: "Vilket av följande var INTE ett problem med XHTML?",
    answers: [
      { text: "JavaScript funkar inte", correct: false },
      { text: "Man kunde på Yellow screen of death", correct: false },
      { text: "Det var långsammare", correct: true },
    ],
  },
  {
    question: "Varför tog man fram CSS?",
    answers: [
      { text: "För att skilja design från innehåll", correct: true },
      { text: " För att webbläsarna blev snabbare", correct: false },
      { text: "W3C krävde det av webbläsartillverkarna", correct: false },
    ],
  },
  {
    question: "Vad kan du inte göra med Webben idag i Sverige?",
    answers: [
      { text: "Köpa böcker", correct: false },
      { text: "Ta fram sin sjukhusjournaler", correct: false },
      { text: " Rösta i val", correct: true },
    ],
  },
  {
    question: "Vad gör DNS?",
    answers: [
      { text: "Översätter IP-adresser till domännamn", correct: true },
      { text: "Översätter IP-adresser till HTML", correct: false },
      { text: "Översätter IP-adresser till CSS", correct: false },
      { text: " Översätter IP-adresser till JavaScript", correct: false },
    ],
  },
  {
    question: "Varför använder man URL?",
    answers: [
      { text: "Det är lättare att komma ihåg text än siffror", correct: true },
      { text: "Det är snabbare", correct: false },
      { text: "Det är säkrare", correct: false },
      { text: "Det är lättare att komma ihåg siffror än text", correct: false },
    ],
  },
  {
    question: "Exempel på extern länk",
    answers: [
      { text: '<a href="https://paubel.se/"> Länk </a>', correct: true },
      { text: '<a href=mapp/index.html"> Länk </a>', correct: false },
      { text: '<link href="http://paubel.se/"> Länk </a>', correct: false },
      { text: '<link href="/mapp/index.html"> Länk </link>', correct: false },
    ],
  },
  {
    question: "Hur bör externa länkar öppnas?",
    answers: [
      { text: "i en ny flik i samma webbläsarfönster", correct: true },
      { text: "i samma flik som som du är i", correct: false },
      { text: " i ett nytt webbläsarfönster", correct: false },
    ],
  },
  {
    question:
      "Vad är ett webbpubliceringssystem, CMS (Content Management System)",
    answers: [
      {
        text: "Programvara som hjälper användare att skapa, hantera och ändra innehåll på en webbplats utan behov av specialiserad teknisk kunskap",
        correct: true,
      },
      {
        text: "Programvara som hjälper användare att koda, hantera och ändra innehåll på en webbplats med  HTML, CSS och JavaScript",
        correct: false,
      },
      {
        text: "Programvara som hjälper användare att hantera olika versioner av din webbplats",
        correct: false,
      },
      {
        text: "En plats där du skickar dina filer till för att de ska gå att se på webben",
        correct: false,
      },
    ],
  },
  {
    question: "Vad kan du inte göra med FTP?",
    answers: [
      { text: "skicka filer till och från Internet", correct: false },
      { text: "skicka filer till och från ett webbhotell", correct: false },
      { text: "Göra webbsidor", correct: true },
    ],
  },
  {
    question: "Vad är Git?",
    answers: [
      { text: "Versionshanteringssystem", correct: true },
      {
        text: "Säkerhetskopiering (kan användas som detta också men är inte syftet)",
        correct: false,
      },
      { text: "Webbhotellssystem", correct: false },
    ],
  },
  {
    question: "Vad är Figma?",
    answers: [
      {
        text: "En tjänst där du gör layouten på en webbplats innan du kodar den",
        correct: true,
      },
      {
        text: "Ett program där du skriver HTML och CSS",
        correct: false,
      },
      { text: "En valideringstjänst", correct: false },
    ],
  },
  {
    question: "Vad är Lighthouse?",
    answers: [
      {
        text: "En tjänst där du gör layouten på en webbplats innan du kodar den",
        correct: false,
      },
      {
        text: "Ett program där du skriver HTML och CSS",
        correct: false,
      },
      { text: "En valideringstjänst", correct: false },
      {
        text: "Automatiserat verktyg för att förbättra prestanda, kvalitet och korrekthet på webbplatser.",
        correct: true,
      },
    ],
  },
  {
    question: "Varför validerar man HTML och CSS?",
    answers: [
      {
        text: " Sidorna blir snabbare",
        correct: false,
      },
      {
        text: " Sidorna blir framtidssäkrade",
        correct: true,
      },
      { text: "Sidorna får snyggare layout", correct: false },
    ],
  },
  {
    question: "Vad behöver INTE en bra editor stöd för",
    answers: [
      {
        text: "UTF-8 (inbyggt i ex: Atom, VS Code. i textformatet)",
        correct: false,
      },
      {
        text: " Syntax highlighting",
        correct: false,
      },
      { text: "radnumrering", correct: false },
      { text: "Stavningskontroll på texten", correct: true },
    ],
  },
  {
    question: "Vad är teckenkodning (charset)?",
    answers: [
      {
        text: "Ett sätt att koda tecken",
        correct: true,
      },
      {
        text: "Ett sätt att koda HTML",
        correct: false,
      },
      { text: "Ett sätt att koda bilder", correct: false },
      { text: "Ett sätt att koda CSS", correct: false },
    ],
  },
  {
    question: "Var ska charset sättas i koden?",
    answers: [
      {
        text: "direkt efter start-head-taggen",
        correct: true,
      },
      {
        text: "direkt efter start-body-taggen",
        correct: false,
      },
      { text: "direkt efter slut-head-taggen", correct: false },
      { text: "direkt före start-body-taggen", correct: false },
    ],
  },
  {
    question: "Hur ska charset utf-8 elementet se ut?",
    answers: [
      {
        text: '<meta charset="utf-8">',
        correct: true,
      },
      {
        text: '<meta="utf-8">',
        correct: false,
      },
      { text: '<charset meta="utf-8">', correct: false },
      { text: '<charset="utf-8">', correct: false },
    ],
  },
  {
    question: "Vilket begrepp har med mobilanpassning att göra?",
    answers: [
      {
        text: "port",
        correct: false,
      },
      {
        text: "media queries",
        correct: true,
      },
      { text: "meta charset", correct: false },
      { text: "style", correct: false },
    ],
  },
  {
    question: "Vilket bildformat stöds INTE av HTML5?",
    answers: [
      {
        text: "gif",
        correct: false,
      },
      {
        text: "png",
        correct: false,
      },
      { text: "jpg", correct: false },
      { text: "psd", correct: true },
      { text: "webp", correct: false },
    ],
  },
  {
    question: "Vilket element används för att bädda in Google Maps i HTML5?",
    answers: [
      {
        text: "iframe",
        correct: true,
      },
      {
        text: "div",
        correct: false,
      },
      { text: "span", correct: false },
      { text: "section", correct: false },
    ],
  },
  {
    question: "Vad kallas färgsystemet som används på skärmar?",
    answers: [
      {
        text: "RGB",
        correct: true,
      },
      {
        text: "CMYK",
        correct: false,
      },
      { text: "Alpha", correct: false },
      { text: "Gamma", correct: false },
    ],
  },
  {
    question: "Vad används alpha värdet till? Tex rgba(255, 255, 255, 0.5)?",
    answers: [
      {
        text: "Ändra genomskinlighet",
        correct: true,
      },
      {
        text: "Ändra nyanser",
        correct: false,
      },
      { text: "Ändra ljushet", correct: false },
      { text: "Ändra mättnad", correct: false },
    ],
  },
  {
    question: "Vilket alternativ är det korrekta? De andra har något fel i sig",
    answers: [
      {
        text: " #34G23BF",
        correct: false,
      },
      {
        text: " rgba(123, 20, 211, 0,4)",
        correct: false,
      },
      { text: " rgb(123, 20, 211)", correct: true },
      { text: "gul", correct: false },
    ],
  },
  {
    question: "Hur kommenterar man HTML kod?",
    answers: [
      {
        text: "<!-- kommentar -->",
        correct: true,
      },
      {
        text: " # kommentar",
        correct: false,
      },
      { text: " * kommentar *", correct: false },
      { text: " // kommentar ", correct: false },
    ],
  },
  {
    question: "Vilket bildformat är det som bara kan ha 256 färger?",
    answers: [
      {
        text: "GIF",
        correct: true,
      },
      {
        text: "PNG",
        correct: false,
      },
      { text: "JPG", correct: false },
      { text: "PSD ", correct: false },
    ],
  },
  {
    question: "Varför ska man följa riktlinjer när man gör webbplatser?",
    answers: [
      {
        text: "Så att alla användare kan använda webbplatsen på bästa sätt",
        correct: true,
      },
      {
        text: "Så att du som webbutvecklare får mindre att göra",
        correct: false,
      },
      {
        text: " Så att du som webbutvecklare får mer att göra",
        correct: false,
      },
      { text: "Så att du tjänar mer pengar ", correct: false },
    ],
  },
  {
    question: "Vad används webbanvändaragenter INTE till?",
    answers: [
      {
        text: "Ge olika användare olika webbsidor",
        correct: false,
      },
      {
        text: "Visa olika innehåll till olika användare",
        correct: false,
      },
      {
        text: "Samla statistik om användarens webbläsare",
        correct: false,
      },
      { text: "Kan ge skadlig kod till webbläsaren ", correct: true },
    ],
  },
  {
    question:
      "Vad beskrivs här: Skapa webbsidor som kan ses med olika OS, webbläsare, plattformar",
    answers: [
      {
        text: "Webbinteroperabilitet",
        correct: true,
      },
      {
        text: "Användaragent",
        correct: false,
      },
      {
        text: "Växlartillägg",
        correct: false,
      },
      { text: "Operativsystem", correct: false },
    ],
  },
  {
    question: "Samlingsnamn för program man kommer åt via webbläsare",
    answers: [
      {
        text: "Webbapplikation",
        correct: true,
      },
      {
        text: "Användaragent",
        correct: false,
      },
      {
        text: "Hårdvaruplattform",
        correct: false,
      },
      { text: "Operativsystem", correct: false },
    ],
  },
  {
    question: "PC, Mac, Android är exempel på en:",
    answers: [
      {
        text: "Webbapplikation",
        correct: false,
      },
      {
        text: "Användaragent",
        correct: false,
      },
      {
        text: "Hårdvaruplattform",
        correct: true,
      },
      { text: "Operativsystem", correct: false },
    ],
  },
  {
    question:
      "Vilket verktyg är INTE en tjänst för att kvalitetssäkra webbplatsen?",
    answers: [
      {
        text: "Google mobilvänlighetstest",
        correct: false,
      },
      {
        text: "W3C validatortjänst för HTML",
        correct: false,
      },
      {
        text: "W3C validatortjänst för CSS",
        correct: false,
      },
      { text: "Google fonts", correct: true },
    ],
  },
  {
    question: "Vilket påstående om lösenord ger INTE högre säkerhet",
    answers: [
      {
        text: " Ha olika lösenord på olika tjänster",
        correct: false,
      },
      {
        text: " Använd lösenordshanterare",
        correct: false,
      },
      {
        text: " Använd ord som är kopplade till dig",
        correct: true,
      },
      { text: " Hellre långa än korta strängar (ord)", correct: false },
    ],
  },
  {
    question: "Vad används JavaScript INTE till?",
    answers: [
      {
        text: "Att ändra webbsidans utseende",
        correct: false,
      },
      {
        text: "Att programmera en webbsida",
        correct: false,
      },
      {
        text: "Att validera en webbsida",
        correct: true,
      },
      { text: "Att ändra webbsidans innehåll ", correct: false },
    ],
  },
];*/

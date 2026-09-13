// ============================================
// QUESTION DATA
// An array of objects — this is the "database" of our quiz.
// Each object holds: the question text, an array of 4 options,
// and the index (0-3) of which option in that array is correct.
// ============================================
const questions = [
  {
    question: "Which keyword declares a variable that can be reassigned but not redeclared?",
    options: ["var", "let", "const", "static"],
    correctIndex: 1
  },
  {
    question: "What does the DOM stand for?",
    options: [
      "Document Object Model",
      "Data Object Method",
      "Document Order Map",
      "Dynamic Object Model"
    ],
    correctIndex: 0
  },
  {
    question: "Which array method creates a new array with only the elements that pass a test?",
    options: ["map()", "forEach()", "filter()", "reduce()"],
    correctIndex: 2
  },
  {
    question: "What will `typeof \"5\" === 5` return?",
    options: ["true", "false", "undefined", "an error"],
    correctIndex: 1
  },
  {
    question: "Which method adds an event listener to an element?",
    options: [
      "element.onClick()",
      "element.addEventListener()",
      "element.listen()",
      "element.event()"
    ],
    correctIndex: 1
  }
];

// ============================================
// STATE
// ============================================
let currentIndex = 0; // which question we're on
let score = 0;
let answered = false; // prevents clicking a second answer on the same question

// ============================================
// GRAB DOM ELEMENTS
// ============================================
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const questionNumberLabel = document.getElementById('question-number');
const progressFill = document.getElementById('progress-fill');
const scoreValue = document.getElementById('score-value');
const scoreMessage = document.getElementById('score-message');
const restartBtn = document.getElementById('restart-btn');

// ============================================
// RENDER THE CURRENT QUESTION
// ============================================
function loadQuestion() {
  answered = false;
  nextBtn.disabled = true;

  const current = questions[currentIndex];

  // Update the "Question X of Y" label and progress bar
  questionNumberLabel.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  progressFill.style.width = `${(currentIndex / questions.length) * 100}%`;

  questionText.textContent = current.question;

  // Clear old options, then build a fresh button for each option
  optionsContainer.innerHTML = '';

  current.options.forEach((optionText, index) => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.textContent = optionText;

    // We store the option's index on the button itself,
    // so the click handler knows exactly which one was picked
    button.dataset.index = index;

    button.addEventListener('click', () => selectAnswer(index));

    optionsContainer.appendChild(button);
  });
}

// ============================================
// HANDLE AN ANSWER BEING CLICKED
// ============================================
function selectAnswer(selectedIndex) {
  if (answered) return; // ignore extra clicks after the first answer
  answered = true;

  const current = questions[currentIndex];
  const allButtons = document.querySelectorAll('.option-btn');

  allButtons.forEach((button, index) => {
    button.disabled = true; // lock all options once one is picked

    if (index === current.correctIndex) {
      button.classList.add('correct'); // always highlight the right answer
    } else if (index === selectedIndex) {
      button.classList.add('wrong'); // highlight the wrong pick, if it was wrong
    }
  });

  if (selectedIndex === current.correctIndex) {
    score++;
  }

  nextBtn.disabled = false;
}

// ============================================
// "NEXT" BUTTON — move to next question, or show results
// ============================================
nextBtn.addEventListener('click', () => {
  currentIndex++;

  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    showResults();
  }
});

// ============================================
// RESULTS SCREEN
// ============================================
function showResults() {
  questionScreen.style.display = 'none';
  resultScreen.style.display = 'block';
  progressFill.style.width = '100%';

  scoreValue.textContent = `${score} / ${questions.length}`;

  // A little feedback message based on performance
  const percentage = (score / questions.length) * 100;
  if (percentage === 100) {
    scoreMessage.textContent = "Perfect score! You know your JS fundamentals.";
  } else if (percentage >= 60) {
    scoreMessage.textContent = "Good job! A little more review and you'll have it all.";
  } else {
    scoreMessage.textContent = "Keep practicing — review the topics you missed and try again.";
  }
}

// ============================================
// RESTART
// ============================================
restartBtn.addEventListener('click', () => {
  currentIndex = 0;
  score = 0;

  resultScreen.style.display = 'none';
  questionScreen.style.display = 'block';

  loadQuestion();
});

// ============================================
// INITIAL LOAD
// ============================================
loadQuestion();
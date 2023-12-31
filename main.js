const progressBar = document.querySelector('.progress-bar'),
  progressText = document.querySelector('.progress-text');

// Function to update progress bar and text
const progress = (value) => {
  const percentage = (value / time) * 100;
  progressBar.style.width = `${percentage}%`;
  progressText.innerHTML = `${value}`;
};

const startBtn = document.querySelector('.start'),
  numQuestions = document.querySelector('#num-questions'),
  category = document.querySelector('#category'),
  timePerQuestion = document.querySelector('#time'),
  quiz = document.querySelector('.quiz'),
  startScreen = document.querySelector('.start-screen');

let questions = [],
  time = 30,
  score = 0,
  currentQuestion,
  timer;
// Start the quiz
const startQuiz = () => {
  const num = numQuestions.value,
    cat = category.value;
  loadingAnimation();
  const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&type=multiple`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      questions = data.results;
      setTimeout(() => {
        startScreen.classList.add('hide');
        quiz.classList.remove('hide');
        currentQuestion = 1;
        showQuestion(questions[0]);
      }, 1000);
    });
};

startBtn.addEventListener('click', startQuiz);
// Display a question
const showQuestion = (question) => {
  const questionText = document.querySelector('.question'),
    answersWrapper = document.querySelector('.answer-wrapper');
  questionNumber = document.querySelector('.number');

  questionText.innerHTML = question.question;
  // Prepare and display answers
  const answers = [
    ...question.incorrect_answers,
    question.correct_answer.toString(),
  ];
  answersWrapper.innerHTML = '';
  answers.sort(() => Math.random() - 0.5);
  answers.forEach((answer) => {
    answersWrapper.innerHTML += `
                    <div class="answer ">
              <span class="text">${answer}</span>
              <span class="checkbox">
                <i class="fas fa-check"></i>
              </span>
            </div>
          `;
  });
  questionNumber.innerHTML = `<span class="current">${
    questions.indexOf(question) + 1
  }</span> of ${questions.length} Questions`;

  const answersDiv = document.querySelectorAll('.answer');
  answersDiv.forEach((answer) => {
    answer.addEventListener('click', () => {
      if (!answer.classList.contains('checked')) {
        answersDiv.forEach((answer) => {
          answer.classList.remove('selected');
        });
        answer.classList.add('selected');
        submitBtn.disabled = false;
      }
    });
  });
  // Start the timer for the current question
  time = timePerQuestion.value;
  startTimer(time);
};

const startTimer = (time) => {
  timer = setInterval(() => {
    progress(time);
    if (time > 0) {
      time--;
    } else {
      checkAnswer();
    }
  }, 1000);
};
// Show loading animation
const loadingAnimation = () => {
  startBtn.innerHTML = 'Loading';
  startBtn.classList.add('disabled-button');
  const loadingInterval = setInterval(() => {
    if (startBtn.innerHTML.length === 10) {
      startBtn.innerHTML = 'Loading';
    } else {
      startBtn.innerHTML += '.';
    }
  }, 500);
};
// Function to check the selected answer
const submitBtn = document.querySelector('.submit'),
  nextBtn = document.querySelector('.next');
submitBtn.addEventListener('click', () => {
  checkAnswer();
});

nextBtn.addEventListener('click', () => {
  nextQuestion();
  submitBtn.style.display = 'block';
  nextBtn.style.display = 'none';
});
//correct/wrong-answer-display//
const checkAnswer = () => {
  clearInterval(timer);
  const selectedAnswer = document.querySelector('.answer.selected');
  if (selectedAnswer) {
    const answer = selectedAnswer.querySelector('.text').innerHTML;
    console.log(currentQuestion);
    if (answer === questions[currentQuestion - 1].correct_answer) {
      score++;
      selectedAnswer.classList.add('correct');
    } else {
      selectedAnswer.classList.add('wrong');
      const correctAnswer = document
        .querySelectorAll('.answer')
        .forEach((answer) => {
          if (
            answer.querySelector('.text').innerHTML ===
            questions[currentQuestion - 1].correct_answer
          ) {
            answer.classList.add('correct-timer');
          }
        });
    }
  } else {
    const correctAnswer = document
      .querySelectorAll('.answer')
      .forEach((answer) => {
        if (
          answer.querySelector('.text').innerHTML ===
          questions[currentQuestion - 1].correct_answer
        ) {
          answer.classList.add('correct-timer');
        }
      });
  }
  // Mark answers as checked
  const answersDiv = document.querySelectorAll('.answer');
  answersDiv.forEach((answer) => {
    answer.classList.add('checked');
  });

  submitBtn.style.display = 'none';
  nextBtn.style.display = 'block';
};
// Move to the next question
const nextQuestion = () => {
  if (currentQuestion < questions.length) {
    currentQuestion++;
    showQuestion(questions[currentQuestion - 1]);
  } else {
    showScore();
  }
};
// Display the final score
const endScreen = document.querySelector('.end-screen'),
  finalScore = document.querySelector('.final-score'),
  totalScore = document.querySelector('.total-score');
const showScore = () => {
  endScreen.classList.remove('hide');
  quiz.classList.add('hide');
  finalScore.innerHTML = score;
  totalScore.innerHTML = `/ ${questions.length}`;
};
// Restart the quiz
const restartBtn = document.querySelector('.restart');
restartBtn.addEventListener('click', () => {
  window.location.reload();
});

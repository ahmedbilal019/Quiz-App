document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple';
    let startQuiz = document.getElementById("quiz-start");
    let welcomePage = document.getElementById("welcome-container");
    let questionPage = document.getElementById("quiz-container");
    let questionElem = document.getElementById("question");
    let answersElem = document.getElementById("answers");
    let scoreElem = document.getElementById("score");
    let nextBtn = document.getElementById("next-btn");

    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];
    let selectedAnswer = null;

    // Initialize the quiz
    function initializeQuiz() {
        let savedProgress = JSON.parse(localStorage.getItem('quizProgress'));
        if (savedProgress) {
            if (confirm('Do you want to resume your quiz?')) {
                score = savedProgress.score;
                currentQuestionIndex = savedProgress.questionIndex;
                questions = savedProgress.questions;
                showQuestion();
            } else {
                localStorage.removeItem('quizProgress');
                startNewQuiz();
            }
        } else {
            startNewQuiz();
        }
    }

    // Start a new quiz
    function startNewQuiz() {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                questions = data.results;
                score = 0;
                currentQuestionIndex = 0;
                localStorage.removeItem('quizProgress');
                showQuestion();
            })
            .catch(error => console.error('Error fetching questions:', error));
    }

    // Show question and answers
    function showQuestion() {
        if (currentQuestionIndex < questions.length) {
            let question = questions[currentQuestionIndex];
            questionElem.textContent =question.question;
            answersElem.innerHTML = '';
            let answers = [...question.incorrect_answers, question.correct_answer];
            // answers = answers.sort(() => Math.random() - 0.5); // Shuffle answers
            answers.forEach(answer => {
                let button = document.createElement('button');
                button.textContent = answer;
                button.addEventListener('click', () => handleAnswer(answer));
                answersElem.appendChild(button);
            });
            scoreElem.textContent = `Score: ${score}`;
            nextBtn.style.display = 'none'; // Hide Next button initially
        } else {
            endQuiz();
        }
    }

    // Handle user's answer
    function handleAnswer(selected) {
        selectedAnswer = selected;
        nextBtn.style.display = 'block'; // Show Next button
        // Optionally, provide visual feedback for the selected answer
        [...answersElem.children].forEach(button => {
            button.disabled = true; // Disable all buttons after selection
            if (button.textContent === selected) {
                button.style.backgroundColor ="blue";
                button.style.color="white";
            }
        });
    }

    // Proceed to the next question
    function nextQuestion() {
        if (selectedAnswer === questions[currentQuestionIndex].correct_answer) {
            score++;
        }
        currentQuestionIndex++;
        selectedAnswer = null;
        saveProgress();
        showQuestion();
    }

    // Save quiz progress to local storage
    function saveProgress() {
        let progress = {
            score: score,
            questionIndex: currentQuestionIndex,
            questions: questions
        };
        localStorage.setItem('quizProgress', JSON.stringify(progress));
    }

    // End the quiz
    function endQuiz() {
        alert(`Quiz finished! Your final score is ${score}.`  
        );
        localStorage.removeItem('quizProgress');
        welcomePage.style.display = "block";
        questionPage.style.display = "none";
    }

    // Event listeners
    startQuiz.addEventListener('click', () => {
        welcomePage.style.display = "none";
        questionPage.style.display = "flex";
        initializeQuiz();
    });

    nextBtn.addEventListener('click', () => {
        nextQuestion();
    });
});

/* ==========================================
            API CONFIGURATION
========================================== */

const BASE_URL = "http://127.0.0.1:8000";

const token = localStorage.getItem("token");

if (!token) {

    window.location.href = "../login.html";

}

/* ==========================================
        AUTHENTICATED FETCH
========================================== */

async function apiFetch(url, options = {}) {

    const response = await fetch(url, {

        ...options,

        headers: {

            "Content-Type": "application/json",

            "Authorization": `Bearer ${token}`,

            ...(options.headers || {})

        }

    });

    if (response.status === 401) {

        alert("Session Expired. Please login again.");

        localStorage.removeItem("token");

        window.location.href = "../login.html";

        return null;

    }

    return response;

}

/* ==========================================
            DOM ELEMENTS
========================================== */

const topicInput = document.getElementById("topic");

const difficultyInput = document.getElementById("difficulty");

const questionCountInput = document.getElementById("questions");

const generateBtn = document.getElementById("generateBtn");

const clearBtn = document.getElementById("clearBtn");

const quizContainer = document.getElementById("quizContainer");

/* ==========================================
        LOADING
========================================== */

function showLoading() {

    quizContainer.innerHTML = `

        <div class="loading">

            <h3>Generating Quiz...</h3>

            <p>Please wait.</p>

        </div>

    `;

}

/* ==========================================
        GENERATE QUIZ
========================================== */

async function generateQuiz() {

    const topic = topicInput.value.trim();

    const difficulty = difficultyInput.value;

    const questions = parseInt(questionCountInput.value);

    if (topic === "") {

        alert("Please enter a topic.");

        return;

    }

    showLoading();

    try {

        const response = await apiFetch(

            `${BASE_URL}/ai/quiz`,

            {

                method: "POST",

                body: JSON.stringify({

                    topic: topic,

                    difficulty: difficulty,

                    questions: questions

                })

            }

        );

        if (!response) return;

        const data = await response.json();

        displayQuiz(data.quiz);

    }

    catch (error) {

        console.error(error);

        quizContainer.innerHTML = `

            <div class="error">

                Failed to generate quiz.

            </div>

        `;

    }

}

/* ==========================================
            DISPLAY QUIZ
========================================== */

function displayQuiz(quiz) {

    quizContainer.innerHTML = "";

    quiz.forEach((item, index) => {

        const card = document.createElement("div");

        card.className = "quiz-card";

        card.innerHTML = `

            <h3>Question ${index + 1}</h3>

            <p class="question">

                ${item.question}

            </p>

            <div class="options">

                ${item.options.map(option => `

                    <label>

                        <input type="radio" name="q${index}">

                        ${option}

                    </label>

                `).join("")}

            </div>

            <button
                class="show-answer-btn"
                onclick="toggleAnswer(${index})">

                Show Answer

            </button>

            <div
                id="answer${index}"
                class="answer"
                style="display:none;">

                ✅ ${item.answer}

            </div>

        `;

        quizContainer.appendChild(card);

    });

}

/* ==========================================
        SHOW / HIDE ANSWER
========================================== */

function toggleAnswer(index) {

    const answer = document.getElementById(

        `answer${index}`

    );

    if (answer.style.display === "none") {

        answer.style.display = "block";

    }

    else {

        answer.style.display = "none";

    }

}

/* ==========================================
            CLEAR QUIZ
========================================== */

function clearQuiz() {

    if (confirm("Clear generated quiz?")) {

        quizContainer.innerHTML = "";

        topicInput.value = "";

    }

}

/* ==========================================
        DOWNLOAD QUIZ
========================================== */

function downloadQuiz() {

    const content = quizContainer.innerText;

    if (content.trim() === "") {

        alert("Generate a quiz first.");

        return;

    }

    const blob = new Blob(

        [content],

        {

            type: "text/plain"

        }

    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "EduGenie_Quiz.txt";

    a.click();

    URL.revokeObjectURL(url);

}

/* ==========================================
            BUTTON EVENTS
========================================== */

generateBtn.addEventListener(

    "click",

    generateQuiz

);

if (clearBtn) {

    clearBtn.addEventListener(

        "click",

        clearQuiz

    );

}

const downloadBtn = document.getElementById("downloadBtn");

if (downloadBtn) {

    downloadBtn.addEventListener(

        "click",

        downloadQuiz

    );

}

/* ==========================================
            ENTER KEY
========================================== */

topicInput.addEventListener(

    "keypress",

    function (e) {

        if (e.key === "Enter") {

            e.preventDefault();

            generateQuiz();

        }

    }

);

/* ==========================================
            INITIAL MESSAGE
========================================== */

window.addEventListener("DOMContentLoaded", () => {

    quizContainer.innerHTML = `

        <div class="welcome-box">

            <h2>EduGenie Quiz Generator</h2>

            <p>

                Enter a topic, select difficulty,

                choose the number of questions,

                and generate your AI-powered quiz.

            </p>

        </div>

    `;

});
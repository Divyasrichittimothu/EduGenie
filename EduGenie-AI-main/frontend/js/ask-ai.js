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

const questionInput = document.getElementById("question");

const askButton = document.getElementById("askBtn");

const clearButton = document.getElementById("clearBtn");

const chatContainer = document.getElementById("chatContainer");

/* ==========================================
        ADD CHAT MESSAGE
========================================== */

function addMessage(type, text) {

    const message = document.createElement("div");

    message.className = `message ${type}`;

    const time = new Date().toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit"

    });

    message.innerHTML = `

        <div class="message-content">

            ${text.replace(/\n/g, "<br>")}

        </div>

        <div class="message-time">

            ${time}

        </div>

    `;

    chatContainer.appendChild(message);

    chatContainer.scrollTop = chatContainer.scrollHeight;

}

/* ==========================================
            LOADING MESSAGE
========================================== */

function showLoading() {

    const loading = document.createElement("div");

    loading.className = "message ai";

    loading.id = "loadingMessage";

    loading.innerHTML = `

        <div class="message-content">

            <span>EduGenie is thinking...</span>

        </div>

    `;

    chatContainer.appendChild(loading);

    chatContainer.scrollTop = chatContainer.scrollHeight;

}

function hideLoading() {

    const loading = document.getElementById("loadingMessage");

    if (loading) {

        loading.remove();

    }

}

/* ==========================================
            ASK AI
========================================== */

async function askAI() {

    const question = questionInput.value.trim();

    if (question === "") {

        alert("Please enter a question.");

        return;

    }

    addMessage("user", question);

    questionInput.value = "";

    showLoading();

    try {

        const response = await apiFetch(

            `${BASE_URL}/ai/ask`,

            {

                method: "POST",

                body: JSON.stringify({

                    question: question

                })

            }

        );

        if (!response) return;

        const data = await response.json();

        hideLoading();

        addMessage("ai", data.answer);

    }

    catch (error) {

        hideLoading();

        addMessage(

            "ai",

            "Unable to connect to EduGenie."

        );

        console.error(error);

    }

}

/* ==========================================
        COPY LAST AI RESPONSE
========================================== */

function copyLastResponse() {

    const aiMessages = document.querySelectorAll(".message.ai .message-content");

    if (aiMessages.length === 0) {

        alert("Nothing to copy.");

        return;

    }

    const lastMessage = aiMessages[aiMessages.length - 1];

    navigator.clipboard.writeText(lastMessage.innerText);

    alert("Response copied successfully.");

}

/* ==========================================
            CLEAR CHAT
========================================== */

function clearChat() {

    if (confirm("Clear all chat messages?")) {

        chatContainer.innerHTML = "";

    }

}

/* ==========================================
            ENTER KEY
========================================== */

questionInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        e.preventDefault();

        askAI();

    }

});

/* ==========================================
            BUTTON EVENTS
========================================== */

askButton.addEventListener(

    "click",

    askAI

);

if (clearButton) {

    clearButton.addEventListener(

        "click",

        clearChat

    );

}

const copyButton = document.getElementById("copyBtn");

if (copyButton) {

    copyButton.addEventListener(

        "click",

        copyLastResponse

    );

}

/* ==========================================
            WELCOME MESSAGE
========================================== */

window.addEventListener("DOMContentLoaded", () => {

    addMessage(

        "ai",

        "👋 Hello! I'm EduGenie AI. Ask me anything about your studies."

    );

});
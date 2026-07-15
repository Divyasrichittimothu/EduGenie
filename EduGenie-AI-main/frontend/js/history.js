/* =====================================================
                EDUGENIE HISTORY JS
                    PART 1
===================================================== */

/* ==============================
        API CONFIGURATION
============================== */

const BASE_URL = "http://127.0.0.1:8000";

const token = localStorage.getItem("token");

if (!token) {

    window.location.href = "../login.html";

}

/* ==============================
        DOM ELEMENTS
============================== */

const historyType = document.getElementById("historyType");

const historyContainer = document.getElementById("historyContainer");

/* ==============================
        AUTHENTICATED FETCH
============================== */

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

        localStorage.removeItem("token");

        window.location.href = "../login.html";

        return null;

    }

    return response;

}

/* ==============================
        LOADING
============================== */

function showLoading() {

    historyContainer.innerHTML = `

        <div class="loading-box">

            <h2>

                Loading History...

            </h2>

            <p>

                Please wait while EduGenie loads your activity.

            </p>

        </div>

    `;

}

/* ==============================
        LOAD HISTORY
============================== */

async function loadHistory() {

    const type = historyType.value;

    let endpoint = "";

    switch (type) {

        case "chat":
            endpoint = "chats";
            break;

        case "quiz":
            endpoint = "quizzes";
            break;

        case "summary":
            endpoint = "summaries";
            break;

        case "roadmap":
            endpoint = "roadmaps";
            break;

        default:
            endpoint = "chats";

    }

    const response = await apiFetch(
        `${BASE_URL}/history/${endpoint}`
    );

    if (!response) return;

    const data = await response.json();

switch(type){

    case "chat":

        displayChats(data);

        break;

    case "quiz":

        displayQuizzes(data);

        break;

    case "summary":

        displaySummaries(data);

        break;

    case "roadmap":

        displayRoadmaps(data);

        break;

}
}

//     catch (error) {

//     console.error(error);

//     historyContainer.innerHTML = `

//             <div class="empty-box">

//                 <h2>

//                     Unable to load history.

//                 </h2>

//                 <p>

//                     Please try again later.

//                 </p>

//             </div>

//         `;

// }


/* =====================================================
                EDUGENIE HISTORY JS
                    PART 2
===================================================== */

/* ==============================
        DISPLAY HISTORY
============================== */

function displayChats(chats) {

    historyContainer.innerHTML = "";

    if (chats.length === 0) {

        historyContainer.innerHTML = `
            <div class="empty-box">
                No chat history found.
            </div>
        `;

        return;

    }

    chats.forEach(chat => {

        const card = document.createElement("div");

        card.className = "history-card";

        card.innerHTML = `

            <h3>❓ Question</h3>

            <div class="history-question">

                ${chat.question}

            </div>

            <br>

            <h3>🤖 Answer</h3>

            <div class="history-answer">

                ${chat.answer.replace(/\n/g, "<br>")}

            </div>

            <br>

            <small>

                ${new Date(chat.created_at).toLocaleString()}

            </small>

        `;

        historyContainer.appendChild(card);

    });

}
/* ==============================
        HISTORY TYPE CHANGE
============================== */

historyType.addEventListener(

    "change",

    function () {

        loadHistory();

    }

);

/* ==============================
        REFRESH HISTORY
============================== */

function refreshHistory() {

    loadHistory();

    
}

/* ==============================
        AUTO REFRESH
============================== */

setInterval(

    refreshHistory,

    60000

);

/* ==============================
        INITIALIZE
============================== */

window.addEventListener(

    "DOMContentLoaded",

    () => {

        loadHistory();

    }

);
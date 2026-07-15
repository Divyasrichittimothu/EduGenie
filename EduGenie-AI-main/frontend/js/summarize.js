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

const inputText = document.getElementById("inputText");

const summarizeBtn = document.getElementById("summarizeBtn");

const clearBtn = document.getElementById("clearBtn");

const copyBtn = document.getElementById("copyBtn");

const downloadBtn = document.getElementById("downloadBtn");

const summaryContainer = document.getElementById("summaryContainer");

/* ==========================================
            SHOW LOADING
========================================== */

function showLoading() {

    summaryContainer.innerHTML = `

        <div class="loading-box">

            <h3>Generating Summary...</h3>

            <p>Please wait...</p>

        </div>

    `;

}

/* ==========================================
        GENERATE SUMMARY
========================================== */

async function generateSummary() {

    const text = inputText.value.trim();

    if (text === "") {

        alert("Please enter text to summarize.");

        return;

    }

    showLoading();

    try {

        const response = await apiFetch(

            `${BASE_URL}/ai/summarize`,

            {

                method: "POST",

                body: JSON.stringify({

                    text: text

                })

            }

        );

        if (!response) return;

        const data = await response.json();

        displaySummary(data.summary);

    }

    catch (error) {

        console.error(error);

        summaryContainer.innerHTML = `

            <div class="error-box">

                Failed to generate summary.

            </div>

        `;

    }

}

/* ==========================================
        DISPLAY SUMMARY
========================================== */

function displaySummary(summary) {

    summaryContainer.innerHTML = `

        <div class="summary-card">

            <h2>Summary</h2>

            <div id="summaryText">

                ${summary.replace(/\n/g, "<br>")}

            </div>

        </div>

    `;

}

/* ==========================================
            COPY SUMMARY
========================================== */

function copySummary() {

    const summary = document.getElementById("summaryText");

    if (!summary) {

        alert("Nothing to copy.");

        return;

    }

    navigator.clipboard.writeText(summary.innerText);

    alert("Summary copied successfully.");

}

/* ==========================================
        DOWNLOAD SUMMARY
========================================== */

function downloadSummary() {

    const summary = document.getElementById("summaryText");

    if (!summary) {

        alert("Generate a summary first.");

        return;

    }

    const blob = new Blob(

        [summary.innerText],

        {

            type: "text/plain"

        }

    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "EduGenie_Summary.txt";

    a.click();

    URL.revokeObjectURL(url);

}

/* ==========================================
            CLEAR ALL
========================================== */

function clearSummary() {

    if (confirm("Clear summary?")) {

        inputText.value = "";

        summaryContainer.innerHTML = `

            <div class="welcome-box">

                <h2>EduGenie Summarizer</h2>

                <p>

                    Paste your notes, article, or document

                    and generate a concise AI-powered summary.

                </p>

            </div>

        `;

    }

}

/* ==========================================
            ENTER KEY
========================================== */

inputText.addEventListener(

    "keydown",

    function (e) {

        if (e.ctrlKey && e.key === "Enter") {

            generateSummary();

        }

    }

);

/* ==========================================
            BUTTON EVENTS
========================================== */

summarizeBtn.addEventListener(

    "click",

    generateSummary

);

if (clearBtn) {

    clearBtn.addEventListener(

        "click",

        clearSummary

    );

}

if (copyBtn) {

    copyBtn.addEventListener(

        "click",

        copySummary

    );

}

if (downloadBtn) {

    downloadBtn.addEventListener(

        "click",

        downloadSummary

    );

}

/* ==========================================
            INITIAL MESSAGE
========================================== */

window.addEventListener("DOMContentLoaded", () => {

    summaryContainer.innerHTML = `

        <div class="welcome-box">

            <h2>EduGenie AI Summarizer</h2>

            <p>

                Paste any educational content and receive a

                clear, concise summary powered by Google Gemini AI.

            </p>

        </div>

    `;

});
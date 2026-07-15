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

const generateBtn = document.getElementById("generateBtn");

const clearBtn = document.getElementById("clearBtn");

const copyBtn = document.getElementById("copyBtn");

const downloadBtn = document.getElementById("downloadBtn");

const roadmapContainer = document.getElementById("roadmapContainer");

/* ==========================================
            LOADING
========================================== */

function showLoading() {

    roadmapContainer.innerHTML = `

        <div class="loading-box">

            <h2>Generating Learning Roadmap...</h2>

            <p>Please wait while EduGenie AI prepares your roadmap.</p>

        </div>

    `;

}

/* ==========================================
        GENERATE ROADMAP
========================================== */

async function generateRoadmap() {

    const topic = topicInput.value.trim();

    if (topic === "") {

        alert("Please enter a learning topic.");

        return;

    }

    showLoading();

    try {

        const response = await apiFetch(

            `${BASE_URL}/ai/roadmap`,

            {

                method: "POST",

                body: JSON.stringify({

                    topic: topic

                })

            }

        );

        if (!response) return;

        const data = await response.json();

        displayRoadmap(data.roadmap);

    }

    catch (error) {

        console.error(error);

        roadmapContainer.innerHTML = `

            <div class="error-box">

                Failed to generate roadmap.

            </div>

        `;

    }

}

/* ==========================================
        DISPLAY ROADMAP
========================================== */

function displayRoadmap(roadmap) {

    roadmapContainer.innerHTML = `

        <div class="roadmap-card">

            <h2>Learning Roadmap</h2>

            <div id="roadmapText">

                ${roadmap.replace(/\n/g, "<br>")}

            </div>

        </div>

    `;

}

/* ==========================================
            COPY ROADMAP
========================================== */

function copyRoadmap() {

    const roadmap = document.getElementById("roadmapText");

    if (!roadmap) {

        alert("Nothing to copy.");

        return;

    }

    navigator.clipboard.writeText(

        roadmap.innerText

    );

    alert("Roadmap copied successfully.");

}

/* ==========================================
        DOWNLOAD ROADMAP
========================================== */

function downloadRoadmap() {

    const roadmap = document.getElementById("roadmapText");

    if (!roadmap) {

        alert("Generate a roadmap first.");

        return;

    }

    const blob = new Blob(

        [

            roadmap.innerText

        ],

        {

            type: "text/plain"

        }

    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "EduGenie_Roadmap.txt";

    a.click();

    URL.revokeObjectURL(url);

}

/* ==========================================
            CLEAR ROADMAP
========================================== */

function clearRoadmap() {

    if (confirm("Clear current roadmap?")) {

        topicInput.value = "";

        roadmapContainer.innerHTML = `

            <div class="welcome-box">

                <h2>EduGenie Learning Roadmap</h2>

                <p>

                    Enter any technology or subject and receive

                    a complete AI-generated learning roadmap.

                </p>

            </div>

        `;

    }

}

/* ==========================================
            ENTER KEY
========================================== */

topicInput.addEventListener(

    "keypress",

    function (e) {

        if (e.key === "Enter") {

            e.preventDefault();

            generateRoadmap();

        }

    }

);

/* ==========================================
            BUTTON EVENTS
========================================== */

generateBtn.addEventListener(

    "click",

    generateRoadmap

);

if (clearBtn) {

    clearBtn.addEventListener(

        "click",

        clearRoadmap

    );

}

if (copyBtn) {

    copyBtn.addEventListener(

        "click",

        copyRoadmap

    );

}

if (downloadBtn) {

    downloadBtn.addEventListener(

        "click",

        downloadRoadmap

    );

}

/* ==========================================
            INITIAL SCREEN
========================================== */

window.addEventListener("DOMContentLoaded", () => {

    roadmapContainer.innerHTML = `

        <div class="welcome-box">

            <h2>EduGenie AI Learning Roadmap</h2>

            <p>

                Enter a topic like Python, Java, AI, Machine Learning,

                Cloud Computing, React, or Data Science and receive

                a complete step-by-step learning roadmap powered by

                Google Gemini AI.

            </p>

        </div>

    `;

});
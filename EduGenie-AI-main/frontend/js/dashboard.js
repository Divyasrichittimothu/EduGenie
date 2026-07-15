/* =====================================================
                EDUGENIE DASHBOARD JS
                      PART 1
===================================================== */

/* ==============================
        API CONFIGURATION
============================== */

const BASE_URL = "http://127.0.0.1:8000";

const token = localStorage.getItem("token");

/* ==============================
    AUTHENTICATION CHECK
============================== */

if (!token) {

    window.location.href = "login.html";

}

/* ==============================
        DOM ELEMENTS
============================== */

const usernameElement = document.getElementById("username");

const greetingElement = document.getElementById("greeting");

const chatCountElement = document.getElementById("chatCount");

const quizCountElement = document.getElementById("quizCount");

const summaryCountElement = document.getElementById("summaryCount");

const roadmapCountElement = document.getElementById("roadmapCount");

const recentActivities = document.getElementById("recentActivities");

const logoutBtn = document.getElementById("logoutBtn");

const notificationIcon = document.querySelector(".notification-icon");

/* ==============================
        AUTH FETCH
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

        window.location.href = "login.html";

        return null;

    }

    return response;

}

/* ==============================
        LOAD USER
============================== */

async function loadUser() {

    try {

        const response = await apiFetch(

            `${BASE_URL}/auth/me`

        );

        if (!response) return;

        const user = await response.json();

        if (usernameElement) {

            usernameElement.innerHTML = user.name;

        }

    }

    catch (error) {

        console.error(error);

    }

}

/* ==============================
            GREETING
============================== */

function updateGreeting() {

    const hour = new Date().getHours();

    let greeting = "";

    if (hour < 12) {

        greeting = "☀️ Good Morning";

    }

    else if (hour < 17) {

        greeting = "🌤️ Good Afternoon";

    }

    else {

        greeting = "🌙 Good Evening";

    }

    if (greetingElement) {

        greetingElement.innerHTML =

            `${greeting} • Continue learning with EduGenie AI.`;

    }

}

/* ==============================
        ANIMATED COUNTER
============================== */

function animateCounter(element, value) {

    if (!element) return;

    let start = 0;

    const duration = 800;

    const increment = Math.max(1, Math.ceil(value / 40));

    const timer = setInterval(() => {

        start += increment;

        if (start >= value) {

            start = value;

            clearInterval(timer);

        }

        element.innerHTML = start;

    }, duration / 40);

}

/* ==============================
        LOAD DASHBOARD STATS
============================== */

async function loadDashboardStats() {

    try {

        const response = await apiFetch(

            `${BASE_URL}/dashboard/stats`

        );

        if (!response) return;

        const result = await response.json();

        console.log("Dashboard API:", result);

        const stats = result.data;

        animateCounter(
            chatCountElement,
            stats.chatCount || 0
        );

        animateCounter(
            quizCountElement,
            stats.quizCount || 0
        );

        animateCounter(
            summaryCountElement,
            stats.summaryCount || 0
        );

        animateCounter(
            roadmapCountElement,
            stats.roadmapCount || 0
        );
    }
    catch (error) {

        console.error(error);

    }

}

/* ==============================
        PAGE ANIMATION
============================== */

window.addEventListener(

    "DOMContentLoaded",

    () => {

        document.body.style.opacity = "0";

        document.body.style.transform = "translateY(20px)";

        setTimeout(() => {

            document.body.style.transition = ".4s ease";

            document.body.style.opacity = "1";

            document.body.style.transform = "translateY(0px)";

        }, 100);

    }

);
/* =====================================================
                EDUGENIE DASHBOARD JS
                      PART 2
===================================================== */

/* ==============================
        LOAD RECENT ACTIVITIES
============================== */

async function loadRecentActivities() {

    if (!recentActivities) return;

    try {

        const response = await apiFetch(

            `${BASE_URL}/dashboard/recent-activities`

        );

        if (!response) return;

        const result = await response.json();

        const activities = result.data;

        console.log("Activities:", activities);

        recentActivities.innerHTML = "";

        if (activities.length === 0) {

            recentActivities.innerHTML = `

                <div class="welcome-box">

                    <i class="fa-solid fa-clock"></i>

                    <h2>No Recent Activity</h2>

                    <p>

                        Start using EduGenie AI to see your latest
                        activities here.

                    </p>

                </div>

            `;

            return;

        }

        activities.forEach(activity => {

            const card = document.createElement("div");

            card.className = "history-card fade-up";

            card.innerHTML = `

                <h3>${activity.title}</h3>

                <p>${activity.description}</p>

                <small>

                    ${new Date(activity.created_at).toLocaleString()}

                </small>

            `;

            recentActivities.appendChild(card);

        });

    }

    catch (error) {

        console.error(error);

    }

}

/* ==============================
        NOTIFICATION ICON
============================== */

if (notificationIcon) {

    notificationIcon.addEventListener(

        "click",

        () => {

            alert("🔔 No new notifications.");

        }

    );

}

/* ==============================
            LOGOUT
============================== */

if (logoutBtn) {

    logoutBtn.addEventListener(

        "click",

        function (e) {

            e.preventDefault();

            const confirmLogout = confirm(

                "Are you sure you want to logout?"

            );

            if (!confirmLogout) return;

            localStorage.removeItem("token");

            window.location.href = "login.html";

        }

    );

}

/* ==============================
        CARD ANIMATIONS
============================== */

function animateCards() {

    const cards = document.querySelectorAll(

        ".card,.action-card,.recent-card"

    );

    cards.forEach((card, index) => {

        card.style.opacity = "0";

        card.style.transform = "translateY(25px)";

        setTimeout(() => {

            card.style.transition = ".45s ease";

            card.style.opacity = "1";

            card.style.transform = "translateY(0px)";

        }, index * 120);

    });

}

/* ==============================
        REFRESH GREETING
============================== */

setInterval(

    updateGreeting,

    60000

);

/* ==============================
        WINDOW RESIZE
============================== */

window.addEventListener(

    "resize",

    () => {

        console.log(

            "Window Width:",

            window.innerWidth

        );

    }

);

/* ==============================
        INITIALIZE
============================== */

async function initializeDashboard() {

    updateGreeting();

    await loadUser();

    await loadDashboardStats();

    await loadRecentActivities();

    animateCards();

}

/* ==============================
        START APPLICATION
============================== */

window.addEventListener(

    "DOMContentLoaded",

    initializeDashboard

);
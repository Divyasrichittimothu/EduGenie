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

const nameInput = document.getElementById("name");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const saveBtn = document.getElementById("saveBtn");

const resetBtn = document.getElementById("resetBtn");

const logoutBtn = document.getElementById("logoutBtn");

const profileCard = document.getElementById("profileCard");

/* ==========================================
            LOAD PROFILE
========================================== */

async function loadProfile() {

    try {

        const response = await apiFetch(

            `${BASE_URL}/auth/me`

        );

        if (!response) return;

        const user = await response.json();

        nameInput.value = user.name;

        emailInput.value = user.email;

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================
        UPDATE PROFILE
========================================== */

async function updateProfile() {

    const name = nameInput.value.trim();

    const email = emailInput.value.trim();

    const password = passwordInput.value.trim();

    if (name === "" || email === "") {

        alert("Name and Email are required.");

        return;

    }

    try {

        const response = await apiFetch(

            `${BASE_URL}/auth/profile`,

            {

                method: "PUT",

                body: JSON.stringify({

                    name: name,

                    email: email,

                    password: password

                })

            }

        );

        if (!response) return;

        const user = await response.json();

        alert("Profile updated successfully.");

        passwordInput.value = "";

        nameInput.value = user.name;

        emailInput.value = user.email;

    }

    catch (error) {

        console.error(error);

        alert("Failed to update profile.");

    }

}

/* ==========================================
            RESET FORM
========================================== */

function resetProfile() {

    if (confirm("Reset changes?")) {

        passwordInput.value = "";

        loadProfile();

    }

}

/* ==========================================
            LOGOUT
========================================== */

function logout() {

    if (confirm("Are you sure you want to logout?")) {

        localStorage.removeItem("token");

        window.location.href = "../login.html";

    }

}

/* ==========================================
        PROFILE CARD ANIMATION
========================================== */

function animateCard() {

    if (!profileCard) return;

    profileCard.style.opacity = "0";

    profileCard.style.transform = "translateY(25px)";

    setTimeout(() => {

        profileCard.style.transition = "0.4s ease";

        profileCard.style.opacity = "1";

        profileCard.style.transform = "translateY(0px)";

    }, 200);

}

/* ==========================================
        BUTTON EVENTS
========================================== */

if (saveBtn) {

    saveBtn.addEventListener(

        "click",

        updateProfile

    );

}

if (resetBtn) {

    resetBtn.addEventListener(

        "click",

        resetProfile

    );

}

if (logoutBtn) {

    logoutBtn.addEventListener(

        "click",

        logout

    );

}

/* ==========================================
            INITIALIZE
========================================== */

window.addEventListener("DOMContentLoaded", () => {

    animateCard();

    loadProfile();

});
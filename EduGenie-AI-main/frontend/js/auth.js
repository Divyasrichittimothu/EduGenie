const BASE_URL = "http://127.0.0.1:8000";

/* ==========================================
        REGISTER
========================================== */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const name = document.getElementById("name").value.trim();

        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value;

        const confirmPassword = document.getElementById("confirmPassword").value;

        const message = document.getElementById("message");

        message.innerHTML = "";
        message.style.color = "red";

        if (password !== confirmPassword) {

            message.innerHTML = "Passwords do not match.";

            return;
        }

        try {

            const response = await fetch(`${BASE_URL}/auth/register`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: name,

                    email: email,

                    password: password

                })

            });

            const data = await response.json();

            if (response.ok) {

                message.style.color = "green";

                message.innerHTML = "Registration Successful! Redirecting...";

                setTimeout(() => {

                    window.location.href = "login.html";

                }, 1500);

            } else {

                message.innerHTML = data.detail || "Registration Failed.";

            }

        }

        catch (error) {

            console.error(error);

            message.innerHTML = "Cannot connect to server.";

        }

    });

}

/* ==========================================
            LOGIN
========================================== */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value;

        const message = document.getElementById("message");

        message.innerHTML = "";
        message.style.color = "red";

        try {

            const response = await fetch(`${BASE_URL}/auth/login`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email: email,

                    password: password

                })

            });

            const data = await response.json();

            if (response.ok) {

                localStorage.setItem("token", data.access_token);

                message.style.color = "green";

                message.innerHTML = "Login Successful!";

                setTimeout(() => {

                    window.location.href = "dashboard.html";

                }, 1000);

            }

            else {

                message.innerHTML = data.detail || "Invalid Email or Password.";

            }

        }

        catch (error) {

            console.error(error);

            message.innerHTML = "Unable to connect to server.";

        }

    });

}

/* ==========================================
        AUTO REDIRECT
========================================== */

const token = localStorage.getItem("token");

if (token) {

    if (
        window.location.pathname.endsWith("login.html") ||
        window.location.pathname.endsWith("register.html")
    ) {

        // Uncomment after dashboard.html is created

        // window.location.href = "dashboard.html";

    }

}
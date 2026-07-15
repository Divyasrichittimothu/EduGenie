const logoutBtn = document.getElementById("logoutBtn");
const logoutButton = document.getElementById("logoutButton");
const saveSettings = document.getElementById("saveSettings");
const themeSelect = document.getElementById("themeSelect");
const notificationToggle = document.getElementById("notificationToggle");

/* ==========================================
            LOAD SETTINGS
========================================== */

window.onload = function () {

    const theme = localStorage.getItem("theme") || "light";
    const notifications = localStorage.getItem("notifications");

    themeSelect.value = theme;

    if (notifications !== null) {

        notificationToggle.checked = notifications === "true";

    }

    applyTheme(theme);

};

/* ==========================================
            SAVE SETTINGS
========================================== */

saveSettings.addEventListener("click", function () {

    const theme = themeSelect.value;

    localStorage.setItem("theme", theme);

    localStorage.setItem(
        "notifications",
        notificationToggle.checked
    );

    applyTheme(theme);

    alert("Settings Saved Successfully!");

});

/* ==========================================
            APPLY THEME
========================================== */

function applyTheme(theme) {

    if (theme === "dark") {

        document.body.style.background = "#0f172a";

        document.body.style.color = "#ffffff";

        document.querySelectorAll(".recent-card").forEach(card => {

            card.style.background = "#1e293b";

            card.style.color = "#ffffff";

        });

        document.querySelectorAll(".topbar").forEach(bar => {

            bar.style.background = "#1e293b";

            bar.style.color = "#ffffff";

        });

    }

    else {

        document.body.style.background = "#f5f7fb";

        document.body.style.color = "#1e293b";

        document.querySelectorAll(".recent-card").forEach(card => {

            card.style.background = "#ffffff";

            card.style.color = "#1e293b";

        });

        document.querySelectorAll(".topbar").forEach(bar => {

            bar.style.background = "#ffffff";

            bar.style.color = "#1e293b";

        });

    }

}

/* ==========================================
                LOGOUT
========================================== */

function logout() {

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {

        localStorage.removeItem("token");

        window.location.href = "../login.html";

    }

}

logoutBtn.addEventListener("click", function (e) {

    e.preventDefault();

    logout();

});

logoutButton.addEventListener("click", logout);
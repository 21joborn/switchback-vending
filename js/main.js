(function () {
    const navToggle = document.querySelector(".nav-toggle");
    const siteNav = document.getElementById("site-nav");
    const form = document.getElementById("vendingForm");
    const formStatus = document.getElementById("formStatus");

    if (navToggle && siteNav) {
        navToggle.addEventListener("click", function () {
            const open = siteNav.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", open ? "true" : "false");
            navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        });

        siteNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                siteNav.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
                navToggle.setAttribute("aria-label", "Open menu");
            });
        });
    }

    document.querySelectorAll("[data-station]").forEach(function (link) {
        link.addEventListener("click", function () {
            const stationSelect = document.getElementById("fuelingStation");
            const value = link.getAttribute("data-station");
            if (stationSelect && value) {
                stationSelect.value = value;
            }
            window.setTimeout(function () {
                const firstName = document.getElementById("firstName");
                if (firstName) firstName.focus();
            }, 0);
        });
    });

    if (!form) return;

    if (new URLSearchParams(window.location.search).get("sent") === "1") {
        showStatus("Thank you! Your inquiry was sent. We will get back to you soon.", "success");
    }

    form.addEventListener("submit", function (event) {
        const honeypot = document.getElementById("company_website");
        if (honeypot && honeypot.value.trim() !== "") {
            event.preventDefault();
            showStatus("Thanks, your inquiry was received.", "success");
            form.reset();
            return;
        }

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const businessName = document.getElementById("businessName").value.trim();
        const email = document.getElementById("email").value.trim();
        const fuelingStation = document.getElementById("fuelingStation").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!firstName || !lastName || !businessName || !email || !fuelingStation || !message) {
            event.preventDefault();
            showStatus("Please fill in all required fields.", "error");
            return;
        }

        const subject = document.getElementById("formSubject");
        if (subject) {
            subject.value = "New station inquiry from " + businessName;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
    });

    function showStatus(message, type) {
        formStatus.hidden = false;
        formStatus.textContent = message;
        formStatus.classList.remove("is-success", "is-error");
        formStatus.classList.add(type === "success" ? "is-success" : "is-error");
    }
})();

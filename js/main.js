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

    const INQUIRY_EMAIL = "switchbackvending@gmail.com";

    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const honeypot = document.getElementById("company_website");
        if (honeypot && honeypot.value.trim() !== "") {
            showStatus("Thanks, your inquiry was received.", "success");
            form.reset();
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const fuelingStationEl = document.getElementById("fuelingStation");
        const payload = {
            firstName: document.getElementById("firstName").value.trim(),
            lastName: document.getElementById("lastName").value.trim(),
            businessName: document.getElementById("businessName").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            address: document.getElementById("address").value.trim(),
            fuelingStation: fuelingStationEl ? fuelingStationEl.value.trim() : "",
            message: document.getElementById("message").value.trim()
        };

        if (!payload.firstName || !payload.lastName || !payload.businessName || !payload.email || !payload.fuelingStation || !payload.message) {
            showStatus("Please fill in all required fields.", "error");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";

        const emailBody = [
            "Name: " + payload.firstName + " " + payload.lastName,
            "Business: " + payload.businessName,
            "Email: " + payload.email,
            "Phone: " + (payload.phone || "Not provided"),
            "Address: " + (payload.address || "Not provided"),
            "Station: " + payload.fuelingStation,
            "",
            payload.message
        ].join("\n");

        try {
            const response = await fetch("https://formsubmit.co/ajax/" + INQUIRY_EMAIL, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    name: payload.firstName + " " + payload.lastName,
                    email: payload.email,
                    phone: payload.phone || "Not provided",
                    business: payload.businessName,
                    address: payload.address || "Not provided",
                    station: payload.fuelingStation,
                    message: payload.message,
                    _subject: "New station inquiry from " + payload.businessName,
                    _template: "table",
                    _captcha: "false",
                    _replyto: payload.email
                })
            });

            const result = await response.json();

            if (!response.ok || result.success === "false" || result.success === false) {
                throw new Error(result.message || "Send failed");
            }

            form.reset();
            showStatus("Thank you! Your inquiry was sent. We will get back to you soon.", "success");
        } catch (error) {
            console.error(error);
            window.location.href =
                "mailto:" + INQUIRY_EMAIL +
                "?subject=" + encodeURIComponent("Station inquiry from " + payload.businessName) +
                "&body=" + encodeURIComponent(emailBody);
            showStatus("We could not send automatically, so your email app was opened instead. You can also call (801) 643-8595.", "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Inquiry";
        }
    });

    function showStatus(message, type) {
        formStatus.hidden = false;
        formStatus.textContent = message;
        formStatus.classList.remove("is-success", "is-error");
        formStatus.classList.add(type === "success" ? "is-success" : "is-error");
    }
})();

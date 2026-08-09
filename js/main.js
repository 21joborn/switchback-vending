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
        });
    });

    // Contact form → Web3Forms (free email delivery)
    // 1. Go to https://web3forms.com and create an access key with switchbackvending@gmail.com
    // 2. Paste the key below
    const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";

    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const honeypot = document.getElementById("company_website");
        if (honeypot && honeypot.value.trim() !== "") {
            showStatus("Thanks, your inquiry was received.", "success");
            form.reset();
            return;
        }

        const verify = (document.getElementById("verify") || {}).value;
        if (String(verify).trim() !== "5") {
            showStatus("Please answer the quick check correctly (2 + 3).", "error");
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const fuelingStationEl = document.getElementById("fuelingStation");
        const payload = {
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: "New Fueling Station inquiry from Switchback Vending website",
            from_name: "Switchback Vending Website",
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

        if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY") {
            const body = [
                "Name: " + payload.firstName + " " + payload.lastName,
                "Business: " + payload.businessName,
                "Email: " + payload.email,
                "Phone: " + (payload.phone || "Not provided"),
                "Address: " + (payload.address || "Not provided"),
                "Fueling Station: " + payload.fuelingStation,
                "",
                payload.message
            ].join("\n");

            window.location.href =
                "mailto:switchbackvending@gmail.com?subject=" +
                encodeURIComponent("Fueling Station inquiry from " + payload.businessName) +
                "&body=" +
                encodeURIComponent(body);

            showStatus("Opening your email app to send the inquiry…", "success");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok || result.success === false) {
                throw new Error(result.message || "Send failed");
            }

            form.reset();
            showStatus("Thank you! Your inquiry was sent. We will get back to you soon.", "success");
        } catch (error) {
            console.error(error);
            showStatus("Something went wrong. Please call (801) 643-8595 or email switchbackvending@gmail.com.", "error");
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

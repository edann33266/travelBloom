// ==========================
// CONTACT FORM VALIDATION
// ==========================
// NOTE: There is no backend wired up yet. This validates the form
// and shows success/error feedback in the UI. To actually deliver
// messages, point `form.action` at a service like Formspree or
// EmailJS and let the fetch call below POST to it.

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");

    if (!form) return;

    const status = document.getElementById("formStatus");
    const submitBtn = form.querySelector(".contact1-btn");

    const fields = {
        name: {
            input: document.getElementById("name"),
            error: document.getElementById("nameError"),
            validate: (value) =>
                value.trim().length >= 2
                    ? ""
                    : "Please enter your full name."
        },
        email: {
            input: document.getElementById("email"),
            error: document.getElementById("emailError"),
            validate: (value) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
                    ? ""
                    : "Please enter a valid email address."
        },
        message: {
            input: document.getElementById("message"),
            error: document.getElementById("messageError"),
            validate: (value) =>
                value.trim().length >= 10
                    ? ""
                    : "Message should be at least 10 characters."
        }
    };

    function validateField(key) {

        const { input, error, validate } = fields[key];

        const message = validate(input.value);

        error.textContent = message;

        return !message;
    }

    Object.keys(fields).forEach(key => {

        fields[key].input.addEventListener("blur", () => validateField(key));

        fields[key].input.addEventListener("input", () => {

            if (fields[key].error.textContent) {
                validateField(key);
            }
        });
    });

    function showStatus(kind, message) {

        status.textContent = message;
        status.className = `form-status is-visible ${kind}`;
    }

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const allValid = Object.keys(fields)
            .map(validateField)
            .every(Boolean);

        if (!allValid) {

            showStatus("error", "Please fix the highlighted fields and try again.");

            return;
        }

        submitBtn.classList.add("is-loading");
        submitBtn.textContent = "Sending...";

        // Simulated send — no backend endpoint is configured.
        // Swap this block for a real fetch() to your form service.
        await new Promise(resolve => setTimeout(resolve, 700));

        submitBtn.classList.remove("is-loading");
        submitBtn.textContent = "Send Message";

        showStatus(
            "success",
            "Thanks for reaching out! This is a demo form — no message was actually sent."
        );

        form.reset();
    });
});

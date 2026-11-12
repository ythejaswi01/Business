const inquiryForm = document.getElementById("inquiry-form");

if (inquiryForm) {
  const inquiryEmailIsValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const inquiryMessage = document.getElementById("inquiry-message");

  inquiryForm.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      field.removeAttribute("aria-invalid");
      const error = document.getElementById(`${field.id}-error`);
      if (error) error.textContent = "";
    });
  });

  inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    inquiryForm.querySelectorAll("[aria-invalid='true']").forEach((field) => field.removeAttribute("aria-invalid"));
    inquiryForm.querySelectorAll(".field-error").forEach((error) => { error.textContent = ""; });
    inquiryMessage.textContent = "";
    inquiryMessage.className = "inquiry-message";

    const required = [
      [document.getElementById("contact-name"), "Please enter your full name."],
      [document.getElementById("contact-email"), "Please enter your business email."],
      [document.getElementById("contact-company"), "Please enter your company name."],
      [document.getElementById("contact-situation"), "Please describe your situation."]
    ];
    let valid = true;

    required.forEach(([field, message]) => {
      if (!field.value.trim()) {
        field.setAttribute("aria-invalid", "true");
        document.getElementById(`${field.id}-error`).textContent = message;
        valid = false;
      }
    });

    const email = document.getElementById("contact-email");
    if (email.value.trim() && !inquiryEmailIsValid(email.value.trim())) {
      email.setAttribute("aria-invalid", "true");
      document.getElementById("contact-email-error").textContent = "Please enter a valid email address.";
      valid = false;
    }

    if (!valid) {
      inquiryMessage.textContent = "Please correct the highlighted fields.";
      inquiryMessage.classList.add("is-error");
      return;
    }

    inquiryMessage.textContent = "Thank you. Your details passed validation. This demo does not send or store submissions.";
    inquiryMessage.classList.add("is-success");
    inquiryForm.reset();
  });

  const selectedInterest = new URLSearchParams(window.location.search).get("interest");
  const interestSelect = document.getElementById("contact-interest");
  const interestLabels = {
    strategy: "Strategy & Operating Model",
    leadership: "Organization & Leadership",
    transformation: "Transformation Delivery",
    growth: "Growth Readiness Review"
  };
  if (selectedInterest && interestLabels[selectedInterest]) {
    interestSelect.value = interestLabels[selectedInterest];
  }
}

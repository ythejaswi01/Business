const DEMO_SESSION_KEY = "stacklyDemoSession";

const emailIsValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const setFieldError = (field, message) => {
  const error = document.getElementById(`${field.id}-error`);
  field.setAttribute("aria-invalid", message ? "true" : "false");
  if (error) {
    error.textContent = message;
  }
};

const clearFormErrors = (form) => {
  form.querySelectorAll("input").forEach((field) => setFieldError(field, ""));
};

const setFormMessage = (element, message, type) => {
  element.textContent = message;
  element.classList.toggle("is-success", type === "success");
  element.classList.toggle("is-error", type === "error");
};

const getDisplayName = (email) => {
  const localPart = email.split("@")[0].replace(/[._-]+/g, " ").trim();
  return localPart.replace(/\b\w/g, (letter) => letter.toUpperCase()) || "there";
};

const saveDemoSession = (name, email, remember) => {
  const session = JSON.stringify({ name, email });
  localStorage.removeItem(DEMO_SESSION_KEY);
  sessionStorage.removeItem(DEMO_SESSION_KEY);
  if (remember) {
    localStorage.setItem(DEMO_SESSION_KEY, session);
  } else {
    sessionStorage.setItem(DEMO_SESSION_KEY, session);
  }
};

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

document.querySelectorAll("[data-toggle-password]").forEach((button) => {
  button.addEventListener("click", () => {
    const field = document.getElementById(button.dataset.togglePassword);
    if (!field) {
      return;
    }

    const showPassword = field.type === "password";
    field.type = showPassword ? "text" : "password";
    button.textContent = showPassword ? "Hide" : "Show";
    button.setAttribute("aria-label", showPassword ? "Hide password" : "Show password");
    button.setAttribute("aria-pressed", String(showPassword));
    field.focus();
  });
});

document.querySelectorAll(".auth-form input").forEach((field) => {
  field.addEventListener("input", () => setFieldError(field, ""));
  field.addEventListener("change", () => setFieldError(field, ""));
});

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFormErrors(loginForm);
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const message = document.getElementById("login-message");
    let isValid = true;

    if (!email.value.trim()) {
      setFieldError(email, "Enter your email address.");
      isValid = false;
    } else if (!emailIsValid(email.value.trim())) {
      setFieldError(email, "Enter a valid email address.");
      isValid = false;
    }

    if (!password.value) {
      setFieldError(password, "Enter your password.");
      isValid = false;
    }

    if (!isValid) {
      setFormMessage(message, "Please correct the highlighted fields.", "error");
      return;
    }

    const emailValue = email.value.trim();
    const name = getDisplayName(emailValue);
    const remember = document.getElementById("remember-me").checked;
    saveDemoSession(name, emailValue, remember);
    setFormMessage(message, "Demo sign in successful. Opening your welcome page…", "success");
    loginForm.querySelector('button[type="submit"]').disabled = true;
    window.setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 500);
  });
}

const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFormErrors(registerForm);
    const name = document.getElementById("full-name");
    const email = document.getElementById("business-email");
    const company = document.getElementById("company");
    const phone = document.getElementById("phone");
    const password = document.getElementById("new-password");
    const confirmPassword = document.getElementById("confirm-password");
    const terms = document.getElementById("terms");
    const message = document.getElementById("register-message");
    let isValid = true;

    const requiredFields = [
      [name, "Enter your full name."],
      [email, "Enter your business email."],
      [company, "Enter your company name."],
      [phone, "Enter your phone number."],
      [password, "Create a password."],
      [confirmPassword, "Confirm your password."]
    ];

    requiredFields.forEach(([field, error]) => {
      if (!field.value.trim()) {
        setFieldError(field, error);
        isValid = false;
      }
    });

    if (email.value.trim() && !emailIsValid(email.value.trim())) {
      setFieldError(email, "Enter a valid email address.");
      isValid = false;
    }

    if (password.value && password.value.length < 8) {
      setFieldError(password, "Use at least 8 characters.");
      isValid = false;
    }

    if (confirmPassword.value && password.value !== confirmPassword.value) {
      setFieldError(confirmPassword, "Passwords do not match.");
      isValid = false;
    }

    if (!terms.checked) {
      setFieldError(terms, "Accept the terms to continue.");
      isValid = false;
    }

    if (!isValid) {
      setFormMessage(message, "Please correct the highlighted fields.", "error");
      return;
    }

    saveDemoSession(name.value.trim(), email.value.trim(), true);
    setFormMessage(message, "Demo account ready. Opening your welcome page…", "success");
    registerForm.querySelector('button[type="submit"]').disabled = true;
    window.setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 500);
  });
}

const forgotForm = document.getElementById("forgot-form");
if (forgotForm) {
  forgotForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFormErrors(forgotForm);
    const email = document.getElementById("recovery-email");
    const message = document.getElementById("forgot-message");
    const value = email.value.trim();

    if (!value) {
      setFieldError(email, "Enter your email address.");
      setFormMessage(message, "Please enter your email address.", "error");
      return;
    }

    if (!emailIsValid(value)) {
      setFieldError(email, "Enter a valid email address.");
      setFormMessage(message, "Please enter a valid email address.", "error");
      return;
    }

    setFormMessage(message, "Demo request received. No reset email was sent.", "success");
  });
}

const DEMO_SESSION_KEY = "stacklyDemoSession";
const storedSession = localStorage.getItem(DEMO_SESSION_KEY) || sessionStorage.getItem(DEMO_SESSION_KEY);
let session = null;

if (storedSession) {
  try {
    const parsed = JSON.parse(storedSession);
    if (typeof parsed.name === "string" && typeof parsed.email === "string") {
      session = parsed;
    } else {
      throw new TypeError("The saved Stackly demo session has an invalid shape.");
    }
  } catch (error) {
    localStorage.removeItem(DEMO_SESSION_KEY);
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    console.error("Could not read the Stackly demo session.", error);
  }
}

if (!session) {
  window.location.replace("login.html");
} else {
  document.getElementById("user-name").textContent = session.name;
  document.getElementById("user-email").textContent = session.email;
}

document.querySelector("[data-current-year]").textContent = String(new Date().getFullYear());

document.getElementById("logout-button").addEventListener("click", () => {
  localStorage.removeItem(DEMO_SESSION_KEY);
  sessionStorage.removeItem(DEMO_SESSION_KEY);
  window.location.href = "login.html";
});

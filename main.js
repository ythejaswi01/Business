const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");
const currentYear = document.querySelector("#current-year");
const siteHeader = document.querySelector(".site-header");

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}
document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

if (menuToggle && primaryNavigation) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    primaryNavigation.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
    primaryNavigation.classList.toggle("is-open", !isExpanded);
  });

  primaryNavigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 640) {
      closeMenu();
    }
  });
}

const revealObserverSupported = "IntersectionObserver" in window;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let revealObserver = null;

if (revealObserverSupported && !reducedMotion) {
  revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

  const addReveal = (selector, direction = "up", stagger = 0) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add("reveal", `reveal--${direction}`);
      if (stagger) {
        element.style.setProperty("--reveal-delay", `${index * stagger}ms`);
      }
      revealObserver.observe(element);
    });
  };

  addReveal(".section-kicker", "up");
  addReveal(".turning-grid h2", "left");
  addReveal(".turning-copy", "right");
  addReveal(".friction-list > div", "up", 90);
  addReveal(".section-heading-row h2", "left");
  addReveal(".section-heading-row > p", "right");
  addReveal(".service-row", "up", 90);
  addReveal(".approach-step", "up", 130);
  addReveal(".work-image", "left");
  addReveal(".work-copy", "right");
  addReveal(".people-heading", "left");
  addReveal(".people-copy", "right");
  addReveal(".testimonial-inner > *", "up", 100);
  addReveal(".leadership-image", "left");
  addReveal(".leadership-copy", "right");
  addReveal(".together-grid > *", "up", 100);
  addReveal(".contact-inner > *", "up", 100);
  addReveal(".interior-hero-copy", "left");
  addReveal(".interior-hero-image", "right", 100);
  addReveal(".contact-hero > *", "up", 80);
  addReveal(".work-hero > *", "up", 80);
  addReveal(".service-feature", "up", 100);
  addReveal(".contact-form-panel", "up");
  addReveal(".contact-aside > *", "right", 100);

  document.documentElement.classList.add("has-scroll-reveal");
}

if (siteHeader) {
  const updateHeader = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

const navigationLinks = primaryNavigation
  ? Array.from(primaryNavigation.querySelectorAll("a"))
  : [];

if (navigationLinks.length) {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  navigationLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });
}

document.querySelectorAll("[data-reveal]").forEach((element, index) => {
  const direction = element.dataset.reveal || "up";
  element.classList.add("reveal", `reveal--${direction}`);
  const delay = Number(element.dataset.revealDelay || 0);
  if (delay) {
    element.style.setProperty("--reveal-delay", `${delay + index * 80}ms`);
  }
  if (revealObserverSupported && !reducedMotion) {
    revealObserver.observe(element);
  } else {
    element.classList.add("is-visible");
  }
});

const statisticNodes = document.querySelectorAll(".metrics strong, .case-outcomes strong");
if (revealObserverSupported && !reducedMotion && statisticNodes.length) {
  const statisticObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const walker = document.createTreeWalker(entry.target, NodeFilter.SHOW_TEXT);
      let textNode = walker.nextNode();
      while (textNode) {
        const originalText = textNode.textContent;
        if (/\d/.test(originalText)) {
          const currentTextNode = textNode;
          const numberTokens = [...originalText.matchAll(/\d+/g)];
          const startedAt = performance.now();
          const duration = 850;
          const update = (now) => {
            const progress = Math.min((now - startedAt) / duration, 1);
            const easedProgress = 1 - (1 - progress) ** 3;
            let tokenIndex = 0;
            currentTextNode.textContent = originalText.replace(/\d+/g, () => {
              const targetValue = Number(numberTokens[tokenIndex][0]);
              tokenIndex += 1;
              return String(Math.round(targetValue * easedProgress));
            });
            if (progress < 1) {
              window.requestAnimationFrame(update);
            } else {
              currentTextNode.textContent = originalText;
            }
          };
          window.requestAnimationFrame(update);
        }
        textNode = walker.nextNode();
      }
      observer.unobserve(entry.target);
    });
  }, { threshold: .55 });

  statisticNodes.forEach((statistic) => statisticObserver.observe(statistic));
}

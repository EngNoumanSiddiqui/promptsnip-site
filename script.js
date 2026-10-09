const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");

toggle?.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";

  toggle.setAttribute("aria-expanded", String(!open));
  toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
  links?.classList.toggle("open", !open);
});

document.querySelectorAll(".nav-links a").forEach((a) =>
  a.addEventListener("click", () => {
    toggle?.setAttribute("aria-expanded", "false");
    links?.classList.remove("open");
  }),
);

const page = document.body.dataset.page;

document.querySelector(`[data-nav="${page}"]`)?.classList.add("active");

const year = document.getElementById("year");

if (year) year.textContent = new Date().getFullYear();

if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );

  document
    .querySelectorAll(
      ".interactive-card,.workflow-track article,.split-grid,.two-cards>* ,.process-step,.policy-box,.faq-list details",
    )
    .forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });
}

(() => {
  "use strict";

  const images = Array.from(document.querySelectorAll('main img[src*="assets/illustrations/"]'));

  if (!images.length) return;

  let currentIndex = 0;
  let previousFocus = null;
  const lightbox = document.createElement("div");

  lightbox.className = "ps-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "PromptSnip illustration viewer");
  lightbox.setAttribute("aria-hidden", "true");

  lightbox.innerHTML = `
    <button
      type="button"
      class="ps-lightbox-control ps-lightbox-close"
      aria-label="Close image"
    >×</button>

    <button
      type="button"
      class="ps-lightbox-control ps-lightbox-prev"
      aria-label="Previous image"
    >‹</button>

    <img class="ps-lightbox-image" alt="" />

    <button
      type="button"
      class="ps-lightbox-control ps-lightbox-next"
      aria-label="Next image"
    >›</button>

    <div class="ps-lightbox-caption" aria-live="polite">
      <span class="ps-lightbox-title"></span>
      <span class="ps-lightbox-count"></span>
    </div>
  `;

  document.body.appendChild(lightbox);

  const largeImage = lightbox.querySelector(".ps-lightbox-image");
  const title = lightbox.querySelector(".ps-lightbox-title");
  const count = lightbox.querySelector(".ps-lightbox-count");
  const closeButton = lightbox.querySelector(".ps-lightbox-close");
  const prevButton = lightbox.querySelector(".ps-lightbox-prev");
  const nextButton = lightbox.querySelector(".ps-lightbox-next");

  let oldOverflow = "";

  function showImage(index) {
    currentIndex = (index + images.length) % images.length;

    const selected = images[currentIndex];

    largeImage.src = selected.currentSrc || selected.src;
    largeImage.alt = selected.alt || "PromptSnip illustration";

    title.textContent = selected.alt || "PromptSnip";
    count.textContent = `${currentIndex + 1} / ${images.length}`;
  }

  function openLightbox(index) {
    previousFocus = document.activeElement;
    oldOverflow = document.body.style.overflow;

    showImage(index);

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = oldOverflow;

    largeImage.removeAttribute("src");

    if (previousFocus?.focus) {
      previousFocus.focus();
    }
  }

  function changeImage(direction) {
    showImage(currentIndex + direction);
  }

  images.forEach((img, index) => {
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.setAttribute(
      "aria-label",
      `Enlarge ${img.alt || "PromptSnip illustration"}`,
    );

    img.addEventListener("click", () => {
      openLightbox(index);
    });

    img.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  prevButton.addEventListener("click", () => {
    changeImage(-1);
  });

  nextButton.addEventListener("click", () => {
    changeImage(1);
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      changeImage(-1);
    } else if (event.key === "ArrowRight") {
      changeImage(1);
    } else if (event.key === "Tab") {
      const controls = [closeButton, prevButton, nextButton];

      const index = controls.indexOf(document.activeElement);

      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        nextButton.focus();
      } else if (!event.shiftKey && index === 2) {
        event.preventDefault();
        closeButton.focus();
      }
    }
  });
})();

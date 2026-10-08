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

  document.querySelectorAll(".interactive-card,.workflow-track article,.split-grid,.two-cards>* ,.process-step,.policy-box,.faq-list details")
  .forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}

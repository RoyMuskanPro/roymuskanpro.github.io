const root = document.documentElement;
const themeToggle = document.querySelector<HTMLButtonElement>(".theme-toggle");
const themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

function currentTheme() {
  return root.dataset.theme === "dark" ? "dark" : "light";
}

function setTheme(theme: "light" | "dark", persist = false) {
  root.dataset.theme = theme;
  themeMeta?.setAttribute("content", theme === "dark" ? "#15191b" : "#f6f7f6");

  if (themeToggle) {
    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
  }

  if (persist) {
    try {
      localStorage.setItem("muskan-theme", theme);
    } catch {
      // The theme still applies for this visit when storage is unavailable.
    }
  }
}

setTheme(currentTheme());
themeToggle?.addEventListener("click", () => {
  setTheme(currentTheme() === "dark" ? "light" : "dark", true);
});

const menuToggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
const mobileNav = document.querySelector<HTMLElement>(".mobile-nav");

function closeMenu() {
  if (!menuToggle || !mobileNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  mobileNav.hidden = true;
}

menuToggle?.addEventListener("click", () => {
  if (!mobileNav) return;
  const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  menuToggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
  mobileNav.hidden = !willOpen;
});

mobileNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("resize", () => {
  if (window.innerWidth >= 820) closeMenu();
});

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll<HTMLElement>(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  revealItems.forEach((item) => observer.observe(item));
}

const dialog = document.querySelector<HTMLDialogElement>(".image-dialog");
const dialogImage = dialog?.querySelector<HTMLImageElement>("img");
const dialogCaption = dialog?.querySelector<HTMLElement>("#dialog-caption");
const closeDialogButton = dialog?.querySelector<HTMLButtonElement>(".dialog-close");
const previousImageButton = dialog?.querySelector<HTMLButtonElement>(".dialog-previous");
const nextImageButton = dialog?.querySelector<HTMLButtonElement>(".dialog-next");
const lightboxLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-lightbox]"));
let activeImageIndex = 0;

function showLightboxImage(index: number) {
  if (!dialogImage || lightboxLinks.length === 0) return;

  activeImageIndex = (index + lightboxLinks.length) % lightboxLinks.length;
  const link = lightboxLinks[activeImageIndex];
  const preview = link.querySelector<HTMLImageElement>("img");

  dialogImage.src = link.href;
  dialogImage.alt = preview?.alt || "Enlarged report screenshot";
  if (dialogCaption) {
    const caption = link.dataset.caption || "Report screenshot";
    dialogCaption.textContent = `${activeImageIndex + 1} of ${lightboxLinks.length} — ${caption}`;
  }
}

lightboxLinks.forEach((link, index) => {
  link.addEventListener("click", (event) => {
    if (!dialog || !dialogImage || typeof dialog.showModal !== "function") return;
    event.preventDefault();
    showLightboxImage(index);
    dialog.showModal();
  });
});

previousImageButton?.addEventListener("click", () => showLightboxImage(activeImageIndex - 1));
nextImageButton?.addEventListener("click", () => showLightboxImage(activeImageIndex + 1));
closeDialogButton?.addEventListener("click", () => dialog?.close());
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
dialog?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showLightboxImage(activeImageIndex - 1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    showLightboxImage(activeImageIndex + 1);
  }
});

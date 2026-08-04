"use strict";

document.documentElement.classList.add("js");

const menuToggle = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-site-nav]");
const overlay = document.querySelector("[data-mobile-overlay]");
const callDropdown = document.querySelector("[data-call-dropdown]");
const callToggle = document.querySelector("[data-call-toggle]");
const callMenu = document.querySelector("[data-call-menu]");

function setCallDropdown(open) {
  if (!callDropdown || !callToggle) return;
  callDropdown.classList.toggle("is-open", open);
  callToggle.setAttribute("aria-expanded", String(open));
}

function setMenu(open) {
  if (!menuToggle || !siteNav || !overlay) return;
  siteNav.classList.toggle("is-open", open);
  overlay.classList.toggle("is-visible", open);
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  if (!open) setCallDropdown(false);
}

menuToggle?.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

overlay?.addEventListener("click", () => setMenu(false));

callToggle?.addEventListener("click", () => {
  setCallDropdown(callToggle.getAttribute("aria-expanded") !== "true");
});

callToggle?.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowDown") return;
  event.preventDefault();
  setCallDropdown(true);
  callMenu?.querySelector("a")?.focus();
});

callMenu?.addEventListener("keydown", (event) => {
  const links = Array.from(callMenu.querySelectorAll("a"));
  const currentIndex = links.indexOf(document.activeElement);

  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const direction = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = (currentIndex + direction + links.length) % links.length;
    links[nextIndex]?.focus();
  }
});

document.addEventListener("click", (event) => {
  if (callDropdown && !callDropdown.contains(event.target)) setCallDropdown(false);
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (callToggle?.getAttribute("aria-expanded") === "true") {
    setCallDropdown(false);
    callToggle.focus();
    return;
  }

  setMenu(false);
});

window.addEventListener("resize", () => {
  setCallDropdown(false);
  if (window.innerWidth > 820) setMenu(false);
});

// Automatically display the current year.
document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

// Lightweight reveal animation. Content stays visible when JS is unavailable.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -24px" });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Accessible testimonial slider.
const track = document.querySelector("[data-testimonial-track]");
const slides = track ? Array.from(track.children) : [];
const previousButton = document.querySelector("[data-testimonial-prev]");
const nextButton = document.querySelector("[data-testimonial-next]");
const slider = track?.closest(".testimonial-shell");
let currentSlide = 0;
let autoPlayTimer;

function showSlide(index) {
  if (!track || slides.length === 0) return;
  currentSlide = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  slides.forEach((slide, slideIndex) => {
    const isCurrent = slideIndex === currentSlide;
    slide.setAttribute("aria-hidden", String(!isCurrent));
    slide.querySelectorAll("a, button").forEach((control) => {
      control.tabIndex = isCurrent ? 0 : -1;
    });
  });
}

function stopAutoPlay() {
  window.clearInterval(autoPlayTimer);
}

function startAutoPlay() {
  stopAutoPlay();
  if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  autoPlayTimer = window.setInterval(() => showSlide(currentSlide + 1), 7000);
}

previousButton?.addEventListener("click", () => {
  showSlide(currentSlide - 1);
  startAutoPlay();
});

nextButton?.addEventListener("click", () => {
  showSlide(currentSlide + 1);
  startAutoPlay();
});

slider?.addEventListener("mouseenter", stopAutoPlay);
slider?.addEventListener("mouseleave", startAutoPlay);
slider?.addEventListener("focusin", stopAutoPlay);
slider?.addEventListener("focusout", startAutoPlay);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopAutoPlay();
  else startAutoPlay();
});

showSlide(0);
startAutoPlay();

// Live business-hours status. All calculations use Pretoria time, regardless
// of the visitor's own device time zone.
const BUSINESS_TIME_ZONE = "Africa/Johannesburg";
const WEEK_ORDER = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const BUSINESS_HOURS = {
  sunday: { open: 8 * 60, close: 13 * 60 },
  monday: { open: 8 * 60, close: 18 * 60 },
  tuesday: { open: 8 * 60, close: 18 * 60 },
  wednesday: { open: 8 * 60, close: 18 * 60 },
  thursday: { open: 8 * 60, close: 18 * 60 },
  friday: { open: 8 * 60, close: 18 * 60 },
  saturday: { open: 8 * 60, close: 17 * 60 }
};

function getPretoriaParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-ZA", {
    timeZone: BUSINESS_TIME_ZONE,
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map(({ type, value }) => [type, value]));
  return {
    weekday: parts.weekday.toLowerCase(),
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
    formattedTime: new Intl.DateTimeFormat("en-ZA", {
      timeZone: BUSINESS_TIME_ZONE,
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).format(date)
  };
}

function formatMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function getBusinessStatus(date = new Date()) {
  const now = getPretoriaParts(date);
  const todayHours = BUSINESS_HOURS[now.weekday];
  const isOpen = now.minutes >= todayHours.open && now.minutes < todayHours.close;

  if (isOpen) {
    return {
      isOpen: true,
      weekday: now.weekday,
      label: "Open now",
      detail: `Closes today at ${formatMinutes(todayHours.close)}`,
      formattedTime: now.formattedTime
    };
  }

  if (now.minutes < todayHours.open) {
    return {
      isOpen: false,
      weekday: now.weekday,
      label: "Closed now",
      detail: `Opens today at ${formatMinutes(todayHours.open)}`,
      formattedTime: now.formattedTime
    };
  }

  const todayIndex = WEEK_ORDER.indexOf(now.weekday);
  for (let offset = 1; offset <= 7; offset += 1) {
    const nextDay = WEEK_ORDER[(todayIndex + offset) % WEEK_ORDER.length];
    const nextHours = BUSINESS_HOURS[nextDay];
    if (!nextHours) continue;
    const dayLabel = offset === 1 ? "tomorrow" : nextDay.charAt(0).toUpperCase() + nextDay.slice(1);
    return {
      isOpen: false,
      weekday: now.weekday,
      label: "Closed now",
      detail: `Opens ${dayLabel} at ${formatMinutes(nextHours.open)}`,
      formattedTime: now.formattedTime
    };
  }

  return {
    isOpen: false,
    weekday: now.weekday,
    label: "Closed now",
    detail: "Please call a branch to confirm trading hours.",
    formattedTime: now.formattedTime
  };
}

function updateBusinessHours() {
  const status = getBusinessStatus();
  const mainStatus = document.querySelector("[data-open-status]");
  const statusLabel = document.querySelector("[data-status-label]");
  const statusDetail = document.querySelector("[data-status-detail]");
  const localTime = document.querySelector("[data-local-time]");

  if (mainStatus) {
    mainStatus.classList.toggle("is-open", status.isOpen);
    mainStatus.classList.toggle("is-closed", !status.isOpen);
  }
  if (statusLabel) statusLabel.textContent = status.label;
  if (statusDetail) statusDetail.textContent = status.detail;
  if (localTime) localTime.textContent = status.formattedTime;

  document.querySelectorAll("[data-branch-status]").forEach((badge) => {
    badge.textContent = status.label;
    badge.classList.toggle("is-open", status.isOpen);
    badge.classList.toggle("is-closed", !status.isOpen);
  });

  document.querySelectorAll("[data-hours-day]").forEach((row) => {
    row.classList.toggle("is-today", row.dataset.hoursDay === status.weekday);
  });
}

updateBusinessHours();
window.setInterval(updateBusinessHours, 60 * 1000);

(function () {
  "use strict";

  var SUPPORTED = ["en", "ko", "zh"];
  var STORAGE_KEY = "cv-lang";
  var LANG_LABELS = { en: "EN", ko: "KO", zh: "中文" };

  function detectDefaultLang() {
    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* localStorage unavailable (e.g. privacy mode) — fall back below */
    }
    if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;

    var browserLang = (navigator.language || "en").toLowerCase();
    if (browserLang.indexOf("ko") === 0) return "ko";
    if (browserLang.indexOf("zh") === 0) return "zh";
    return "en";
  }

  function applyLang(lang) {
    var dict = window.CV_I18N[lang] || window.CV_I18N.en;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        el.textContent = dict[key];
      }
    });

    // A few strings (e.g. the hero headline) wrap one phrase in a gradient
    // span for emphasis. Those keys live in the same dictionaries but are
    // applied as markup, not plain text — the content is ours, never user
    // input, so innerHTML here carries no injection risk.
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        el.innerHTML = dict[key];
      }
    });

    document.documentElement.lang = lang;

    var toggleLabel = document.querySelector(".lang-toggle-current");
    if (toggleLabel) toggleLabel.textContent = LANG_LABELS[lang] || lang.toUpperCase();

    document.querySelectorAll(".lang-menu button[data-lang]").forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang") === lang;
      btn.setAttribute("aria-checked", isActive ? "true" : "false");
    });

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore — language switching still works for this page view */
    }
  }

  var REDUCE_MOTION = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initScrollReveal() {
    var targets = document.querySelectorAll("[data-reveal]");
    if (REDUCE_MOTION || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initLangToggle() {
    var wrapper = document.querySelector(".lang-switch");
    var toggle = document.querySelector(".lang-toggle");
    var menu = document.querySelector(".lang-menu");
    if (!wrapper || !toggle || !menu) return;

    function openMenu() {
      menu.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
    }
    function closeMenu(focusToggle) {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      if (focusToggle) toggle.focus();
    }

    toggle.addEventListener("click", function () {
      if (menu.hidden) openMenu();
      else closeMenu(false);
    });

    menu.querySelectorAll("button[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-lang"));
        closeMenu(true);
      });
    });

    document.addEventListener("click", function (event) {
      if (!menu.hidden && !wrapper.contains(event.target)) closeMenu(false);
    });

    wrapper.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !menu.hidden) closeMenu(true);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyLang(detectDefaultLang());
    initLangToggle();
    initScrollReveal();
  });
})();

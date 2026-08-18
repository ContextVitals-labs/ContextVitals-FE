(function () {
  "use strict";

  var SUPPORTED = ["en", "ko", "zh"];
  var STORAGE_KEY = "cv-lang";

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

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang") === lang;
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
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

  document.addEventListener("DOMContentLoaded", function () {
    applyLang(detectDefaultLang());

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-lang"));
      });
    });

    initScrollReveal();
  });
})();

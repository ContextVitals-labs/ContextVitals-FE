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

  document.addEventListener("DOMContentLoaded", function () {
    applyLang(detectDefaultLang());

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-lang"));
      });
    });
  });
})();

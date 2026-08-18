/**
 * Generates and renders the ECG-style "pulse trace" used throughout the
 * site — it's not decoration for its own sake, it's the same waveform in
 * the product's logo (a heartbeat line inside a chat bubble), reused as the
 * site's one recurring signature device instead of a generic gradient blob.
 *
 * Paths are generated procedurally (not hand-authored) so the same function
 * can produce a calm, mostly-flat line for "Good" and an erratic, spiky one
 * for "Critical" just by changing two numbers.
 */
(function () {
  "use strict";

  function mulberry32(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function buildPulsePath(width, height, options) {
    var opts = options || {};
    var segments = opts.segments || 5;
    var spikeHeight = opts.spikeHeight != null ? opts.spikeHeight : height * 0.32;
    var jitter = opts.jitter != null ? opts.jitter : 0.12;
    var seed = opts.seed != null ? opts.seed : 7;

    var rand = mulberry32(seed);
    var midY = height / 2;
    var segWidth = width / segments;
    var d = "M 0 " + midY.toFixed(2);

    for (var i = 0; i < segments; i++) {
      var x0 = i * segWidth;
      var flatLen = segWidth * (0.32 + rand() * 0.16);
      var spikeLen = segWidth - flatLen;
      var dir = rand() > 0.5 ? 1 : -1;
      var spikeMag = spikeHeight * (0.35 + rand() * 0.65) * dir;
      var wobble = (rand() - 0.5) * jitter * height;

      d += " L " + (x0 + flatLen).toFixed(2) + " " + (midY + wobble).toFixed(2);
      d += " L " + (x0 + flatLen + spikeLen * 0.26).toFixed(2) + " " + (midY - spikeMag).toFixed(2);
      d += " L " + (x0 + flatLen + spikeLen * 0.48).toFixed(2) + " " + (midY + spikeMag * 0.55).toFixed(2);
      d += " L " + (x0 + flatLen + spikeLen).toFixed(2) + " " + midY.toFixed(2);
    }
    return d;
  }

  var REDUCE_MOTION = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SVG_NS = "http://www.w3.org/2000/svg";

  function renderPulse(container, opts) {
    var rect = container.getBoundingClientRect();
    var width = Math.max(rect.width, 80);
    var height = Number(container.getAttribute("data-pulse-height")) || 48;

    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("class", "pulse-svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    var d = buildPulsePath(width, height, opts);

    var basePath = document.createElementNS(SVG_NS, "path");
    basePath.setAttribute("d", d);
    basePath.setAttribute("class", "pulse-path-base");
    svg.appendChild(basePath);

    if (!REDUCE_MOTION) {
      var tracePath = document.createElementNS(SVG_NS, "path");
      tracePath.setAttribute("d", d);
      tracePath.setAttribute("class", "pulse-path-trace");
      svg.appendChild(tracePath);
      container.appendChild(svg);
      // getTotalLength() needs the path attached to a rendered SVG first.
      var len = tracePath.getTotalLength();
      tracePath.style.setProperty("--len", String(len));
    } else {
      container.appendChild(svg);
    }
  }

  function renderAll() {
    document.querySelectorAll("[data-pulse]").forEach(function (container) {
      var kind = container.getAttribute("data-pulse");
      var presets = {
        hero: { segments: 6, spikeHeight: 16, jitter: 0.08, seed: 3 },
        divider: { segments: 10, spikeHeight: 6, jitter: 0.04, seed: 11 },
        "band-good": { segments: 6, spikeHeight: 3, jitter: 0.03, seed: 21 },
        "band-moderate": { segments: 6, spikeHeight: 8, jitter: 0.06, seed: 22 },
        "band-high": { segments: 6, spikeHeight: 14, jitter: 0.1, seed: 23 },
        "band-critical": { segments: 6, spikeHeight: 20, jitter: 0.16, seed: 24 },
        brand: { segments: 3, spikeHeight: 5, jitter: 0.05, seed: 1 },
      };
      renderPulse(container, presets[kind] || presets.hero);
    });
  }

  document.addEventListener("DOMContentLoaded", renderAll);

  window.CV_PULSE = { buildPulsePath: buildPulsePath, renderPulse: renderPulse, renderAll: renderAll };
})();

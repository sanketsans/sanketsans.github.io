// Motion graphics layer — vanilla JS, inspired by Efecto's presets
// (dotGrid shader, grain, mask reveals, per-word entrances, glitch).
// Everything is skipped under prefers-reduced-motion.
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  document.documentElement.classList.add("motion");

  // --- 1. Interactive dot grid behind the sidebar ---
  // Dots breathe in a slow wave and swell around the cursor.
  function dotGrid(host) {
    var canvas = document.createElement("canvas");
    canvas.className = "dot-grid";
    canvas.setAttribute("aria-hidden", "true");
    host.insertBefore(canvas, host.querySelector(".header__content"));

    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var gap = 18, w = 0, h = 0;
    var mouse = { x: -9999, y: -9999 };
    var visible = true;

    function resize() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function frame(t) {
      if (visible) {
        ctx.clearRect(0, 0, w, h);
        var time = t * 0.0006;
        for (var y = gap / 2; y < h; y += gap) {
          for (var x = gap / 2; x < w; x += gap) {
            var wave = Math.sin(x * 0.03 + time) * Math.cos(y * 0.025 - time * 0.8);
            var dx = x - mouse.x, dy = y - mouse.y;
            var near = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 140);
            var r = 0.6 + (wave + 1) * 0.45 + near * 2.4;
            var a = 0.08 + (wave + 1) * 0.06 + near * 0.6;
            ctx.fillStyle = near > 0.05
              ? "rgba(180,140,222," + a + ")"
              : "rgba(255,255,255," + a + ")";
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 6.2832);
            ctx.fill();
          }
        }
      }
      requestAnimationFrame(frame);
    }

    host.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    host.addEventListener("pointerleave", function () {
      mouse.x = mouse.y = -9999;
    });
    document.addEventListener("visibilitychange", function () {
      visible = !document.hidden;
    });
    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(frame);
  }

  // --- 2. Text scramble / decode on the site title ---
  var GLYPHS = "!<>-_\\/[]{}=+*^?#01";
  function scramble(el) {
    var text = el.textContent.trim();
    var running = false;
    function run() {
      if (running) return;
      running = true;
      var start = performance.now(), dur = 700;
      (function tick(now) {
        var p = Math.min(1, (now - start) / dur);
        var out = "";
        for (var i = 0; i < text.length; i++) {
          if (text[i] === " " || i / text.length < p) out += text[i];
          else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
        if (p < 1) requestAnimationFrame(tick);
        else { el.textContent = text; running = false; }
      })(start);
    }
    run();
    el.addEventListener("mouseenter", run);
  }

  // --- 3. Per-word mask reveal for page headings ---
  function splitWords(el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    el.setAttribute("aria-label", words.join(" "));
    words.forEach(function (word, i) {
      var mask = document.createElement("span");
      mask.className = "word-mask";
      mask.setAttribute("aria-hidden", "true");
      var inner = document.createElement("span");
      inner.className = "word-mask__inner";
      inner.style.transitionDelay = (0.15 + i * 0.07) + "s";
      inner.textContent = word;
      mask.appendChild(inner);
      el.appendChild(mask);
      el.appendChild(document.createTextNode(" "));
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { el.classList.add("is-split-in"); });
    });
  }

  // --- 4. Scroll progress bar ---
  function progressBar() {
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  // --- 5. Cursor spotlight + tilt on post cards ---
  function cardSpotlight(card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", px * 100 + "%");
      card.style.setProperty("--my", py * 100 + "%");
      card.style.setProperty("--rx", (0.5 - py) * 4 + "deg");
      card.style.setProperty("--ry", (px - 0.5) * 4 + "deg");
    });
    card.addEventListener("pointerleave", function () {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  }

  // --- 6. Iris / diagonal mask reveal for images on scroll ---
  function maskReveal(els) {
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-unmasked");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    els.forEach(function (el, i) {
      el.classList.add(i % 2 ? "mask-diagonal" : "mask-iris");
      io.observe(el);
    });
  }

  function init() {
    var header = document.querySelector(".header");
    if (header) dotGrid(header);

    var title = document.querySelector(".header__title");
    if (title) scramble(title);

    document.querySelectorAll(".intro h1, .hero__title").forEach(splitWords);

    progressBar();

    document.querySelectorAll(".blog-post").forEach(cardSpotlight);

    // Stagger index for the underline draw-in, capped so long pages don't lag.
    document.querySelectorAll("[data-animate]").forEach(function (section) {
      section.querySelectorAll("a").forEach(function (a, i) {
        a.style.setProperty("--link-i", Math.min(i, 12));
      });
    });

    maskReveal(Array.prototype.slice.call(
      document.querySelectorAll(".blog-post__image, .single img:not(.emoji)")
    ));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

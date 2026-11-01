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
  // Without a photo, dots breathe in a slow wave and swell around the cursor.
  // With the page's featured photo, the dots become a halftone portrait, and a
  // soft lens follows the cursor revealing the real photo underneath.
  function dotGrid(host) {
    var canvas = document.createElement("canvas");
    canvas.className = "dot-grid";
    canvas.setAttribute("aria-hidden", "true");
    host.insertBefore(canvas, host.querySelector(".header__content"));

    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var gap = 18, w = 0, h = 0;
    var mouse = { x: -9999, y: -9999 };
    var lens = { x: 0, y: 0, r: 0 };
    var visible = true;

    var photo = null, lum = null;
    var lensCanvas = document.createElement("canvas");
    var lensCtx = lensCanvas.getContext("2d");

    // Draw `img` into `c` with background-size: cover semantics.
    function cover(c, img) {
      var s = Math.max(w / img.width, h / img.height);
      var iw = img.width * s, ih = img.height * s;
      c.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
    }

    // Sample photo brightness once per grid cell, fading toward the bottom
    // so the name and menu stay readable.
    function sample() {
      // Canvas dimensions are integers; index with the same rounded width
      // or each row drifts when the sidebar width is fractional.
      var sw = Math.round(w), sh = Math.round(h);
      var off = document.createElement("canvas");
      off.width = sw; off.height = sh;
      var octx = off.getContext("2d");
      cover(octx, photo);
      var px = octx.getImageData(0, 0, sw, sh).data;
      lum = [];
      for (var y = gap / 2; y < h; y += gap) {
        var fade = 1 - 0.75 * Math.pow(y / h, 1.6);
        for (var x = gap / 2; x < w; x += gap) {
          var i = (Math.min(y | 0, sh - 1) * sw + Math.min(x | 0, sw - 1)) * 4;
          lum.push((0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255 * fade);
        }
      }
    }

    function resize() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lensCanvas.width = w * dpr; lensCanvas.height = h * dpr;
      lensCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (photo) sample();
    }

    function drawGrid(time) {
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

    function drawHalftone(time) {
      var i = 0;
      for (var y = gap / 2; y < h; y += gap) {
        for (var x = gap / 2; x < w; x += gap, i++) {
          var v = lum[i];
          var dx = x - lens.x, dy = y - lens.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          // Dots inside the lens shrink away; a purple ring rides its edge.
          var inside = lens.r > 0 ? Math.max(0, 1 - d / lens.r) : 0;
          var ring = lens.r > 0 ? Math.max(0, 1 - Math.abs(d - lens.r) / 18) : 0;
          var shimmer = 0.06 * Math.sin(x * 0.05 + y * 0.04 + time * 2);
          var r = Math.max(0, (v + shimmer) * gap * 0.55 * (1 - inside));
          if (r < 0.3) continue;
          ctx.fillStyle = ring > 0.05
            ? "rgba(180,140,222," + (0.5 + ring * 0.5) + ")"
            : "rgba(255,255,255," + (0.35 + v * 0.6) + ")";
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 6.2832);
          ctx.fill();
        }
      }

      // Real photo through a soft-edged circular lens.
      if (lens.r > 1) {
        lensCtx.globalCompositeOperation = "source-over";
        lensCtx.clearRect(0, 0, w, h);
        cover(lensCtx, photo);
        lensCtx.globalCompositeOperation = "destination-in";
        var g = lensCtx.createRadialGradient(lens.x, lens.y, lens.r * 0.55, lens.x, lens.y, lens.r);
        g.addColorStop(0, "rgba(0,0,0,1)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        lensCtx.fillStyle = g;
        lensCtx.fillRect(0, 0, w, h);
        ctx.drawImage(lensCanvas, 0, 0, w, h);
      }
    }

    function frame(t) {
      if (visible) {
        ctx.clearRect(0, 0, w, h);
        var time = t * 0.0006;
        if (lum) {
          // Ease the lens toward the cursor and grow/shrink it on enter/leave.
          var on = mouse.x > -9999;
          if (on) {
            lens.x += (mouse.x - lens.x) * 0.15;
            lens.y += (mouse.y - lens.y) * 0.15;
          }
          lens.r += ((on ? 120 : 0) - lens.r) * 0.12;
          drawHalftone(time);
        } else {
          drawGrid(time);
        }
      }
      requestAnimationFrame(frame);
    }

    // Use the sidebar's featured photo, if this page has one.
    var bg = host.querySelector(".header-image--on");
    var match = bg && /url\(["']?([^"')]+)["']?\)/.exec(bg.style.backgroundImage);
    if (match && match[1]) {
      var img = new Image();
      img.onload = function () {
        photo = img;
        gap = 7;
        host.classList.add("has-halftone");
        sample();
      };
      img.src = match[1];
    }

    host.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      if (lens.r < 1) { lens.x = mouse.x; lens.y = mouse.y; }
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

  // --- 7. Social buttons: brand fill, magnetic pull, popup label ---
  var BRANDS = {
    twitter: "#1d9bf0", medium: "#000000", github: "#6e40c9",
    spotify: "#1db954", linkedin: "#0a66c2", cv: "#b48cde", scholar: "#8ab4f8"
  };

  function socialButton(link) {
    var name = (link.getAttribute("title") || "").trim();
    var key = name.toLowerCase();
    link.style.setProperty("--brand", BRANDS[key] || "#b48cde");
    // Move the label off `title` so the native tooltip doesn't double up.
    link.parentNode.setAttribute("data-label", key === "cv" ? "CV" : name);
    link.setAttribute("aria-label", name);
    link.removeAttribute("title");

    link.addEventListener("pointermove", function (e) {
      var r = link.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2);
      var dy = e.clientY - (r.top + r.height / 2);
      link.style.setProperty("--tx", dx * 0.3 + "px");
      link.style.setProperty("--ty", dy * 0.3 + "px");
    });
    link.addEventListener("pointerleave", function () {
      link.style.setProperty("--tx", "0px");
      link.style.setProperty("--ty", "0px");
    });
  }

  function init() {
    var header = document.querySelector(".header");
    if (header) dotGrid(header);

    var title = document.querySelector(".header__title");
    if (title) scramble(title);

    document.querySelectorAll(".intro h1, .hero__title").forEach(splitWords);

    progressBar();

    document.querySelectorAll(".header .socials__item__link").forEach(socialButton);

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

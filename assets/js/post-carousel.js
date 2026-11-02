// Posts carousel — paired with _includes/post-carousel.html.
// Native scroll-snap does the positioning; this adds mouse drag, buttons,
// keyboard, counter/progress, depth falloff, and generative card covers.
(function () {
  "use strict";

  var root = document.querySelector(".post-carousel");
  if (!root) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var track = root.querySelector(".js-pc-track");
  var cards = Array.prototype.slice.call(track.querySelectorAll(".post-card"));
  var prev = root.querySelector(".js-pc-prev");
  var next = root.querySelector(".js-pc-next");
  var current = root.querySelector(".js-pc-current");
  var bar = root.querySelector(".js-pc-bar");
  var active = 0;

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function step() {
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return cards[0].offsetWidth + gap;
  }

  // --- Active card, counter, progress, depth falloff ---
  function update() {
    var max = track.scrollWidth - track.clientWidth;
    var center = track.scrollLeft + track.clientWidth / 2;
    var best = 0, bestDist = Infinity;

    cards.forEach(function (card, i) {
      var mid = card.offsetLeft + card.offsetWidth / 2;
      var dist = Math.abs(mid - center);
      if (dist < bestDist) { bestDist = dist; best = i; }
      card.style.setProperty("--d", Math.min(1, dist / (card.offsetWidth * 1.2)).toFixed(3));
    });

    // At the scroll ends, snap the counter to the first/last card.
    if (track.scrollLeft <= 2) best = 0;
    if (track.scrollLeft >= max - 2) best = cards.length - 1;

    if (best !== active) {
      cards[active].classList.remove("is-active");
      active = best;
    }
    cards[active].classList.add("is-active");
    current.textContent = pad(active + 1);
    bar.style.transform = "scaleX(" + (max > 0 ? track.scrollLeft / max : 1) + ")";
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
  }

  var ticking = false;
  track.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { update(); ticking = false; });
  }, { passive: true });
  window.addEventListener("resize", update);

  // --- Buttons + keyboard ---
  var behavior = reduceMotion ? "auto" : "smooth";
  prev.addEventListener("click", function () {
    track.scrollBy({ left: -step(), behavior: behavior });
  });
  next.addEventListener("click", function () {
    track.scrollBy({ left: step(), behavior: behavior });
  });
  track.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); next.click(); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); prev.click(); }
  });

  // --- Mouse drag (touch already scrolls natively) ---
  var drag = null;
  track.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag = { x: e.clientX, left: track.scrollLeft, moved: false };
  });
  window.addEventListener("pointermove", function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 5) {
      drag.moved = true;
      track.classList.add("is-dragging");
    }
    if (drag.moved) track.scrollLeft = drag.left - dx;
  });
  window.addEventListener("pointerup", function () {
    if (!drag) return;
    var wasDrag = drag.moved;
    drag = null;
    if (!wasDrag) return;
    // Re-enable snapping, then settle on the nearest card.
    track.classList.remove("is-dragging");
    var target = cards[active];
    track.scrollTo({
      left: target.offsetLeft - (track.clientWidth - target.offsetWidth) / 2,
      behavior: behavior
    });
    // Swallow the click that follows a drag so it doesn't open the post.
    track.addEventListener("click", function swallow(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      track.removeEventListener("click", swallow, true);
    }, true);
  });
  track.addEventListener("dragstart", function (e) { e.preventDefault(); });

  // --- Generative dot-art covers ---
  // Each card gets one of four fields, seeded by its index. Dots swell where
  // the field is high; hovering a card animates its field.
  function rand(seed) {
    var s = seed * 9301 + 49297;
    return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }

  var FIELDS = [
    function (x, y, t, r) { // concentric rings
      var dx = x - r.cx, dy = y - r.cy;
      return 0.5 + 0.5 * Math.sin(Math.sqrt(dx * dx + dy * dy) * r.f - t * 2);
    },
    function (x, y, t, r) { // diagonal waves
      return 0.5 + 0.5 * Math.sin((x * r.ax + y * r.ay) * r.f + t * 1.5);
    },
    function (x, y, t, r) { // radial burst
      var a = Math.atan2(y - r.cy, x - r.cx);
      return 0.5 + 0.5 * Math.sin(a * r.n + t);
    },
    function (x, y, t, r) { // interference blobs
      return 0.5 + 0.25 * (Math.sin(x * r.f + t) + Math.cos(y * r.f * 1.3 - t * 0.7));
    }
  ];

  function cover(canvas) {
    var seed = parseInt(canvas.getAttribute("data-seed"), 10) || 1;
    var rnd = rand(seed);
    var field = FIELDS[seed % FIELDS.length];
    var params = {
      cx: rnd(), cy: rnd(), f: 8 + rnd() * 10, n: 3 + Math.floor(rnd() * 6),
      ax: 0.4 + rnd(), ay: 0.4 + rnd()
    };
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, gap = 9, t = rnd() * 10, raf = 0;

    function size() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var y = gap / 2; y < h; y += gap) {
        for (var x = gap / 2; x < w; x += gap) {
          var v = field(x / w, y / h, t, params);
          if (v < 0.15) continue;
          ctx.fillStyle = v > 0.82 ? "rgba(180,140,222," + v + ")" : "rgba(255,255,255," + v * 0.55 + ")";
          ctx.beginPath();
          ctx.arc(x, y, v * gap * 0.42, 0, 6.2832);
          ctx.fill();
        }
      }
    }

    function loop() {
      t += 0.02;
      draw();
      raf = requestAnimationFrame(loop);
    }

    if (!reduceMotion) {
      var card = canvas.closest(".post-card");
      card.addEventListener("pointerenter", function () {
        if (!raf) raf = requestAnimationFrame(loop);
      });
      card.addEventListener("pointerleave", function () {
        cancelAnimationFrame(raf);
        raf = 0;
      });
    }

    window.addEventListener("resize", size);
    size();
  }

  root.querySelectorAll(".post-card__canvas").forEach(cover);
  update();
})();

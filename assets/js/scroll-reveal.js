// Scroll-based reveal animations — vanilla JS, no framer-motion.
// Uses IntersectionObserver to add `.is-visible` to `[data-animate]` elements
// as they enter the viewport. Respects prefers-reduced-motion.
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Skip entirely if the user prefers reduced motion.
  if (reduceMotion) {
    document.querySelectorAll("[data-animate]").forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  // Fallback: if IntersectionObserver isn't supported, show everything.
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll("[data-animate]").forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  // --- Reveal on enter ---
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -6% 0px"
  });

  document.querySelectorAll("[data-animate]").forEach(function (el) {
    revealObserver.observe(el);
  });

  // --- Blog post cards: staggered reveal + hover lift ---
  var blogPosts = document.querySelectorAll(".blog-post");
  blogPosts.forEach(function (post, i) {
    post.setAttribute("data-animate", "");
    post.style.transitionDelay = (i % 3) * 0.08 + "s";
    revealObserver.observe(post);
  });
})();

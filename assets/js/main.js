(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WHATSAPP = "27740808080";

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Header background and the mobile order bar both switch on once the hero leaves view.
  var header = document.querySelector("[data-header]");
  var bar = document.querySelector("[data-mobile-bar]");
  var hero = document.querySelector(".hero");
  if (hero && "IntersectionObserver" in window) {
    var sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:80px;pointer-events:none";
    hero.appendChild(sentinel);
    new IntersectionObserver(function (entries) {
      header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
    }).observe(sentinel);
    new IntersectionObserver(function (entries) {
      if (bar) bar.classList.toggle("is-visible", !entries[0].isIntersecting);
    }, { threshold: 0.15 }).observe(hero);
  }

  // Mobile nav
  var toggle = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");
  function setNav(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileNav.hidden = !open;
    header.classList.toggle("is-scrolled", open || window.scrollY > 40);
  }
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    mobileNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setNav(false); toggle.focus(); }
    });
  }

  // Scroll reveal, staggered within each parent.
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var groups = new Map();
    reveals.forEach(function (el) {
      var p = el.parentElement;
      var i = groups.get(p) || 0;
      el.style.setProperty("--stagger", Math.min(i, 6) * 80 + "ms");
      groups.set(p, i + 1);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  // Menu board dialog
  var board = document.querySelector("[data-board]");
  var openBoard = document.querySelector("[data-open-board]");
  if (board && openBoard && typeof board.showModal === "function") {
    openBoard.addEventListener("click", function () { board.showModal(); });
    board.querySelector("[data-close-board]").addEventListener("click", function () { board.close(); });
    board.addEventListener("click", function (e) { if (e.target === board) board.close(); });
  } else if (openBoard) {
    openBoard.addEventListener("click", function () { window.open("assets/img/menu-board.webp", "_blank"); });
  }

  // Function enquiry: validate, then open WhatsApp with the details written out.
  var form = document.querySelector("[data-event-form]");
  if (form) {
    var dateInput = form.querySelector("#ev-date");
    if (dateInput) dateInput.min = new Date().toISOString().slice(0, 10);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var valid = input.value.trim() !== "" && input.checkValidity();
        input.closest(".field").classList.toggle("is-invalid", !valid);
        input.setAttribute("aria-invalid", String(!valid));
        if (!valid && ok) { input.focus(); ok = false; }
      });
      if (!ok) return;

      var d = form.elements;
      var when = d.date.value;
      try {
        when = new Date(d.date.value + "T12:00:00").toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      } catch (err) { /* keep ISO date */ }
      var lines = [
        "Hi Chris, I'd like to book The Wrap Shack for an event.",
        "",
        "Name: " + d.name.value.trim(),
        "Date: " + when,
        "Guests: " + d.guests.value.trim(),
        "Venue or area: " + d.where.value.trim()
      ];
      if (d.notes.value.trim()) lines.push("Notes: " + d.notes.value.trim());
      window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
    });

    form.addEventListener("input", function (e) {
      var field = e.target.closest(".field");
      if (field && field.classList.contains("is-invalid") && e.target.value.trim() !== "" && e.target.checkValidity()) {
        field.classList.remove("is-invalid");
        e.target.setAttribute("aria-invalid", "false");
      }
    });
  }

  // Rising embers behind the hero. Pauses when the hero is off screen; off for reduced motion.
  var canvas = document.querySelector("[data-embers]");
  if (canvas && !reduceMotion && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, sparks = [], running = false, raf = 0;

    function size() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.min(70, w / 18));
      sparks = [];
      for (var i = 0; i < count; i++) sparks.push(spawn(true));
    }
    function spawn(anywhere) {
      return {
        x: w * (0.35 + Math.random() * 0.65),
        y: anywhere ? Math.random() * h : h + 10,
        r: 0.6 + Math.random() * 1.8,
        vy: 0.25 + Math.random() * 0.9,
        vx: (Math.random() - 0.5) * 0.3,
        life: 0.4 + Math.random() * 0.6,
        t: Math.random() * Math.PI * 2
      };
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < sparks.length; i++) {
        var s = sparks[i];
        s.t += 0.02;
        s.y -= s.vy;
        s.x += s.vx + Math.sin(s.t) * 0.25;
        var fade = Math.max(0, Math.min(1, s.y / h)) * s.life;
        ctx.beginPath();
        ctx.fillStyle = "rgba(255," + (120 + Math.round(s.r * 40)) + ",40," + fade.toFixed(3) + ")";
        ctx.shadowColor = "rgba(255,90,40,0.9)";
        ctx.shadowBlur = 8;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.y < -10) sparks[i] = spawn(false);
      }
      raf = requestAnimationFrame(frame);
    }
    size();
    window.addEventListener("resize", function () { cancelAnimationFrame(raf); size(); if (running) raf = requestAnimationFrame(frame); });
    new IntersectionObserver(function (entries) {
      running = entries[0].isIntersecting;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(frame);
    }).observe(canvas);
  }
})();

/* ===========================================================
   Flower — site behaviour
   - book reader (flip between chapters, persists position)
   - RSVP "read like Flower" mode per chapter (feature A)
   - progress bar (feature B)
   - reveal-on-scroll
   - site-wide language tied to the reader (i18n.js)
   - touch swipe to flip chapters on mobile
   - signup form -> Telegram relay
   =========================================================== */
(function () {
  "use strict";

  /* ============================================================
     CONFIG — Telegram (direct mode, no server)
     Each signup is sent straight from the browser to your bot's
     chat. The token is visible in the page source — that's an
     accepted trade-off here (tiny, low-traffic form).

       TG_TOKEN    — from @BotFather
       TG_CHAT_ID  — the numeric id of the chat that should
                     receive the emails. Get it once:
                     1) open https://t.me/FlowerMailsbot and press Start
                     2) open in a browser:
                        https://api.telegram.org/bot<TG_TOKEN>/getUpdates
                     3) copy the number from "chat":{"id": ... }
     While TG_CHAT_ID is empty the form validates + confirms
     locally but nothing is actually sent.
     ============================================================ */
  var TG_TOKEN = "8729470889:AAFGjdJdIqxwW3M_TsZHSzIkj5VgaQhkHW8";
  var TG_CHAT_ID = "5902050669"; // Karol (@GrKarol)

  var T = function (k) { return (window.t ? window.t(k) : k); };

  /* ---------- B · progress bar ---------- */
  var progress = document.getElementById("progress");
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
    if (progress) progress.style.width = (p * 100).toFixed(2) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- reveal-on-scroll (with hard failsafes) ---------- */
  var reveals = [].slice.call(document.querySelectorAll(".reveal"));
  function show(el) { el.classList.add("in"); }
  function showIfInView(el) {
    var r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.95 && r.bottom > 0) show(el);
  }
  reveals.forEach(showIfInView);
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { if (!el.classList.contains("in")) io.observe(el); });
  }
  window.addEventListener("load", function () { reveals.forEach(showIfInView); });
  window.addEventListener("scroll", function () { reveals.forEach(showIfInView); }, { passive: true });
  setTimeout(function () { reveals.forEach(show); }, 1500);

  /* ---------- language toggles (whole-site, tied to reader) ---------- */
  function bindLangToggles() {
    var btns = [].slice.call(document.querySelectorAll(".c-lang, .lang-btn"));
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var lg = b.getAttribute("data-lg");
        if (lg && window.setSiteLang) window.setSiteLang(lg);
      });
    });
  }
  bindLangToggles();

  /* ---------- the book ---------- */
  var stage = document.getElementById("stage");
  if (!stage) {
    // still wire the form on pages without the book
    wireForm();
    return;
  }
  var pages = [].slice.call(stage.querySelectorAll(".page"));
  var rail = document.getElementById("rail");
  var railBtns = rail ? [].slice.call(rail.querySelectorAll("button")) : [];
  var prevBtn = document.getElementById("prevCh");
  var nextBtn = document.getElementById("nextCh");
  var readBtn = document.getElementById("readFlower");
  var rsvpMode = document.getElementById("rsvpMode");
  var rsvpLabel = document.getElementById("rsvpLabel");
  var rsvpBack = document.getElementById("rsvpBack");
  var rsvpScreen = rsvpMode ? rsvpMode.querySelector("rsvp-screen") : null;
  var rsvpControls = document.getElementById("rsvpControls");
  var rsvpPlay = document.getElementById("rsvpPlay");
  var rsvpPlaying = true;
  var heroScreen = document.querySelector(".hero rsvp-screen");
  var heroControls = document.getElementById("heroControls");

  var idx = 0;
  try {
    var saved = parseInt(localStorage.getItem("flower_ch"), 10);
    if (saved >= 0 && saved < pages.length) idx = saved;
  } catch (e) {}

  function fitHeight() {
    var active = pages[idx];
    if (active) stage.style.height = active.offsetHeight + "px";
  }

  function render() {
    pages.forEach(function (p, i) {
      p.classList.toggle("is-active", i === idx);
      p.classList.toggle("is-prev", i < idx);
    });
    railBtns.forEach(function (b, i) { b.classList.toggle("on", i === idx); });
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === pages.length - 1;
    requestAnimationFrame(fitHeight);
    setTimeout(fitHeight, 120);
    try { localStorage.setItem("flower_ch", String(idx)); } catch (e) {}
  }

  function go(n) {
    var next = Math.max(0, Math.min(pages.length - 1, n));
    if (next === idx) return;
    idx = next;
    exitRsvp();
    render();
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { go(idx - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { go(idx + 1); });
  railBtns.forEach(function (b) {
    b.addEventListener("click", function () { go(parseInt(b.getAttribute("data-i"), 10)); });
  });

  /* keyboard ← / → only while the book is on screen and not typing */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    var tag = (document.activeElement && document.activeElement.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    var r = stage.getBoundingClientRect();
    var visible = r.top < window.innerHeight * 0.8 && r.bottom > window.innerHeight * 0.2;
    if (!visible) return;
    if (e.key === "ArrowLeft") go(idx - 1);
    else go(idx + 1);
  });

  /* ---------- touch swipe to flip chapters (mobile) ---------- */
  (function () {
    var x0 = null, y0 = null, t0 = 0;
    stage.addEventListener("touchstart", function (e) {
      if (rsvpMode && rsvpMode.classList.contains("on")) { x0 = null; return; }
      var t = e.changedTouches[0];
      x0 = t.clientX; y0 = t.clientY; t0 = Date.now();
    }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var t = e.changedTouches[0];
      var dx = t.clientX - x0, dy = t.clientY - y0, dt = Date.now() - t0;
      x0 = null;
      // horizontal, decisive, not a vertical scroll, reasonably quick
      if (dt < 700 && Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.6) {
        if (dx < 0) go(idx + 1); else go(idx - 1);
      }
    }, { passive: true });
  })();

  /* ---------- A · read this chapter like on Flower ---------- */
  function enterRsvp() {
    if (!rsvpScreen) return;
    var page = pages[idx];
    var meta = page.querySelector(".ch-meta");
    var title = page.querySelector(".ch-title");
    var bodyEl = page.querySelector(".ch-body");
    var text = bodyEl ? bodyEl.innerText.replace(/\s+/g, " ").trim() : "";
    if (rsvpLabel) {
      rsvpLabel.textContent = (meta ? meta.textContent : "") + " · " + (title ? title.textContent : "");
    }
    rsvpMode.classList.add("on");
    fitHeight();
    var wpmEl = rsvpControls ? rsvpControls.querySelector(".c-wpm") : null;
    if (rsvpScreen.setText) {
      rsvpScreen.setWPM && rsvpScreen.setWPM(wpmEl ? +wpmEl.value : 210);
      rsvpScreen.setText(text);
    }
    rsvpPlaying = true;
    if (rsvpPlay) rsvpPlay.textContent = T("rsvp.pause");
  }
  function exitRsvp() {
    if (!rsvpMode) return;
    rsvpMode.classList.remove("on");
    if (rsvpScreen && rsvpScreen.pause) rsvpScreen.pause();
  }
  if (readBtn) readBtn.addEventListener("click", function () {
    if (rsvpMode.classList.contains("on")) exitRsvp(); else enterRsvp();
  });
  if (rsvpBack) rsvpBack.addEventListener("click", exitRsvp);

  /* ---------- functional controls (hero + RSVP) ---------- */
  function bindControls(root, getScreen) {
    if (!root) return;
    var wpm = root.querySelector(".c-wpm");
    var val = root.querySelector(".c-wpm-val");
    if (wpm) wpm.addEventListener("input", function () {
      var s = getScreen(); if (s && s.setWPM) s.setWPM(+wpm.value);
      if (val) val.textContent = wpm.value;
    });
    [].forEach.call(root.querySelectorAll(".c-theme button"), function (b) {
      b.addEventListener("click", function () {
        [].forEach.call(root.querySelectorAll(".c-theme button"), function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        var s = getScreen(); if (s && s.setTheme) s.setTheme(b.getAttribute("data-th"));
      });
    });
  }
  bindControls(heroControls, function () { return heroScreen; });
  bindControls(rsvpControls, function () { return rsvpScreen; });

  if (rsvpPlay) rsvpPlay.addEventListener("click", function () {
    if (!rsvpScreen) return;
    if (rsvpPlaying) { rsvpScreen.pause && rsvpScreen.pause(); rsvpPlay.textContent = T("rsvp.play"); }
    else { rsvpScreen.play && rsvpScreen.play(); rsvpPlay.textContent = T("rsvp.pause"); }
    rsvpPlaying = !rsvpPlaying;
  });

  /* ---------- language change reacts everywhere ---------- */
  document.addEventListener("flowerlangchange", function (e) {
    var lang = e.detail && e.detail.lang;
    // hero reader demo text follows the site language
    if (heroScreen && heroScreen.setLang) heroScreen.setLang(lang);
    // play/pause label
    if (rsvpPlay) rsvpPlay.textContent = rsvpPlaying ? T("rsvp.pause") : T("rsvp.play");
    // if currently reading a chapter on Flower, re-read it in the new language
    if (rsvpMode && rsvpMode.classList.contains("on")) {
      // text content has just been swapped by i18n; re-enter to refresh
      requestAnimationFrame(enterRsvp);
    }
    // chapter heights may change with translated copy
    requestAnimationFrame(fitHeight);
    setTimeout(fitHeight, 160);
  });

  /* ---------- init ---------- */
  window.addEventListener("resize", fitHeight);
  window.addEventListener("load", fitHeight);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHeight);
  render();
  // sync the hero reader to the language already chosen by i18n on load
  if (window.flowerLang && heroScreen && heroScreen.setLang) heroScreen.setLang(window.flowerLang);
  wireForm();

  /* ============================================================
     Signup form -> Telegram relay
     ============================================================ */
  function wireForm() {
    var form = document.getElementById("signupForm");
    if (!form) return;
    var input = document.getElementById("email");
    var btn = document.getElementById("signupBtn");
    var msg = document.getElementById("formMsg");
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setMsg(key, kind) {
      if (!msg) return;
      msg.textContent = T(key);
      msg.className = "form-msg" + (kind ? " is-" + kind : "");
      msg.hidden = false;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = (input.value || "").trim();
      if (!EMAIL_RE.test(email)) { setMsg("su.invalid", "err"); input.focus(); return; }

      if (!TG_CHAT_ID) {
        // chat id not set yet — confirm locally so the page works,
        // but make it obvious in the console that nothing was sent.
        console.warn("[Flower] TG_CHAT_ID is empty — email not sent:", email);
        setMsg("su.ok", "ok");
        form.reset();
        return;
      }

      var original = btn.textContent;
      btn.disabled = true;
      btn.textContent = T("su.btn.sending");

      var text =
        "\uD83C\uDF31 New Flower signup\n" +
        "\u2709\uFE0F  " + email + "\n" +
        "\uD83C\uDF10  lang: " + (window.flowerLang || "en") + "\n" +
        "\uD83D\uDD52  " + new Date().toLocaleString();

      fetch("https://api.telegram.org/bot" + TG_TOKEN + "/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text: text, disable_web_page_preview: true })
      })
        .then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); })
        .then(function (res) {
          if (!res || res.ok !== true) throw new Error("telegram: " + (res && res.description || "failed"));
          setMsg("su.ok", "ok");
          form.reset();
        })
        .catch(function (err) {
          console.error("[Flower] telegram error:", err);
          setMsg("su.err", "err");
        })
        .then(function () {
          btn.disabled = false;
          btn.textContent = original;
        });
    });
  }
})();

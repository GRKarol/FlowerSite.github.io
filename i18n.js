/* ===========================================================
   Flower — site-wide i18n
   English is the DEFAULT language. Polish is a toggle.
   The reader (rsvp-screen) language is tied to the site language:
   switching the reader switches the whole page, and vice-versa.
   =========================================================== */
(function () {
  "use strict";

  var STR = {
    en: {
      docTitle: "Flower — a book that fits in your pocket",

      /* hero controls */
      "ui.wpm": "WPM",
      "ui.theme": "Theme",
      "ui.lang": "Language",

      /* hero */
      "hero.lead": "A book that fits in your&nbsp;pocket.",
      "hero.sub": "Every free moment is another chapter.",
      "hero.cta1": "See how it started",
      "hero.cta2": "Instagram →",
      "hero.scrollcue": "Chapter 1 ↓",

      /* book intro */
      "book.kicker": "Story",
      "book.h2": "Five chapters. How Flower came to be.",
      "book.hint": "Turn the pages like a book — or read a chapter the way you'd read it on&nbsp;Flower.",

      /* chapter 1 */
      "ch1.meta": "Chapter one",
      "ch1.title": "The Queue",
      "ch1.p1": "I was standing in line at the checkout. Four people ahead of me. My phone slipped out of my pocket. TikTok again. I didn't want it, but I scrolled anyway.",
      "ch1.p2": "I had a book in my backpack that I genuinely loved. But pulling it out, opening it, holding it open — that was a whole operation.",
      "ch1.p3": "Then it hit me clearly: I'm not short on time to read. I'm short on a book in my&nbsp;pocket.",
      "ch1.cap": "In the queue",
      "ch1.ph": "Drag a photo into chapter 1",
      "ch1.pageno": "p. 3",

      /* chapter 2 */
      "ch2.meta": "Chapter two",
      "ch2.title": "The Idea",
      "ch2.p1": "I stumbled on a simple open-source project. It showed text one word at a time. Ugly — built by programmers, for programmers.",
      "ch2.p2": "But there was something to it. Your eyes don't jump around. You read faster. I remembered that queue and thought: if you packed this into something truly small, something you hold in one hand — everything would change.",
      "ch2.p3": "That thought is where it began.",
      "ch2.cap": "The idea",
      "ch2.ph": "Drag a photo into chapter 2",
      "ch2.pageno": "p. 9",

      /* chapter 3 */
      "ch3.meta": "Chapter three",
      "ch3.title": "The Board",
      "ch3.p1": "I took a Waveshare ESP32-S3. A small board, a good screen. I wrote the software from scratch. Nothing unnecessary.",
      "ch3.p2": "With every decision I asked myself one question: would someone who'd never seen it before know what to do with it right away?",
      "ch3.cap": "Waveshare ESP32-S3 · e-ink screen",
      "ch3.pageno": "p. 15",

      /* chapter 4 */
      "ch4.meta": "Chapter four",
      "ch4.title": "Flower",
      "ch4.p1": "Flower fits in your hand. You hold it with one hand — in a queue, on the tram, anywhere. The text flows word by word. You set the pace. After a moment you forget the device. Only the book is left.",
      "ch4.p2": "You can change the font, the text size, switch on night mode. You turn it off whenever you like and come back to exactly the same spot.",
      "ch4.cap": "Flower in hand",
      "ch4.pageno": "p. 21",

      /* chapter 5 */
      "ch5.meta": "Chapter five",
      "ch5.title": "What's Next",
      "ch5.p1": "Flower v1 is ready. We assemble it by hand, one at a time. No fancy box, no manual, for 300&nbsp;zł. We sell it the way we make it — plainly, no nonsense.",
      "ch5.p2": "This is the first version. It works well, but we know it's only the beginning. It's just the two of us — Jan and Karol, in Poland. No office, no investors, no corporate theatre.",
      "ch5.credo": "Because we believe every moment can be a chapter.",
      "ch5.cap": "Karol",
      "ch5.pageno": "p. 29",

      /* rail */
      "rail.1": "The Queue",
      "rail.2": "The Idea",
      "rail.3": "The Board",
      "rail.4": "Flower",
      "rail.5": "What's Next",

      /* rsvp read-mode */
      "rsvp.label": "Chapter one · The Queue",
      "rsvp.back": "← Back to text",
      "rsvp.play": "Play",
      "rsvp.pause": "Pause",
      "read.flower": "Read this chapter the way it reads on Flower →",

      /* signup */
      "su.kicker": "Next batch",
      "su.h2": "We make few. One at a time.",
      "su.p": "We build Flower by hand. Leave your email — we'll write when the next one is&nbsp;ready.",
      "su.label": "Your email",
      "su.ph": "you@example.com",
      "su.btn": "Let me know",
      "su.btn.sending": "Sending…",
      "su.ok": "Thanks — you're on the list. We'll be in touch.",
      "su.err": "Something went wrong. Try again, or write to us on Instagram.",
      "su.invalid": "Please enter a valid email address.",
      "su.ig": "Or follow along on Instagram → @flower.the.reader",

      /* footer */
      "foot.made": "Handmade by Jan and Karol in&nbsp;Poland.",
      "foot.karol": "system, software",
      "foot.jan": "marketing, assembly, Instagram",
      "foot.email": "E-mail",
      "foot.ig": "Instagram",
      "foot.privacy": "Privacy policy",
      "foot.base": "© 2026 Flower",

      /* privacy page back link */
      "doc.back": "← Back to site"
    },

    pl: {
      docTitle: "Flower — książka, która mieści się w kieszeni",

      "ui.wpm": "WPM",
      "ui.theme": "Motyw",
      "ui.lang": "Język",

      "hero.lead": "Książka, która mieści się w&nbsp;kieszeni.",
      "hero.sub": "Każda wolna chwila to kolejny rozdział.",
      "hero.cta1": "Zobacz, jak się zaczęło",
      "hero.cta2": "Instagram →",
      "hero.scrollcue": "Rozdział 1 ↓",

      "book.kicker": "Historia",
      "book.h2": "Pięć rozdziałów. Tak powstał Flower.",
      "book.hint": "Przewracaj strony jak w książce — albo przeczytaj rozdział tak, jak czyta się go na&nbsp;Flowerze.",

      "ch1.meta": "Rozdział pierwszy",
      "ch1.title": "Kolejka",
      "ch1.p1": "Stałem w kolejce do kasy. Cztery osoby przede mną. Telefon wyszedł z kieszeni. Znowu TikTok. Nie chciałem tego, ale i tak scrollowałem.",
      "ch1.p2": "W plecaku miałem książkę, którą naprawdę lubiłem. Tylko że wyciągnięcie jej, otwarcie, utrzymanie to była cała operacja.",
      "ch1.p3": "Wtedy uderzyło mnie jasno: nie brakuje mi czasu na czytanie. Brakuje mi książki w&nbsp;kieszeni.",
      "ch1.cap": "W kolejce",
      "ch1.ph": "Przeciągnij zdjęcie do rozdziału 1",
      "ch1.pageno": "str. 3",

      "ch2.meta": "Rozdział drugi",
      "ch2.title": "Idea",
      "ch2.p1": "Natknąłem się na prosty open-source'owy projekt. Pokazywał tekst słowo po słowie. Brzydki, zrobiony przez programistów dla programistów.",
      "ch2.p2": "Ale coś w tym było. Oczy nie skaczą. Czyta się szybciej. Przypomniałem sobie tę kolejkę i pomyślałem: gdyby to zapakować w coś naprawdę małego, co trzymasz w jednej ręce wszystko by się zmieniło.",
      "ch2.p3": "Od tej myśli się zaczęło.",
      "ch2.cap": "Pomysł",
      "ch2.ph": "Przeciągnij zdjęcie do rozdziału 2",
      "ch2.pageno": "str. 9",

      "ch3.meta": "Rozdział trzeci",
      "ch3.title": "Płytka",
      "ch3.p1": "Wziąłem Waveshare ESP32-S3. Mała płytka, dobry ekran. Napisałem oprogramowanie od zera. Zero zbędnych rzeczy.",
      "ch3.p2": "Przy każdej decyzji zadawałem sobie jedno pytanie: czy ktoś, kto nigdy tego nie widział, od razu będzie wiedział, co z tym zrobić?",
      "ch3.cap": "Waveshare ESP32-S3 · ekran e-ink",
      "ch3.pageno": "str. 15",

      "ch4.meta": "Rozdział czwarty",
      "ch4.title": "Flower",
      "ch4.p1": "Flower mieści się w dłoni. Trzymasz go jedną ręką, w kolejce, w tramwaju, gdziekolwiek. Tekst płynie słowo po słowie. Ty decydujesz o tempie. Po chwili zapominasz o urządzeniu. Zostaje tylko książka.",
      "ch4.p2": "Możesz zmienić czcionkę, rozmiar tekstu, włączyć tryb nocny. Wyłączasz w dowolnym momencie i wracasz dokładnie w to samo miejsce.",
      "ch4.cap": "Flower w dłoni",
      "ch4.pageno": "str. 21",

      "ch5.meta": "Rozdział piąty",
      "ch5.title": "Co dalej",
      "ch5.p1": "Flower v1 jest gotowy. Składamy go ręcznie, po jednej sztuce. Bez fajnego pudełka, bez instrukcji, za 300&nbsp;zł. Sprzedajemy tak, jak robimy, prosto i bez ściemy.",
      "ch5.p2": "To pierwsza wersja. Działa dobrze, ale wiemy, że to dopiero początek. Robimy to we dwóch, Jan i Karol, w Polsce. Bez biura, bez inwestorów, bez korporacyjnego teatru.",
      "ch5.credo": "Bo wierzymy, że każdy moment może być rozdziałem.",
      "ch5.cap": "Karol",
      "ch5.pageno": "str. 29",

      "rail.1": "Kolejka",
      "rail.2": "Idea",
      "rail.3": "Płytka",
      "rail.4": "Flower",
      "rail.5": "Co dalej",

      "rsvp.label": "Rozdział pierwszy · Kolejka",
      "rsvp.back": "← Wróć do tekstu",
      "rsvp.play": "Graj",
      "rsvp.pause": "Pauza",
      "read.flower": "Czytaj ten rozdział jak na Flowerze →",

      "su.kicker": "Następna partia",
      "su.h2": "Robimy mało. Po jednej sztuce.",
      "su.p": "Składamy Flower ręcznie. Zostaw maila — napiszemy, gdy będzie gotowy&nbsp;kolejny.",
      "su.label": "Twój e-mail",
      "su.ph": "ty@przyklad.pl",
      "su.btn": "Daj mi znać",
      "su.btn.sending": "Wysyłam…",
      "su.ok": "Dzięki — jesteś na liście. Odezwiemy się.",
      "su.err": "Coś poszło nie tak. Spróbuj ponownie albo napisz na Instagramie.",
      "su.invalid": "Podaj poprawny adres e-mail.",
      "su.ig": "Albo zaglądaj na Instagram → @flower.the.reader",

      "foot.made": "Ręcznie robione przez Jana i Karola w&nbsp;Polsce.",
      "foot.karol": "system, oprogramowanie",
      "foot.jan": "marketing, montaż, Instagram",
      "foot.email": "E-mail",
      "foot.ig": "Instagram",
      "foot.privacy": "Polityka prywatności",
      "foot.base": "© 2026 Flower",

      "doc.back": "← Wróć na stronę"
    }
  };

  var DEFAULT_LANG = "en";
  var current = DEFAULT_LANG;

  function saved() {
    try { return localStorage.getItem("flower_lang"); } catch (e) { return null; }
  }
  function persist(l) {
    try { localStorage.setItem("flower_lang", l); } catch (e) {}
  }

  function dict(l) { return STR[l] || STR[DEFAULT_LANG]; }

  // public translator used by flower.js for JS-built strings
  function t(key, lang) {
    var d = dict(lang || current);
    var v = d[key];
    return v == null ? (STR[DEFAULT_LANG][key] || key) : v;
  }

  function apply(lang) {
    if (!STR[lang]) lang = DEFAULT_LANG;
    current = lang;
    var d = dict(lang);

    document.documentElement.setAttribute("lang", lang);
    if (d.docTitle) document.title = d.docTitle;

    // text / html content
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute("data-i18n");
      if (!(key in d)) continue;
      var val = d[key];
      if (val.indexOf("<") !== -1 || val.indexOf("&") !== -1) el.innerHTML = val;
      else el.textContent = val;
    }
    // placeholder attributes (inputs + custom elements like <image-slot>)
    var phs = document.querySelectorAll("[data-i18n-ph]");
    for (var j = 0; j < phs.length; j++) {
      var p = phs[j];
      var k2 = p.getAttribute("data-i18n-ph");
      if (k2 in d) p.setAttribute("placeholder", d[k2]);
    }

    // reflect the choice on every language toggle (hero + topbar)
    var toggles = document.querySelectorAll(".c-lang, .lang-btn");
    for (var m = 0; m < toggles.length; m++) {
      var b = toggles[m];
      b.classList.toggle("on", b.getAttribute("data-lg") === lang);
      b.setAttribute("aria-pressed", b.getAttribute("data-lg") === lang ? "true" : "false");
    }

    persist(lang);
    window.flowerLang = lang;

    // let the reader + flower.js react (rsvp demo text, labels, button copy)
    document.dispatchEvent(new CustomEvent("flowerlangchange", { detail: { lang: lang } }));
  }

  // expose
  window.FlowerI18N = { apply: apply, t: t, get lang() { return current; }, DEFAULT: DEFAULT_LANG };
  window.setSiteLang = apply;
  window.t = t;

  // pick the starting language:
  //   1) an explicit choice the user made before (persisted) — always wins
  //   2) otherwise auto-detect from the browser: Polish browsers get PL,
  //      everyone else gets English
  function detect() {
    var langs = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || ""];
    for (var i = 0; i < langs.length; i++) {
      if (String(langs[i]).toLowerCase().indexOf("pl") === 0) return "pl";
    }
    return "en";
  }
  var start = saved() || detect();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { apply(start); });
  } else {
    apply(start);
  }
})();

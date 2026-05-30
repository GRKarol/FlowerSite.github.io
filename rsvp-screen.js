// <rsvp-screen> — Flower's reading screen, simulated.
// A flowing strip of monospace words; the active word is pinned to a center
// pivot with its ORP (focus) letter highlighted and crosshair ticks, exactly
// like the real e-ink device. Real, working controls drive it from outside.
//
// Attributes:
//   lang="en|pl"            which built-in demo text (default en)
//   theme="eink|paper|dark" screen palette (default eink)
//   wpm="60..400"           words per minute (default 90)
//   accent="#1488d8"        focus-letter + tick color
//   chrome="on|off"         device corner labels (default on)
//   text="..."              override demo text (any language)
// Methods: setWPM(n), setTheme(t), setLang(l), setText(str), play(), pause()

(function () {
  const DEMO = {
    en: "This is Flower. It displays text word by word. You look at one point. Your eyes stay rested. The words flow.",
    pl: "To jest Flower. Wyświetla tekst słowo po słowie. Patrzysz w jeden punkt. Wzrok się nie męczy. Słowa płyną same.",
  };

  function orpIndex(word) {
    const n = word.replace(/[^\p{L}\p{N}]/gu, "").length;
    if (n <= 1) return 0;
    if (n <= 4) return 1;
    if (n <= 8) return 2;
    if (n <= 12) return 3;
    return 4;
  }

  const THEMES = {
    eink:  { bg: "#c7ccc2", fg: "#1d2026", dim: "#7e8478", grid: "rgba(0,0,0,.05)" },
    paper: { bg: "#fafaf7", fg: "#1a1a1a", dim: "#9a9a92", grid: "rgba(0,0,0,.035)" },
    dark:  { bg: "#0b111c", fg: "#e9ebe6", dim: "#5b6472", grid: "rgba(255,255,255,.045)" },
  };

  class RsvpScreen extends HTMLElement {
    constructor() {
      super();
      this._wpm = 90;
      this._theme = "eink";
      this._lang = "en";
      this._accent = "#1488d8";
      this._chrome = true;
      this._words = [];
      this._i = 0;
      this._timer = null;
      this._playing = false;
    }

    connectedCallback() {
      this._wpm = +this.getAttribute("wpm") || 90;
      this._theme = this.getAttribute("theme") || "eink";
      this._lang = this.getAttribute("lang") || "en";
      this._accent = this.getAttribute("accent") || "#1488d8";
      this._chrome = (this.getAttribute("chrome") || "on") !== "off";
      this._raw = this.getAttribute("text") || DEMO[this._lang] || DEMO.en;
      this._build();
      this._tokenize();
      this._renderWords();
      requestAnimationFrame(() => { this._center(false); this.play(); });
      this._ro = new ResizeObserver(() => this._center(false));
      this._ro.observe(this);
    }
    disconnectedCallback() { this.pause(); this._ro && this._ro.disconnect(); }

    _build() {
      const root = this.attachShadow({ mode: "open" });
      const t = THEMES[this._theme] || THEMES.eink;
      root.innerHTML = `
        <style>
          :host{ display:block; position:relative; container-type:size; }
          .scr{
            position:relative; width:100%; height:100%; overflow:hidden;
            background:${t.bg}; color:${t.fg};
            font-family: var(--rsvp-mono,'JetBrains Mono',ui-monospace,monospace);
            font-weight:500; letter-spacing:-0.01em;
            font-size:clamp(18px, 9cqw, 46px);
            background-image:
              radial-gradient(${t.grid} 1px, transparent 1px);
            background-size:4px 4px;
          }
          .track{ position:absolute; top:50%; left:0; white-space:nowrap;
            transform:translateY(-50%); will-change:transform; }
          .w{ display:inline-block; }
          .gap{ display:inline-block; }
          .past{ opacity:.38; }
          .future{ opacity:.5; }
          .active{ opacity:1; }
          .orp{ color:var(--accent); }
          .pivot{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
            width:0; height:100%; pointer-events:none; }
          .tick{ position:absolute; left:50%; transform:translateX(-50%);
            width:2px; background:var(--accent); }
          .tick.top{ top:14%; height:18%; }
          .tick.bot{ bottom:14%; height:18%; }
          .tick::after{ content:""; position:absolute; left:50%; transform:translateX(-50%);
            width:13px; height:2px; background:var(--accent); }
          .tick.top::after{ top:0; }
          .tick.bot::after{ bottom:0; }
          .chrome{ position:absolute; font-size:clamp(8px,1.4cqw,12px); letter-spacing:.08em;
            color:${t.dim}; font-weight:500; }
          .c-tl{ top:7%; left:4%; } .c-tr{ top:7%; right:4%; }
          .c-bl{ bottom:8%; left:4%; } .c-br{ bottom:8%; right:5%; }
        </style>
        <div class="scr" part="screen">
          <div class="track"></div>
          <div class="pivot"><div class="tick top"></div><div class="tick bot"></div></div>
          ${this._chrome ? `
            <div class="chrome c-tl">&lt;&lt;</div>
            <div class="chrome c-tr">4H40</div>
            <div class="chrome c-bl">DEMO</div>
            <div class="chrome c-br">CH 1M</div>` : ``}
        </div>`;
      this.style.setProperty("--accent", this._accent);
      this._scr = root.querySelector(".scr");
      this._trackEl = root.querySelector(".track");
    }

    _tokenize() {
      this._words = (this._raw || "").trim().split(/\s+/).filter(Boolean);
      this._i = 0;
    }

    _renderWords() {
      const frag = document.createDocumentFragment();
      this._spans = [];
      this._words.forEach((word, idx) => {
        const span = document.createElement("span");
        span.className = "w";
        const oi = orpIndex(word);
        // find oi-th letter position among actual chars
        let pre = "", mid = "", post = "", seenLetters = -1;
        for (const ch of word) {
          if (/[\p{L}\p{N}]/u.test(ch)) seenLetters++;
          if (seenLetters < oi || (mid && seenLetters >= oi)) {
            if (seenLetters < oi) pre += ch; else post += ch;
          } else if (!mid) { mid = ch; } else { post += ch; }
        }
        if (!mid) { mid = word[0] || ""; post = word.slice(1); pre = ""; }
        span.innerHTML = `${escapeHtml(pre)}<span class="orp">${escapeHtml(mid)}</span>${escapeHtml(post)}`;
        frag.appendChild(span);
        this._spans.push(span);
        if (idx < this._words.length - 1) {
          const g = document.createElement("span");
          g.className = "gap";
          g.innerHTML = "&nbsp;&nbsp;";
          frag.appendChild(g);
        }
      });
      this._trackEl.innerHTML = "";
      this._trackEl.appendChild(frag);
      this._paint();
    }

    _paint() {
      this._spans.forEach((s, idx) => {
        s.classList.remove("past", "future", "active");
        s.classList.add(idx < this._i ? "past" : idx > this._i ? "future" : "active");
      });
    }

    _center(animate = true) {
      const active = this._spans[this._i];
      if (!active) return;
      const orp = active.querySelector(".orp");
      const target = orp || active;
      const orpCenter = target.offsetLeft + target.offsetWidth / 2;
      const w = this.clientWidth || this.offsetWidth || 480;
      const x = Math.round(w / 2 - orpCenter);
      this._trackEl.style.transition = animate ? "transform .13s cubic-bezier(.4,0,.2,1)" : "none";
      this._trackEl.style.transform = `translateY(-50%) translateX(${x}px)`;
    }

    _delay() {
      const base = 60000 / this._wpm;
      const w = this._words[this._i] || "";
      let mult = 1;
      if (/[.!?]$/.test(w)) mult = 1.9;
      else if (/[,;:]$/.test(w)) mult = 1.35;
      else if (this._i % 5 === 4) mult = 1.5;
      return base * mult;
    }

    _step() {
      this._i = (this._i + 1) % this._words.length;
      this._paint();
      this._center(this._i !== 0);
      this._timer = setTimeout(() => this._step(), this._delay());
    }

    play() {
      if (this._playing) return;
      this._playing = true;
      this._timer = setTimeout(() => this._step(), this._delay());
    }
    pause() { this._playing = false; clearTimeout(this._timer); }

    setWPM(n) { this._wpm = Math.max(30, Math.min(800, +n || 90)); }
    setTheme(theme) {
      this._theme = theme; const t = THEMES[theme] || THEMES.eink;
      const scr = this._scr;
      scr.style.background = t.bg; scr.style.color = t.fg;
      scr.style.backgroundImage = `radial-gradient(${t.grid} 1px, transparent 1px)`;
      this.shadowRoot.querySelectorAll(".chrome").forEach(c => c.style.color = t.dim);
    }
    setAccent(a){ this._accent = a; this.style.setProperty("--accent", a); }
    setLang(l) { this._lang = l; this._raw = DEMO[l] || DEMO.en; this._restart(); }
    setText(str) { this._raw = str; this._restart(); }
    _restart() {
      this.pause(); this._tokenize(); this._renderWords();
      requestAnimationFrame(() => { this._center(false); this.play(); });
    }
  }

  function escapeHtml(s) {
    return (s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  if (!customElements.get("rsvp-screen")) customElements.define("rsvp-screen", RsvpScreen);
})();

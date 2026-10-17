/**
 * Hover Buttons — Part 2
 * Canvas and pointer-driven effects for the six buttons in index.html.
 * Flip, flicker, and shimmer are CSS-only — no JS needed for those.
 */

/* ==========================================================
   MATRIX DECODE — hybrid rain + text scramble
   Canvas handles the falling glyphs; the label resolves
   character-by-character on hover.
   ========================================================== */
const MATRIX_CHARS = "アイウエオカキクケコサシスセソ0123456789ABCDEF";

class MatrixDecodeButton {
  constructor(btn) {
    this.btn = btn;
    this.canvas = btn.querySelector(".btn-cipher__canvas");
    this.textEl = btn.querySelector(".btn-cipher__text");
    this.target = btn.dataset.scramble || this.textEl.textContent;
    this.scrambleFrame = null;
    this.scrambling = false;

    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.cols = [];
    this.speedMul = 1;

    btn.addEventListener("mouseenter", () => this._startScramble());
    btn.addEventListener("mouseleave", () => this._stopScramble(true));

    new ResizeObserver(() => this._resize()).observe(btn);
    this._loop();
  }

  _resize() {
    const { canvas, ctx, btn, dpr } = this;
    const w = btn.offsetWidth;
    const h = btn.offsetHeight;
    if (!w || !h) return;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.w = w;
    this.h = h;
    this.fontSize = 11;
    this.colCount = Math.ceil(w / this.fontSize);
    this.cols = Array.from({ length: this.colCount }, () => ({
      y: Math.random() * h,
      speed: 0.6 + Math.random() * 1.4,
    }));
  }

  _isActive() {
    return this.btn.matches(":hover") || this.scrambling;
  }

  _startScramble() {
    if (this.scrambling) return;
    this.scrambling = true;
    this.btn.classList.add("is-scrambling");

    let iteration = 0;
    const framesPerChar = 7;
    const max = this.target.length * framesPerChar;

    const tick = () => {
      const resolved = Math.floor(iteration / framesPerChar);

      this.textEl.textContent = this.target
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < resolved) return this.target[i];
          return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        })
        .join("");

      iteration += 1;

      if (iteration >= max) {
        this.textEl.textContent = this.target;
        this.scrambling = false;
        this.scrambleFrame = null;
        if (!this.btn.matches(":hover")) {
          this.btn.classList.remove("is-scrambling");
        }
        return;
      }

      this.scrambleFrame = requestAnimationFrame(tick);
    };

    this.scrambleFrame = requestAnimationFrame(tick);
  }

  _stopScramble(reset) {
    if (this.scrambleFrame) cancelAnimationFrame(this.scrambleFrame);
    this.scrambleFrame = null;
    this.scrambling = false;
    this.btn.classList.remove("is-scrambling");
    if (reset) this.textEl.textContent = this.target;
  }

  _loop() {
    const active = this._isActive();
    this.speedMul += ((active ? 3.2 : 1) - this.speedMul) * 0.06;

    if (this.w && this.h) {
      this._draw(active);
    }

    requestAnimationFrame(() => this._loop());
  }

  _draw(active) {
    const { ctx, w: W, h: H, cols, fontSize, speedMul } = this;

    ctx.fillStyle = active ? "rgba(2, 8, 4, 0.28)" : "rgba(2, 8, 4, 0.14)";
    ctx.fillRect(0, 0, W, H);

    ctx.font = `500 ${fontSize}px "Fira Code", monospace`;

    cols.forEach((col, i) => {
      const x = i * fontSize;
      const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];

      ctx.fillStyle = `rgba(0, 255, 90, ${active ? 0.95 : 0.55})`;
      ctx.shadowColor = "#00ff50";
      ctx.shadowBlur = active ? 10 : 4;
      ctx.fillText(char, x, col.y);

      ctx.shadowBlur = 0;
      if (col.y > fontSize * 2) {
        ctx.fillStyle = `rgba(0, 180, 60, ${active ? 0.4 : 0.18})`;
        ctx.fillText(
          MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
          x,
          col.y - fontSize * 1.2
        );
      }

      col.y += col.speed * speedMul;

      if (col.y > H + fontSize) {
        col.y = -fontSize * (1 + Math.random() * 4);
        col.speed = 0.6 + Math.random() * 1.4;
      }
    });
  }
}

/* ==========================================================
   CONFETTI BURST — one-shot particle explosion on hover
   Fires once per mouseenter; particles fade out over time.
   ========================================================== */
class ConfettiButton {
  constructor(btn) {
    this.btn = btn;
    this.canvas = btn.querySelector(".btn-confetti__canvas");
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.particles = [];
    this.colors = ["#ff4fd8", "#7c5cff", "#3ef0ff", "#b8ff3e", "#ffd166", "#ff6b6b"];

    new ResizeObserver(() => this._resize()).observe(btn);
    btn.addEventListener("mouseenter", () => this._burst());
    this._loop();
  }

  _resize() {
    const { canvas, ctx, btn, dpr } = this;
    const pad = 20;
    const w = btn.offsetWidth + pad * 2;
    const h = btn.offsetHeight + pad * 2;
    if (!w || !h) return;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.w = w;
    this.h = h;
    this.pad = pad;
  }

  _burst() {
    const cx = this.w / 2;
    const cy = this.h / 2;
    const count = 55;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 3 + Math.random() * 6;
      this.particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        w: 4 + Math.random() * 5,
        h: 3 + Math.random() * 4,
        rot: Math.random() * 360,
        rotV: (Math.random() - 0.5) * 14,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        life: 1,
        decay: 0.012 + Math.random() * 0.01,
        gravity: 0.18 + Math.random() * 0.08,
      });
    }
  }

  _loop() {
    if (this.w && this.h) {
      this._draw();
    }
    requestAnimationFrame(() => this._loop());
  }

  _draw() {
    const { ctx, w: W, h: H, particles } = this;
    ctx.clearRect(0, 0, W, H);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.rot += p.rotV;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
  }
}

/* ==========================================================
   TYPEWRITER — types the label on hover
   Resets cleanly when the pointer leaves.
   ========================================================== */
class TypewriterButton {
  constructor(btn) {
    this.btn = btn;
    this.out = btn.querySelector(".btn-type__out");
    this.target = btn.dataset.type || "Type";
    this.frame = null;
    this.running = false;

    btn.addEventListener("mouseenter", () => this._start());
    btn.addEventListener("mouseleave", () => this._stop());
  }

  _start() {
    if (this.running) return;
    this.running = true;
    this.btn.classList.add("is-typing");
    this.out.textContent = "";

    let i = 0;
    const tick = () => {
      if (i <= this.target.length) {
        this.out.textContent = this.target.slice(0, i);
        i += 1;
        this.frame = setTimeout(tick, 85);
      } else {
        this.running = false;
        this.frame = null;
      }
    };

    tick();
  }

  _stop() {
    if (this.frame) clearTimeout(this.frame);
    this.frame = null;
    this.running = false;
    this.btn.classList.remove("is-typing");
    this.out.textContent = "";
  }
}

/* ==========================================================
   INIT — wire up interactive buttons
   Flip, flicker, and shimmer are pure CSS.
   ========================================================== */
(function () {
  "use strict";

  const cipherBtnEl = document.querySelector(".btn-cipher");
  const confettiBtnEl = document.querySelector(".btn-confetti");
  const typeBtnEl = document.querySelector(".btn-type");

  if (cipherBtnEl) new MatrixDecodeButton(cipherBtnEl);
  if (confettiBtnEl) new ConfettiButton(confettiBtnEl);
  if (typeBtnEl) new TypewriterButton(typeBtnEl);
})();

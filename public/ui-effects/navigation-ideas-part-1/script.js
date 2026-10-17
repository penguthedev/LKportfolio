/**
 * Navigation Ideas — Part 1
 * Five themed navigation bars for culinary, café, camera,
 * gym, and bar sites. Each section is self-contained —
 * copy the markup, CSS block, and matching JS you need.
 */

(function () {
  "use strict";

  /* ==========================================================
     SHARED — active-state toggle within one demo section
     ========================================================== */
  function wireNav(sectionId, btnSelector, onActivate) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const btns = section.querySelectorAll(btnSelector);

    btns.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        btns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        if (onActivate) onActivate(btn, i);
      });
    });
  }

  /* ==========================================================
     1. CHEF KNIFE — chop animation on selection
     ========================================================== */
  (function initKnifeNav() {
    const nav = document.querySelector("#chef-demo .knife-nav");
    if (!nav) return;

    function doChop() {
      nav.classList.remove("is-chopping");
      void nav.offsetWidth;
      nav.classList.add("is-chopping");
      setTimeout(() => nav.classList.remove("is-chopping"), 420);
    }

    wireNav("chef-demo", ".knife-item", doChop);
  })();

  /* ==========================================================
     2. ESPRESSO MACHINE — gauge needle + steam puff
     ========================================================== */
  (function initBrewNav() {
    const needle = document.querySelector("#brew-demo .brew-needle");
    const steam = document.querySelector("#brew-demo .brew-steam");
    if (!needle || !steam) return;

    // Needle resting angles for Home, Menu, Order, Visit
    const angles = [-60, -15, 30, 70];

    wireNav("brew-demo", ".brew-key", (_, i) => {
      needle.style.setProperty("--angle", angles[i] + "deg");
      steam.classList.remove("puffing");
      void steam.offsetWidth;
      steam.classList.add("puffing");
    });
  })();

  /* ==========================================================
     3. CAMERA TOP PLATE — dial rotate + LCD flash + shutter
     ========================================================== */
  (function initCamNav() {
    const dial = document.querySelector("#cam-demo .cam-dial");
    const screen = document.getElementById("cam-screen");
    const shutter = document.querySelector("#cam-demo .cam-shutter");
    if (!dial || !screen) return;

    // P, S, G, A — resting angle under the top marker
    const targets = [0, 270, 180, 90];
    let currentRot = 0;

    function shortestTurn(from, target) {
      const norm = ((from % 360) + 360) % 360;
      let diff = target - norm;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      if (diff === -180) diff = 180; // tie → clockwise
      return from + diff;
    }

    wireNav("cam-demo", ".cam-key", (btn, i) => {
      currentRot = shortestTurn(currentRot, targets[i]);
      dial.style.setProperty("--rot", currentRot + "deg");
      screen.classList.add("is-flashing");
      setTimeout(() => {
        screen.textContent = btn.textContent.trim();
        screen.classList.remove("is-flashing");
      }, 120);
    });

    if (shutter) {
      shutter.addEventListener("click", () => {
        shutter.classList.remove("is-firing");
        void shutter.offsetWidth;
        shutter.classList.add("is-firing");
        setTimeout(() => shutter.classList.remove("is-firing"), 350);
      });
    }
  })();

  /* ==========================================================
     4. CAST IRON DUMBBELL — slider track + curl / rattle
     ========================================================== */
  (function initGymNav() {
    const nav = document.querySelector("#gym-demo .gym-nav");
    const bar = document.querySelector("#gym-demo .gym-bar");
    const slider = document.getElementById("gym-slider");
    if (!nav || !bar || !slider) return;

    function moveSlider(btn) {
      const centerX = btn.offsetLeft + btn.offsetWidth / 2;
      slider.style.left = centerX + "px";
    }

    function doRep() {
      nav.classList.remove("is-curling", "is-rattling");
      void nav.offsetWidth;
      nav.classList.add("is-curling", "is-rattling");
      setTimeout(() => {
        nav.classList.remove("is-curling", "is-rattling");
      }, 600);
    }

    wireNav("gym-demo", ".gym-item", (btn) => {
      moveSlider(btn);
      doRep();
    });

    const active = bar.querySelector(".gym-item.is-active");
    if (active) moveSlider(active);

    window.addEventListener("resize", () => {
      const current = bar.querySelector(".gym-item.is-active");
      if (current) moveSlider(current);
    });
  })();

  /* ==========================================================
     5. BACK-BAR TAP ROW — beer liquid fill on clip labels
     Canvas pour adapted from Hover Buttons liquid fill.
     ========================================================== */
  class BeerClipLiquid {
    constructor(clip) {
      this.clip = clip;
      this.tap = clip.closest(".bar-tap");
      this.canvas = clip.querySelector(".bar-clip__liquid");
      if (!this.canvas || !this.tap) return;

      this.ctx = this.canvas.getContext("2d");
      this.fillLevel = this.tap.classList.contains("is-active") ? 1 : 0;
      this.t = 0;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.bubbles = Array.from({ length: 5 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.8 + Math.random() * 1.4,
        s: 0.004 + Math.random() * 0.008,
      }));

      // ResizeObserver picks up initial size and any later layout changes
      const ro = new ResizeObserver(() => this._resize());
      ro.observe(clip);
      this._resize();
      this._loop();
    }

    _resize() {
      const { canvas, ctx, clip, dpr } = this;
      const w = clip.offsetWidth;
      const h = clip.offsetHeight;
      if (!w || !h) return;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    _isActive() {
      return this.tap.classList.contains("is-active");
    }

    _loop() {
      const active = this._isActive();
      const target = active ? 1 : 0;
      const diff = target - this.fillLevel;

      // Pour in a bit quicker than it drains — feels more satisfying
      this.fillLevel += diff * (diff > 0 ? 0.028 : 0.02);

      const hasLiquid = this.fillLevel > 0.004;
      const draining = hasLiquid && diff < 0;

      if (hasLiquid) {
        const waveSpeed = 0.02 + this.fillLevel * 0.028;
        this.t += draining ? -waveSpeed : waveSpeed;
        this.bubbles.forEach((b) => {
          b.y -= b.s;
          if (b.y < 0) {
            b.y = 1;
            b.x = Math.random();
          }
        });
      }

      this._draw();
      requestAnimationFrame(() => this._loop());
    }

    _draw() {
      const { canvas, ctx, fillLevel, t, bubbles } = this;
      const dpr = this.dpr;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;

      ctx.clearRect(0, 0, W, H);
      if (fillLevel < 0.004) return;

      const fillY = H * (1 - fillLevel);

      // Wave height ramps up mid-fill, then settles near the top
      const levelRamp = Math.pow(Math.min(fillLevel / 0.55, 1), 2.2);
      const settleRamp = Math.max(1 - Math.max(fillLevel - 0.88, 0) / 0.12, 0.15);
      const amp = 2.2 * levelRamp * settleRamp;
      const secondary = amp * 0.3 * Math.min(fillLevel / 0.35, 1);
      const steps = 28;
      const wave = (i) =>
        Math.sin(t * 1.5 + i * 0.55) * amp +
        Math.sin(t * 0.95 + i * 0.24) * secondary;

      // Beer body
      ctx.beginPath();
      ctx.moveTo(0, H);
      ctx.lineTo(0, fillY);
      for (let i = 0; i <= steps; i++) {
        ctx.lineTo((i / steps) * W, fillY + wave(i));
      }
      ctx.lineTo(W, H);
      ctx.closePath();

      const beerGrad = ctx.createLinearGradient(0, fillY, 0, H);
      beerGrad.addColorStop(0, "rgba(232, 176, 72, 1)");
      beerGrad.addColorStop(0.25, "rgba(196, 122, 28, 1)");
      beerGrad.addColorStop(0.65, "rgba(140, 72, 14, 1)");
      beerGrad.addColorStop(1, "rgba(82, 40, 8, 1)");
      ctx.fillStyle = beerGrad;
      ctx.fill();

      // Rising bubbles in the beer
      if (fillLevel > 0.2) {
        bubbles.forEach((b) => {
          const by = fillY + b.y * (H - fillY);
          if (by < fillY + 2 || by > H - 2) return;
          ctx.beginPath();
          ctx.arc(b.x * W, by, b.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 230, 160, 0.35)";
          ctx.fill();
        });
      }

      // Froth / head on top of the beer
      const frothH = Math.min(7 + fillLevel * 4, H * 0.28);
      const frothTop = fillY - frothH * 0.35;
      ctx.beginPath();
      ctx.moveTo(0, fillY + wave(0) + 1);
      for (let i = 0; i <= steps; i++) {
        ctx.lineTo((i / steps) * W, fillY + wave(i) + 1);
      }
      for (let i = steps; i >= 0; i--) {
        const foamWave =
          Math.sin(t * 1.2 + i * 0.7) * (amp * 0.45) +
          Math.sin(t * 2.1 + i * 1.1) * (amp * 0.2);
        ctx.lineTo((i / steps) * W, frothTop + foamWave);
      }
      ctx.closePath();

      const frothGrad = ctx.createLinearGradient(0, frothTop, 0, fillY + amp + 2);
      frothGrad.addColorStop(0, "rgba(255, 250, 240, 0.98)");
      frothGrad.addColorStop(0.45, "rgba(245, 230, 200, 0.95)");
      frothGrad.addColorStop(1, "rgba(220, 180, 110, 0.75)");
      ctx.fillStyle = frothGrad;
      ctx.fill();

      // Soft foam bubbles along the head
      for (let i = 0; i < 6; i++) {
        const fx = ((i + 0.3) / 6) * W;
        const fy = frothTop + 2 + Math.sin(t + i) * 1.2 + (i % 2) * 1.5;
        ctx.beginPath();
        ctx.arc(fx, fy, 1.1 + (i % 3) * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
        ctx.fill();
      }
    }
  }

  wireNav("bar-demo", ".bar-tap");
  document.querySelectorAll("#bar-demo .bar-clip").forEach((clip) => {
    new BeerClipLiquid(clip);
  });
})();

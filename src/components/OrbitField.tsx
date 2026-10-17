import { useEffect, useRef } from 'react';

export function OrbitField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = mountRef.current;
    if (!canvas || !host) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const ctx = context;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = true;
    let frame = 0;
    let started = performance.now();
    let width = 0;
    let height = 0;

    function resize() {
      if (!canvas || !host) return;
      const box = host.getBoundingClientRect();
      width = box.width;
      height = box.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(now: number) {
      if (!width || !height) return;
      ctx.clearRect(0, 0, width, height);
      const t = (now - started) * 0.000075;
      const cx = width * 0.52;
      const cy = height * 0.50;
      const unit = Math.min(width, height);
      for (let ring = 0; ring < 3; ring++) {
        const radius = unit * (0.18 + ring * 0.138);
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius * 1.10, radius, -0.32, 0, Math.PI * 2);
        ctx.strokeStyle = ring === 1 ? 'rgba(36,85,219,.15)' : 'rgba(36,85,219,.09)';
        ctx.lineWidth = 1;
        ctx.stroke();
        const dots = [11, 16, 21][ring];
        for (let dot = 0; dot < dots; dot++) {
          const angle = (dot / dots) * Math.PI * 2 + t * (ring % 2 ? -0.8 : 1) + ring;
          const x0 = radius * 1.10 * Math.cos(angle);
          const y0 = radius * Math.sin(angle);
          const x = cx + x0 * Math.cos(-0.32) - y0 * Math.sin(-0.32);
          const y = cy + x0 * Math.sin(-0.32) + y0 * Math.cos(-0.32);
          const r = (dot % 8 === 0 ? 3 : 1.25);
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = dot % 8 === 0 ? 'rgba(36,85,219,.72)' : 'rgba(36,85,219,.25)';
          ctx.fill();
        }
      }
      const core = ctx.createRadialGradient(cx, cy, 8, cx, cy, unit * 0.26);
      core.addColorStop(0, 'rgba(221,233,255,.9)');
      core.addColorStop(1, 'rgba(221,233,255,0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, unit * 0.26, 0, Math.PI * 2);
      ctx.fill();
    }

    function shouldAnimate() {
      return visible && document.visibilityState === 'visible' && !motion.matches;
    }
    function tick(now: number) {
      draw(now);
      if (shouldAnimate()) frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame);
      draw(performance.now());
      if (shouldAnimate()) frame = requestAnimationFrame(tick);
    }
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false;
      sync();
    });
    const resizer = new ResizeObserver(() => { resize(); sync(); });
    resizer.observe(host);
    observer.observe(host);
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    resize();
    sync();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizer.disconnect();
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      started = 0;
    };
  }, []);

  return <div className="orbit-field" ref={mountRef} aria-hidden="true"><canvas ref={canvasRef} /></div>;
}

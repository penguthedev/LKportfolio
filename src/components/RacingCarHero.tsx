import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { RotateCcw, ScanLine } from 'lucide-react';
import { carParts, type CarPartId } from '../data/carParts';

/** Real GLB is rendered behind the hero HTML; only a narrow overlay handles part selection. */
export function RacingCarHero() {
  const iframe = useRef<HTMLIFrameElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const [canLoad, setCanLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<CarPartId | null>(null);

  function send(type: 'HOVER' | 'POINTER' | 'CLICK' | 'SELECT' | 'PAUSE' | 'RESUME', extra: Record<string, unknown> = {}) {
    iframe.current?.contentWindow?.postMessage({ source: 'lin-portfolio', type, ...extra }, window.location.origin);
  }

  useEffect(() => {
    const supported = (() => {
      try { const canvas = document.createElement('canvas'); return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')); }
      catch { return false; }
    })();
    const mq = matchMedia('(min-width: 781px) and (prefers-reduced-motion: no-preference)');
    const update = () => setCanLoad(supported && mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== iframe.current?.contentWindow || event.data?.source !== 'lin-f1') return;
      if (event.data.type === 'READY') setReady(true);
      if (event.data.type === 'ERROR') { setFailed(true); setReady(false); }
      if (event.data.type === 'SELECTED' && typeof event.data.part === 'string') {
        const part = carParts.find(item => item.id === event.data.part);
        if (part) setSelected(part.id);
      }
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, []);

  useEffect(() => {
    if (!ready || !backdrop.current) return;
    const update = (visible: boolean) => send(visible && !document.hidden ? 'RESUME' : 'PAUSE');
    const observer = new IntersectionObserver(entries => update(Boolean(entries[0]?.isIntersecting)), { threshold: .01 });
    observer.observe(backdrop.current);
    const visibility = () => update(Boolean(backdrop.current && backdrop.current.getBoundingClientRect().bottom > 0 && backdrop.current.getBoundingClientRect().top < window.innerHeight));
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, [ready]);

  useEffect(() => {
    if (ready && selected) send('SELECT', { part: selected });
  }, [ready]);

 function pointerCoords(
  event: ReactPointerEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
) {
    if (!backdrop.current) return { x: 0, y: 0 };
    const bounds = backdrop.current.getBoundingClientRect();
    return { x: ((event.clientX - bounds.left) / bounds.width) * 2 - 1, y: -((event.clientY - bounds.top) / bounds.height) * 2 + 1 };
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch' || !ready) return;
    send('POINTER', pointerCoords(event));
  }

  function choosePart(part: CarPartId | null) {
    setSelected(part);
    if (ready) send('SELECT', { part });
  }
  const part = carParts.find(item => item.id === selected);

  return (
    <div ref={backdrop} className={`formula-background ${selected ? 'is-inspecting' : ''}`} aria-label="Rotating Formula-inspired racing car visual">
      <div className="formula-poster" aria-hidden="true" />
      {canLoad && !failed && (
        <iframe ref={iframe} className="formula-three-frame" src="/rb22-viewer.html" title="Interactive Formula-style racing car model" loading="eager" tabIndex={-1} />
      )}
      <div className="formula-text-scrim" aria-hidden="true" />
      <div className="formula-technical-lines" aria-hidden="true" />
      {canLoad && ready && (
        <div className="formula-hover-zone"
          aria-label="Car parts: hover to separate and click a visible component to inspect it"
          onPointerEnter={event => { if (event.pointerType !== 'touch') send('HOVER', { active: true }); }}
          onPointerMove={onPointerMove}
          onPointerLeave={() => send('HOVER', { active: false })}
          onClick={event => send('CLICK', pointerCoords(event))}
          title="Click a car part to see what it does"
        />
      )}
      <div className="formula-parts-panel">
        <div className="formula-parts-eyebrow"><ScanLine size={15} aria-hidden="true" /> EXPLORE THE F1 DESIGN</div>
        <div aria-live="polite" className="formula-parts-detail">
          <h3>{part?.title ?? 'Explore the car'}</h3>
          <p>{part?.description ?? 'Move the cursor over the car to separate its components. Click a part to see what it does, or choose one below.'}</p>
        </div>
        <div className="formula-parts-actions">
          <label className="sr-only" htmlFor="car-part-picker">Choose a car component</label>
          <select id="car-part-picker" value={selected ?? ''} onChange={event => choosePart((event.target.value || null) as CarPartId | null)}>
            <option value="">Select a part</option>
            {carParts.map(item => <option value={item.id} key={item.id}>{item.title}</option>)}
          </select>
          <button type="button" title="Clear car selection" aria-label="Clear car selection" onClick={() => choosePart(null)} disabled={!selected}><RotateCcw size={17} /></button>
        </div>
        <p className="formula-parts-note">Illustrative exterior anatomy · 3D model</p>
      </div>
    </div>
  );
}

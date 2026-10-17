import { useEffect, useRef, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import type { UIStudy } from '../data/portfolio';

type Props = { study: UIStudy | null; onClose: () => void };

/** Each original HTML/CSS/JS sample runs in a separate document to retain its own layout/colors. */
export function UIPlayground({ study, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (study) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setLoaded(false);
      if (!node.open) node.showModal();
    } else if (node.open) {
      node.close();
      opener.current?.focus();
    }
  }, [study]);

  return (
    <dialog ref={dialog} className="ui-playground-dialog original-ui-dialog" aria-labelledby="ui-playground-title" onClose={onClose} onClick={event => { if (event.target === dialog.current) onClose(); }}>
      {study && (
        <div className="original-ui-shell">
          <div className="original-ui-head">
            <div>
              <span className="lab-eyebrow">ORIGINAL INTERACTION · EMBEDDED UI</span>
              <h2 id="ui-playground-title">{study.title}</h2>
              <p>Original HTML, CSS and JavaScript effects from the supplied archive, displayed without changing their colors.</p>
            </div>
            <button className="lab-close" type="button" onClick={onClose} aria-label="Close interactive UI"><X size={23} /></button>
          </div>
          <div className="original-ui-viewport">
            {!loaded && <p className="original-ui-loading" role="status">Loading interactive experience…</p>}
            <iframe
              key={study.id}
              title={`${study.title} original interactive implementation`}
              src={`/ui-effects/${encodeURIComponent(study.id)}/index.html`}
              loading="eager"
              onLoad={() => setLoaded(true)}
              className="original-ui-frame"
              allow="clipboard-write"
            />
          </div>
          <div className="original-ui-footer">
            <p>Provided third-party UI effect · Licensed for use in portfolios. Not claimed as my own original work. Payment and account forms are UI-only examples.</p>
            <a href={`/ui-effects/${encodeURIComponent(study.id)}/index.html`} target="_blank" rel="noopener noreferrer">Open full size <ExternalLink size={15} /></a>
          </div>
        </div>
      )}
    </dialog>
  );
}

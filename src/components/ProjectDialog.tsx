import { useEffect, useRef } from 'react';
import { ArrowUpRight, Github, X, CheckCircle2, Bookmark, ExternalLink } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { ProjectVisual } from './ProjectVisual';
import { LiveProjectPreview, projectHasInteractivePreview } from './LiveProjectPreview';

type Props = {
  project: Project | null;
  onClose: () => void;
  saved: boolean;
  onToggleSaved: (id: string) => void;
};

export function ProjectDialog({ project, onClose, saved, onToggleSaved }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
      opener.current?.focus();
    }
  }, [project]);

  return (
    <dialog
      ref={ref}
      className="project-dialog"
      aria-labelledby="project-dialog-title"
      onClose={onClose}
      onClick={e => { if (e.target === ref.current) onClose(); }}
    >
      {project && (
        <div className="dialog-inner">
          <button onClick={onClose} className="dialog-close icon-button" aria-label="Close project details"><X size={21} /></button>
          <ProjectVisual project={project} expanded />
          <div className="dialog-body">
            <span className="eyebrow">{project.kicker} <span className="eyebrow-separator">/</span> {project.category}</span>
            <h2 id="project-dialog-title">{project.title}</h2>
            <p className="dialog-lead">{project.description}</p>
            {project.demo && (
              <div className="dialog-live-banner">
                <div><strong>Explore the actual application</strong><span>Runs on its own live website, not a simulated preview.</span></div>
                <a className="btn btn-primary" href={project.demo} target="_blank" rel="noopener noreferrer" aria-label={`Launch ${project.title} live app in a new tab`}><ExternalLink size={17} /> Launch Live App <ArrowUpRight size={16} /></a>
              </div>
            )}
            {project.id === 'personal-portfolio' && project.demo && (
              <section className="real-site-preview" aria-label="Deployed personal portfolio">
                <div className="real-site-preview-heading">
                  <strong>Real running website</strong>
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">Open full website <ArrowUpRight size={15} /></a>
                </div>
                <iframe
                  title="Live Lin Khant portfolio website"
                  src={project.demo}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  allow="fullscreen"
                />
                <p>If the deployed site blocks embedding, use the Open full website link.</p>
              </section>
            )}
            {projectHasInteractivePreview(project.id) && (
              <>
                <h3>Interactive portfolio preview</h3>
                <p>This lightweight preview runs directly inside the portfolio to demonstrate the interaction style and product flow.</p>
                <div className="live-preview-shell"><LiveProjectPreview project={project} /></div>
              </>
            )}
            <h3>My contribution</h3>
            <p>{project.contribution}</p>
            <h3>Project highlights</h3>
            <ul className="highlights">{project.highlights.map(h => <li key={h}><CheckCircle2 size={18} />{h}</li>)}</ul>
            <div className="project-tags dialog-tags">{project.technologies.map(t => <span key={t}>{t}</span>)}</div>
            <div className="dialog-actions">
              {project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary"><ExternalLink size={18} /> Live App <ArrowUpRight size={16} /></a>}
              <a href={project.github} target="_blank" rel="noopener noreferrer" className={project.demo ? 'btn btn-outline' : 'btn btn-primary'}><Github size={18} /> View GitHub <ArrowUpRight size={17} /></a>
              <button className="btn btn-light" onClick={() => onToggleSaved(project.id)} aria-pressed={saved}>
                <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

import { ArrowUpRight, Bookmark, Github, Plus, ExternalLink } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { ProjectVisual } from './ProjectVisual';
import { projectHasInteractivePreview } from './LiveProjectPreview';

type Props = {
  project: Project;
  saved: boolean;
  onToggleSaved: (id: string) => void;
  onOpen: (project: Project) => void;
};

export function ProjectCard({ project, saved, onToggleSaved, onOpen }: Props) {
  return (
    <article className="project-card">
      <button className="project-card-main" onClick={() => onOpen(project)} aria-label={`View details for ${project.title}`}>
        <ProjectVisual project={project} />
        <div className="project-card-content">
          <div className="project-card-eyebrow"><span>{project.kicker}</span><span>{project.category}</span></div>
          <h3>{project.title}</h3>
          <p className="project-card-description">{project.description}</p>
          <p className="project-card-contribution"><strong>My work:</strong> {project.contribution}</p>
          <div className="project-tags">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}{projectHasInteractivePreview(project.id) && <span className="project-preview-badge">Interactive preview</span>}</div>
          <span className="detail-inline">{projectHasInteractivePreview(project.id) ? 'Open project + interactive preview' : 'Explore project'} <Plus size={16} /></span>
        </div>
      </button>
      <div className="project-card-footer">
        {project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-demo project-live-primary" aria-label={`Launch ${project.title} live app in a new tab`}>
          <ExternalLink size={17} /> Live App <ArrowUpRight size={15} />
        </a>}
        <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-source" aria-label={`Open ${project.title} source code on GitHub (new tab)`}>
          <Github size={17} /> GitHub <ArrowUpRight size={15} />
        </a>
        <button
          className={`save-button ${saved ? 'is-saved' : ''}`}
          onClick={() => onToggleSaved(project.id)}
          aria-label={`${saved ? 'Remove' : 'Save'} ${project.title} ${saved ? 'from' : 'to'} bookmarks`}
          aria-pressed={saved}
          title={saved ? 'Remove bookmark' : 'Bookmark project'}
        ><Bookmark size={19} fill={saved ? 'currentColor' : 'none'} /></button>
      </div>
    </article>
  );
}

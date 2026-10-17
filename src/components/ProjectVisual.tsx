import { useEffect, useState } from 'react';
import { Code2 } from 'lucide-react';
import type { Project } from '../data/portfolio';

type Props = { project: Project; expanded?: boolean };

export function ProjectVisual({ project, expanded = false }: Props) {
  const [imageState, setImageState] = useState<'loading' | 'ok' | 'error'>('loading');
  useEffect(() => { setImageState('loading'); }, [project.screenshot]);
  return (
    <div className={`project-visual visual-${project.id} ${expanded ? 'project-visual--large' : ''}`}>
      {project.video && expanded && (
        <video className="project-video" controls playsInline preload="metadata" poster={imageState === 'ok' ? project.screenshot : undefined} aria-label={`${project.title} demonstration video`}>
          <source src={project.video} type={project.video.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
          Your browser does not support this video.
        </video>
      )}
      {!(project.video && expanded) && project.screenshot && imageState !== 'error' && (
        <img
          src={project.screenshot}
          alt={`Screenshot of ${project.title}`}
          loading="lazy"
          decoding="async"
          className={`project-image ${imageState === 'ok' ? 'is-loaded' : ''}`}
          onLoad={() => setImageState('ok')}
          onError={() => setImageState('error')}
        />
      )}
      {!(project.video && expanded) && imageState !== 'ok' && (
        <div className="project-placeholder" aria-label={`${project.title} project title artwork`}>
          <div className="placeholder-line placeholder-line-1" />
          <div className="placeholder-line placeholder-line-2" />
          <div className="placeholder-line placeholder-line-3" />
          <div className="placeholder-square"><span>{project.title.slice(0, 2).toUpperCase()}</span></div>
          <span className="placeholder-label"><Code2 size={15} strokeWidth={1.7} /> {project.category} / {project.technologies.slice(0, 2).join(" + ")}</span>
        </div>
      )}
    </div>
  );
}

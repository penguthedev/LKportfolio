import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Bookmark,
  Check, Code2, Github, GraduationCap,
  Linkedin, Mail, MapPin, Menu, Phone, Search, Sparkles, X
} from 'lucide-react';
import { education, experiences, profile, projects, skillGroups, uiStudies, type Project, type ProjectCategory } from './data/portfolio';
import { RacingCarHero } from './components/RacingCarHero';
import { Reveal } from './components/Reveal';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDialog } from './components/ProjectDialog';
import { UIPlayground } from './components/UIPlayground';

const sections = ['home', 'about', 'skills', 'experience', 'projects', 'contact'] as const;
type Filter = 'All' | ProjectCategory | 'Saved';
const filters: Filter[] = ['All', 'Full Stack', 'Frontend', 'Backend', 'Game', 'Saved'];

function usePageNavigation() {
  const [active, setActive] = useState('home');
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let pending = false;
    const update = () => {
      pending = false;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setProgress(Math.max(0, Math.min(100, window.scrollY / maxScroll * 100)));
      setScrolled(window.scrollY > 36);
      const visible = sections.map(id => {
        const el = document.getElementById(id);
        return { id, top: el?.getBoundingClientRect().top ?? Infinity };
      });
      const current = visible.filter(item => item.top <= window.innerHeight * 0.33).pop();
      setActive(current?.id ?? 'home');
    };
    const onScroll = () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return { active, progress, scrolled };
}

function External({ href, children, className = '', label }: { href: string; children: ReactNode; className?: string; label?: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={label}>{children}</a>;
}

function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return <div className="section-label"><span className="section-number">{index}</span><span className="section-label-line" /><span>{children}</span></div>;
}

function WorkFocus() {
  return (
    <div className="about-focus" aria-label="Areas of work">
      <span className="about-focus-kicker">DESIGN • DEVELOP • REFINE</span>
      <h3>From interface to implementation.</h3>
      <div className="about-focus-rows">
        <div><span className="about-focus-number">01</span><div><strong>Interactive interfaces</strong><p>React, TypeScript and UI/UX prototyping.</p></div></div>
        <div><span className="about-focus-number">02</span><div><strong>Backend systems</strong><p>FastAPI, Python and PostgreSQL applications.</p></div></div>
        <div><span className="about-focus-number">03</span><div><strong>Creative projects</strong><p>Canvas experiments and Python games.</p></div></div>
      </div>
    </div>
  );
}

function Header({ active, scrolled }: { active: string; scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);
  const navigate = () => setOpen(false);
  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container header-inner">
        <a href="#home" className="wordmark home-wheel-link" onClick={navigate} aria-label="Lin Khant home"><span className="wheel-mark" aria-hidden="true"><img src="/images/f1-wheel.png" alt="" /></span><span>LK<span className="wordmark-dot">.</span></span></a>
        <nav className={`primary-nav ${open ? 'nav-open' : ''}`} id="site-navigation" aria-label="Main navigation">
          {sections.map(id => (
            <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={navigate} className={active === id ? 'is-active' : ''}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
          <a href={`mailto:${profile.email}`} className="mobile-nav-email" onClick={navigate}>Email me <ArrowUpRight size={15} /></a>
        </nav>
        <div className="header-right">
          <a className="header-availability" href="#contact"><span className="availability-dot" /> <span className="internship-status">AVAILABLE</span> · INTERNSHIP 2027 <ArrowUpRight size={15} /></a>
          <button className="menu-toggle icon-button" onClick={() => setOpen(v => !v)} aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="site-navigation">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <RacingCarHero />
      <div className="container hero-container">
        <div className="hero-content">
          <p className="hero-eyebrow"><span className="eyebrow-dash" /> PORTFOLIO <span className="eyebrow-mid">/</span> 2026—27 <span className="eyebrow-mid">/</span> OPEN TO WORK</p>
          <h1 className="hero-title" id="hero-title"><span className="name-line"><span>LIN</span></span><span className="name-line"><span>KHANT<span className="name-period">.</span></span></span></h1>
          <div className="hero-summary">
            <p className="hero-role">{profile.role}</p>
            <p className="hero-tagline">{profile.tagline}</p>
          </div>
          <div className="hero-details">
            <span><MapPin size={17} strokeWidth={1.8} /> {profile.location}</span>
            <span><span className="availability-dot" /> {profile.availability}</span>
          </div>
          <div className="hero-ctas">
            <a href="#projects" className="btn btn-primary">View Projects <ArrowUpRight size={18} className="arrow-animate" /></a>
            <a href="#contact" className="btn btn-outline">Contact Me <ArrowRight size={18} className="arrow-animate" /></a>
            <External href={profile.github} className="btn btn-text" label="Lin Khant on GitHub, opens new tab"><Github size={19} /> GitHub <ArrowUpRight size={15} /></External>
          </div>
          <p className="hero-helper-copy">Explore the Formula-inspired car behind this introduction. Hover to separate its bodywork; click a part to inspect it.</p>
        </div>
        <div className="hero-note" aria-hidden="true"><span className="hero-note-seal">01</span><span>FORMULA CONCEPT<br />INTERACTIVE TEARDOWN</span></div>
        <a href="#about" className="scroll-cue">SCROLL TO EXPLORE <ArrowDownRight size={17} /></a>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section section-about" id="about" aria-labelledby="about-title">
      <div className="container">
        <Reveal><SectionLabel index="01">A LITTLE INTRODUCTION</SectionLabel></Reveal>
        <div className="about-layout">
          <Reveal className="about-intro">
            <h2 id="about-title" className="display-heading">Curiosity meets <em>craft.</em></h2>
            <p className="about-copy">{profile.about}</p>
            <div className="interests-block"><h3>Open to internship roles in</h3><p>{profile.interests.join('  ·  ')}</p></div>
            <a className="text-link" href="#projects">A look at what I build <ArrowUpRight size={18} /></a>
          </Reveal>
          <Reveal delay={100} className="about-side">
            <WorkFocus />
          </Reveal>
        </div>
        <Reveal>
          <div className="education-block">
            <div><h3 className="subsection-heading"><GraduationCap size={22} /> Education</h3><p className="muted-small">The foundation behind the work.</p></div>
            <div className="education-list">
              {education.map(item => (
                <article className="education-row" key={item.degree}>
                  <div><h4>{item.degree}</h4><p>{item.school}</p>{item.detail && <p className="education-detail">{item.detail}</p>}</div>
                  <time>{item.date}</time>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Skills() {
  const symbols = [<Code2 size={23} key="a" />, <span key="b" className="skill-symbol">{`{ }`}</span>, <span key="c" className="skill-symbol">C++</span>, <span key="d" className="skill-symbol">✳</span>];
  return (
    <section className="section section-skills" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <Reveal><SectionLabel index="02">TOOLS OF THE TRADE</SectionLabel></Reveal>
        <div className="section-heading-row"><Reveal><h2 className="display-heading" id="skills-title">My technical <em>toolkit.</em></h2></Reveal><Reveal><p className="section-side-copy">A growing set of tools for building interfaces, APIs and useful applications.</p></Reveal></div>
        <div className="skills-grid">
          {skillGroups.map((group, index) => (
            <Reveal delay={index * 70} key={group.name}>
              <div className="skill-card">
                <div className="skill-card-top"><span className="skill-icon">{symbols[index]}</span><span className="skill-index">0{index + 1}</span></div>
                <h3>{group.name}</h3>
                <div className="skill-tags">{group.values.map(s => <span key={s}>{s}</span>)}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="section section-experience" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <Reveal><SectionLabel index="03">WHERE I'VE BEEN</SectionLabel></Reveal>
        <div className="section-heading-row"><Reveal><h2 className="display-heading" id="experience-title">Learning by <em>doing.</em></h2></Reveal><Reveal><p className="section-side-copy">Professional exposure and independent projects, each adding something to the next.</p></Reveal></div>
        <div className="experience-timeline">
          {experiences.map((exp, index) => (
            <Reveal key={exp.title}>
              <article className="experience-item">
                <div className="experience-time"><span className="timeline-node" /><span>{exp.period}</span></div>
                <div className="experience-body"><span className="experience-index">0{index + 1} / EXPERIENCE</span><h3>{exp.title}</h3><p className="experience-company">{exp.company}</p><ul>{exp.points.map(point => <li key={point}>{point}</li>)}</ul></div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects({ saved, onToggleSaved }: { saved: string[]; onToggleSaved: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [current, setCurrent] = useState<Project | null>(null);
  const [activeStudy, setActiveStudy] = useState<(typeof uiStudies)[number] | null>(null);
  const visible = useMemo(() => projects.filter(p => {
    const matches = filter === 'All' || (filter === 'Saved' ? saved.includes(p.id) : p.category === filter || (filter === 'Backend' && p.technologies.includes('FastAPI')));
    const q = query.trim().toLowerCase();
    return matches && (!q || `${p.title} ${p.description} ${p.contribution} ${p.technologies.join(' ')}`.toLowerCase().includes(q));
  }), [filter, query, saved]);

  return (
    <section className="section section-projects" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <Reveal><SectionLabel index="04">SELECTED WORK</SectionLabel></Reveal>
        <div className="section-heading-row projects-header"><Reveal><h2 id="projects-title" className="display-heading">Things I've <em>built.</em></h2></Reveal><Reveal><p className="section-side-copy">A mix of application development, backend systems and creative experiments. Some projects include interactive previews that run directly inside this portfolio.</p></Reveal></div>
        <div className="project-toolbar">
          <div className="filter-list" role="group" aria-label="Filter projects by category">
            {filters.map(item => <button key={item} type="button" className={`filter-button ${filter === item ? 'is-current' : ''}`} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item === 'Saved' && <Bookmark size={14} fill={filter === 'Saved' ? 'currentColor' : 'none'} />}{item}</button>)}
          </div>
          <label className="project-search"><Search size={18} aria-hidden="true" /><span className="sr-only">Search projects</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search projects..." /></label>
        </div>
        <p className="results-count" aria-live="polite">SHOWING {visible.length} OF {projects.length} PROJECTS</p>
        {visible.length ? (
          <div className="project-grid">
            {visible.map((project, index) => <Reveal key={project.id} delay={(index % 2) * 80}><ProjectCard project={project} saved={saved.includes(project.id)} onToggleSaved={onToggleSaved} onOpen={setCurrent} /></Reveal>)}
          </div>
        ) : (
          <div className="empty-state"><Sparkles size={30} /><h3>No projects found</h3><p>Try another search term or category{filter === 'Saved' ? ', or bookmark a project first' : ''}.</p><button className="btn btn-outline" onClick={() => { setFilter('All'); setQuery(''); }}>Clear filters <ArrowRight size={16} /></button></div>
        )}
        <Reveal>
          <External href={profile.moreProjects} className="more-projects" label="Explore more projects and source code on GitHub (new tab)"><span><Github size={23} /><span>Explore more projects and source code on <strong>GitHub</strong></span></span><ArrowUpRight size={29} /></External>
        </Reveal>
        <Reveal>
          <div className="studies-heading"><div><span className="eyebrow">INTERACTION LIBRARY</span><h3>Interactive UI <em>studies.</em></h3></div><p>Explore seven working frontend interactions, with their original styling intact. These are credited third-party reference effects, separate from my own projects.</p></div>
          <div className="studies-grid">
            {uiStudies.map(study => <article className="study-card" key={study.id}>
              <img src={study.preview} alt={`Illustrated concept, not an actual screenshot: ${study.title}`} loading="lazy" decoding="async" />
              <div className="study-card-body"><span className="study-type">INTERACTIVE REFERENCE · THIRD-PARTY</span><h4>{study.title}</h4><p>{study.summary}</p><div className="study-tags">{study.technologies.map(t => <span key={t}>{t}</span>)}</div><button className="study-run-button" type="button" onClick={() => setActiveStudy(study)}>Open original interaction <ArrowUpRight size={16}/></button><span className="study-credit">Original third-party effect · Styling preserved</span></div>
            </article>)}
          </div>
        </Reveal>
      </div>
      <ProjectDialog project={current} onClose={() => setCurrent(null)} saved={Boolean(current && saved.includes(current.id))} onToggleSaved={onToggleSaved} />
      <UIPlayground study={activeStudy} onClose={() => setActiveStudy(null)} />
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState<'idle' | 'success' | 'error'>('idle');
  useEffect(() => {
    if (copied === 'idle') return;
    const timeout = window.setTimeout(() => setCopied('idle'), 2700);
    return () => window.clearTimeout(timeout);
  }, [copied]);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied('success');
    } catch {
      setCopied('error');
    }
  }
  return (
    <section className="section section-contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <Reveal><SectionLabel index="05">GET IN TOUCH</SectionLabel></Reveal>
        <Reveal>
          <div className="contact-panel">
            <div className="contact-orbit" aria-hidden="true" />
            <div className="contact-content"><p className="contact-eyebrow"><span className="availability-dot" /> {profile.availability}</p><h2 id="contact-title">Let's build<br /><em>something good.</em></h2><p>Have an internship opportunity, a project idea, or just want to say hello? I'd be glad to connect.</p>
              <div className="contact-actions"><a className="btn btn-cream" href={`mailto:${profile.email}`}>Say hello <ArrowUpRight size={19} className="arrow-animate" /></a><button className="btn btn-ghost" onClick={copyEmail} aria-live="polite">{copied === 'success' ? <Check size={18} /> : <Mail size={18} />}{copied === 'success' ? 'Email copied!' : copied === 'error' ? 'Copy unavailable' : 'Copy email'}</button></div>
            </div>
            <div className="contact-details"><a href={`mailto:${profile.email}`}><Mail size={18} /> {profile.email} <ArrowUpRight size={15} /></a><a href={`tel:${profile.phoneHref}`}><Phone size={18} /> {profile.phone} <ArrowUpRight size={15} /></a><External href={profile.github}><Github size={18} /> GitHub <ArrowUpRight size={15} /></External><External href={profile.linkedin}><Linkedin size={18} /> LinkedIn <ArrowUpRight size={15} /></External></div>
          </div>
        </Reveal>
        <div className="personal-row">
          <Reveal><div><h3>Languages</h3><div className="personal-items">{profile.languages.map(l => <span key={l.language}><strong>{l.language}</strong> <span>{l.level}</span></span>)}</div></div></Reveal>
          <Reveal><div><h3>Beyond the screen</h3><p>{profile.hobbies.join('  ·  ')}</p></div></Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-layout"><a href="#home" className="footer-name" aria-label="Back to top">LIN KHANT<span>.</span></a><p>Made with intention. Built with code.</p><div className="footer-links"><External href={profile.github} label="GitHub, new tab"><Github size={19} /></External><External href={profile.linkedin} label="LinkedIn, new tab"><Linkedin size={19} /></External><a href={`mailto:${profile.email}`} aria-label="Email Lin"><Mail size={19} /></a></div><span className="footer-copyright">© {new Date().getFullYear()} Lin Khant</span></div>
    </footer>
  );
}

export default function App() {
  const { active, progress, scrolled } = usePageNavigation();
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem('lin-khant-saved-projects') || '[]');
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
    } catch { return []; }
  });
  const toggleSaved = (id: string) => setSaved(prev => prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]);
  useEffect(() => {
    try { localStorage.setItem('lin-khant-saved-projects', JSON.stringify(saved)); } catch { /* Storage is optional */ }
  }, [saved]);
  useEffect(() => {
    let frame = 0;
    const rotateWheel = () => {
      frame = 0;
      const rotation = `${window.scrollY * 1.2}deg`;
      document.documentElement.style.setProperty('--scroll-wheel-angle', rotation);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(rotateWheel); };
    rotateWheel();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    const onHomeClick = (event: MouseEvent) => {
      const target=event.target;
      if (!(target instanceof Element)) return;
      const link=target.closest('a[href="#home"]');
      if (!link) return;
      document.documentElement.classList.remove('racing-home');
      void document.documentElement.offsetWidth;
      document.documentElement.classList.add('racing-home');
      window.setTimeout(() => document.documentElement.classList.remove('racing-home'), 1100);
    };
    document.addEventListener('click',onHomeClick);
    return () => document.removeEventListener('click',onHomeClick);
  }, []);
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="scroll-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
      <Header active={active} scrolled={scrolled} />
      <main id="main-content">
        <Hero /><About /><Skills /><Experience /><Projects saved={saved} onToggleSaved={toggleSaved} /><Contact />
      </main>
      <Footer />
      <a className={`back-to-top ${scrolled ? 'is-visible' : ''}`} href="#home" aria-label="Back to top"><span className="wheel-mark" aria-hidden="true"><img src="/images/f1-wheel.png" alt="" /></span></a>
    </>
  );
}

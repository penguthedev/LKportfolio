import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, ChefHat, Clock3, Heart, Search, Star, Users } from 'lucide-react';
import type { Project } from '../data/portfolio';

type Props = {
  project: Project;
};

type ReservationSlot = '6:00 PM' | '7:30 PM' | '9:00 PM';

const movieList = [
  { id: 1, title: 'Dune', genre: 'Sci‑Fi', year: 2021 },
  { id: 2, title: 'Interstellar', genre: 'Sci‑Fi', year: 2014 },
  { id: 3, title: 'La La Land', genre: 'Drama', year: 2016 },
  { id: 4, title: 'Inside Out 2', genre: 'Animation', year: 2024 },
  { id: 5, title: 'The Batman', genre: 'Action', year: 2022 },
];

function ClassroomPreview() {
  const [role, setRole] = useState<'Student' | 'Teacher' | 'Admin'>('Student');
  const roleInfo = {
    Student: { classes: 5, alerts: 2, tasks: 3, panel: 'View timetable, enrolment status and assistant answers.' },
    Teacher: { classes: 4, alerts: 1, tasks: 6, panel: 'Review classes, attendance and timetable conflicts.' },
    Admin: { classes: 12, alerts: 3, tasks: 9, panel: 'Manage permissions, classes and academic operations.' },
  } as const;
  const info = roleInfo[role];
  return (
    <div className="live-preview-inner live-dashboard">
      <div className="live-preview-toolbar">
        <span className="live-preview-label">Interactive preview</span>
        <div className="live-chip-group" role="group" aria-label="Choose dashboard role">
          {(['Student', 'Teacher', 'Admin'] as const).map(item => (
            <button key={item} type="button" className={`live-chip ${role === item ? 'is-active' : ''}`} onClick={() => setRole(item)}>{item}</button>
          ))}
        </div>
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-metric"><strong>{info.classes}</strong><span>Active classes</span></div>
        <div className="dashboard-metric"><strong>{info.alerts}</strong><span>Alerts</span></div>
        <div className="dashboard-metric"><strong>{info.tasks}</strong><span>Tasks today</span></div>
      </div>
      <div className="dashboard-panel">
        <div>
          <p className="panel-title">Current role</p>
          <h4>{role}</h4>
          <p>{info.panel}</p>
        </div>
        <div className="assistant-card">
          <span>Gemini assistant</span>
          <p>“Show me timetable conflicts for Wednesday and suggest a free classroom.”</p>
        </div>
      </div>
    </div>
  );
}

function QuickDinePreview() {
  const [name, setName] = useState('Lin');
  const [guests, setGuests] = useState(2);
  const [slot, setSlot] = useState<ReservationSlot>('7:30 PM');
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div className="live-preview-inner">
      <div className="live-preview-toolbar">
        <span className="live-preview-label">Quick booking demo</span>
        <span className="live-status"><ChefHat size={14} /> Booking UI prototype</span>
      </div>
      <div className="reservation-card">
        <div className="reservation-header">
          <div>
            <h4>Saffron Kitchen</h4>
            <p>Modern Asian dining · Bukit Jalil</p>
          </div>
          <div className="rating-badge"><Star size={14} fill="currentColor" /> 4.8</div>
        </div>
        <div className="reservation-grid">
          <label>
            <span>Name</span>
            <input value={name} onChange={event => setName(event.target.value)} />
          </label>
          <label>
            <span>Guests</span>
            <input type="number" min={1} max={12} value={guests} onChange={event => setGuests(Number(event.target.value) || 1)} />
          </label>
        </div>
        <div className="slot-row">
          {(['6:00 PM', '7:30 PM', '9:00 PM'] as ReservationSlot[]).map(item => (
            <button key={item} type="button" className={`slot-button ${slot === item ? 'is-active' : ''}`} onClick={() => setSlot(item)}>{item}</button>
          ))}
        </div>
        <button className="mini-action" type="button" onClick={() => setConfirmed(true)}>
          <CalendarDays size={16} /> Reserve table
        </button>
        {confirmed && <p className="live-feedback"><Check size={15} /> Local preview only: {name || 'Guest'} · {guests} guests · {slot}</p>}
      </div>
    </div>
  );
}

function HabitPreview() {
  const [habits, setHabits] = useState(() => {
    const initial = [
      { id: 'drink', label: 'Drink water', done: true },
      { id: 'study', label: 'Study for 1 hour', done: false },
      { id: 'walk', label: 'Take a short walk', done: true },
    ];
    try {
      const saved = JSON.parse(localStorage.getItem('lin-portfolio-habit-lab') || 'null');
      return Array.isArray(saved) && saved.length === 3 && saved.every(item => typeof item.id === 'string' && typeof item.done === 'boolean' && typeof item.label === 'string') ? saved as typeof initial : initial;
    } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem('lin-portfolio-habit-lab', JSON.stringify(habits)); } catch { /* Optional storage */ } }, [habits]);
  const doneCount = habits.filter(item => item.done).length;
  const streak = doneCount; // Preview tracks today's completed activities only; historical streaks require dated records.
  function toggle(id: string) {
    setHabits(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  }
  return (
    <div className="live-preview-inner">
      <div className="live-preview-toolbar">
        <span className="live-preview-label">Habit tracker demo</span>
        <span className="live-status"><Clock3 size={14} /> This mini-preview saves progress locally</span>
      </div>
      <div className="habit-preview-card">
        <div className="habit-summary">
          <div><strong>{doneCount}/{habits.length}</strong><span>completed today</span></div>
          <div><strong>{streak}</strong><span>today's progress</span></div>
        </div>
        <ul className="habit-list">
          {habits.map(item => (
            <li key={item.id}>
              <label>
                <input type="checkbox" checked={item.done} onChange={() => toggle(item.id)} />
                <span>{item.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MoviePreview() {
  const [query, setQuery] = useState('');
  const [favourites, setFavourites] = useState<number[]>(() => {
    try { const saved = JSON.parse(localStorage.getItem('lin-portfolio-movie-lab') || '[2]'); return Array.isArray(saved) && saved.every(x => typeof x === 'number') ? saved : [2]; }
    catch { return [2]; }
  });
  useEffect(() => { try { localStorage.setItem('lin-portfolio-movie-lab', JSON.stringify(favourites)); } catch { /* Optional storage */ } }, [favourites]);
  const visible = useMemo(() => movieList.filter(movie => `${movie.title} ${movie.genre}`.toLowerCase().includes(query.toLowerCase())), [query]);
  function toggleFavourite(id: number) {
    setFavourites(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  }
  return (
    <div className="live-preview-inner">
      <div className="live-preview-toolbar">
        <span className="live-preview-label">Movie search demo</span>
        <label className="movie-search">
          <Search size={14} />
          <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search title or genre" />
        </label>
      </div>
      <div className="movie-list">
        {visible.map(movie => {
          const liked = favourites.includes(movie.id);
          return (
            <article key={movie.id} className="movie-row">
              <div className="movie-poster" aria-hidden="true">{movie.title.slice(0, 2).toUpperCase()}</div>
              <div className="movie-copy">
                <strong>{movie.title}</strong>
                <span>{movie.genre} · {movie.year}</span>
              </div>
              <button type="button" className={`favourite-button ${liked ? 'is-liked' : ''}`} onClick={() => toggleFavourite(movie.id)} aria-pressed={liked}>
                <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function PortfolioPreview() {
  const [panel, setPanel] = useState<'Chat' | 'Canvas' | 'Performance'>('Chat');
  const content = {
    Chat: 'Claude assistant with timeout handling and fallback messaging.',
    Canvas: 'Shared scroll and canvas animation coordination for responsive motion.',
    Performance: 'Visibility-aware animation pauses reduce wasted rendering work.',
  } as const;
  return (
    <div className="live-preview-inner">
      <div className="live-preview-toolbar">
        <span className="live-preview-label">Portfolio systems preview</span>
        <div className="live-chip-group" role="group" aria-label="Select portfolio subsystem">
          {(['Chat', 'Canvas', 'Performance'] as const).map(item => (
            <button key={item} type="button" className={`live-chip ${panel === item ? 'is-active' : ''}`} onClick={() => setPanel(item)}>{item}</button>
          ))}
        </div>
      </div>
      <div className="portfolio-preview-card">
        <div className="preview-terminal">
          <span className="dot" /><span className="dot" /><span className="dot" />
          <strong>portfolio.system</strong>
        </div>
        <div className="portfolio-preview-main">
          <div className="preview-stat"><Users size={16} /><span>Responsive interactions</span></div>
          <p>{content[panel]}</p>
        </div>
      </div>
    </div>
  );
}

export function projectHasInteractivePreview(projectId: string) {
  return ['classroom-dashboard', 'quickdine', 'habit-tracker', 'lumi-movie', 'personal-portfolio'].includes(projectId);
}

export function LiveProjectPreview({ project }: Props) {
  switch (project.id) {
    case 'classroom-dashboard':
      return <ClassroomPreview />;
    case 'quickdine':
      return <QuickDinePreview />;
    case 'habit-tracker':
      return <HabitPreview />;
    case 'lumi-movie':
      return <MoviePreview />;
    case 'personal-portfolio':
      return <PortfolioPreview />;
    default:
      return null;
  }
}

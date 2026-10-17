/** Edit all text, URLs and project screenshot paths here. */
export type ProjectCategory = 'Full Stack' | 'Frontend' | 'Backend' | 'Game';
export type Project = {
  id: string;
  title: string;
  kicker: string;
  category: ProjectCategory;
  description: string;
  contribution: string;
  highlights: string[];
  technologies: string[];
  github: string;
  demo?: string; // Only add genuine deployed demo URLs
  screenshot: string; // Image/poster path; otherwise a labelled placeholder appears
  video?: string; // Optional genuine MP4/WebM; expanded project dialog shows controls
  featured?: boolean;
};

export type UIStudy = {
  id: string;
  title: string;
  summary: string;
  preview: string; // Illustrative image; not a screenshot of the source pack
  technologies: string[];
  sourceNote: string;
};

export const profile = {
  name: 'LIN KHANT',
  firstName: 'LIN',
  lastName: 'KHANT',
  role: 'Computer Science Student | Developer & UI/UX Designer',
  tagline: 'Building interactive web experiences and practical backend systems.',
  location: 'Kuala Lumpur, Malaysia',
  availability: 'Available for internships from January 2027',
  email: 'linnkhant217@gmail.com',
  phone: '+60 13-717 7415',
  phoneHref: '+60137177415',
  github: 'https://github.com/penguthedev',
  linkedin: 'https://www.linkedin.com/in/lin-khant-810773362/',
  moreProjects: 'https://github.com/penguthedev?tab=repositories',
  about: "I’m a second-year Computer Science student at Asia Pacific University of Technology and Innovation. I enjoy combining programming, interface design and problem solving to turn ideas into working applications. My projects include React websites, Python APIs, interactive games and AI-assisted applications.",
  interests: ['Software Engineering', 'Full Stack', 'Frontend', 'Backend', 'Data Analytics', 'AI Engineering', 'UI/UX'],
  languages: [
    { language: 'Burmese', level: 'Native' },
    { language: 'English', level: 'C1 Advanced' },
    { language: 'Mandarin', level: 'B1 Intermediate' },
  ],
  hobbies: ['Indie game design', 'Videography', 'Video editing', 'Gunpla building'],
};

export const education = [
  {
    degree: 'BSc Computer Science',
    school: 'Asia Pacific University, Malaysia',
    date: '2025–Present',
    detail: 'Year 2 Semester 1 GPA: 3.79/4.00',
  },
  {
    degree: 'Professional Web Developer',
    school: 'Fairway Technology, Myanmar',
    date: '2023',
    detail: '',
  },
];

export const skillGroups = [
  { name: 'Frontend', values: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'HTML Canvas'] },
  { name: 'Backend & databases', values: ['Python', 'FastAPI', 'Node.js', 'Express', 'SQL', 'PostgreSQL'] },
  { name: 'Programming fundamentals', values: ['Java', 'C', 'C++', 'OOP'] },
  { name: 'Tools & design', values: ['Git', 'GitHub', 'Chrome DevTools', 'UI/UX', 'Wireframing', 'Prototyping'] },
];

export const experiences = [
  {
    title: 'AI Engineer Intern',
    company: 'The13',
    period: 'July–September 2026',
    points: [
      'Improved interactive website elements and mobile usability.',
      'Supported speech recognition model training through data validation.',
    ],
  },
  {
    title: 'Web Developer & UI/UX Designer',
    company: 'Personal Projects',
    period: '2025–Present',
    points: [
      'Built React applications, API integrations and Python games.',
      'Designed mobile interfaces, wireframes and high-fidelity prototypes.',
    ],
  },
  {
    title: 'Technical Assistant Trainee',
    company: 'APU',
    period: 'October–December 2025',
    points: [
      'Provided technical support and resolved client issues.',
      'Maintained equipment and developed professional communication skills.',
    ],
  },
];

export const projects: Project[] = [
  {
    id: 'classroom-dashboard', title: 'Classroom Management Dashboard', kicker: '01 / Academic systems',
    category: 'Full Stack',
    description: 'A university dashboard for managing classes, schedules and enrolments, with a context-aware AI assistant.',
    contribution: 'Focused on the FastAPI backend, authentication, role permissions, enrolments, timetable conflict checks and Gemini assistant integration.',
    highlights: ['Role-aware access to academic workflows', 'Timetable conflict detection', 'AI assistant connected to application data'],
    technologies: ['React', 'FastAPI', 'PostgreSQL', 'Python', 'Gemini'],
    github: 'https://github.com/penguthedev/classroom-dashboard', screenshot: '/images/projects/classroom-dashboard.png', featured: true,
  },
  {
    id: 'quickdine', title: 'QuickDine Restaurant Booking', kicker: '02 / Reservations',
    category: 'Full Stack',
    description: 'A restaurant discovery and reservation experience with authentication and role-specific dashboards.',
    contribution: 'Built a React/TypeScript interface connected to a FastAPI and SQLite booking system.',
    highlights: ['Restaurant search and reservations', 'Authentication', 'Role-based dashboards'],
    technologies: ['React', 'TypeScript', 'FastAPI', 'SQLite'],
    github: 'https://github.com/penguthedev/RestaurantQuickDine', demo: 'https://quickodinos.netlify.app/', screenshot: '/images/projects/quickdine.png', featured: true,
  },
  {
    id: 'personal-portfolio', title: 'Personal Portfolio', kicker: '03 / Creative development',
    category: 'Frontend',
    description: 'An animated web experience with a Claude-powered assistant and performance-conscious interactions.',
    contribution: 'Worked on HTML Canvas motion, shared scroll handling, visibility-aware pauses, request timeouts and graceful fallbacks.',
    highlights: ['Interactive Canvas elements', 'Claude-powered assistant', 'Animation and request resilience'],
    technologies: ['React', 'Node.js', 'Express', 'HTML Canvas'],
    github: 'https://github.com/penguthedev/portfolio', demo: 'https://linkhantv1.netlify.app/', screenshot: '/images/projects/personal-portfolio.png', featured: true,
  },
  {
    id: 'lumi-movie', title: 'Lumi Movie App', kicker: '04 / Media discovery',
    category: 'Frontend',
    description: 'A movie discovery interface for finding films and keeping a personal favourites list.',
    contribution: 'Integrated TMDB search and browsing with React Context and localStorage for persistent favourites.',
    highlights: ['TMDB API integration', 'Movie browsing and search', 'Persistent favourites'],
    technologies: ['React', 'TMDB API', 'Context API', 'localStorage'],
    github: 'https://github.com/penguthedev/LumiMovieProject', demo: 'https://lumimovieapp.netlify.app/', screenshot: '/images/projects/lumi-movie.png',
  },
  {
    id: 'habit-tracker', title: 'Habit Tracker', kicker: '05 / Everyday utility',
    category: 'Frontend',
    description: 'A focused habit-building application for daily tracking and reflecting on consistency.',
    contribution: 'Implemented daily completion states, streak calculations and persistent local storage.',
    highlights: ['Daily completion tracking', 'Streak calculations', 'Saved progress across sessions'],
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    github: 'https://github.com/penguthedev/habit-tracker', demo: 'https://habitotraka.netlify.app/', screenshot: '/images/projects/habit-tracker.png',
  },
  {
    id: 'flappybird', title: 'Flappy Bird', kicker: '06 / Interactive game',
    category: 'Game',
    description: 'A lightweight desktop arcade game exploring real-time logic and responsive interaction.',
    contribution: 'Programmed the Tkinter game loop, gravity, randomized obstacles, collision detection and score tracking.',
    highlights: ['Gravity and movement physics', 'Random obstacle generation', 'Collision and score logic'],
    technologies: ['Python', 'Tkinter'],
    github: 'https://github.com/penguthedev/flappybird', screenshot: '/images/projects/flappybird.png',
  },
];

/**
 * These images are illustrations that index the third-party UI demo packages in the supplied Projects.zip.
 * They are NOT screenshots, and the supplied packages must not be redistributed or claimed as original work.
 * Delete this section if you prefer a projects-only public portfolio.
 */
export const uiStudies: UIStudy[] = [
  { id: 'cool-loading-screens', title: 'Animated Loading Screens', summary: 'Five playful, themed loading interactions.', preview: '/images/ui-studies/cool-loading-screens.svg', technologies: ['HTML', 'CSS', 'JavaScript'], sourceNote: 'Supplied third-party demo pack — attribution required' },
  { id: 'day-night-window-toggle', title: 'Day / Night Window Toggle', summary: 'A window-inspired theme switch with atmospheric motion.', preview: '/images/ui-studies/day-night-window-toggle.svg', technologies: ['HTML', 'CSS', 'JavaScript'], sourceNote: 'Supplied third-party demo pack — attribution required' },
  { id: 'hover-buttons-part-2', title: 'Hover Button Interactions', summary: 'Button effects and playful microinteractions.', preview: '/images/ui-studies/hover-buttons-part-2.svg', technologies: ['HTML', 'CSS', 'JavaScript'], sourceNote: 'Supplied third-party demo pack — attribution required' },
  { id: 'login-signup-animation', title: 'Split Panel Authentication UI', summary: 'Animated navigation between sign-in and registration views.', preview: '/images/ui-studies/login-signup-animation.svg', technologies: ['HTML', 'CSS', 'JavaScript'], sourceNote: 'Supplied third-party demo pack — attribution required' },
  { id: 'modern-checkout-ui', title: 'Interactive Checkout Concept', summary: 'A UI-only payment-form and card-interaction demonstration.', preview: '/images/ui-studies/modern-checkout-ui.svg', technologies: ['HTML', 'CSS', 'JavaScript'], sourceNote: 'Supplied third-party demo pack — attribution required; not a payment processor' },
  { id: 'navigation-ideas-part-1', title: 'Navigation Interaction Ideas', summary: 'Themed navigation concepts with custom motion.', preview: '/images/ui-studies/navigation-ideas-part-1.svg', technologies: ['HTML', 'CSS', 'JavaScript'], sourceNote: 'Supplied third-party demo pack — attribution required' },
  { id: 'otp-verification', title: 'OTP Verification Concept', summary: 'An animated code-entry interface demonstrating UI states.', preview: '/images/ui-studies/otp-verification.svg', technologies: ['HTML', 'CSS', 'JavaScript'], sourceNote: 'Supplied third-party demo pack — attribution required; UI demo only' },
];

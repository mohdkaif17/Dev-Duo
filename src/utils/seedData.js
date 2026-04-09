import { saveEvents, saveChallenges, saveSubmissions, saveProjects, savePhotos } from './storage';

// Demo data for ClubVerse

const demoEvents = [
  {
    id: 'evt-001',
    title: 'DevFest 2024',
    category: 'Conference',
    date: '2024-12-15',
    status: 'Published',
    description: 'Annual developer festival featuring workshops on AI, Web3, and Cloud technologies. Join industry experts for a day of learning and networking.',
    registrations: [],
    maxSlots: 200,
    image: '/images/events/devfest.jpg'
  },
  {
    id: 'evt-002',
    title: 'React Workshop',
    category: 'Workshop',
    date: '2024-11-10',
    status: 'Published',
    description: 'Hands-on workshop covering React 18 features, hooks, and modern patterns. Build real-world components with expert guidance.',
    registrations: [],
    maxSlots: 50,
    image: '/images/events/react-workshop.jpg'
  },
  {
    id: 'evt-003',
    title: 'Hackathon 2025',
    category: 'Competition',
    date: '2025-01-20',
    status: 'Upcoming',
    description: '24-hour coding competition with prizes worth ₹50,000. Form teams and build innovative solutions to real-world problems.',
    registrations: [],
    maxSlots: 150,
    image: '/images/events/hackathon.jpg'
  },
  {
    id: 'evt-004',
    title: 'AI Challenge',
    category: 'Competition',
    date: '2025-02-05',
    status: 'Draft',
    description: 'Test your machine learning skills in this AI-focused challenge. Build models, compete on leaderboards, and win exciting prizes.',
    registrations: [],
    maxSlots: 100,
    image: '/images/events/ai-challenge.jpg'
  }
];

const demoChallenges = [
  {
    id: 'chl-001',
    title: 'Build a Portfolio Website',
    difficulty: 'Easy',
    category: 'Web Dev',
    deadline: '2024-11-30',
    xp: 100,
    description: 'Create a responsive portfolio website using HTML, CSS, and JavaScript. Include sections for about, projects, and contact.',
    status: 'Active',
    submissions: []
  },
  {
    id: 'chl-002',
    title: 'REST API with Node.js',
    difficulty: 'Medium',
    category: 'Backend',
    deadline: '2024-12-15',
    xp: 250,
    description: 'Build a RESTful API using Node.js and Express. Implement CRUD operations, authentication, and database integration.',
    status: 'Active',
    submissions: []
  },
  {
    id: 'chl-003',
    title: 'Machine Learning Classifier',
    difficulty: 'Hard',
    category: 'AI/ML',
    deadline: '2025-01-10',
    xp: 500,
    description: 'Develop a machine learning model to classify data. Use Python, scikit-learn, and achieve at least 85% accuracy.',
    status: 'Active',
    submissions: []
  },
  {
    id: 'chl-004',
    title: 'Mobile App with React Native',
    difficulty: 'Medium',
    category: 'Mobile',
    deadline: '2025-01-25',
    xp: 300,
    description: 'Build a cross-platform mobile application using React Native. Include navigation, state management, and API integration.',
    status: 'Active',
    submissions: []
  }
];

const demoSubmissions = [
  {
    id: 'sub-001',
    challengeId: 'chl-001',
    challengeTitle: 'Build a Portfolio Website',
    userId: 'user-001',
    userName: 'Demo User',
    title: 'My Awesome Portfolio',
    description: 'Created a fully responsive portfolio with animations and dark mode support.',
    demoUrl: 'https://demo.example.com/portfolio',
    githubUrl: 'https://github.com/demo/portfolio',
    submittedAt: '2024-11-15T10:30:00Z',
    score: null,
    status: 'Pending'
  },
  {
    id: 'sub-002',
    challengeId: 'chl-002',
    challengeTitle: 'REST API with Node.js',
    userId: 'user-002',
    userName: 'John Doe',
    title: 'E-commerce API',
    description: 'Built a complete e-commerce API with user auth, product management, and order processing.',
    demoUrl: 'https://api.demo.example.com',
    githubUrl: 'https://github.com/demo/ecommerce-api',
    submittedAt: '2024-12-01T14:20:00Z',
    score: 85,
    status: 'Graded'
  },
  {
    id: 'sub-003',
    challengeId: 'chl-001',
    challengeTitle: 'Build a Portfolio Website',
    userId: 'user-003',
    userName: 'Jane Smith',
    title: 'Creative Developer Portfolio',
    description: 'A unique portfolio featuring WebGL effects and smooth page transitions.',
    demoUrl: 'https://jane.demo.example.com',
    githubUrl: 'https://github.com/jane/portfolio',
    submittedAt: '2024-11-20T09:15:00Z',
    score: 92,
    status: 'Graded'
  }
];

const demoProjects = [
  {
    id: 'prj-001',
    title: 'ClubHub Platform',
    description: 'A comprehensive platform for managing tech club activities, events, and member engagement.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    githubLink: 'https://github.com/techverse/clubhub',
    liveDemo: 'https://clubhub.demo',
    likes: 156,
    stars: 89,
    featured: true,
    year: '2024',
    domain: 'Web Dev',
    team: [
      { name: 'Alex Johnson', role: 'Lead Developer', github: 'alexj' },
      { name: 'Sarah Chen', role: 'UI/UX Designer', github: 'sarahc' }
    ]
  },
  {
    id: 'prj-002',
    title: 'AI Study Assistant',
    description: 'An AI-powered study companion that helps students with personalized learning paths and quiz generation.',
    techStack: ['Python', 'TensorFlow', 'FastAPI', 'React'],
    githubLink: 'https://github.com/techverse/ai-study',
    liveDemo: 'https://aistudy.demo',
    likes: 234,
    stars: 145,
    featured: true,
    year: '2024',
    domain: 'AI/ML',
    team: [
      { name: 'Mike Ross', role: 'ML Engineer', github: 'miker' },
      { name: 'Emily Wang', role: 'Frontend Dev', github: 'emilyw' }
    ]
  },
  {
    id: 'prj-003',
    title: 'Campus Navigation App',
    description: 'Indoor navigation solution for university buildings with AR wayfinding features.',
    techStack: ['React Native', 'ARKit', 'Node.js', 'PostgreSQL'],
    githubLink: 'https://github.com/techverse/campus-nav',
    liveDemo: 'https://campusnav.demo',
    likes: 98,
    stars: 56,
    featured: false,
    year: '2024',
    domain: 'Mobile',
    team: [
      { name: 'David Kim', role: 'Mobile Dev', github: 'davidk' },
      { name: 'Lisa Park', role: 'UI Designer', github: 'lisap' }
    ]
  }
];

// Demo photos for Gallery
const demoPhotos = [
  { id: 'photo-001', src: 'https://picsum.photos/seed/1/600/400', album: 'DevFest 2024', date: '2024-12-10', height: 260 },
  { id: 'photo-002', src: 'https://picsum.photos/seed/2/600/450', album: 'DevFest 2024', date: '2024-12-10', height: 300 },
  { id: 'photo-003', src: 'https://picsum.photos/seed/3/600/350', album: 'DevFest 2024', date: '2024-12-10', height: 220 },
  { id: 'photo-004', src: 'https://picsum.photos/seed/4/600/500', album: 'Hackathon 2025', date: '2025-01-20', height: 320 },
  { id: 'photo-005', src: 'https://picsum.photos/seed/5/600/380', album: 'Hackathon 2025', date: '2025-01-20', height: 250 },
  { id: 'photo-006', src: 'https://picsum.photos/seed/6/600/420', album: 'Hackathon 2025', date: '2025-01-20', height: 280 },
  { id: 'photo-007', src: 'https://picsum.photos/seed/7/600/360', album: 'React Workshop', date: '2024-11-15', height: 240 },
  { id: 'photo-008', src: 'https://picsum.photos/seed/8/600/480', album: 'React Workshop', date: '2024-11-15', height: 300 },
  { id: 'photo-009', src: 'https://picsum.photos/seed/9/600/400', album: 'Social Night', date: '2024-10-25', height: 260 },
  { id: 'photo-010', src: 'https://picsum.photos/seed/10/600/440', album: 'Social Night', date: '2024-10-25', height: 290 },
];

export const seedData = () => {
  // Only seed if data doesn't already exist
  const existingEvents = localStorage.getItem('cv_events');
  const existingChallenges = localStorage.getItem('cv_challenges');
  const existingSubmissions = localStorage.getItem('cv_submissions');
  const existingProjects = localStorage.getItem('cv_projects');
  const existingPhotos = localStorage.getItem('cv_photos');

  if (!existingEvents) {
    saveEvents(demoEvents);
    console.log('[Seed] Events seeded');
  }

  if (!existingChallenges) {
    saveChallenges(demoChallenges);
    console.log('[Seed] Challenges seeded');
  }

  if (!existingSubmissions) {
    saveSubmissions(demoSubmissions);
    console.log('[Seed] Submissions seeded');
  }

  if (!existingProjects) {
    saveProjects(demoProjects);
    console.log('[Seed] Projects seeded');
  }

  if (!existingPhotos) {
    savePhotos(demoPhotos);
    console.log('[Seed] Photos seeded');
  }
};

export default seedData;

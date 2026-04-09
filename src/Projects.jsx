import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProjectStats from './components/ProjectStats';
import ProjectFilters from './components/ProjectFilters';
import ProjectCard from './components/ProjectCard';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Sample projects for demo
const sampleProjects = [
  {
    _id: '1',
    title: 'ClubHub Platform',
    description: 'A comprehensive platform for managing tech club activities, events, and member engagement. Built with modern web technologies for seamless collaboration.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Express'],
    githubLink: 'https://github.com/techverse/clubhub',
    liveDemo: 'https://clubhub.demo',
    likes: 156,
    stars: 89,
    featured: true,
    year: '2024',
    domain: 'Web Dev',
    team: [
      { name: 'Alex Johnson', role: 'Lead Developer', github: 'alexj' },
      { name: 'Sarah Chen', role: 'UI/UX Designer', github: 'sarahc' },
      { name: 'Mike Ross', role: 'Backend Engineer', github: 'miker' },
      { name: 'Emma Wilson', role: 'DevOps', github: 'emmaw' },
    ]
  },
  {
    _id: '2',
    title: 'AI Challenge Engine',
    description: 'An intelligent system for generating and evaluating coding challenges with adaptive difficulty based on user performance.',
    techStack: ['Python', 'TensorFlow', 'FastAPI', 'PostgreSQL', 'Docker'],
    githubLink: 'https://github.com/techverse/ai-challenge-engine',
    likes: 234,
    stars: 145,
    featured: true,
    year: '2024',
    domain: 'AI/ML',
    team: [
      { name: 'David Kim', role: 'ML Engineer', github: 'davidk' },
      { name: 'Lisa Park', role: 'Data Scientist', github: 'lisap' },
    ]
  },
  {
    _id: '3',
    title: 'Community Dashboard',
    description: 'Real-time analytics dashboard for tracking member contributions, event participation, and challenge completion rates.',
    techStack: ['Vue.js', 'D3.js', 'Firebase', 'TypeScript', 'Vite'],
    githubLink: 'https://github.com/techverse/community-dashboard',
    liveDemo: 'https://dashboard.demo',
    likes: 98,
    stars: 56,
    year: '2023',
    domain: 'Web Dev',
    team: [
      { name: 'Tom Brown', role: 'Frontend Dev', github: 'tomb' },
      { name: 'Amy Lee', role: 'Data Viz', github: 'amyl' },
      { name: 'Chris Davis', role: 'Full Stack', github: 'chrisd' },
    ]
  },
  {
    _id: '4',
    title: 'Mobile Event App',
    description: 'Cross-platform mobile application for event management with real-time notifications and QR code check-ins.',
    techStack: ['Flutter', 'Dart', 'Firebase', 'Node.js'],
    githubLink: 'https://github.com/techverse/event-app',
    likes: 67,
    stars: 34,
    year: '2024',
    domain: 'Mobile',
    team: [
      { name: 'Ryan Garcia', role: 'Mobile Dev', github: 'ryang' },
      { name: 'Nina Patel', role: 'UI Designer', github: 'ninap' },
    ]
  },
  {
    _id: '5',
    title: 'Design System',
    description: 'A comprehensive design system with reusable components, tokens, and documentation for consistent UI across projects.',
    techStack: ['React', 'Storybook', 'Figma', 'TypeScript'],
    githubLink: 'https://github.com/techverse/design-system',
    liveDemo: 'https://design.demo',
    likes: 189,
    stars: 112,
    featured: true,
    year: '2024',
    domain: 'Design',
    team: [
      { name: 'Sophie Martin', role: 'Design Lead', github: 'sophiem' },
      { name: 'Jack White', role: 'Frontend Dev', github: 'jackw' },
    ]
  },
];

const Projects = () => {
  const [projects, setProjects] = useState(sampleProjects);
  const [filters, setFilters] = useState({ 
    techStack: 'All', 
    year: 'All', 
    domain: 'All', 
    teamSize: 'All',
    sort: 'latest'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAdmin(user.role === 'admin');
  }, []);

  const fetchProjects = useCallback(async (isRetry = false) => {
    if (!isRetry) setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/projects', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (response.data && response.data.length > 0) {
        const enrichedProjects = response.data.map((p, index) => ({
          ...p,
          description: p.description || sampleProjects[index % sampleProjects.length]?.description,
          techStack: p.techStack || sampleProjects[index % sampleProjects.length]?.techStack,
          team: p.team || sampleProjects[index % sampleProjects.length]?.team,
          likes: p.likes || Math.floor(Math.random() * 200) + 50,
          stars: p.stars || Math.floor(Math.random() * 100) + 20,
          year: p.year || '2024',
          domain: p.domain || 'Web Dev'
        }));
        setProjects(enrichedProjects);
      }
      setRetryCount(0);
    } catch (err) {
      console.error('Fetch error:', err);
      // Use sample data on error
      setProjects(sampleProjects);
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  // Filter and sort projects
  const filteredProjects = projects.filter(project => {
    if (filters.techStack !== 'All' && !project.techStack?.includes(filters.techStack)) return false;
    if (filters.year !== 'All' && project.year !== filters.year) return false;
    if (filters.domain !== 'All' && project.domain !== filters.domain) return false;
    if (filters.teamSize !== 'All') {
      const size = project.team?.length || 0;
      if (filters.teamSize === 'Solo' && size !== 1) return false;
      if (filters.teamSize === '2-4' && (size < 2 || size > 4)) return false;
      if (filters.teamSize === '5+' && size < 5) return false;
    }
    return true;
  }).sort((a, b) => {
    if (filters.sort === 'likes') return (b.likes || 0) - (a.likes || 0);
    if (filters.sort === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    return 0; // latest - keep original order
  });

  const handleEdit = (project) => {
    console.log('Edit project:', project);
  };

  const handleDelete = (project) => {
    if (confirm(`Delete "${project.title}"?`)) {
      setProjects(prev => prev.filter(p => p._id !== project._id));
    }
  };

  const handleFeature = (project) => {
    setProjects(prev => prev.map(p => 
      p._id === project._id ? { ...p, featured: !p.featured } : p
    ));
  };

  return (
    <div className="page-content min-h-screen bg-bg">
      {/* Hero Stats */}
      <ProjectStats onSubmitClick={() => setShowSubmitModal(true)} />

      {/* Filters */}
      <ProjectFilters filters={filters} onFilterChange={setFilters} />

      {/* Admin FAB */}
      {isAdmin && (
        <button
          onClick={() => setShowSubmitModal(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-teal text-bg rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,205,184,0.4)] hover:scale-110 transition-all duration-300 z-50"
          title="Add Project"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Projects Masonry Grid */}
      <section className="section-spacing">
        <div className="section-container">
          {/* Loading State */}
          {loading && filteredProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-3 border-teal/30 border-t-teal rounded-full animate-spin mb-4"></div>
              <p className="text-muted animate-pulse">Loading projects...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted text-xl">No projects found matching your filters.</p>
              <button 
                onClick={() => setFilters({ techStack: 'All', year: 'All', domain: 'All', teamSize: 'All', sort: 'latest' })}
                className="mt-4 text-teal hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Masonry Grid */}
          {filteredProjects.length > 0 && (
            <div 
              className="columns-1 md:columns-2 xl:columns-3"
              style={{ columnGap: '1.25rem' }}
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard 
                  key={project._id} 
                  project={project} 
                  index={index}
                  isAdmin={isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onFeature={handleFeature}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Submit Project Modal Placeholder */}
      {showSubmitModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowSubmitModal(false)}
        >
          <div 
            className="max-w-lg w-full p-8 rounded-2xl bg-bg2 border border-white/10 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Submit a Project</h2>
            <p className="text-muted mb-6">Project submission form coming soon!</p>
            <button 
              onClick={() => setShowSubmitModal(false)}
              className="px-6 py-2 bg-teal text-bg font-medium rounded-lg hover:shadow-[0_0_20px_rgba(0,205,184,0.4)] transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;

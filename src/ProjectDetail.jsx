import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

const techColors = {
  React: { text: '#61DAFB', bg: 'rgba(97, 218, 251, 0.1)' },
  Python: { text: '#3776AB', bg: 'rgba(55, 118, 171, 0.1)' },
  'Node.js': { text: '#68A063', bg: 'rgba(104, 160, 99, 0.1)' },
  'AI/ML': { text: '#00CDB8', bg: 'rgba(0, 205, 184, 0.1)' },
  Design: { text: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)' },
  default: { text: '#00CDB8', bg: 'rgba(0, 205, 184, 0.1)' }
};

const getTechStyle = (tech) => {
  const style = techColors[tech] || techColors.default;
  return {
    color: style.text,
    backgroundColor: style.bg,
    border: `1px solid ${style.text}40`
  };
};

const getGradient = () => 'linear-gradient(135deg, #00CDB8 0%, #0A2540 50%, #1a1a2e 100%)';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  // Sample screenshots for demo
  const screenshots = [
    { url: '/screenshot1.jpg', caption: 'Dashboard View' },
    { url: '/screenshot2.jpg', caption: 'Project Settings' },
    { url: '/screenshot3.jpg', caption: 'Team Collaboration' },
    { url: '/screenshot4.jpg', caption: 'Analytics Page' },
  ];

  const fetchProject = useCallback(async (isRetry = false) => {
    if (!isRetry) setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/projects/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      const enrichedProject = {
        ...response.data,
        description: response.data.description || 'A community-built project showcasing innovative solutions and technical excellence.',
        techStack: response.data.techStack || ['React', 'Node.js', 'MongoDB'],
        year: response.data.year || '2024',
        domain: response.data.domain || 'Web Dev',
        teamSize: response.data.team?.length || 3,
        team: response.data.team || [
          { name: 'Alex Johnson', role: 'Lead Developer', github: 'alexj' },
          { name: 'Sarah Chen', role: 'UI/UX Designer', github: 'sarahc' },
          { name: 'Mike Ross', role: 'Backend Engineer', github: 'miker' },
        ],
        screenshots: response.data.screenshots || screenshots,
        likes: response.data.likes || 42,
        stars: response.data.stars || 28,
        submittedBy: response.data.submittedBy || { name: 'Alex Johnson', date: '2024-03-15' },
        liveDemo: response.data.liveDemo || 'https://demo.example.com',
        githubLink: response.data.githubLink || 'https://github.com/example/project',
        docsLink: response.data.docsLink || 'https://docs.example.com'
      };
      
      setProject(enrichedProject);
      setLikeCount(enrichedProject.likes);
      
      const liked = localStorage.getItem(`project-liked-${id}`);
      setIsLiked(!!liked);
      setRetryCount(0);
    } catch (err) {
      console.error('Fetch error:', err);
      let errorMsg = 'Failed to load project';
      if (err.code === 'ECONNABORTED') errorMsg = 'Request timed out';
      else if (err.code === 'ERR_NETWORK') errorMsg = 'Cannot connect to server';
      
      setError(errorMsg);
      
      if (retryCount < 2 && (err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK')) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchProject(true);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [id, retryCount]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') setCurrentScreenshot(prev => Math.max(0, prev - 1));
      if (e.key === 'ArrowRight') setCurrentScreenshot(prev => Math.min(screenshots.length - 1, prev + 1));
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    
    if (newLiked) {
      localStorage.setItem(`project-liked-${id}`, 'true');
    } else {
      localStorage.removeItem(`project-liked-${id}`);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${project?.title} on ClubVerse!`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      copy: null
    };
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-12 h-12 border-3 border-teal/30 border-t-teal rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error || 'Project not found'}</p>
          <Link to="/projects" className="text-teal hover:underline">← Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Banner */}
      <div 
        className="relative w-full h-[300px] md:h-[400px]"
        style={{
          background: getGradient(),
          backgroundAttachment: 'fixed',
          borderRadius: '0 0 16px 16px'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
        <Link 
          to="/projects"
          className="absolute top-6 left-6 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      {/* Content */}
      <div className="section-container -mt-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - 65% */}
          <div className="lg:w-[65%]">
            {/* Title & Tech */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{project.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={getTechStyle(tech)}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {project.year}
                </span>
                <span>•</span>
                <span>{project.domain}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {project.teamSize} members
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-white/10 mb-6">
              {['overview', 'screenshots', 'team'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative pb-3 text-sm font-medium capitalize transition-colors"
                  style={{ color: activeTab === tab ? '#00CDB8' : 'rgba(255,255,255,0.5)' }}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {activeTab === 'overview' && (
                <div>
                  <p className="text-white/80 leading-relaxed mb-6">{project.description}</p>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <a 
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-lg bg-[#24292e] text-white font-medium flex items-center gap-2 hover:bg-[#2f363d] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      View on GitHub
                    </a>
                    <a 
                      href={project.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-lg bg-teal text-bg font-medium flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,205,184,0.4)] transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </a>
                    <a 
                      href={project.docsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-lg border border-white/20 text-white font-medium flex items-center gap-2 hover:bg-white/5 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Docs
                    </a>
                  </div>
                </div>
              )}

              {activeTab === 'screenshots' && (
                <div>
                  {/* Carousel */}
                  <div className="relative mb-4">
                    <div 
                      className="aspect-video rounded-xl overflow-hidden cursor-pointer"
                      onClick={() => setLightboxOpen(true)}
                    >
                      <div 
                        className="w-full h-full transition-transform duration-300 hover:scale-105"
                        style={{
                          background: getGradient()
                        }}
                      />
                    </div>
                    
                    {/* Navigation Arrows */}
                    <button
                      onClick={() => setCurrentScreenshot(prev => Math.max(0, prev - 1))}
                      disabled={currentScreenshot === 0}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-30"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentScreenshot(prev => Math.min(project.screenshots.length - 1, prev + 1))}
                      disabled={currentScreenshot === project.screenshots.length - 1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-30"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Dots */}
                  <div className="flex justify-center gap-2">
                    {project.screenshots.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentScreenshot(i)}
                        className="w-2 h-2 rounded-full transition-colors"
                        style={{
                          background: currentScreenshot === i ? '#00CDB8' : 'rgba(255,255,255,0.3)'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'team' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.team.map((member, i) => (
                    <div 
                      key={i}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3"
                    >
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: getGradient() }}
                      >
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{member.name}</p>
                        <p className="text-sm text-muted truncate">{member.role}</p>
                      </div>
                      {member.github && (
                        <a 
                          href={`https://github.com/${member.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted hover:text-white transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - 35% */}
          <div className="lg:w-[35%]">
            <div className="sticky top-24 space-y-4">
              {/* Like Card */}
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <button 
                  onClick={handleLike}
                  className="w-full py-3 rounded-lg bg-teal/10 border border-teal/30 flex items-center justify-center gap-2 transition-all hover:bg-teal/20"
                >
                  <svg 
                    className="w-6 h-6"
                    fill={isLiked ? '#00CDB8' : 'none'}
                    stroke={isLiked ? '#00CDB8' : 'currentColor'}
                    viewBox="0 0 24 24"
                    style={{ color: isLiked ? '#00CDB8' : '#00CDB8' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-teal font-bold text-lg">{likeCount}</span>
                  <span className="text-teal">likes</span>
                </button>
              </div>

              {/* Metadata Card */}
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-white font-semibold mb-4">Project Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Submitted by</span>
                    <span className="text-white">{project.submittedBy.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Date</span>
                    <span className="text-white">{project.submittedBy.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Domain</span>
                    <span className="text-white">{project.domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Team size</span>
                    <span className="text-white">{project.teamSize}</span>
                  </div>
                </div>
              </div>

              {/* Share Card */}
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-white font-semibold mb-4">Share</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleShare('copy')}
                    className="flex-1 py-2 rounded-lg bg-white/5 text-white text-sm hover:bg-white/10 transition-colors"
                  >
                    Copy Link
                  </button>
                  <button 
                    onClick={() => handleShare('twitter')}
                    className="flex-1 py-2 rounded-lg bg-[#1DA1F2]/20 text-[#1DA1F2] text-sm hover:bg-[#1DA1F2]/30 transition-colors"
                  >
                    Twitter
                  </button>
                  <button 
                    onClick={() => handleShare('linkedin')}
                    className="flex-1 py-2 rounded-lg bg-[#0A66C2]/20 text-[#0A66C2] text-sm hover:bg-[#0A66C2]/30 transition-colors"
                  >
                    LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setCurrentScreenshot(prev => Math.max(0, prev - 1)); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setCurrentScreenshot(prev => Math.min(project.screenshots.length - 1, prev + 1)); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div 
            className="max-w-5xl max-h-[80vh] aspect-video rounded-2xl overflow-hidden transition-all duration-300"
            style={{
              background: getGradient(),
              transform: 'scale(0.95)',
              animation: 'fadeInScale 0.3s forwards'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full" style={{ background: getGradient() }} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInScale {
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetail;

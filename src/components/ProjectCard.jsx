import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const techColors = {
  React: { text: '#61DAFB', bg: 'rgba(97, 218, 251, 0.1)' },
  Python: { text: '#3776AB', bg: 'rgba(55, 118, 171, 0.1)' },
  'Node.js': { text: '#68A063', bg: 'rgba(104, 160, 99, 0.1)' },
  'AI/ML': { text: '#00CDB8', bg: 'rgba(0, 205, 184, 0.1)' },
  Design: { text: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)' },
  Flutter: { text: '#02569B', bg: 'rgba(2, 86, 155, 0.1)' },
  MongoDB: { text: '#47A248', bg: 'rgba(71, 162, 72, 0.1)' },
  'Tailwind CSS': { text: '#38BDF8', bg: 'rgba(56, 189, 248, 0.1)' },
  Express: { text: '#404040', bg: 'rgba(64, 64, 64, 0.1)' },
  TensorFlow: { text: '#FF6F00', bg: 'rgba(255, 111, 0, 0.1)' },
  FastAPI: { text: '#009688', bg: 'rgba(0, 150, 136, 0.1)' },
  PostgreSQL: { text: '#336791', bg: 'rgba(51, 103, 145, 0.1)' },
  Docker: { text: '#2496ED', bg: 'rgba(36, 150, 237, 0.1)' },
  'Vue.js': { text: '#4FC08D', bg: 'rgba(79, 192, 141, 0.1)' },
  'D3.js': { text: '#F9A03C', bg: 'rgba(249, 160, 60, 0.1)' },
  Firebase: { text: '#FFCA28', bg: 'rgba(255, 202, 40, 0.1)' },
  TypeScript: { text: '#3178C6', bg: 'rgba(49, 120, 198, 0.1)' },
  Vite: { text: '#646CFF', bg: 'rgba(100, 108, 255, 0.1)' },
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

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getGradient = (index) => {
  const gradients = [
    'linear-gradient(135deg, #00CDB8 0%, #0A2540 100%)',
    'linear-gradient(135deg, #0A2540 0%, #00CDB8 100%)',
    'linear-gradient(135deg, #1a1a2e 0%, #00CDB8 50%, #0A2540 100%)',
    'linear-gradient(45deg, #0A2540 0%, #00CDB8 100%)',
    'linear-gradient(225deg, #00CDB8 0%, #1a1a2e 100%)',
  ];
  return gradients[index % gradients.length];
};

const ProjectCard = ({ project, index, isAdmin, onEdit, onDelete, onFeature }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(project.likes || 0);
  const [imageHovered, setImageHovered] = useState(false);

  useEffect(() => {
    const liked = localStorage.getItem(`project-liked-${project._id}`);
    if (liked) {
      setIsLiked(true);
    }
  }, [project._id]);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    
    if (newLiked) {
      localStorage.setItem(`project-liked-${project._id}`, 'true');
    } else {
      localStorage.removeItem(`project-liked-${project._id}`);
    }
  };

  const displayTeam = project.team?.slice(0, 4) || [];
  const remainingCount = project.team?.length > 4 ? project.team.length - 4 : 0;

  return (
    <div className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-[5px] break-inside-avoid mb-5"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(0,205,184,0.1)',
      }}
      onMouseEnter={() => setImageHovered(true)}
      onMouseLeave={() => setImageHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative h-[180px] overflow-hidden rounded-t-[10px]">
        <div 
          className="absolute inset-0 transition-transform duration-300"
          style={{
            background: getGradient(index),
            transform: imageHovered ? 'scale(1.06)' : 'scale(1)'
          }}
        />
        
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
            style={{
              background: 'rgba(255, 193, 7, 0.2)',
              border: '1px solid rgba(255, 193, 7, 0.5)',
              color: '#FFC107'
            }}
          >
            <span>★</span> Featured
          </div>
        )}

        {/* Admin Actions */}
        {isAdmin && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.stopPropagation(); onFeature?.(project); }}
              className={`p-1.5 rounded-lg transition-colors ${project.featured ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-white/70 hover:text-yellow-400'}`}
              title={project.featured ? 'Unfeature' : 'Feature'}
            >
              ★
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit?.(project); }}
              className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:text-teal transition-colors"
              title="Edit"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete?.(project); }}
              className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:text-red-400 transition-colors"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-base font-bold text-white mb-2 group-hover:text-teal transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-[#8A8A9A] mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack?.slice(0, 4).map((tech, i) => (
            <span 
              key={i} 
              className="px-2 py-0.5 rounded-full text-[11px] font-medium"
              style={getTechStyle(tech)}
            >
              {tech}
            </span>
          ))}
          {project.techStack?.length > 4 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium text-muted bg-white/5">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Team Members */}
        {displayTeam.length > 0 && (
          <div className="flex items-center gap-1 mb-4">
            <div className="flex -space-x-2">
              {displayTeam.map((member, i) => (
                <div 
                  key={i}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-bg"
                  style={{
                    background: `linear-gradient(135deg, #00CDB8 0%, #0A2540 100%)`,
                    zIndex: displayTeam.length - i
                  }}
                  title={member.name}
                >
                  {getInitials(member.name)}
                </div>
              ))}
            </div>
            {remainingCount > 0 && (
              <span className="text-xs text-muted ml-1">+ {remainingCount} more</span>
            )}
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <button 
              onClick={handleLike}
              className="flex items-center gap-1.5 text-sm transition-colors"
            >
              <svg 
                className="w-4 h-4 transition-all duration-200"
                fill={isLiked ? '#00CDB8' : 'none'}
                stroke={isLiked ? '#00CDB8' : 'currentColor'}
                viewBox="0 0 24 24"
                style={{ color: isLiked ? '#00CDB8' : '#8A8A9A' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span style={{ color: isLiked ? '#00CDB8' : '#8A8A9A' }}>{likeCount}</span>
            </button>

            {/* Stars */}
            <div className="flex items-center gap-1 text-sm text-muted">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>{project.stars || 0}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* GitHub Link */}
            {project.githubLink && (
              <a 
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-muted hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            )}

            {/* Live Demo */}
            {project.liveDemo && (
              <a 
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-teal hover:underline flex items-center gap-1"
              >
                Live Demo →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-300 opacity-0 group-hover:opacity-100"
        style={{
          border: '1px solid rgba(0,205,184,0.35)'
        }}
      />
    </div>
  );
};

export default ProjectCard;

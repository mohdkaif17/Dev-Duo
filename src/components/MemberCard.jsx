import { useState, useRef } from 'react';

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

const MemberCard = ({ member, index, size = 'medium', isAlumni = false, isAdmin, onEdit, onDelete, onClick }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Size configurations
  const sizeConfig = {
    large: {
      card: 'max-w-[260px]',
      photo: 'w-[84px] h-[84px] border-[3px]',
      name: 'text-lg',
      badge: 'text-xs px-3 py-1',
      batch: 'text-xs',
      skills: 'text-[11px]',
      social: 'w-5 h-5'
    },
    medium: {
      card: '',
      photo: 'w-16 h-16 border-[2px]',
      name: 'text-base',
      badge: 'text-[11px] px-2 py-0.5',
      batch: 'text-xs',
      skills: 'text-[10px]',
      social: 'w-4 h-4'
    },
    compact: {
      card: '',
      photo: 'w-12 h-12 border-[2px]',
      name: 'text-sm',
      badge: 'text-[10px] px-2 py-0.5',
      batch: 'text-[11px]',
      skills: null,
      social: 'w-4 h-4'
    }
  };

  const config = sizeConfig[size];

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -7; // Max 7deg
    const rotateY = ((x - centerX) / centerX) * 7;
    
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const designationColors = member.isLead 
    ? { bg: 'rgba(255, 193, 7, 0.15)', border: 'rgba(255, 193, 7, 0.5)', color: '#FFC107' }
    : { bg: 'rgba(0, 205, 184, 0.1)', border: 'rgba(0, 205, 184, 0.3)', color: '#00CDB8' };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${config.card}`}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(0,205,184,0.1)',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${isHovered ? -8 : 0}px)`,
        opacity: isAlumni ? 0.72 : 1,
        filter: isAlumni ? 'saturate(0.7)' : 'none',
        transition: isHovered ? 'transform 0.1s ease-out, opacity 0.3s ease, filter 0.3s ease' : 'transform 0.3s ease-out, opacity 0.3s ease, filter 0.3s ease, border-color 0.3s ease'
      }}
    >
      <div className={`p-5 ${size === 'compact' ? 'p-4' : ''} flex flex-col items-center text-center`}>
        {/* Photo */}
        <div 
          className={`${config.photo} rounded-full flex items-center justify-center text-white font-bold mb-3 relative overflow-hidden`}
          style={{
            background: getGradient(index),
            borderColor: '#00CDB8',
            boxShadow: isHovered ? '0 0 18px rgba(0, 205, 184, 0.5)' : '0 0 0 rgba(0, 205, 184, 0)',
            transition: 'box-shadow 0.3s ease'
          }}
        >
          {member.initials || member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          
          {/* Alumni badge overlay */}
          {isAlumni && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-[8px] font-bold text-white/80">ALUMNI</span>
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className={`${config.name} font-bold text-white mb-1`}>
          {member.name}
        </h3>

        {/* Designation Badge */}
        <div 
          className={`${config.badge} rounded-full font-medium mb-2 flex items-center gap-1`}
          style={{
            background: designationColors.bg,
            border: `1px solid ${designationColors.border}`,
            color: designationColors.color
          }}
        >
          {member.isLead && <span>★</span>}
          {member.designation || member.role}
        </div>

        {/* Batch */}
        <p className={`${config.batch} text-[#8A8A9A] mb-3`}>
          Batch {member.batch || '2024'}
        </p>

        {/* Skills - only for large and medium */}
        {config.skills && member.skills && (
          <div className="flex flex-wrap justify-center gap-1 mb-3">
            {member.skills.slice(0, 3).map((skill, i) => (
              <span 
                key={i}
                className={`${config.skills} px-2 py-0.5 rounded-full`}
                style={{
                  background: 'rgba(0, 205, 184, 0.08)',
                  color: 'rgba(0, 205, 184, 0.8)',
                  border: '1px solid rgba(0, 205, 184, 0.15)'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Social Icons */}
        <div className="flex items-center gap-3">
          {member.github && (
            <a 
              href={`https://github.com/${member.github}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`${config.social} text-muted hover:text-teal transition-colors`}
            >
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          )}
          {member.linkedin && (
            <a 
              href={`https://linkedin.com/in/${member.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`${config.social} text-muted hover:text-teal transition-colors`}
            >
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Hover Border Effect */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-300 opacity-0 group-hover:opacity-100"
        style={{
          border: '1px solid rgba(0,205,184,0.35)',
          opacity: isHovered ? 1 : 0
        }}
      />

      {/* Admin Actions */}
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit?.(member); }}
            className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:text-teal transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete?.(member); }}
            className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:text-red-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}

      {/* Alumni Graduation Year Tooltip */}
      {isAlumni && isHovered && member.graduationYear && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-white text-[10px] whitespace-nowrap">
          Class of {member.graduationYear}
        </div>
      )}
    </div>
  );
};

export default MemberCard;

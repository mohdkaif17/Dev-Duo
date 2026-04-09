import { useEffect } from 'react';

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

const MemberModal = ({ member, isOpen, onClose, index = 0 }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !member) return null;

  const designationColors = member.isLead 
    ? { bg: 'rgba(255, 193, 7, 0.15)', border: 'rgba(255, 193, 7, 0.5)', color: '#FFC107' }
    : { bg: 'rgba(0, 205, 184, 0.1)', border: 'rgba(0, 205, 184, 0.3)', color: '#00CDB8' };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
      
      {/* Modal Card */}
      <div 
        className="relative w-full max-w-[460px] rounded-2xl p-8 overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(0,205,184,0.2)',
          boxShadow: '0 0 40px rgba(0, 205, 184, 0.1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Large Photo */}
        <div className="flex justify-center mb-6">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold border-[3px]"
            style={{
              background: getGradient(index),
              borderColor: '#00CDB8',
              boxShadow: '0 0 24px rgba(0, 205, 184, 0.4)'
            }}
          >
            {member.initials || member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
        </div>

        {/* Name & Designation */}
        <div className="text-center mb-4">
          <h2 className="text-[22px] font-bold text-white mb-2">{member.name}</h2>
          <div 
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
            style={{
              background: designationColors.bg,
              border: `1px solid ${designationColors.border}`,
              color: designationColors.color
            }}
          >
            {member.isLead && <span>★</span>}
            {member.designation || member.role}
          </div>
          <p className="text-[#8A8A9A] text-sm mt-2">Batch {member.batch || '2024'}</p>
        </div>

        {/* Skills */}
        {member.skills && member.skills.length > 0 && (
          <div className="mb-5">
            <div className="flex flex-wrap justify-center gap-2">
              {member.skills.map((skill, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: 'rgba(0, 205, 184, 0.1)',
                    color: '#00CDB8',
                    border: '1px solid rgba(0, 205, 184, 0.25)'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bio */}
        {member.bio && (
          <p className="text-[#8A8A9A] text-sm text-center mb-5 leading-relaxed">
            {member.bio}
          </p>
        )}

        {/* Activity Stats */}
        <div className="flex justify-center gap-3 mb-6">
          <div 
            className="px-3 py-2 rounded-lg text-xs font-medium"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <span className="text-teal font-bold">{member.eventsCount || 12}</span>
            <span className="text-muted ml-1">Events</span>
          </div>
          <div 
            className="px-3 py-2 rounded-lg text-xs font-medium"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <span className="text-teal font-bold">{member.challengesCount || 5}</span>
            <span className="text-muted ml-1">Challenges</span>
          </div>
          <div 
            className="px-3 py-2 rounded-lg text-xs font-medium"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <span className="text-teal font-bold">{member.projectsCount || 3}</span>
            <span className="text-muted ml-1">Projects</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center gap-3">
          {member.github && (
            <a
              href={`https://github.com/${member.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-[#24292e] flex items-center justify-center text-white hover:shadow-[0_0_20px_rgba(0,205,184,0.4)] transition-all hover:scale-105"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          )}
          {member.linkedin && (
            <a
              href={`https://linkedin.com/in/${member.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-[#0A66C2] flex items-center justify-center text-white hover:shadow-[0_0_20px_rgba(0,205,184,0.4)] transition-all hover:scale-105"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          )}
          {member.twitter && (
            <a
              href={`https://twitter.com/${member.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-[#1DA1F2] flex items-center justify-center text-white hover:shadow-[0_0_20px_rgba(0,205,184,0.4)] transition-all hover:scale-105"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberModal;

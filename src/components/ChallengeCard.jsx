import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ChallengeCard = ({ 
  challenge, 
  index, 
  isAdmin, 
  onEdit, 
  onDelete, 
  onSubmit,
  deleteConfirm,
  setDeleteConfirm,
  existingSubmission 
}) => {
  const cardRef = useRef(null);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Animate progress bar on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const submissions = challenge.submissions || 42;
      const maxSubmissions = challenge.maxSubmissions || 100;
      setProgressWidth((submissions / maxSubmissions) * 100);
    }, 100 + index * 100);
    return () => clearTimeout(timer);
  }, [index, challenge.submissions, challenge.maxSubmissions]);

  // 3D tilt effect on mouse move
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20; // Max 5deg
    const rotateY = (centerX - x) / 20;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
    setIsHovered(false);
  };

  // Calculate deadline color
  const getDeadlineColor = () => {
    const deadline = new Date(challenge.deadline || '2025-04-20');
    const now = new Date();
    const hoursRemaining = (deadline - now) / (1000 * 60 * 60);
    return hoursRemaining < 72 ? 'text-[#F59E0B]' : 'text-muted';
  };

  // Difficulty colors
  const difficultyColors = {
    Easy: { border: '#22C55E', badge: 'bg-[#22C55E]/15 text-[#22C55E]' },
    Medium: { border: '#F59E0B', badge: 'bg-[#F59E0B]/15 text-[#F59E0B]' },
    Hard: { border: '#EF4444', badge: 'bg-[#EF4444]/15 text-[#EF4444]' }
  };

  const colors = difficultyColors[challenge.difficulty] || difficultyColors.Medium;

  // Status chip
  const getStatusChip = () => {
    const status = challenge.status || 'Active';
    const styles = {
      Active: 'bg-teal/20 text-teal border-teal/30 shadow-[0_0_12px_rgba(0,205,184,0.3)]',
      Closed: 'bg-white/5 text-muted border-white/10',
      Upcoming: 'bg-blue-500/15 text-blue-400 border-blue-500/30'
    };
    return styles[status] || styles.Active;
  };

  const submissions = challenge.submissions || 42;
  const maxSubmissions = challenge.maxSubmissions || 100;

  const isDeleteConfirm = deleteConfirm === challenge.id;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
        isHovered ? 'shadow-[0_0_30px_rgba(0,205,184,0.2)]' : ''
      }`}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(0,205,184,0.1)',
        borderLeft: `4px solid ${colors.border}`,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Admin Edit/Delete Buttons */}
      {isAdmin && (
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg bg-white/10 hover:bg-teal/20 text-white hover:text-teal transition-colors"
            title="Edit Challenge"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 transition-colors"
            title="Delete Challenge"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeleteConfirm && (
        <div className="absolute inset-0 bg-bg/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6">
          <p className="text-white font-medium mb-4 text-center">Delete this challenge?</p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 rounded-lg border border-white/20 text-white text-sm hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition-colors"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Top Row - Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colors.badge}`}>
            {challenge.difficulty}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-white/5 text-muted border-white/10">
            {challenge.category || 'UI/UX'}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusChip()}`}>
            {challenge.status || 'Active'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-bold text-[#F0F0F0] mb-2 leading-tight">
          {challenge.title}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-muted leading-relaxed mb-4 line-clamp-3">
          {challenge.description}
        </p>

        {/* Deadline */}
        <div className={`flex items-center gap-2 text-sm mb-3 ${getDeadlineColor()}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Closes {challenge.deadline || 'Apr 20, 2025'}</span>
        </div>

        {/* XP Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span 
            className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
            style={{
              background: 'rgba(255,215,0,0.08)',
              color: '#FFD700',
              border: '1px solid rgba(255,215,0,0.2)'
            }}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {challenge.xp || 300} XP
          </span>
        </div>

        {/* Submissions Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted mb-1.5">
            <span>{submissions} / {maxSubmissions} Submissions</span>
            <span>{Math.round((submissions / maxSubmissions) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-teal rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>

        {/* Submission Status Badge */}
        {existingSubmission && (
          <div className="mb-3 px-3 py-1.5 rounded-lg bg-teal/10 border border-teal/30 text-teal text-xs font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Submitted · {existingSubmission.status}
          </div>
        )}

        {/* Button Row */}
        <div className="flex items-center gap-3">
          <Link
            to={`/challenges/${challenge.id}`}
            className="flex-1 px-4 py-2.5 rounded-lg border border-teal/40 text-teal text-sm font-medium text-center hover:bg-teal/10 transition-all duration-300 flex items-center justify-center gap-1 group"
          >
            View Problem
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <button
            onClick={onSubmit}
            className="flex-1 px-4 py-2.5 rounded-lg bg-teal text-[#080810] text-sm font-bold text-center hover:shadow-[0_0_18px_rgba(0,205,184,0.5)] transition-all duration-300"
          >
            {existingSubmission ? 'Update Submission' : 'Submit Solution'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;

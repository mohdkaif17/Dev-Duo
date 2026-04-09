import { useState } from 'react';

const LeaderboardStats = ({ activeTab, onTabChange, timeFilter, onTimeFilterChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const challenges = ['DevFest 2024', 'Hackathon 2025', 'React Workshop', 'AI Challenge'];

  return (
    <section className="relative py-16 overflow-hidden border-b border-white/[0.05]">
      <div className="bg-blob top-0 left-1/4 opacity-20"></div>
      <div className="section-container relative z-10">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-[clamp(36px,6vw,72px)] font-black tracking-tighter uppercase mb-4">
            <span className="text-white">LEADER</span>
            <span className="text-teal">BOARD</span>
          </h1>
          <p className="text-muted text-lg md:text-xl">
            Compete. Contribute. Climb.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => onTabChange('global')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === 'global'
                ? 'bg-teal/20 text-teal border border-teal/50'
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
            }`}
          >
            Global Leaderboard
          </button>
          
          <div className="relative">
            <button
              onClick={() => {
                onTabChange('challenge');
                setShowDropdown(!showDropdown);
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'challenge'
                  ? 'bg-teal/20 text-teal border border-teal/50'
                  : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
              }`}
            >
              By Challenge/Event
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showDropdown && activeTab === 'challenge' && (
              <div 
                className="absolute top-full left-0 mt-2 w-56 rounded-xl overflow-hidden z-20"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(0,205,184,0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {challenges.map((challenge) => (
                  <button
                    key={challenge}
                    className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-teal/10 hover:text-teal transition-colors"
                  >
                    {challenge}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Time Filter Pills */}
        <div className="flex justify-center gap-2">
          {['all-time', 'month', 'week'].map((filter) => (
            <button
              key={filter}
              onClick={() => onTimeFilterChange(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                timeFilter === filter
                  ? 'bg-teal/20 text-teal border border-teal/40'
                  : 'bg-transparent text-white/50 border border-white/10 hover:text-white/70'
              }`}
            >
              {filter === 'all-time' ? 'All Time' : filter === 'month' ? 'This Month' : 'This Week'}
            </button>
          ))}
        </div>

        {/* Stats Pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <div className="px-5 py-2.5 rounded-full border border-teal/30 bg-teal/10 backdrop-blur-xl text-sm font-semibold text-teal">
            200+ Members
          </div>
          <div className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-sm font-semibold text-white/70">
            Live Ranking
          </div>
          <div className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-sm font-semibold text-white/70">
            Weekly Updates
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardStats;

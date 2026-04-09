import { useState, useEffect } from 'react';

const getGradient = (index) => {
  const gradients = [
    'linear-gradient(135deg, #00CDB8 0%, #0A2540 100%)',
    'linear-gradient(135deg, #0A2540 0%, #00CDB8 100%)',
    'linear-gradient(135deg, #1a1a2e 0%, #00CDB8 50%, #0A2540 100%)',
  ];
  return gradients[index % gradients.length];
};

const getBadgeColor = (badge) => {
  const colors = {
    'Newbie': { bg: 'rgba(255,255,255,0.1)', color: '#8A8A9A', border: 'rgba(255,255,255,0.2)' },
    'Contributor': { bg: 'rgba(59,130,246,0.15)', color: '#60A5FA', border: 'rgba(59,130,246,0.3)' },
    'Expert': { bg: 'rgba(0,205,184,0.15)', color: '#00CDB8', border: 'rgba(0,205,184,0.3)' },
    'Legend': { bg: 'rgba(255,193,7,0.15)', color: '#FFC107', border: 'rgba(255,193,7,0.3)' },
  };
  return colors[badge] || colors['Newbie'];
};

const getRankIcon = (rank) => {
  if (rank === 1) return <span className="text-yellow-400 mr-1">🏆</span>;
  if (rank === 2) return <span className="text-gray-300 mr-1">🥈</span>;
  if (rank === 3) return <span className="text-amber-600 mr-1">🥉</span>;
  return null;
};

const LeaderboardTable = ({ users, currentUserId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(8);
  const itemsPerPage = 10;

  // Auto-refresh indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(prev => {
        if (prev >= 30) {
          // Simulate refresh
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="section-container">
      {/* Glass Card Wrapper */}
      <div 
        className="max-w-[900px] mx-auto rounded-2xl overflow-hidden relative"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(0,205,184,0.15)'
        }}
      >
        {/* Live Indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs text-muted">Live · Updated {lastUpdated}s ago</span>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr style={{ background: 'rgba(0,205,184,0.05)' }}>
              {['Rank', 'User', 'Badge', 'XP', 'Challenges', 'Events', 'Win Rate'].map((header) => (
                <th
                  key={header}
                  className="text-left py-3 px-5 text-[11px] font-bold uppercase tracking-wider border-b"
                  style={{ 
                    color: '#8A8A9A',
                    borderColor: 'rgba(0,205,184,0.1)',
                    letterSpacing: '0.08em'
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, index) => {
              const actualRank = startIndex + index + 1;
              const isCurrentUser = user._id === currentUserId;
              const badgeColors = getBadgeColor(user.badge);
              const maxXP = Math.max(...users.map(u => u.xp));
              const xpPercentage = (user.xp / maxXP) * 100;

              return (
                <tr
                  key={user._id || index}
                  className="transition-colors duration-200"
                  style={{
                    background: isCurrentUser ? 'rgba(0,205,184,0.06)' : 'transparent',
                    borderLeft: isCurrentUser ? '3px solid #00CDB8' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrentUser) e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrentUser) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <td className="py-3 px-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <span className="text-sm font-semibold text-white/80 flex items-center">
                      {getRankIcon(actualRank)}
                      #{actualRank}
                    </span>
                  </td>
                  
                  <td className="py-3 px-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: getGradient(index) }}
                      >
                        {user.initials || user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <span className="text-sm text-white font-medium">{user.name}</span>
                    </div>
                  </td>
                  
                  <td className="py-3 px-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <span
                      className="px-2 py-1 rounded-full text-[10px] font-medium"
                      style={{
                        background: badgeColors.bg,
                        color: badgeColors.color,
                        border: `1px solid ${badgeColors.border}`
                      }}
                    >
                      {user.badge}
                    </span>
                  </td>
                  
                  <td className="py-3 px-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: '#00CDB8' }}>
                        {user.xp.toLocaleString()}
                      </span>
                      <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${xpPercentage}%`, background: '#00CDB8' }}
                        />
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-3 px-5 border-b text-sm text-white/70" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    {user.challenges || 0}
                  </td>
                  
                  <td className="py-3 px-5 border-b text-sm text-white/70" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    {user.events || 0}
                  </td>
                  
                  <td className="py-3 px-5 border-b text-sm text-white/70" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    {user.winRate || '0%'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-4 border-t" style={{ borderColor: 'rgba(0,205,184,0.1)' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:bg-white/5 disabled:opacity-30 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-teal/20 text-teal border border-teal/40'
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:bg-white/5 disabled:opacity-30 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default LeaderboardTable;

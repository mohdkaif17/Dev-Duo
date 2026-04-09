import { useEffect, useState } from 'react';

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

const PodiumCard = ({ user, rank, delay }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const rankStyles = {
    1: {
      glow: '0 0 30px rgba(255,215,0,0.4)',
      border: '3px solid #FFD700',
      crown: true,
      minHeight: '220px',
      trophy: '🥇',
      avatarSize: '96px',
      fontSize: '28px'
    },
    2: {
      glow: '0 0 20px rgba(192,192,192,0.3)',
      border: '3px solid #C0C0C0',
      crown: false,
      minHeight: '180px',
      trophy: '🥈',
      avatarSize: '80px',
      fontSize: '22px'
    },
    3: {
      glow: '0 0 20px rgba(205,127,50,0.3)',
      border: '3px solid #CD7F32',
      crown: false,
      minHeight: '160px',
      trophy: '🥉',
      avatarSize: '72px',
      fontSize: '20px'
    }
  };

  const style = rankStyles[rank];
  const badgeColors = getBadgeColor(user.badge);

  return (
    <div
      className="relative rounded-2xl p-6 transition-all duration-700 ease-out"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(0,205,184,0.15)',
        minHeight: style.minHeight,
        width: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'flex-end',
        transform: isVisible ? 'translateY(0)' : 'translateY(100px)',
        opacity: isVisible ? 1 : 0,
        boxShadow: isVisible ? style.glow : 'none'
      }}
    >
      {/* Crown for rank 1 */}
      {style.crown && (
        <div className="absolute -top-8 text-4xl animate-bounce">👑</div>
      )}

      {/* Trophy */}
      <div className="absolute top-4 text-3xl">{style.trophy}</div>

      {/* Avatar */}
      <div
        className="rounded-full flex items-center justify-center text-white font-bold mb-4"
        style={{
          width: style.avatarSize,
          height: style.avatarSize,
          background: getGradient(rank - 1),
          border: style.border,
          boxShadow: style.glow,
          fontSize: style.fontSize
        }}
      >
        {user.initials || user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
      </div>

      {/* Name */}
      <h3 className="text-white font-bold text-lg mb-1">{user.name}</h3>

      {/* Badge */}
      <div
        className="px-3 py-1 rounded-full text-xs font-medium mb-2"
        style={{
          background: badgeColors.bg,
          color: badgeColors.color,
          border: `1px solid ${badgeColors.border}`
        }}
      >
        {user.badge}
      </div>

      {/* XP */}
      <div className="text-teal font-black text-2xl">{user.xp.toLocaleString()} XP</div>
    </div>
  );
};

const Podium = ({ topUsers }) => {
  // Ensure we have at least 3 users, fill with defaults if needed
  const safeUsers = [
    topUsers[1] || { _id: '2nd', name: 'TBD', initials: '?', xp: 0, badge: 'Newbie' },
    topUsers[0] || { _id: '1st', name: 'TBD', initials: '?', xp: 0, badge: 'Newbie' },
    topUsers[2] || { _id: '3rd', name: 'TBD', initials: '?', xp: 0, badge: 'Newbie' }
  ];

  // Reorder for visual display: 2nd, 1st, 3rd
  const orderedUsers = [
    { ...safeUsers[0], rank: 2 },
    { ...safeUsers[1], rank: 1 },
    { ...safeUsers[2], rank: 3 }
  ];

  if (!topUsers || topUsers.length === 0) {
    return (
      <section className="py-12 px-4">
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <p className="text-muted">No leaderboard data available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4">
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'flex-end', 
            gap: '1.5rem', 
            padding: '3rem 2rem' 
          }}
        >
          {orderedUsers.map((user, index) => (
            <PodiumCard
              key={user._id || index}
              user={user}
              rank={user.rank}
              delay={index * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Podium;

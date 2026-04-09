import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import { useEffect, useState } from 'react';

const XPBar = ({ value }) => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 500);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
      <div 
        className="h-full bg-teal transition-all duration-1000 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

const LeaderboardPreview = () => {
  const contributors = [
    { rank: 1, name: "Aryan Sharma", xp: 4500, percent: 90, color: "gold" },
    { rank: 2, name: "Isha Gupta", xp: 3800, percent: 76, color: "silver" },
    { rank: 3, name: "Rahul Verma", xp: 3200, percent: 64, color: "#CD7F32" },
    { rank: 4, name: "Sneha Reddy", xp: 2900, percent: 58, color: "plain" },
    { rank: 5, name: "Vikram Singh", xp: 2100, percent: 42, color: "plain" },
  ];

  return (
    <section className="py-4">
      <div className="text-center mb-12">
        <SectionHeading accent="CONTRIBUTORS">TOP</SectionHeading>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Reveal className="glass-card rounded-[20px] overflow-hidden border border-white/10 shadow-2xl">
          <div className="p-8 md:p-10 divide-y divide-white/5">
            {contributors.map((user) => (
              <div 
                key={user.rank} 
                className={`flex items-center gap-6 py-6 transition-colors hover:bg-white/[0.02] ${user.rank === 1 ? 'relative' : ''}`}
              >
                {user.rank === 1 && (
                  <div className="absolute inset-y-0 left-0 w-1 bg-teal shadow-[0_0_15px_rgba(0,205,184,0.5)]"></div>
                )}
                
                <div className={`w-10 flex-shrink-0 font-black text-xl ${user.rank === 1 ? 'text-teal' : 'text-muted/40'}`}>
                  {user.rank.toString().padStart(2, '0')}
                </div>
                
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal/20 to-bg2 flex items-center justify-center text-teal font-bold text-base border border-teal/20 flex-shrink-0">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-white font-bold text-lg truncate tracking-tight">{user.name}</span>
                    <span className="text-teal font-mono text-sm font-bold">{user.xp} XP</span>
                  </div>
                  <XPBar value={user.percent} />
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-8 pt-0 text-center">
              <button className="w-full text-teal text-[13px] font-black hover:bg-teal hover:text-bg py-4 rounded-xl border-2 border-teal/20 transition-all uppercase tracking-widest">
                  View Full Rankings →
              </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default LeaderboardPreview;

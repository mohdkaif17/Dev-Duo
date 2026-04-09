import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const ChallengesGrid = () => {
  const challenges = [
    { 
      id: 1, title: "Algorithm Mastery", diff: "Easy", color: "#10B981", 
      xp: 300, desc: "Solve 5 basic logic problems using your favorite language." 
    },
    { 
      id: 2, title: "FullStack Integration", diff: "Medium", color: "#F59E0B", 
      xp: 600, desc: "Connect a React frontend with a Node.js backend to perform CRUD operations." 
    },
    { 
      id: 3, title: "Security Breach", diff: "Hard", color: "#EF4444", 
      xp: 1200, desc: "Identify and patch 3 critical security vulnerabilities in the provided codebase." 
    },
  ];

  return (
    <div>
      <SectionHeading accent="CHALLENGES">FEATURED</SectionHeading>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {challenges.map((challenge, i) => (
          <Reveal key={challenge.id} delay={i * 100} className="h-full">
            <div 
              className="glass-card p-8 rounded-xl border-l-[6px] transition-all hover:bg-white/[0.05] h-full flex flex-col"
              style={{ borderLeftColor: challenge.color }}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">{challenge.title}</h3>
                <div className="text-[#FFD700] font-bold text-[10px] bg-[#FFD700]/10 px-2 py-1 rounded-lg border border-[#FFD700]/30 flex items-center gap-1 flex-shrink-0">
                  <span>⭐</span> {challenge.xp} XP
                </div>
              </div>
              
              <p className="text-muted text-sm mb-8 leading-relaxed flex-grow">
                {challenge.desc}
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                <div 
                  className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest bg-white/5 border border-white/10"
                  style={{ color: challenge.color }}
                >
                  {challenge.diff}
                </div>
                <button className="text-teal font-extrabold text-xs px-4 py-2 hover:bg-teal/10 rounded-lg transition-all border border-transparent hover:border-teal/30">
                  Attempt →
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default ChallengesGrid;

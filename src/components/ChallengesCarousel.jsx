import { useState, useEffect } from 'react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const ChallengesCarousel = () => {
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

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % challenges.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [challenges.length]);

  return (
    <section className="py-4">
      <SectionHeading accent="CHALLENGES">FEATURED</SectionHeading>
      
      <div className="relative max-w-[540px] mx-auto overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {challenges.map((challenge) => (
            <div key={challenge.id} className="w-full flex-shrink-0 px-2">
              <div 
                className="glass-card p-8 rounded-xl border-l-[6px] transition-all hover:bg-white/[0.05]"
                style={{ borderLeftColor: challenge.color }}
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{challenge.title}</h3>
                  <div className="text-[#FFD700] font-bold text-xs bg-[#FFD700]/10 px-3 py-1.5 rounded-lg border border-[#FFD700]/30 shadow-[0_0_15px_rgba(255,215,0,0.15)] flex items-center gap-2">
                    <span className="text-[14px]">⭐</span> {challenge.xp} XP
                  </div>
                </div>
                
                <p className="text-muted text-base mb-8 line-clamp-2 leading-relaxed h-12">
                  {challenge.desc}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div 
                    className="text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest bg-white/5 border border-white/10"
                    style={{ color: challenge.color }}
                  >
                    {challenge.diff}
                  </div>
                  {/* mt-4 clearance implied by flex alignment and padding */}
                  <button className="text-teal font-extrabold text-sm px-6 py-2.5 hover:bg-teal/10 rounded-lg transition-all border border-transparent hover:border-teal/30">
                    Attempt →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Nav Dots */}
        <div className="flex justify-center gap-3 mt-10">
          {challenges.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setActiveIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeIndex === i ? 'bg-teal w-8' : 'bg-teal/20'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChallengesCarousel;

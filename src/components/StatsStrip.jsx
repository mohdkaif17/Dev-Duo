import { useEffect, useState, useRef } from 'react';
import Reveal from './Reveal';

const CountUp = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true);
      }
    }, { threshold: 0.5 });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [started, end]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const StatsStrip = () => {
  const stats = [
    { label: "Members", value: 1200, suffix: "+", icon: "👥" },
    { label: "Events Hosted", value: 48, suffix: "", icon: "🎯" },
    { label: "Challenges", value: 96, suffix: "", icon: "🧩" },
    { label: "Projects Built", value: 34, suffix: "", icon: "🚀" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto">
      {stats.map((stat, i) => (
        <Reveal key={i} delay={i * 80} className="w-full">
          <div className="text-center group p-6 rounded-2xl transition-all hover:bg-white/[0.02]">
            <div className="w-14 h-14 rounded-2xl bg-teal/5 flex items-center justify-center mx-auto mb-6 text-2xl group-hover:scale-110 group-hover:bg-teal/10 transition-all duration-300 border border-teal/10">
              {stat.icon}
            </div>
            <div className="text-4xl md:text-5xl font-black text-teal mb-2 tracking-tighter shadow-teal-glow">
              <CountUp end={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-[11px] text-muted uppercase tracking-[0.25em] font-bold">
              {stat.label}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
};

export default StatsStrip;

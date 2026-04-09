import { useState, useEffect } from 'react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const ProjectsCarousel = () => {
  const projects = [
    { 
        id: 1, name: "NeuralLink Dashboard", stack: ["Python", "React", "TensorFlow"],
        image: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)" 
    },
    { 
        id: 2, name: "CryptoVault Wallet", stack: ["Solidity", "Web3.js", "Next.js"],
        image: "linear-gradient(135deg, #8B5CF6 0%, #5B21B6 100%)" 
    },
    { 
        id: 3, name: "EcoTracker App", stack: ["React Native", "Firebase", "Node.js"],
        image: "linear-gradient(135deg, #10B981 0%, #065F46 100%)" 
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projects.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [projects.length]);

  return (
    <section className="py-4">
      <SectionHeading accent="PROJECTS">FEATURED</SectionHeading>
      
      <div className="relative max-w-[540px] mx-auto overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {projects.map((project) => (
            <div key={project.id} className="w-full flex-shrink-0 px-2">
              <div className="glass-card rounded-[14px] overflow-hidden group transition-all duration-300 hover:-translate-y-2">
                <div 
                  className="h-[180px] w-full opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{ background: project.image }}
                />
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 tracking-tight group-hover:text-teal transition-colors">
                    {project.name}
                  </h3>
                  <div className="flex flex-wrap gap-2.5 mb-8">
                    {project.stack.map(tech => (
                      <span key={tech} className="text-[10px] font-bold px-3 py-1.5 rounded-md bg-teal/10 text-teal uppercase tracking-widest border border-teal/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <button className="w-full py-3.5 rounded-lg bg-teal text-bg font-bold text-sm hover:shadow-[0_10px_20px_rgba(0,205,184,0.25)] transition-all active:scale-[0.98]">
                    View Project →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-3 mt-10">
          {projects.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setActiveIndex(i)}
              className={`w-2 h-1 rounded-full transition-all duration-300 ${activeIndex === i ? 'bg-teal w-10' : 'bg-teal/20'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsCarousel;

import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const ProjectsGrid = () => {
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

  return (
    <div>
      <SectionHeading accent="PROJECTS">FEATURED</SectionHeading>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 100} className="h-full">
            <div className="glass-card rounded-[14px] overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:border-teal flex flex-col h-full border border-white/10">
              <div 
                className="h-[180px] w-full opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0"
                style={{ background: project.image }}
              />
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight group-hover:text-teal transition-colors">
                  {project.name}
                </h3>
                <div className="flex flex-wrap gap-2 mb-8 flex-grow">
                  {project.stack.map(tech => (
                    <span key={tech} className="text-[9px] font-bold px-2.5 py-1 rounded-md bg-teal/10 text-teal uppercase tracking-widest border border-teal/5 h-fit">
                      {tech}
                    </span>
                  ))}
                </div>
                <button className="w-full py-3 rounded-lg bg-teal text-bg font-bold text-[13px] hover:shadow-[0_10px_20px_rgba(0,205,184,0.25)] transition-all active:scale-[0.98] mt-auto">
                  View Project →
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default ProjectsGrid;

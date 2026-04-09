const ProjectStats = ({ onSubmitClick }) => {
  return (
    <section className="relative py-16 overflow-hidden border-b border-white/[0.05]">
      <div className="bg-blob top-0 left-1/4 opacity-20"></div>
      <div className="section-container relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Left - Heading */}
          <div className="flex-1">
            <h1 className="text-[clamp(36px,6vw,72px)] font-black tracking-tighter uppercase mb-4">
              <span className="text-white">OUR </span>
              <span className="text-teal">PROJECTS</span>
            </h1>
            <p className="text-muted text-lg md:text-xl max-w-xl">
              Built by the community. Powered by passion.
            </p>
          </div>

          {/* Right - Submit Button */}
          <div className="flex-shrink-0">
            <button 
              onClick={onSubmitClick}
              className="px-6 py-3 rounded-xl border border-teal/40 text-teal font-medium hover:bg-teal/10 hover:border-teal/60 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Submit a Project
            </button>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex flex-wrap gap-4 mt-10">
          <div className="px-5 py-2.5 rounded-full border border-teal/30 bg-teal/10 backdrop-blur-xl text-sm font-semibold text-teal">
            50+ Projects
          </div>
          <div className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-sm font-semibold text-white/70">
            Open Source
          </div>
          <div className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-sm font-semibold text-white/70">
            Community Built
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectStats;

const TeamStats = ({ showAlumni, onToggleAlumni }) => {
  return (
    <section className="relative py-16 overflow-hidden border-b border-white/[0.05]">
      <div className="bg-blob top-0 left-1/4 opacity-20"></div>
      <div className="section-container relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Left - Heading */}
          <div className="flex-1">
            <h1 className="text-[clamp(36px,6vw,72px)] font-black tracking-tighter uppercase mb-4">
              <span className="text-white">MEET THE </span>
              <span className="text-teal">TEAM</span>
            </h1>
            <p className="text-muted text-lg md:text-xl max-w-xl">
              The people who make ClubVerse run.
            </p>
          </div>

          {/* Right - Alumni Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted">Show Alumni</span>
            <button
              onClick={onToggleAlumni}
              className="relative w-14 h-7 rounded-full transition-colors duration-300"
              style={{
                background: showAlumni ? 'rgba(0, 205, 184, 0.3)' : 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <div
                className="absolute top-1 w-5 h-5 rounded-full bg-teal transition-transform duration-300"
                style={{
                  transform: showAlumni ? 'translateX(28px)' : 'translateX(4px)',
                  boxShadow: '0 0 10px rgba(0, 205, 184, 0.5)'
                }}
              />
            </button>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex flex-wrap gap-4 mt-10">
          <div className="px-5 py-2.5 rounded-full border border-teal/30 bg-teal/10 backdrop-blur-xl text-sm font-semibold text-teal">
            50+ Members
          </div>
          <div className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-sm font-semibold text-white/70">
            5 Domain Leads
          </div>
          <div className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-sm font-semibold text-white/70">
            200+ Alumni
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamStats;

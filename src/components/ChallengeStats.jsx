const ChallengeStats = () => {
  const stats = [
    { label: '3 Active', color: 'bg-teal/10 text-teal border-teal/30' },
    { label: '12 Completed', color: 'bg-white/5 text-white/70 border-white/10' },
    { label: '2 Upcoming', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' }
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background blobs */}
      <div className="bg-blob top-1/2 left-1/4 opacity-20"></div>
      
      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[clamp(36px,6vw,72px)] font-black tracking-tighter uppercase mb-4">
            <span className="text-white">CHALLEN</span>
            <span className="text-teal">GES</span>
          </h1>
          <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto">
            Test your skills. Earn XP. Rise the ranks.
          </p>
        </div>

        {/* Stats Pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`px-5 py-2.5 rounded-full border backdrop-blur-xl text-sm font-semibold ${stat.color}`}
            >
              {stat.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChallengeStats;

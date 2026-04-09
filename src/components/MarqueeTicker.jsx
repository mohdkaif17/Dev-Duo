const MarqueeTicker = () => {
  const notices = [
    "🏆 Hackathon 2025 registrations now open",
    "🧩 New challenge: Build a REST API",
    "📸 Gallery updated — DevFest photos live",
    "🎓 Internship drive open till April 30",
    "🚀 New project submissions open",
  ];

  return (
    <div className="w-full bg-teal/6 border-t border-b border-teal/15 py-3 overflow-hidden relative flex items-center">
      {/* Label */}
      <div className="absolute left-0 top-0 bottom-0 bg-[#080810] z-10 px-6 flex items-center border-r border-teal/15 font-bold text-teal text-sm tracking-widest uppercase">
          📢 NOTICES
      </div>
      
      {/* Moving Content */}
      <div className="flex whitespace-nowrap animate-marquee py-1 pl-[150px]">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-12 items-center text-white/90 font-medium text-sm">
            {notices.map((notice, idx) => (
              <span key={idx} className="flex items-center gap-12">
                <span className="flex items-center gap-2">
                   {notice}
                </span>
                <span className="text-teal/30 font-bold uppercase tracking-tighter mx-2">●</span>
              </span>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MarqueeTicker;

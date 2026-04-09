import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const EventsPreview = () => {
  const events = [
    { id: 1, title: "WebDev Hackathon 2025", category: "Coding", date: "APR 25", time: "2d 14h 32m" },
    { id: 2, title: "UI/UX Design Workshop", category: "Design", date: "MAY 02", time: "9d 08h 15m" },
    { id: 3, title: "Cloud Computing Summit", category: "Tech", date: "MAY 15", time: "22d 05h 45m" },
  ];

  return (
    <div>
      <SectionHeading accent="EVENTS">UPCOMING</SectionHeading>
      
      {/* SaaS-Style 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {events.map((event, i) => (
          <Reveal key={event.id} delay={i * 100} className="h-full">
            <div className="glass-card rounded-[14px] overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:border-teal flex flex-col h-full border border-white/10">
              {/* Image Banner */}
              <div className="h-[220px] w-full relative overflow-hidden flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600" 
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg2 to-transparent/10"></div>
                <div className="absolute top-4 left-4 bg-teal text-bg font-bold text-[11px] px-3 py-1.5 rounded-md shadow-lg">
                  {event.date}
                </div>
              </div>
              
              {/* Body with p-6 and flex-grow */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-teal transition-colors">
                  {event.title}
                </h3>
                <div className="inline-block px-3 py-1 rounded-full border border-white/10 text-[9px] text-muted uppercase font-bold mb-8 tracking-widest w-fit">
                  {event.category}
                </div>
                
                {/* Spacer to push countdown and button to bottom */}
                <div className="mt-auto">
                    <div className="flex items-center gap-2 text-teal font-mono text-[13px] mb-6 border border-teal/10 bg-teal/5 p-3 rounded-lg justify-center">
                        <span className="opacity-80">⏱️</span> {event.time}
                    </div>
                    
                    <button className="w-full py-3.5 rounded-lg border-2 border-teal/20 text-teal text-[13px] font-black hover:bg-teal hover:text-bg transition-all uppercase tracking-tighter">
                        Register Now →
                    </button>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default EventsPreview;

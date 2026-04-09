import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const SocialCard = ({ scale = false, title = "Post Title" }) => (
    <div className={`w-[260px] md:w-[300px] glass-card bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ${scale ? 'scale-[1.05] z-10 -translate-y-4' : 'scale-90 opacity-70 translate-y-2'}`}>
        <div className="p-3 flex items-center gap-2 border-b border-gray-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal to-blue-500"></div>
            <span className="text-bg font-bold text-[12px]">techverse.it</span>
        </div>
        <div className="aspect-square bg-gray-50 flex items-center justify-center text-gray-200 text-6xl">
            🖼
        </div>
        <div className="p-4 bg-white">
            <div className="flex gap-3 mb-2">
                <span className="text-red-500">❤️</span>
                <span className="text-gray-400">💬</span>
                <span className="text-gray-400">✈️</span>
            </div>
            <p className="text-bg text-[12px] line-clamp-2">
                <b>techverse.it</b> Exciting things happening at the IT department this week! Stay tuned for more updates. #Tech #Innovation
            </p>
        </div>
    </div>
);

const SocialsSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="relative z-10">
        <div className="text-center mb-16">
          <SectionHeading accent="SOCIALS">OUR</SectionHeading>
        </div>
        
        {/* Clean Horizontal Grid */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-20">
            <Reveal delay={0}>
                <SocialCard title="Post 1" scale={true} />
            </Reveal>
            <Reveal delay={150}>
                <SocialCard title="Post 2" scale={true} />
            </Reveal>
            <Reveal delay={300}>
                <SocialCard title="Post 3" scale={true} />
            </Reveal>
        </div>

        {/* Platform Buttons */}
        <div className="flex flex-col items-center gap-10">
          <div className="flex justify-center items-center gap-6">
              <div className="w-14 h-14 rounded-full border-2 border-teal/20 flex items-center justify-center text-teal hover:bg-teal hover:text-bg hover:scale-110 transition-all cursor-pointer font-black text-xl">
                  𝕏
              </div>
              <button className="px-12 py-4 rounded-xl border-2 border-teal text-teal font-black tracking-[0.2em] hover:bg-teal hover:text-bg hover:shadow-[0_0_30px_rgba(0,205,184,0.3)] transition-all uppercase text-sm">
                  Follow on Instagram
              </button>
              <div className="w-14 h-14 rounded-full border-2 border-teal/20 flex items-center justify-center text-teal hover:bg-teal hover:text-bg hover:scale-110 transition-all cursor-pointer font-black text-xl">
                  in
              </div>
          </div>
          <p className="text-muted text-sm font-medium tracking-wide">Join 2,500+ followers for daily tech updates</p>
        </div>
      </div>
    </section>
  );
};

export default SocialsSection;

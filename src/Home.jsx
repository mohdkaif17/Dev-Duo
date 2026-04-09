import HeroCanvas from './components/HeroCanvas';
import Reveal from './components/Reveal';
import StatsStrip from './components/StatsStrip';
import EventsPreview from './components/EventsPreview';
import ChallengesGrid from './components/ChallengesGrid';
import ProjectsGrid from './components/ProjectsGrid';
import LeaderboardPreview from './components/LeaderboardPreview';
import MarqueeTicker from './components/MarqueeTicker';
import SponsorsStrip from './components/SponsorsStrip';
import SocialsSection from './components/SocialsSection';
import Footer from './components/Footer';
import SectionHeading from './components/SectionHeading';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="page-content w-full bg-[#080810] selection:bg-teal/30 selection:text-teal font-space">
      {/* 1. Hero Section - Immersive Full Width background */}
      <section 
        className="relative w-full flex flex-col items-center justify-center overflow-hidden hero-section"
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
        <div className="bg-blob -top-20 -left-20 opacity-40"></div>
        <div className="bg-blob top-1/2 -right-40 opacity-30 animation-delay-2000"></div>
        
        <HeroCanvas />
        
        <div className="section-container relative z-10 text-center flex flex-col items-center py-20 md:py-32">
          <Reveal delay={0}>
              <div className="mb-10 px-6 py-2 rounded-full bg-teal/5 border border-teal/20 backdrop-blur-xl inline-block shadow-[0_0_30px_rgba(0,205,184,0.1)]">
                <span className="text-teal text-[11px] md:text-[13px] font-black tracking-[0.3em] flex items-center gap-2 uppercase">
                   CMR University · Tech Club
                </span>
              </div>
          </Reveal>

          <div className="flex flex-col mb-12">
            <Reveal delay={150}>
                <h1 className="text-[clamp(44px,8vw,96px)] font-black text-white leading-[0.9] tracking-tighter uppercase mb-2">
                  YOUR COMPLETE
                </h1>
            </Reveal>
            <Reveal delay={300}>
                <h2 className="text-[clamp(44px,8vw,92px)] font-black text-gradient-cyan leading-[0.9] tracking-tighter uppercase">
                  TECH ECOSYSTEM
                </h2>
            </Reveal>
          </div>

          <Reveal delay={450}>
              <p className="text-muted text-lg md:text-2xl max-w-3xl mb-14 leading-relaxed font-medium mx-auto px-4">
                Explore events, solve challenges, and build professional projects—all in a unified student-driven platform.
              </p>
          </Reveal>

          <Reveal delay={600}>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <Link 
                  to="/join"
                  className="bg-teal text-bg font-black px-14 py-5 rounded-2xl hover:scale-105 hover:shadow-[0_0_50px_rgba(0,205,184,0.4)] transition-all duration-500 active:scale-95 text-lg uppercase tracking-tighter"
                >
                  Join the Verse
                </Link>
                <Link 
                  to="/explore"
                  className="text-white border-2 border-white/10 px-14 py-5 rounded-2xl hover:border-teal hover:bg-teal/5 transition-all duration-300 text-lg uppercase tracking-tighter font-bold"
                >
                  Learn More
                </Link>
              </div>
          </Reveal>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce-slow">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-teal/40">
                <path d="M7 13L12 18L17 13M12 6V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="section-spacing bg-gradient-to-b from-transparent to-white/[0.02]">
           <div className="section-container">
                <StatsStrip />
           </div>
      </section>

      {/* 3. Marquee Ticker */}
      <MarqueeTicker />

      {/* 4. Upcoming Events */}
      <section className="section-spacing border-t border-white/[0.05]">
           <div className="section-container">
                <EventsPreview />
           </div>
      </section>

      {/* 5. Featured Challenges */}
      <section className="section-spacing border-t border-white/[0.05] bg-bg2/40">
           <div className="section-container">
                <ChallengesGrid />
           </div>
      </section>

      {/* 6. Featured Projects */}
      <section className="section-spacing border-t border-white/[0.05]">
           <div className="section-container">
                <ProjectsGrid />
           </div>
      </section>

      {/* 7. About Us */}
      <section id="about" className="section-spacing border-t border-white/[0.05] bg-gradient-to-r from-teal/[0.02] to-transparent">
           <div className="section-container text-center flex flex-col items-center justify-center">
                <div className="max-w-4xl mx-auto">
                    <SectionHeading accent="Us">ABOUT</SectionHeading>
                    <Reveal className="space-y-12">
                        <div className="relative pt-12 flex flex-col items-center">
                            <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[180px] text-teal/5 font-serif leading-none italic select-none">"</span>
                            <p className="text-white text-2xl md:text-3xl font-semibold italic leading-relaxed relative z-10 text-center">
                                The only way to predict the future is to create it. In a world where people are anticipating the future, we have taken it upon us to shape it.
                            </p>
                            <div className="w-12 h-1 bg-teal mt-10 mb-4"></div>
                            <p className="text-sm uppercase tracking-[0.3em] text-teal font-black text-center">
                                — President 2024-25
                            </p>
                        </div>
                        <p className="text-muted text-lg md:text-xl leading-relaxed max-w-3xl mx-auto text-center">
                            Tech Verse centers on inclusive technological developments, bringing modern innovations to everyone. Our technology-driven approach bridges the gap between aspirations and leadership.
                        </p>
                    </Reveal>
                </div>
           </div>
      </section>

      {/* 8. Leaderboard Section (Top Contributors) */}
      <section className="section-spacing border-t border-white/[0.05]">
           <div className="section-container text-center flex flex-col items-center">
                <LeaderboardPreview />
           </div>
      </section>

      {/* 9. Sponsors Strip */}
      <section className="section-spacing border-t border-white/[0.05] bg-white/[0.01]">
           <div className="section-container">
                <SponsorsStrip />
           </div>
      </section>

      {/* 10. Socials Section */}
      <section className="section-spacing border-t border-white/[0.05]">
           <div className="section-container">
                <SocialsSection />
           </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;

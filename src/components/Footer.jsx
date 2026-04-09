import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#050508] border-t border-teal/10 pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Left: Branding */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-teal">
                <path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              <span className="text-xl font-bold text-white tracking-tight">Tech<span className="text-teal">Verse</span></span>
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              CMR University · Department of Information Technology. Empowering student innovators since 2021.
            </p>
          </div>

          {/* Center: Links */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Explore</h4>
              {[ 'Home', 'Events', 'Challenges', 'Projects', 'Team' ].map(link => (
                <Link key={link} to="#" className="block text-muted text-sm hover:text-teal transition-colors">{link}</Link>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Community</h4>
              {[ 'Gallery', 'Leaderboard', 'Sponsors', 'About', 'Contact' ].map(link => (
                <Link key={link} to="#" className="block text-muted text-sm hover:text-teal transition-colors">{link}</Link>
              ))}
            </div>
          </div>

          {/* Right: CTA */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Join Us</h4>
            <p className="text-muted text-sm leading-relaxed">
              Want to lead the next big initiative? We're looking for passionate tech enthusiasts.
            </p>
            <button className="w-full py-3 rounded-lg border border-teal text-teal text-sm font-bold hover:bg-teal/5 transition-colors">
              We're Recruiting! Apply Now →
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-muted text-[13px]">
            © 2025 Tech Verse IT Department. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-muted text-sm">
             <a href="mailto:thetechclub@cmr.edu.in" className="hover:text-teal transition-colors">thetechclub@cmr.edu.in</a>
             <div className="flex gap-4">
               {['FB', 'IG', 'LI', 'TW'].map(s => (
                 <span key={s} className="hover:text-white cursor-pointer transition-colors">{s}</span>
               ))}
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

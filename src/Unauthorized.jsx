import { Link } from 'react-router-dom';

// Hexagonal SVG pattern
const HexPattern = () => (
  <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.07, zIndex: 0 }}>
    <defs>
      <pattern id="hex-unauthorized" width="28" height="48" patternUnits="userSpaceOnUse">
        <path d="M14 0 L28 8 L28 24 L14 32 L0 24 L0 8 Z" fill="none" stroke="#00CDB8" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hex-unauthorized)" />
  </svg>
);

// Floating triangles decoration
const FloatingTriangles = () => (
  <>
    <div className="fixed left-8 top-1/3 opacity-60 animate-float" style={{ animationDuration: '10s' }}>
      <svg width="30" height="45" viewBox="0 0 30 45" fill="none">
        <path d="M15 0 L30 22 L15 15 L0 22 Z" fill="#00CDB8" opacity="0.25"/>
      </svg>
    </div>
    <div className="fixed right-8 bottom-1/3 opacity-60 animate-float" style={{ animationDuration: '12s', animationDelay: '2s' }}>
      <svg width="25" height="40" viewBox="0 0 25 40" fill="none">
        <path d="M12 0 L25 20 L12 13 L0 20 Z" fill="#00CDB8" opacity="0.25"/>
      </svg>
    </div>
  </>
);

// Sad Robot SVG
const SadRobot = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
    {/* Robot head */}
    <rect x="20" y="20" width="80" height="70" rx="10" stroke="#00CDB8" strokeWidth="3" fill="none"/>
    {/* Left eye (X) */}
    <path d="M35 45 L45 55 M45 45 L35 55" stroke="#00CDB8" strokeWidth="3" strokeLinecap="round"/>
    {/* Right eye (circle - sad) */}
    <circle cx="75" cy="50" r="8" stroke="#00CDB8" strokeWidth="2" fill="none"/>
    {/* Mouth (sad curve) */}
    <path d="M45 70 Q60 60 75 70" stroke="#00CDB8" strokeWidth="3" strokeLinecap="round" fill="none"/>
    {/* Antenna */}
    <line x1="60" y1="20" x2="60" y2="5" stroke="#00CDB8" strokeWidth="2"/>
    <circle cx="60" cy="5" r="4" fill="#00CDB8"/>
    {/* Tears */}
    <circle cx="35" cy="60" r="3" fill="#00CDB8" opacity="0.5"/>
    <circle cx="38" cy="65" r="2" fill="#00CDB8" opacity="0.3"/>
  </svg>
);

const Unauthorized = () => {
  return (
    <div className="page-content min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#080810' }}>
      <HexPattern />
      <FloatingTriangles />
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>

      <div className="relative z-10 text-center px-4">
        {/* Sad Robot */}
        <div className="flex justify-center mb-6">
          <SadRobot />
        </div>

        {/* 403 */}
        <h1 className="text-[80px] font-extrabold leading-none mb-2" style={{ color: '#00CDB8' }}>
          403
        </h1>

        {/* Access Denied */}
        <h2 className="text-[28px] font-bold mb-4" style={{ color: '#F0F0F0' }}>
          Access Denied
        </h2>

        {/* Subtext */}
        <p className="text-[15px] max-w-md mx-auto mb-8" style={{ color: '#8A8A9A' }}>
          You don't have permission to view this page. This area is for admins only.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 rounded-[10px] font-semibold text-[15px] transition-all hover:scale-105"
            style={{
              background: '#00CDB8',
              color: '#080810'
            }}
          >
            Go Home
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-[10px] font-semibold text-[15px] border transition-all hover:scale-105"
            style={{
              borderColor: 'rgba(0,205,184,0.4)',
              color: '#00CDB8',
              background: 'transparent'
            }}
          >
            Contact Admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

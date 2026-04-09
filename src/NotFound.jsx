import { Link } from 'react-router-dom';

// Hexagonal SVG pattern
const HexPattern = () => (
  <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.07, zIndex: 0 }}>
    <defs>
      <pattern id="hex-404" width="28" height="48" patternUnits="userSpaceOnUse">
        <path d="M14 0 L28 8 L28 24 L14 32 L0 24 L0 8 Z" fill="none" stroke="#00CDB8" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hex-404)" />
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

// Lost Astronaut SVG
const LostAstronaut = () => (
  <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
    {/* Helmet */}
    <circle cx="70" cy="50" r="35" stroke="#00CDB8" strokeWidth="3" fill="none"/>
    {/* Face shield */}
    <ellipse cx="70" cy="50" rx="25" ry="22" stroke="#00CDB8" strokeWidth="2" fill="none"/>
    {/* Eyes (confused) */}
    <circle cx="62" cy="48" r="3" fill="#00CDB8"/>
    <circle cx="78" cy="48" r="3" fill="#00CDB8"/>
    {/* Question mark */}
    <text x="100" y="35" fill="#00CDB8" fontSize="24" fontWeight="bold">?</text>
    {/* Body */}
    <rect x="50" y="85" width="40" height="35" rx="5" stroke="#00CDB8" strokeWidth="2" fill="none"/>
    {/* Backpack */}
    <rect x="40" y="90" width="10" height="25" rx="2" stroke="#00CDB8" strokeWidth="2" fill="none"/>
    <rect x="90" y="90" width="10" height="25" rx="2" stroke="#00CDB8" strokeWidth="2" fill="none"/>
    {/* Legs floating */}
    <line x1="55" y1="120" x2="50" y2="135" stroke="#00CDB8" strokeWidth="3" strokeLinecap="round"/>
    <line x1="85" y1="120" x2="90" y2="135" stroke="#00CDB8" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const NotFound = () => {
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
        {/* Lost Astronaut */}
        <div className="flex justify-center mb-6">
          <LostAstronaut />
        </div>

        {/* 404 */}
        <h1 className="text-[100px] font-extrabold leading-none mb-2" style={{ color: '#00CDB8' }}>
          404
        </h1>

        {/* Page Not Found */}
        <h2 className="text-[28px] font-bold mb-4" style={{ color: '#F0F0F0' }}>
          Page Not Found
        </h2>

        {/* Subtext */}
        <p className="text-[15px] max-w-md mx-auto mb-8" style={{ color: '#8A8A9A' }}>
          Looks like you've drifted into uncharted space. The page you're looking for doesn't exist.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="inline-block px-8 py-3 rounded-[10px] font-semibold text-[15px] transition-all hover:scale-105"
          style={{
            background: '#00CDB8',
            color: '#080810'
          }}
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

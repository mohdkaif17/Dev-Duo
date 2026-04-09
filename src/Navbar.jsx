import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from './context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isLoggedIn, isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Challenges', path: '/challenges' },
    { name: 'Projects', path: '/projects' },
    { name: 'Team', path: '/team' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Leaderboard', path: '/leaderboard' },
    ...(isAdmin() ? [{ name: 'Admin', path: '/admin' }] : []),
  ];

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const getInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#080810]/90 backdrop-blur-xl border-b border-teal/20 shadow-2xl' 
            : 'bg-transparent border-b border-transparent'
        }`}
        style={{
          height: '64px',
          padding: '0 2.5rem'
        }}
      >
        <div 
          className="flex items-center justify-between w-full h-full"
          style={{ gap: 0 }}
        >
          {/* Left: Logo */}
          <Link 
            to="/" 
            className="flex items-center group"
            style={{ gap: '10px', flexShrink: 0 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-teal group-hover:scale-110 transition-transform">
              <path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-[18px] font-bold text-white tracking-tight whitespace-nowrap">Tech<span className="text-teal">Verse</span></span>
          </Link>

          {/* Center: Nav Links (hidden on mobile) */}
          <div 
            className="hidden lg:flex items-center"
            style={{ gap: '6px' }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-medium transition-colors whitespace-nowrap ${
                  location.pathname === link.path
                    ? 'text-teal'
                    : 'text-muted hover:text-teal'
                }`}
                style={{
                  padding: '7px 14px',
                  fontSize: '14px',
                  borderRadius: '8px'
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right: User Section */}
          <div 
            className="flex items-center"
            style={{ gap: '10px', flexShrink: 0 }}
          >
            {!isLoggedIn() ? (
              // Not logged in - show login/join buttons
              <>
                <Link 
                  to="/login" 
                  className="hidden sm:block text-teal border border-teal/40 hover:bg-teal/10 transition-colors whitespace-nowrap"
                  style={{ padding: '8px 18px', fontSize: '14px', borderRadius: '9999px' }}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-teal text-[#080810] font-bold hover:shadow-[0_0_18px_rgba(0,205,184,0.5)] transition-all active:scale-95 whitespace-nowrap"
                  style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '9999px' }}
                >
                  Join Now
                </Link>
              </>
            ) : (
              // Logged in - show user avatar with dropdown
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center group"
                  style={{ gap: '10px' }}
                >
                  {/* Avatar */}
                  <div 
                    className="rounded-full flex items-center justify-center font-bold"
                    style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #00CDB8 0%, #0A2540 100%)',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  >
                    {getInitials()}
                  </div>
                  {/* Admin Badge */}
                  {isAdmin() && (
                    <span 
                      className="hidden sm:block rounded-full font-bold"
                      style={{
                        padding: '2px 8px',
                        fontSize: '10px',
                        background: 'rgba(0,205,184,0.2)',
                        color: '#00CDB8',
                        border: '1px solid rgba(0,205,184,0.4)'
                      }}
                    >
                      ADMIN
                    </span>
                  )}
                  <svg 
                    className={`text-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    style={{ width: '16px', height: '16px' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div 
                    className="absolute top-12 right-0 min-w-[180px] rounded-xl overflow-hidden z-50"
                    style={{
                      background: 'rgba(10,10,26,0.95)',
                      border: '1px solid rgba(0,205,184,0.2)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                    }}
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-[14px] font-semibold text-white">{user?.name || user?.email}</p>
                      <span 
                        className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px]"
                        style={{
                          background: isAdmin() ? 'rgba(0,205,184,0.15)' : 'rgba(255,255,255,0.1)',
                          color: isAdmin() ? '#00CDB8' : '#8A8A9A',
                          border: `1px solid ${isAdmin() ? 'rgba(0,205,184,0.3)' : 'rgba(255,255,255,0.2)'}`
                        }}
                      >
                        {user?.role === 'admin' ? 'Admin' : 'Member'}
                      </span>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-[13px] text-white/80 hover:bg-white/5 hover:text-teal transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                      <Link 
                        to="/dashboard" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-[13px] text-white/80 hover:bg-white/5 hover:text-teal transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Dashboard
                      </Link>
                      {isAdmin() && (
                        <Link 
                          to="/admin" 
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-[13px] text-teal hover:bg-teal/10 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Admin Panel
                        </Link>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/10"></div>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-[13px] text-red-400 hover:bg-red-500/10 w-full text-left transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center"
              style={{ color: '#F0F0F0' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`mobile-menu-link ${
                location.pathname === link.path ? 'text-teal' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
          {!isLoggedIn() && (
            <>
              <div className="border-t border-white/10 my-2"></div>
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-menu-link text-teal"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-menu-link bg-teal/10 text-teal border border-teal/30"
              >
                Join Now
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;


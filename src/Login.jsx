import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Hexagonal SVG pattern
const HexPattern = () => (
  <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.07, zIndex: 0 }}>
    <defs>
      <pattern id="hex" width="28" height="48" patternUnits="userSpaceOnUse">
        <path d="M14 0 L28 8 L28 24 L14 32 L0 24 L0 8 Z" fill="none" stroke="#00CDB8" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hex)" />
  </svg>
);

// Floating triangles decoration
const FloatingTriangles = () => (
  <>
    {/* Left side triangles */}
    <div className="fixed left-4 top-1/4 opacity-60 animate-float" style={{ animationDuration: '8s' }}>
      <svg width="40" height="60" viewBox="0 0 40 60" fill="none">
        <path d="M20 0 L40 30 L20 20 L0 30 Z" fill="#00CDB8" opacity="0.3"/>
        <path d="M20 20 L30 50 L20 40 L10 50 Z" fill="#00CDB8" opacity="0.2"/>
      </svg>
    </div>
    <div className="fixed left-8 bottom-1/3 opacity-60 animate-float" style={{ animationDuration: '12s', animationDelay: '2s' }}>
      <svg width="30" height="45" viewBox="0 0 30 45" fill="none">
        <path d="M15 0 L30 22 L15 15 L0 22 Z" fill="#00CDB8" opacity="0.25"/>
      </svg>
    </div>
    
    {/* Right side triangles */}
    <div className="fixed right-4 top-1/3 opacity-60 animate-float" style={{ animationDuration: '10s', animationDelay: '1s' }}>
      <svg width="35" height="55" viewBox="0 0 35 55" fill="none">
        <path d="M17 0 L35 28 L17 18 L0 28 Z" fill="#00CDB8" opacity="0.3"/>
        <path d="M17 18 L28 45 L17 35 L6 45 Z" fill="#00CDB8" opacity="0.2"/>
      </svg>
    </div>
    <div className="fixed right-8 bottom-1/4 opacity-60 animate-float" style={{ animationDuration: '9s', animationDelay: '3s' }}>
      <svg width="25" height="40" viewBox="0 0 25 40" fill="none">
        <path d="M12 0 L25 20 L12 13 L0 20 Z" fill="#00CDB8" opacity="0.25"/>
      </svg>
    </div>
  </>
);

// Toast component
const Toast = ({ message, visible }) => {
  if (!visible) return null;
  return (
    <div 
      className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium animate-fade-in"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(0,205,184,0.4)',
        backdropFilter: 'blur(10px)',
        color: '#00CDB8'
      }}
    >
      {message}
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const navigate = useNavigate();
  const { setUserDirect, isLoggedIn, user: currentUser } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      if (currentUser?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isLoggedIn, currentUser, navigate]);

  useEffect(() => {
    // Add float animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
      }
      .animate-float {
        animation: float ease-in-out infinite;
      }
      .animate-shake {
        animation: shake 0.4s ease-in-out;
      }
      .animate-fade-in {
        animation: fadeIn 0.3s ease;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    // Mock authentication
    setTimeout(() => {
      const adminCreds = { email: 'admin@123.in', password: 'Admin@123' };
      const userCreds = { email: 'user@clubverse.in', password: 'User@123' };

      if (email === adminCreds.email && password === adminCreds.password) {
        const userData = { role: 'admin', email, name: 'Admin', loggedIn: true };
        setUserDirect(userData);
        showToast('✓ Welcome back, Admin!');
        setTimeout(() => navigate('/admin'), 1500);
      } else if (email === userCreds.email && password === userCreds.password) {
        const userData = { role: 'user', email, name: 'Member', loggedIn: true };
        setUserDirect(userData);
        showToast('✓ Welcome back, Member!');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setShake(true);
        setErrors({ general: 'Invalid credentials. Please try again.' });
        setTimeout(() => setShake(false), 400);
      }
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="page-content min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#080810', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* Hexagonal Pattern */}
      <HexPattern />
      
      {/* Floating Triangles */}
      <FloatingTriangles />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[440px] px-4">
        {/* Glass Card */}
        <div 
          className={`p-10 rounded-[20px] ${shake ? 'animate-shake' : ''}`}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(0,205,184,0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 40px rgba(0,205,184,0.06), 0 20px 60px rgba(0,0,0,0.4)',
            animation: 'fadeIn 0.5s ease'
          }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2.5 mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" stroke="#00CDB8" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M12 8V16M8 12H16" stroke="#00CDB8" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-[20px] font-bold" style={{ color: '#F0F0F0' }}>ClubVerse</span>
            </div>
            <h2 className="text-[24px] font-extrabold mb-1" style={{ color: '#F0F0F0' }}>Welcome Back</h2>
            <p className="text-[13px]" style={{ color: '#8A8A9A' }}>Sign in to your ClubVerse account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#8A8A9A' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '', general: '' }); }}
                placeholder="you@cmr.edu.in"
                className="w-full px-4 py-3 rounded-[10px] text-[14px] outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${errors.email ? '#EF4444' : 'rgba(255,255,255,0.1)'}`,
                  color: '#F0F0F0',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}
              />
              {errors.email && <p className="text-[12px] mt-1" style={{ color: '#EF4444' }}>{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#8A8A9A' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '', general: '' }); }}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-[10px] text-[14px] outline-none transition-all pr-12"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${errors.password ? '#EF4444' : 'rgba(255,255,255,0.1)'}`,
                    color: '#F0F0F0',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: '#8A8A9A' }}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-[12px] mt-1" style={{ color: '#EF4444' }}>{errors.password}</p>}
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/30"
                  style={{ accentColor: '#00CDB8' }}
                />
                <span className="text-[13px]" style={{ color: '#8A8A9A' }}>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-[13px] hover:underline" style={{ color: '#00CDB8' }}>
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {errors.general && (
              <p className="text-[13px] text-center" style={{ color: '#EF4444' }}>{errors.general}</p>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-[10px] font-bold text-[15px] transition-all disabled:opacity-70"
              style={{
                background: '#00CDB8',
                color: '#080810',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background = '#00B8A5';
                  e.target.style.boxShadow = '0 0 20px rgba(0,205,184,0.45)';
                  e.target.style.transform = 'scale(1.01)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#00CDB8';
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'scale(1)';
              }}
              onMouseDown={(e) => { e.target.style.transform = 'scale(0.99)'; }}
              onMouseUp={(e) => { e.target.style.transform = 'scale(1.01)'; }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }}></div>
            <span className="text-[12px]" style={{ color: '#4A4A6A' }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }}></div>
          </div>

          {/* Social Login */}
          <div className="flex gap-3">
            <button
              className="flex-1 py-2.5 rounded-[10px] flex items-center justify-center gap-2 text-[13px] transition-all"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.03)',
                color: '#F0F0F0'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'rgba(0,205,184,0.3)';
                e.target.style.background = 'rgba(0,205,184,0.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                e.target.style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              className="flex-1 py-2.5 rounded-[10px] flex items-center justify-center gap-2 text-[13px] transition-all"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.03)',
                color: '#F0F0F0'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'rgba(0,205,184,0.3)';
                e.target.style.background = 'rgba(0,205,184,0.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                e.target.style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
              </svg>
              GitHub
            </button>
          </div>

          {/* Footer Link */}
          <p className="text-center mt-6 text-[13px]" style={{ color: '#8A8A9A' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold hover:underline" style={{ color: '#00CDB8' }}>
              Sign Up
            </Link>
          </p>
        </div>

        {/* Demo Credentials Hint */}
        <div 
          className="mt-3 p-3.5 rounded-[10px] text-[12px] text-center"
          style={{
            background: 'rgba(0,205,184,0.04)',
            border: '1px solid rgba(0,205,184,0.15)',
            color: '#8A8A9A'
          }}
        >
          <p><span className="font-bold" style={{ color: '#00CDB8' }}>🔑 Demo — Admin:</span> admin@clubverse.in / Admin@123</p>
          <p><span className="font-bold" style={{ color: '#00CDB8' }}>👤 Demo — User:</span> user@clubverse.in / User@123</p>
        </div>
      </div>

      {/* Toast */}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
};

export default Login;

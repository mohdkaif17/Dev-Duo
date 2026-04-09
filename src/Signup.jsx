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

// Password Strength Meter
const PasswordStrength = ({ password }) => {
  const getStrength = () => {
    if (!password) return { level: 0, label: '', color: '' };
    if (password.length < 6) return { level: 1, label: 'Weak', color: '#EF4444' };
    if (password.length >= 8 && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { level: 4, label: 'Strong', color: '#00CDB8' };
    }
    if (password.length >= 6 && /\d/.test(password)) {
      return { level: 3, label: 'Good', color: '#3B82F6' };
    }
    return { level: 2, label: 'Fair', color: '#F59E0B' };
  };

  const { level, label, color } = getStrength();

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-sm"
            style={{
              background: i <= level ? color : 'rgba(255,255,255,0.1)',
            }}
          />
        ))}
      </div>
      {label && (
        <p className="text-[11px] mt-1" style={{ color }}>{label}</p>
      )}
    </div>
  );
};

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    batch: '',
    role: 'Member',
    terms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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
      .animate-float {
        animation: float ease-in-out infinite;
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

  const getPasswordStrength = (password) => {
    if (!password || password.length < 6) return 1;
    if (password.length >= 8 && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)) return 4;
    if (password.length >= 6 && /\d/.test(password)) return 3;
    return 2;
  };

  const passwordsMatch = () => {
    return formData.password === formData.confirmPassword && formData.confirmPassword !== '';
  };

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (getPasswordStrength(formData.password) < 2) {
      newErrors.password = 'Password too weak';
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (!passwordsMatch()) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.batch.trim()) newErrors.batch = 'Batch year is required';
    if (!formData.terms) newErrors.terms = 'You must agree to the terms';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    // Mock signup
    setTimeout(() => {
      const userData = {
        role: 'user',
        email: formData.email,
        name: formData.name,
        batch: formData.batch,
        loggedIn: true
      };
      setUserDirect(userData);
      
      showToast('✓ Account created! Welcome to ClubVerse');
      setTimeout(() => navigate('/dashboard'), 1000);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="page-content min-h-screen flex items-center justify-center relative overflow-hidden py-8" style={{ background: '#080810', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* Hexagonal Pattern */}
      <HexPattern />
      
      {/* Floating Triangles */}
      <FloatingTriangles />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[480px] px-4">
        {/* Glass Card */}
        <div 
          className="p-10 rounded-[20px]"
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
            <h2 className="text-[24px] font-extrabold mb-1" style={{ color: '#F0F0F0' }}>Create Account</h2>
            <p className="text-[13px]" style={{ color: '#8A8A9A' }}>Join the ClubVerse community</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#8A8A9A' }}>
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-[10px] text-[14px] outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${errors.name ? '#EF4444' : 'rgba(255,255,255,0.1)'}`,
                  color: '#F0F0F0',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}
              />
              {errors.name && <p className="text-[12px] mt-1" style={{ color: '#EF4444' }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#8A8A9A' }}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
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

            {/* Password */}
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#8A8A9A' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                  placeholder="Create a strong password"
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
              <PasswordStrength password={formData.password} />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#8A8A9A' }}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => { setFormData({ ...formData, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }); }}
                  placeholder="Repeat your password"
                  className="w-full px-4 py-3 rounded-[10px] text-[14px] outline-none transition-all pr-12"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${
                      errors.confirmPassword ? '#EF4444' : 
                      (passwordsMatch() && formData.confirmPassword) ? '#22C55E' : 
                      'rgba(255,255,255,0.1)'
                    }`,
                    color: '#F0F0F0',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {passwordsMatch() && (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#22C55E">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="p-1"
                    style={{ color: '#8A8A9A' }}
                  >
                    {showConfirmPassword ? (
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
              </div>
              {errors.confirmPassword && <p className="text-[12px] mt-1" style={{ color: '#EF4444' }}>{errors.confirmPassword}</p>}
            </div>

            {/* Batch */}
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#8A8A9A' }}>
                Batch / Year
              </label>
              <input
                type="text"
                value={formData.batch}
                onChange={(e) => { setFormData({ ...formData, batch: e.target.value }); setErrors({ ...errors, batch: '' }); }}
                placeholder="e.g. 2024"
                className="w-full px-4 py-3 rounded-[10px] text-[14px] outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${errors.batch ? '#EF4444' : 'rgba(255,255,255,0.1)'}`,
                  color: '#F0F0F0',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}
              />
              {errors.batch && <p className="text-[12px] mt-1" style={{ color: '#EF4444' }}>{errors.batch}</p>}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#8A8A9A' }}>
                Account Type
              </label>
              <div className="grid grid-cols-1 gap-3">
                <div
                  onClick={() => setFormData({ ...formData, role: 'Member' })}
                  className="p-3 rounded-[10px] cursor-pointer relative"
                  style={{
                    border: '1.5px solid #00CDB8',
                    background: 'rgba(0,205,184,0.08)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">👤</span>
                    <div>
                      <p className="text-[13px] font-semibold" style={{ color: '#F0F0F0' }}>Member</p>
                      <p className="text-[11px]" style={{ color: '#8A8A9A' }}>For regular club members</p>
                    </div>
                  </div>
                  <svg className="absolute top-3 right-3 w-4 h-4" fill="#00CDB8" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
              <p className="text-[11px] mt-2" style={{ color: '#8A8A9A' }}>
                Note: Admin accounts are pre-created. Contact your club admin for admin access.
              </p>
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.terms}
                  onChange={(e) => { setFormData({ ...formData, terms: e.target.checked }); setErrors({ ...errors, terms: '' }); }}
                  className="w-4 h-4 rounded border-white/30 mt-0.5"
                  style={{ accentColor: '#00CDB8' }}
                />
                <span className="text-[13px]" style={{ color: '#8A8A9A' }}>
                  I agree to the{' '}
                  <a href="#" className="hover:underline" style={{ color: '#00CDB8' }}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="hover:underline" style={{ color: '#00CDB8' }}>Privacy Policy</a>
                </span>
              </label>
              {errors.terms && <p className="text-[12px] mt-1" style={{ color: '#EF4444' }}>{errors.terms}</p>}
            </div>

            {/* Sign Up Button */}
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
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center mt-6 text-[13px]" style={{ color: '#8A8A9A' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: '#00CDB8' }}>
              Sign In
            </Link>
          </p>
        </div>

        {/* Note Box */}
        <div 
          className="mt-3 p-3.5 rounded-[10px] text-[12px] text-center"
          style={{
            background: 'rgba(0,205,184,0.04)',
            border: '1px solid rgba(0,205,184,0.1)',
            borderLeft: '2px solid #00CDB8',
            color: '#8A8A9A'
          }}
        >
          ℹ Admin accounts are not created via signup. Contact your club admin to get admin access.
        </div>
      </div>

      {/* Toast */}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
};

export default Signup;

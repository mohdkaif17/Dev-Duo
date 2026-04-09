import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logAdminAction, AuditActions } from '../utils/auditLog';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )},
  { id: 'events', label: 'Events', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )},
  { id: 'challenges', label: 'Challenges', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  )},
  { id: 'team', label: 'Team', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )},
  { id: 'projects', label: 'Projects', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  )},
  { id: 'gallery', label: 'Gallery', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )},
  { id: 'submissions', label: 'Submissions', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )},
  { id: 'users', label: 'Users', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )},
  { id: 'analytics', label: 'Analytics', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )},
  { id: 'announcements', label: 'Announcements', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  )},
  { id: 'audit', label: 'Audit Log', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )},
];

const AdminLayout = ({ user, activeTab, onTabChange, onLogout, children }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Get session start time from localStorage or current time
  const sessionTime = localStorage.getItem('adminSessionStart') || new Date().toISOString();
  if (!localStorage.getItem('adminSessionStart')) {
    localStorage.setItem('adminSessionStart', sessionTime);
  }
  
  const formatSessionTime = () => {
    const start = new Date(sessionTime);
    const now = new Date();
    const diff = Math.floor((now - start) / 60000); // minutes
    if (diff < 1) return 'just now';
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ${diff % 60}m ago`;
  };

  const handleLogoutConfirm = () => {
    logAdminAction(user, AuditActions.ADMIN_LOGOUT, 'Admin Panel');
    localStorage.removeItem('adminSessionStart');
    onLogout();
  };

  const getInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'A';
  };

  return (
    <div className="page-content bg-bg flex">
      {/* Sidebar - positioned below navbar (top: 64px) */}
      <aside 
        className="fixed left-0 w-[220px] flex flex-col overflow-y-auto"
        style={{
          top: '64px',
          bottom: '0',
          background: '#050510',
          borderRight: '1px solid rgba(0,205,184,0.1)',
          height: 'calc(100vh - 64px)'
        }}
      >
        {/* Admin Identity Header */}
        <div className="p-5 border-b border-white/5">
          {/* Avatar */}
          <div 
            className="w-11 h-11 rounded-full flex items-center justify-center text-[16px] font-bold mb-3"
            style={{
              background: 'linear-gradient(135deg, #00CDB8 0%, #0A2540 100%)',
              color: '#080810'
            }}
          >
            {getInitials()}
          </div>
          
          {/* Name */}
          <p className="text-[14px] font-bold truncate" style={{ color: '#F0F0F0' }}>
            {user?.name || 'Admin'}
          </p>
          
          {/* Role Badge */}
          <div className="mt-2 mb-1">
            <span 
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{
                background: 'rgba(0,205,184,0.15)',
                color: '#00CDB8',
                border: '1px solid rgba(0,205,184,0.3)',
                letterSpacing: '0.08em'
              }}
            >
              <span>⚙</span> ADMIN
            </span>
          </div>
          
          {/* Email */}
          <p className="text-[11px] truncate" style={{ color: '#8A8A9A' }}>
            {user?.email}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="w-full flex items-center gap-3 px-5 py-3 text-sm transition-all duration-200"
                style={{
                  background: isActive ? 'rgba(0,205,184,0.08)' : 'transparent',
                  borderLeft: isActive ? '3px solid #00CDB8' : '3px solid transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.6)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ color: isActive ? '#00CDB8' : 'rgba(255,255,255,0.5)' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5 relative">
          {/* Logout Confirmation Dialog */}
          {showLogoutConfirm && (
            <div 
              className="absolute bottom-full left-4 right-4 mb-2 p-4 rounded-xl z-50"
              style={{
                background: 'rgba(10,10,26,0.98)',
                border: '1px solid rgba(0,205,184,0.2)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 -10px 40px rgba(0,0,0,0.5)'
              }}
            >
              <p className="text-[13px] text-white mb-3">Are you sure you want to logout?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2 rounded-lg text-[12px] font-medium transition-colors"
                  style={{
                    border: '1px solid rgba(0,205,184,0.4)',
                    color: '#00CDB8',
                    background: 'transparent'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 py-2 rounded-lg text-[12px] font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content - offset by sidebar width, fills remaining height */}
      <main 
        className="flex-1 ml-[220px]"
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
        {/* Admin Session Info Bar */}
        <div 
          className="flex items-center justify-between px-6 py-1.5"
          style={{
            background: 'rgba(0,205,184,0.05)',
            borderBottom: '1px solid rgba(0,205,184,0.1)'
          }}
        >
          <div className="flex items-center gap-2 text-[12px]" style={{ color: '#00CDB8' }}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Admin Session Active
          </div>
          <div className="text-[11px]" style={{ color: '#8A8A9A' }}>
            Logged in as {user?.email} · Session since {formatSessionTime()}
          </div>
        </div>
        
        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

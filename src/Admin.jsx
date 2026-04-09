import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { logAdminAction, AuditActions } from './utils/auditLog';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import AdminEvents from './components/AdminEvents';
import AdminChallenges from './components/AdminChallenges';
import AdminUsers from './components/AdminUsers';
import AdminSubmissions from './components/AdminSubmissions';
import AdminAnnouncements from './components/AdminAnnouncements';
import { getAuditLogs, getActionColor } from './utils/auditLog';

// Placeholder components for remaining tabs
const AdminTeam = () => <div className="p-8 text-muted">Team management coming soon...</div>;
const AdminProjects = () => <div className="p-8 text-muted">Projects management coming soon...</div>;
const AdminGallery = () => <div className="p-8 text-muted">Gallery management coming soon...</div>;
const AdminAnalytics = () => <div className="p-8 text-muted">Analytics dashboard coming soon...</div>;

// Full Audit Log component with data
const AdminAuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  const filteredLogs = filter === 'All' ? logs : logs.filter(l => l.action.includes(filter));

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'Admin', 'Action', 'Target'].join(','),
      ...logs.map(l => [l.timestamp, l.admin, l.action, l.target].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clubverse_audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Audit Log</h1>
        <div className="flex gap-3">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          >
            <option className="bg-bg">All</option>
            <option className="bg-bg">Created</option>
            <option className="bg-bg">Updated</option>
            <option className="bg-bg">Deleted</option>
          </select>
          <button 
            onClick={handleExport}
            className="px-4 py-2 rounded-lg border border-teal/40 text-teal text-sm hover:bg-teal/10 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div 
        className="rounded-xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(0,205,184,0.1)'
        }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(0,205,184,0.05)' }}>
              {['Timestamp', 'Admin', 'Action', 'Target'].map(h => (
                <th key={h} className="text-left py-3 px-5 text-xs font-bold uppercase text-muted tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => {
              const styles = getActionColor(log.action);
              return (
                <tr key={log.id} className="border-t border-white/5">
                  <td className="py-3 px-5 text-muted text-sm">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-5 text-white">{log.admin}</td>
                  <td className="py-3 px-5">
                    <span 
                      className="px-2 py-1 rounded-full text-xs"
                      style={{
                        background: styles.bg,
                        color: styles.color,
                        border: `1px solid ${styles.border}`
                      }}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-white">{log.target}</td>
                </tr>
              );
            })}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted">
                  No audit log entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // ENTRY GUARD: Double-check admin access (defense in depth)
  if (!user || user.role !== 'admin') {
    return null; // AdminRoute should have already redirected
  }

  const handleLogout = () => {
    logout();
  };

  // Log admin login
  useEffect(() => {
    logAdminAction(user, AuditActions.ADMIN_LOGIN, 'Admin Panel');
  }, [user]);

  const renderTab = () => {
    // All tabs gated by admin role
    if (user.role !== 'admin') return null;
    
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'events': return <AdminEvents user={user} />;
      case 'challenges': return <AdminChallenges user={user} />;
      case 'team': return <AdminTeam />;
      case 'projects': return <AdminProjects />;
      case 'gallery': return <AdminGallery />;
      case 'submissions': return <AdminSubmissions user={user} />;
      case 'users': return <AdminUsers user={user} />;
      case 'analytics': return <AdminAnalytics />;
      case 'announcements': return <AdminAnnouncements />;
      case 'audit': return <AdminAuditLog />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout 
      user={user} 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      {renderTab()}
    </AdminLayout>
  );
};

export default Admin;

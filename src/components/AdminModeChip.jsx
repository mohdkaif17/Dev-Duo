import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminModeChip = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Only show for admin users
  if (!isAdmin()) return null;

  return (
    <button
      onClick={() => navigate('/admin')}
      className="fixed bottom-20 right-5 z-50 flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all hover:scale-105"
      style={{
        background: 'rgba(0,205,184,0.1)',
        border: '1px solid rgba(0,205,184,0.3)',
        color: '#00CDB8',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 20px rgba(0,205,184,0.15)'
      }}
    >
      <span>⚙</span>
      <span>Admin Mode</span>
      <span style={{ color: 'rgba(0,205,184,0.7)' }}>·</span>
      <span className="hover:underline">Manage →</span>
    </button>
  );
};

export default AdminModeChip;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view your profile');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUser(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else {
        setError('Failed to fetch profile');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <p style={{ textAlign: 'center', color: '#64748B' }}>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center' }}>
        <p style={{ color: '#DC2626', marginBottom: '1rem' }}>{error}</p>
        <button onClick={handleLogin} className="btn btn-primary">
          Go to Login
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-wrapper">
        <p style={{ textAlign: 'center', color: '#64748B' }}>User not found</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2.5rem 2rem' }}>
      {/* Top Card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: '#EFF6FF',
          color: '#2563EB',
          fontSize: '24px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>{user.name}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge badge-blue">{user.role}</span>
            <span style={{ fontSize: '14px', color: '#64748B' }}>{user.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: '13px', color: '#64748B' }}>Email</span>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#0F172A' }}>{user.email}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: '13px', color: '#64748B' }}>Role</span>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#0F172A', textTransform: 'capitalize' }}>{user.role}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: '13px', color: '#64748B' }}>XP Points</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#2563EB' }}>{user.xp}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#64748B' }}>Member Since</span>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#0F172A' }}>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

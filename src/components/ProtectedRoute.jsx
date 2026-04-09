import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-bg">
    <div 
      className="rounded-full animate-spin"
      style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(0,205,184,0.2)',
        borderTopColor: '#00CDB8'
      }}
    />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user?.loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

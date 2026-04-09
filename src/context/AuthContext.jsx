import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Read user from localStorage on mount
    const storedUser = localStorage.getItem('clubverseUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.loggedIn) {
          setUser(parsedUser);
        }
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        localStorage.removeItem('clubverseUser');
      }
    }
    setLoading(false);
  }, []);

  // Login with hardcoded credentials
  const login = (email, password) => {
    const hardcodedUsers = {
      'admin@clubverse.in': {
        password: 'Admin@123',
        userData: { name: 'Admin Kaif', email: 'admin@clubverse.in', role: 'admin' }
      },
      'user@clubverse.in': {
        password: 'User@123',
        userData: { name: 'Demo User', email: 'user@clubverse.in', role: 'user' }
      }
    };

    const userEntry = hardcodedUsers[email];
    if (!userEntry || userEntry.password !== password) {
      return { success: false, error: 'Invalid email or password' };
    }

    const userWithLogin = { ...userEntry.userData, loggedIn: true };
    localStorage.setItem('clubverseUser', JSON.stringify(userWithLogin));
    setUser(userWithLogin);
    return { success: true };
  };

  // Direct login with user object (for signup flow)
  const setUserDirect = (userData) => {
    const userWithLogin = { ...userData, loggedIn: true };
    localStorage.setItem('clubverseUser', JSON.stringify(userWithLogin));
    setUser(userWithLogin);
  };

  const logout = () => {
    localStorage.removeItem('clubverseUser');
    setUser(null);
    navigate('/login');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isLoggedIn = () => {
    return !!user?.loggedIn;
  };

  const value = {
    user,
    loading,
    login,
    setUserDirect,
    logout,
    isAdmin,
    isLoggedIn
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

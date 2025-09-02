import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in on app load
    const token = localStorage.getItem('adminToken');
    if (token) {
      // You can add token verification here if needed
      setAdmin({ token });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('adminToken', token);
    setAdmin({ token });
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
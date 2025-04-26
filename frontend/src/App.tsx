import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Goals from './pages/Goals';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

type ThemeType = 'light' | 'dark';

// Protected Route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!user) {
    // Redirect to login but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeType>('light');

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('taskx-theme') as ThemeType;
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.className = savedTheme;
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem('taskx-theme', newTheme);
  };

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout theme={theme} toggleTheme={toggleTheme}>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout theme={theme} toggleTheme={toggleTheme}>
                <Settings theme={theme} toggleTheme={toggleTheme} />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout theme={theme} toggleTheme={toggleTheme}>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/goals" element={
            <ProtectedRoute>
              <Layout theme={theme} toggleTheme={toggleTheme}>
                <Goals />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Redirect to login for any other routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;

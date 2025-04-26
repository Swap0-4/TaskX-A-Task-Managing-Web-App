import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { AuthUser } from '../services/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (tokenId: string) => Promise<boolean>;
  loginWithGithub: (code: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user on initial render
  useEffect(() => {
    const initializeAuth = () => {
      try {
        authService.initAuth();
        const currentUser = authService.getUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Authentication initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const loggedInUser = await authService.login({ email, password });
      
      if (loggedInUser) {
        setUser(loggedInUser);
        return true;
      } else {
        setError('Invalid email or password');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await authService.register({ name, email, password });
      
      if (newUser) {
        setUser(newUser);
        return true;
      } else {
        setError('Registration failed');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (tokenId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const googleUser = await authService.loginWithGoogle(tokenId);
      
      if (googleUser) {
        setUser(googleUser);
        return true;
      } else {
        setError('Google login failed');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGithub = async (code: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const githubUser = await authService.loginWithGithub(code);
      
      if (githubUser) {
        setUser(githubUser);
        return true;
      } else {
        setError('GitHub login failed');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during GitHub login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    loginWithGoogle,
    loginWithGithub,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
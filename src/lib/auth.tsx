import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Initialize state from localStorage
    const auth = localStorage.getItem('isAuthenticated');
    const storedUserId = localStorage.getItem('user-id');
    const storedEmail = localStorage.getItem('userEmail');
    const storedPassword = localStorage.getItem('userPassword');
    return auth === 'true' && !!storedUserId && !!storedEmail && !!storedPassword;
  });

  const [userId, setUserId] = useState<string | null>(() => {
    return localStorage.getItem('user-id');
  });

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated');
      const storedUserId = localStorage.getItem('user-id');
      const storedEmail = localStorage.getItem('userEmail');
      const storedPassword = localStorage.getItem('userPassword');

      if (auth === 'true' && storedUserId && storedEmail && storedPassword) {
        setIsAuthenticated(true);
        setUserId(storedUserId);
      } else {
        setIsAuthenticated(false);
        setUserId(null);
      }
    };

    // Check auth on mount
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // First check if this is a new login attempt
    const storedEmail = localStorage.getItem('userEmail');
    const storedPassword = localStorage.getItem('userPassword');
    const storedUserId = localStorage.getItem('user-id');

    // If credentials match, use the existing user ID
    if (email === storedEmail && password === storedPassword && storedUserId) {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      setUserId(storedUserId);
      return;
    }

    // If no stored credentials exist or they don't match, this is a new user
    if (!storedEmail || !storedPassword || email !== storedEmail || password !== storedPassword) {
      // Store the new credentials
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPassword', password);
      const newUserId = crypto.randomUUID();
      localStorage.setItem('user-id', newUserId);
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      setUserId(newUserId);
      return;
    }

    throw new Error('Invalid credentials');
  };

  const logout = () => {
    // Only remove authentication status, keep user ID and data
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setUserId(null);
  };

  const value = {
    isAuthenticated,
    userId,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
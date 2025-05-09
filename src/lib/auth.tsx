import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Check authentication status on mount and when storage changes
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

    // Listen for storage changes
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedPassword = localStorage.getItem('userPassword');

    if (email === storedEmail && password === storedPassword) {
      // Get the existing user ID or generate a new one if it doesn't exist
      let userID = localStorage.getItem('user-id');
      if (!userID) {
        userID = crypto.randomUUID();
        localStorage.setItem('user-id', userID);
      }

      // Store all auth data
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPassword', password);

      setIsAuthenticated(true);
      setUserId(userID);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    // Clear all auth-related data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPassword');
    // Don't remove user-id to maintain user data persistence

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
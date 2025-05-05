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

  useEffect(() => {
    // Check if user is already logged in
    const auth = localStorage.getItem('isAuthenticated');
    const storedUserId = localStorage.getItem('user-id');
    setIsAuthenticated(auth === 'true');
    setUserId(storedUserId);
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Implement actual authentication logic here
    // For now, we'll just simulate a successful login
    const storedEmail = localStorage.getItem('userEmail');
    const storedPassword = localStorage.getItem('userPassword');

    if (email === storedEmail && password === storedPassword) {
      // Get the existing user ID or generate a new one if it doesn't exist
      let userID = localStorage.getItem('user-id');
      if (!userID) {
        userID = crypto.randomUUID();
        localStorage.setItem('user-id', userID);
      }

      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      setUserId(userID);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    // Only remove the authentication status, keep the user ID
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    // Don't remove the user ID or clear the userId state
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
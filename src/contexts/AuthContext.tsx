import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { loadAppConfig } from '../utils/config';

interface AuthUser {
  id: string;
  userid: number;
  username: string;
  name: string;
  team: string;
  team_id: string;
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. On Mount: Check localStorage for existing session
  useEffect(() => {
    const savedUser = localStorage.getItem('domjudge_auth');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error: unknown) {
        localStorage.removeItem('domjudge_auth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const config = await loadAppConfig();
      const apiBaseUrl = config.apiBaseUrl.replace(/\/+$/, '');
      const authToken = `Basic ${btoa(`${username}:${password}`)}`;

      const response = await fetch(`${apiBaseUrl}/user`, {
        method: 'GET',
        headers: {
          'Authorization': authToken,
          'Accept': 'application/json',
        },
      });

      if (response.status === 401) throw new Error('Invalid credentials');
      if (!response.ok) throw new Error('Server unreachable');

      const userData = await response.json();

      console.log(userData);
      if (!userData.team_id) {
        throw new Error('User not associated with a Team.');
      }

      const newUser: AuthUser = {
        id: userData.id,
        userid: userData.userid,
        username: userData.username,
        name: userData.name,
        team: userData.team,
        team_id: userData.team_id,
        token: authToken,
      };

      // Persistence
      setUser(newUser);
      localStorage.setItem('domjudge_auth', JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('domjudge_auth');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
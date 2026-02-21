import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { login as apiLogin, register as apiRegister, type User } from "@/lib/api";

const TOKEN_KEY = "securebank_token";
const USER_KEY = "securebank_user";

// ------------------------------------------------------------------
// Context type
// ------------------------------------------------------------------
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ------------------------------------------------------------------
// Provider
// ------------------------------------------------------------------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { }
    }
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const u = await apiLogin(username, password);
      setUser(u);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      localStorage.setItem(TOKEN_KEY, u.token);
      return u;
    } catch (e: any) {
      setError(e.message ?? "Login failed");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiRegister(username, password);
    } catch (e: any) {
      setError(e.message ?? "Registration failed");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

// ------------------------------------------------------------------
// Hook
// ------------------------------------------------------------------
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

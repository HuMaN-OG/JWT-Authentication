import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { generateToken, storeToken, getStoredToken, removeToken, getAuthPayload } from "../utils/jwt";
import { authenticate } from "../utils/users";

// ─── Auth Context ─────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);   // decoded payload (userId, role, username…)
  const [token, setToken] = useState(null);   // raw JWT string
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const payload = getAuthPayload();
    if (payload) {
      // oxlint-disable set-state-in-effect
      setUser(payload);
      setToken(getStoredToken());
      // oxlint-enable set-state-in-effect
    }
    setLoading(false);
  }, []);

  /** Login flow: authenticate → generate token → store → update state */
  const login = useCallback((username, password) => {
    const authUser = authenticate(username, password);
    if (!authUser) {
      return { success: false, error: "Invalid username or password." };
    }

    const payload = {
      userId:      authUser.id,
      username:    authUser.username,
      role:        authUser.role,
      displayName: authUser.displayName,
      avatar:      authUser.avatar,
      department:  authUser.department,
      email:       authUser.email,
    };

    const newToken = generateToken(payload);
    storeToken(newToken);
    setToken(newToken);
    setUser(payload);

    return { success: true };
  }, []);

  /** Logout: clear token and state */
  const logout = useCallback(() => {
    removeToken();
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// oxlint-disable-next-line only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

import { createContext, useContext, useState, useCallback } from 'react';

const STORAGE_KEY = 'cm_user';

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  /** Called with the full API response after register/login */
  const login = useCallback((userData) => {
    const saved = {
      id: userData.userId,
      name: userData.name,
      username: userData.username,
      token: userData.token,
      lat: userData.lat ?? null,
      lng: userData.lng ?? null,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    setUser(saved);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const updateLocation = useCallback((lat, lng) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, lat, lng };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateLocation }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("cars_current_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("cars_current_user", JSON.stringify(userData));
    localStorage.setItem("cars_authenticated", "true");
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("cars_current_user");
    localStorage.removeItem("cars_authenticated");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      currentUser: JSON.parse(localStorage.getItem("cars_current_user") || "null"),
      login: () => {},
      logout: () => {},
    };
  }
  return context;
};

export default AuthContext;
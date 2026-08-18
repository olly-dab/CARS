// src/context/AuthContext.jsx

import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  // ==========================================
  // CURRENT USER
  // ==========================================

  const [currentUser, setCurrentUser] =
    useState(() => {
      try {
        const saved =
          localStorage.getItem(
            "cars_current_user"
          );

        return saved
          ? JSON.parse(saved)
          : null;
      } catch (error) {
        console.error(
          "Unable to load current user:",
          error
        );

        return null;
      }
    });


  // ==========================================
  // LOGIN
  // ==========================================

  const login = (userData) => {

    setCurrentUser(userData);

    localStorage.setItem(
      "cars_current_user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "cars_authenticated",
      "true"
    );
  };


  // ==========================================
  // UPDATE CURRENT USER
  // ==========================================

  const updateCurrentUser = (userData) => {

    setCurrentUser(userData);

    localStorage.setItem(
      "cars_current_user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "cars_authenticated",
      "true"
    );
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {

    setCurrentUser(null);

    localStorage.removeItem(
      "cars_current_user"
    );

    localStorage.removeItem(
      "cars_authenticated"
    );
  };


  // ==========================================
  // PROVIDER
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


// ==========================================
// USE AUTH
// ==========================================

export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}


export default AuthContext;
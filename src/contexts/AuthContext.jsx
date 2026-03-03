import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// shape stored in localStorage for users: { [email]: password }
const USERS_KEY = 'authUsers';
const AUTH_KEY = 'isAuthenticated';
const USER_KEY = 'currentUser';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return localStorage.getItem(USER_KEY) || null;
    } catch {
      return null;
    }
  });
  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(isAuthenticated));
    } catch {}
  }, [isAuthenticated]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_KEY, currentUser);
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {}
  }, [users]);

  const register = (email, password) => {
    if (users[email]) {
      return { success: false, message: 'User already exists' };
    }
    setUsers((prev) => ({ ...prev, [email]: password }));
    // auto-login after register
    setCurrentUser(email);
    setIsAuthenticated(true);
    return { success: true };
  };

  const login = (email, password) => {
    if (users[email] && users[email] === password) {
      setCurrentUser(email);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

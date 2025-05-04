// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

export type User = {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
  role: "user" | "moderator" | "admin";
  bio?: string;
  favoriteTeams?: string[];
  points: number;
  badges: string[];
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize from localStorage
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("fannation_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("fannation_token");
  });

  const isAuthenticated = !!user && !!token;

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Backend should return { token, user }
      localStorage.setItem("fannation_token", data.token);
      localStorage.setItem("fannation_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);

      toast.success(`Welcome back, ${data.user.username}!`);
    } catch (err) {
      toast.error((err as Error).message || "Login failed");
      throw err;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Backend returns { token, user }
      localStorage.setItem("fannation_token", data.token);
      localStorage.setItem("fannation_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);

      toast.success("Registration successful! Welcome to FanNation!");
    } catch (err) {
      toast.error((err as Error).message || "Registration failed");
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("fannation_user");
    localStorage.removeItem("fannation_token");
    toast.info("You've been logged out");
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user || !token) throw new Error("Not authenticated");

      // Example: PATCH /api/auth/profile
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const updated = await response.json();
      if (!response.ok) {
        throw new Error(updated.message || "Profile update failed");
      }

      // Updated user returned
      setUser(updated.user);
      localStorage.setItem("fannation_user", JSON.stringify(updated.user));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error((err as Error).message || "Profile update failed");
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

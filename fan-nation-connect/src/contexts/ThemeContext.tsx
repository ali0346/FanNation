
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if user has already set a preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme");
      
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
        return savedTheme;
      }
      
      // Check user system preference
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return systemPreference ? "dark" : "light";
    }
    
    return "light"; // Default fallback
  });

  useEffect(() => {
    // Update localStorage and document class when theme changes
    if (typeof window !== 'undefined') {
      localStorage.setItem("theme", theme);
      
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

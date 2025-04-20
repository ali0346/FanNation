"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/api"

// Create Context
const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  register: () => {},
  logout: () => {},
  isAuthenticated: false,
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state from localStorage on app load
  useEffect(() => {
    const loadUser = () => {
      const storedUser = authService.getCurrentUser()
      if (storedUser) {
        setUser(storedUser)
      }
      setLoading(false)
    }

    loadUser()
  }, [])

  // Login method
  const login = async (username, password) => {
    try {
      const userData = await authService.login(username, password)
      setUser({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        roles: userData.roles,
      })
      return { success: true, data: userData }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: error.message || "Login failed" }
    }
  }

  // Register method
  const register = async (username, email, password) => {
    try {
      await authService.register(username, email, password)
      return { success: true }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, error: error.message || "Registration failed" }
    }
  }

  // Logout method
  const logout = () => {
    authService.logout()
    setUser(null)
    router.push("/login")
  }

  // Context value
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext)

export default AuthContext

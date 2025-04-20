"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { authService } from "@/services/api"
import { useRouter } from "next/navigation"

// Create Auth Context
const AuthContext = createContext(null)

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = authService.getCurrentUser()
    if (storedUser) {
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  // Login function
  const login = async (username, password) => {
    try {
      const data = await authService.login(username, password)
      setUser({
        id: data.id,
        username: data.username,
        email: data.email,
        roles: data.roles,
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Register function
  const register = async (username, email, password) => {
    try {
      await authService.register(username, email, password)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Logout function
  const logout = () => {
    authService.logout()
    setUser(null)
    router.push("/login")
  }

  // Update user function
  const updateUser = (userData) => {
    setUser((prevUser) => ({ ...prevUser, ...userData }))

    // Update local storage
    const storedUser = authService.getCurrentUser()
    if (storedUser) {
      localStorage.setItem("user", JSON.stringify({ ...storedUser, ...userData }))
    }
  }

  // Check if user has a specific role
  const hasRole = (role) => {
    return user && user.roles && user.roles.includes(role)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext)
}

export default useAuth

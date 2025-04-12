"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  _id: string
  firstName: string
  lastName: string
  email: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // Mock user data
        const token = localStorage.getItem("token")
        if (token) {
          const mockUser = {
            _id: "u1",
            firstName: "Emre",
            lastName: "Demir",
            email: "emre.demir@sirket.com",
          }
          setUser(mockUser)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("token")
        setUser(null)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    // Mock login
    const mockUser = {
      _id: "u1",
      firstName: "Emre",
      lastName: "Demir",
      email: email,
    }

    const mockToken = "mock-jwt-token"
    localStorage.setItem("token", mockToken)
    document.cookie = `token=${mockToken}; path=/; max-age=86400`

    setUser(mockUser)
  }

  const logout = () => {
    localStorage.removeItem("token")
    document.cookie = "token=; path=/; max-age=0"
    setUser(null)
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
  }

  return <AuthContext.Provider value={{ user, login, logout, updateUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

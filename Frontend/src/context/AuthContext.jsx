import React, { createContext, useContext, useState, useEffect } from 'react'
import cookieAuth from '../utils/cookieAuth'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [registeredGames, setRegisteredGames] = useState([])
  const [loading, setLoading] = useState(true)

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const authData = cookieAuth.getAuthData()
      if (!authData) {
        setLoading(false)
        return
      }

      // Set user state from cookie data directly (no server verification)
      setUser({
        id: authData.userId,
        username: authData.userName,
        name: authData.userName,
        role: authData.userRole
      })
      setIsLoggedIn(true)
      setIsAdminLoggedIn(authData.isAdmin || false)

      // Fetch user registrations if student
      if (!authData.isAdmin) {
        await fetchUserRegistrations(authData.userName, authData.token)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      cookieAuth.clearAuthData()
    } finally {
      setLoading(false)
    }
  }

  const fetchUserRegistrations = async (username, token) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://veyg-2k25-backend.onrender.com'
      const response = await fetch(`${API_BASE_URL}/api/game-registrations/my-registrations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const registrations = data.registrations || data.data?.registrations || data.data || []
        setRegisteredGames(Array.isArray(registrations) ? registrations : [])
      }
    } catch (error) {
      console.error('Failed to fetch user registrations:', error)
      setRegisteredGames([])
    }
  }

  const refreshRegistrations = async () => {
    try {
      const authData = cookieAuth.getAuthData()
      if (authData && !authData.isAdmin) {
        await fetchUserRegistrations(authData.userName, authData.token)
      }
    } catch (error) {
      console.error('Failed to refresh registrations:', error)
    }
  }

  const login = async (userData) => {
    setUser(userData)
    setIsLoggedIn(true)
    setIsAdminLoggedIn(userData.isAdmin || false)

    // Store data in cookies for persistence
    cookieAuth.setAuthData({
      token: userData.token,
      userId: userData.id,
      userName: userData.username,
      userRole: userData.role,
      isAdmin: userData.isAdmin || false
    })

    // Fetch user registrations
    if (userData.token) {
      await fetchUserRegistrations(userData.username, userData.token)
    }
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    setIsAdminLoggedIn(false)
    setRegisteredGames([])

    // Clear cookies
    cookieAuth.clearAuthData()
  }

  const registerGame = async (gameId, registrationDetails) => {
    try {
      const authData = cookieAuth.getAuthData()

      if (!authData) {
        throw new Error('Please log in to register for games.')
      }

      const registrationData = {
        userId: authData.userName,
        username: authData.userName,
        gameId: gameId,
        gameName: registrationDetails.gameName || "Game",
        gameDay: registrationDetails.gameDay || 1,
        registrationType: registrationDetails.registrationType,
        teamName: registrationDetails.teamName,
        teamLeader: registrationDetails.teamLeader,
        teamMembers: registrationDetails.teamMembers || [],
        totalAmount: registrationDetails.totalAmount || 0
      }

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://veyg-2k25-backend.onrender.com'
      const response = await fetch(`${API_BASE_URL}/api/game-registrations/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.token}`
        },
        body: JSON.stringify(registrationData)
      })

      if (response.ok) {
        const data = await response.json()

        // Update local state
        const newRegistration = {
          ...data.registration,
          gameId,
          userId: username,
          paymentStatus: 'pending'
        }
        setRegisteredGames(prev => [...prev, newRegistration])

        return { success: true, message: 'Game registration successful!' }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registration failed!')
      }
    } catch (error) {
      console.error('Game registration error:', error)
      throw error
    }
  }

  const value = {
    user,
    isLoggedIn,
    isAdminLoggedIn,
    registeredGames,
    loading,
    login,
    logout,
    registerGame,
    refreshRegistrations
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

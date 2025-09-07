import React, { createContext, useContext, useState, useEffect } from 'react'
import cookieAuth from '../utils/cookieAuth'
import websocketService from '../services/websocket'

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

  // Setup WebSocket connection and listeners
  useEffect(() => {
    const setupWebSocket = () => {
      if (isLoggedIn) {
        websocketService.connect()

        // Listen for payment status updates
        const handlePaymentStatusUpdate = (data) => {
          console.log('📡 Payment status update received:', data)

          // Update registeredGames state with new status
          setRegisteredGames(prev =>
            prev.map(reg =>
              reg.registrationId === data.registrationId || reg._id === data.registrationId
                ? { ...reg, paymentStatus: data.paymentStatus, approvalStatus: data.approvalStatus }
                : reg
            )
          )

          // Update localStorage
          const updatedRegistrations = registeredGames.map(reg =>
            reg.registrationId === data.registrationId || reg._id === data.registrationId
              ? { ...reg, paymentStatus: data.paymentStatus, approvalStatus: data.approvalStatus }
              : reg
          )
          localStorage.setItem('registeredGames', JSON.stringify(updatedRegistrations))

          // Show notification to user
          if (data.approvalStatus === 'approved') {
            console.log(`🎉 Payment approved for ${data.gameName}!`)
          }
        }

        websocketService.on('paymentStatusUpdate', handlePaymentStatusUpdate)

        return () => {
          websocketService.off('paymentStatusUpdate', handlePaymentStatusUpdate)
        }
      } else {
        websocketService.disconnect()
      }
    }

    setupWebSocket()

    return () => {
      websocketService.disconnect()
    }
  }, [isLoggedIn, registeredGames])

  const checkAuthStatus = async () => {
    try {
      const authData = cookieAuth.getAuthData()
      if (!authData || !authData.token) {
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

      // Load cached registrations from localStorage first
      const cachedRegistrations = localStorage.getItem('registeredGames')
      if (cachedRegistrations) {
        try {
          setRegisteredGames(JSON.parse(cachedRegistrations))
        } catch (parseError) {
          console.warn('Failed to parse cached registrations:', parseError)
          localStorage.removeItem('registeredGames')
        }
      }

      // Fetch user registrations if student (with error handling)
      if (!authData.isAdmin) {
        try {
          await fetchUserRegistrations(authData.userName, authData.token)
        } catch (regError) {
          console.warn('Failed to fetch registrations, but keeping user logged in:', regError)
          // Don't logout user if registration fetch fails
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      // Don't clear auth data on error - keep user logged in
    } finally {
      setLoading(false)
    }
  }

  const fetchUserRegistrations = async (username, token) => {
    try {
      //const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://veyg-2k25-backend.onrender.com'
      const response = await fetch(`https://veyg-2k25-backend.onrender.com/api/game-registrations/my-registrations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const registrations = data.registrations || data.data?.registrations || data.data || []
        const processedRegistrations = Array.isArray(registrations) ? registrations : []

        // Store in both state and localStorage for persistence
        setRegisteredGames(processedRegistrations)
        localStorage.setItem('registeredGames', JSON.stringify(processedRegistrations))
      } else {
        // Try to load from localStorage if API fails
        const cachedRegistrations = localStorage.getItem('registeredGames')
        if (cachedRegistrations) {
          setRegisteredGames(JSON.parse(cachedRegistrations))
        }
      }
    } catch (error) {
      // Try to load from localStorage if network error
      const cachedRegistrations = localStorage.getItem('registeredGames')
      if (cachedRegistrations) {
        setRegisteredGames(JSON.parse(cachedRegistrations))
      }
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

    // Clear cookies and localStorage
    cookieAuth.clearAuthData()
    localStorage.removeItem('registeredGames')

    // Disconnect WebSocket
    websocketService.disconnect()
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

      //const API_BASE_URL = 'https://veyg-2k25-backend.onrender.com'
      const response = await fetch(`https://veyg-2k25-backend.onrender.com/api/game-registrations/my-registrations`, {
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
          userId: authData.userName,
          paymentStatus: 'pending'
        }
        const updatedRegistrations = [...registeredGames, newRegistration]
        setRegisteredGames(updatedRegistrations)

        // Persist to localStorage for session persistence
        localStorage.setItem('registeredGames', JSON.stringify(updatedRegistrations))

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

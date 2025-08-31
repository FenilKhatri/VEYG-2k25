import React, { useState, useEffect, useCallback } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "./styles/animations.css"
import "./styles/global.css"
import { Container } from "react-bootstrap"

// Import components
import AppNavbar from "./components/Navbar"
import Footer from "./components/Footer"
import NotFound from "./components/NotFound"
import Home from "./pages/Home"
import AboutUs from "./pages/AboutUs"
import ContactUs from "./pages/ContactUs"
import Guidelines from "./pages/GuidelinesNew"
import GamePageNew from "./pages/GamePageNew"
import RegisteredGames from "./pages/RegisteredGames"
import AdminPage from "./pages/AdminDashboardNew"
import StudentLogin from "./components/auth/StudentLogin"
import StudentSignup from "./components/auth/StudentSignup"
import AdminLogin from "./components/auth/AdminLogin"
import AdminSignup from "./components/auth/AdminSignup"
import Profile from "./pages/Profile"
import AdminProfile from "./pages/AdminProfile"
import ToastMessage from "./components/Toast"
import { AuthProvider } from "./context/AuthContext"
import cookieAuth from "./utils/cookieAuth"
import apiService from "./services/api"
import ScrollToTop from "./components/ScrollToTop"
import ProtectedRoute from "./components/auth/ProtectedRoute"

const App = () => {
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  // Function to update authentication state
  const updateAuthState = useCallback((authData) => {
    if (authData) {
      setUser({
        id: authData.userId,
        username: authData.userName,
        name: authData.userName,
        role: authData.userRole
      })
      setIsLoggedIn(true)
      setIsAdminLoggedIn(authData.isAdmin)
    } else {
      setUser(null)
      setIsLoggedIn(false)
      setIsAdminLoggedIn(false)
    }
  }, [])

  const showToast = useCallback((message, type = "success") => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000)
  }, [])

  const testBackendConnection = useCallback(async () => {
    try {
      const response = await apiService.healthCheck()
      console.log('Backend connection successful:', response)
    } catch (error) {
      console.error('Backend connection failed:', error)
      showToast('Backend server connection failed. Some features may not work properly.', 'warning')
    }
  }, [showToast])

  const checkAuthenticationStatus = useCallback(async () => {
    try {
      const authData = cookieAuth.getAuthData()

      // Use existing auth data immediately to prevent logout
      updateAuthState(authData)

      // Verify token with server in background
      try {
        const userData = await apiService.verifyToken()
        if (userData) {
          const userName = userData.name || userData.username || authData.userName
          const updatedAuthData = {
            token: authData.token,
            userId: userData.id || userData._id,
            userName: userName,
            userRole: userData.role,
            isAdmin: userData.isAdmin || userData.role === 'admin'
          }
          updateAuthState(updatedAuthData)

          // Update cookie with fresh user data
          cookieAuth.setAuthData(updatedAuthData)
        }
      } catch (verifyError) {
        console.warn('Token verification failed, but keeping user logged in:', verifyError)
        // Keep user logged in even if verification fails (network issues, etc.)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      // Only clear auth if there's a critical error
      const authData = cookieAuth.getAuthData()
      if (authData) {
        updateAuthState(authData) // Keep user logged in
      }
    }
  }, [updateAuthState])

  useEffect(() => {
    // Check authentication status on app load using API verification
    checkAuthenticationStatus()
    // Test backend connection
    testBackendConnection()
  }, [checkAuthenticationStatus, testBackendConnection])



  const handleLogout = () => {
    cookieAuth.clearAuthData()
    setUser(null)
    setIsLoggedIn(false)
    setIsAdminLoggedIn(false)
    showToast("Logged out successfully!", "info")
  }

  return (
    <AuthProvider value={{ user, isLoggedIn, isAdminLoggedIn, updateAuthState }}>
      <Router>
        <ScrollToTop />
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 75%, #1a1a2e 100%)',
          margin: 0,
          padding: 0
        }}>
          <AppNavbar isLoggedIn={isLoggedIn} isAdminLoggedIn={isAdminLoggedIn} userId={user?.name || user?.username} onLogout={handleLogout} />
          <Container fluid className="px-0">
            <Routes>
              {/* Home Route */}
              <Route
                path="/"
                element={<Home showToast={showToast} user={user} isLoggedIn={isLoggedIn} />}
              />

              {/* Authentication Routes */}
              <Route path="/student-login" element={<StudentLogin showToast={showToast} updateAuthState={updateAuthState} />} />
              <Route path="/student-signup" element={<StudentSignup showToast={showToast} />} />
              <Route path="/admin-login" element={<AdminLogin showToast={showToast} updateAuthState={updateAuthState} />} />
              <Route path="/admin-signup" element={<AdminSignup showToast={showToast} updateAuthState={updateAuthState} />} />

              {/* Game Routes - Available to all users */}
              <Route
                path="/game/:id"
                element={
                  <GamePageNew
                    isLoggedIn={isLoggedIn}
                    user={user}
                    showToast={showToast}
                  />
                }
              />

              {/* Protected Student Routes */}
              <Route
                path="/registered-games"
                element={
                  <ProtectedRoute requireStudent={true}>
                    <RegisteredGames user={user} showToast={showToast} />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPage showToast={showToast} />
                  </ProtectedRoute>
                }
              />

              {/* Profile Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute requireStudent={true}>
                    <Profile user={user} showToast={showToast} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-profile"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminProfile user={user} showToast={showToast} />
                  </ProtectedRoute>
                }
              />

              {/* Public Pages */}
              <Route path="/about" element={<AboutUs showToast={showToast} />} />
              <Route path="/guidelines" element={<Guidelines />} />
              <Route path="/contact" element={<ContactUs showToast={showToast} />} />

              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
          <Footer />
          <ToastMessage
            show={toast.show}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App;
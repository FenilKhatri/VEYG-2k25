import React from 'react'
import { Navigate } from 'react-router-dom'
import cookieAuth from '../../utils/cookieAuth'

const ProtectedRoute = ({ children, requireAdmin = false, requireStudent = false }) => {
  const authData = cookieAuth.getAuthData()
  
  // Check if user is authenticated
  if (!authData) {
    return <Navigate to="/student-login" replace />
  }

  // Check if admin access is required
  if (requireAdmin && (!authData.isAdmin || authData.userRole !== 'admin')) {
    return <Navigate to="/admin-login" replace />
  }

  // Check if student access is required (block admins from student-only routes)
  if (requireStudent && authData.isAdmin && authData.userRole === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default ProtectedRoute

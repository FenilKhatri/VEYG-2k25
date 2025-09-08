import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { Shield, User, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import cookieAuth from '../../utils/cookieAuth'
import apiService from '../../services/api'

const AdminLogin = ({ showToast, updateAuthState }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      // Ensure email is trimmed and lowercase
      const loginData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      }
      
      const data = await apiService.adminLogin(loginData)

      if (data.success) {
        // Store auth data in cookies
        const authData = {
          token: data.data.token,
          userId: data.data.admin.id,
          userName: data.data.admin.name,
          userRole: data.data.admin.role,
          isAdmin: data.data.admin.isAdmin
        }
        cookieAuth.setAuthData(authData)

        // Update app state immediately
        if (updateAuthState) {
          updateAuthState(authData)
        }

        showToast('Admin login successful!', 'success')
        navigate('/admin')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(error.message || 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #0a0e1a 0%, #1a1f2e 50%, #0f1419 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Neural Network Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        backgroundImage: `radial-gradient(circle at 20% 80%, #00d4ff 0%, transparent 50%), 
                         radial-gradient(circle at 80% 20%, #007bff 0%, transparent 50%)`,
        backgroundSize: '400px 400px'
      }}></div>

      <Container className="py-5 position-relative d-flex align-items-center justify-content-center" style={{ zIndex: 2, minHeight: '100vh' }}>
        <Row className="justify-content-center align-items-center w-100">
          <Col md={8} lg={6} xl={5}>
            <div>
              {/* Header Section */}
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #00d4ff, #007bff)',
                  borderRadius: '50%',
                  boxShadow: '0 0 30px rgba(0, 212, 255, 0.5)'
                }}>
                  <Shield size={40} color="white" />
                </div>
                <h2 style={{
                  color: '#00d4ff',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem'
                }}>Admin Access</h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Secure login for VEYG 2K25 administrators
                </p>
              </div>

              {/* Login Card */}
              <Card style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 212, 255, 0.1)'
              }}>
                <Card.Body className="p-5">
                  {error && (
                    <Alert
                      variant="danger"
                      className="mb-4"
                      style={{
                        background: 'rgba(220, 53, 69, 0.1)',
                        border: '1px solid rgba(220, 53, 69, 0.3)',
                        color: '#ff6b6b'
                      }}
                    >
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <Form.Group className="mb-4">
                      <Form.Label style={{ color: '#00d4ff', fontWeight: '500' }}>
                        <User size={18} className="me-2" />
                        Admin Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your admin email"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '2px solid rgba(0, 212, 255, 0.3)',
                          borderRadius: '12px',
                          color: 'white',
                          padding: '12px 20px',
                          fontSize: '16px'
                        }}
                        className="custom-input"
                      />
                    </Form.Group>

                    {/* Password Field */}
                    <Form.Group className="mb-4">
                      <Form.Label style={{ color: '#00d4ff', fontWeight: '500' }}>
                        <Lock size={18} className="me-2" />
                        Password
                      </Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '2px solid rgba(0, 212, 255, 0.3)',
                            borderRadius: '12px',
                            color: 'white',
                            padding: '12px 50px 12px 20px',
                            fontSize: '16px'
                          }}
                          className="custom-input"
                        />
                        <Button
                          variant="link"
                          className="position-absolute"
                          style={{
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            border: 'none',
                            background: 'none',
                            color: 'rgba(255, 255, 255, 0.6)'
                          }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </Button>
                      </div>
                    </Form.Group>

                    {/* Login Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-100 mb-3"
                      disabled={loading}
                      style={{
                        background: 'linear-gradient(135deg, #00d4ff, #007bff)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '14px',
                        fontSize: '16px',
                        fontWeight: '600',
                        boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Authenticating...
                        </>
                      ) : (
                        <>
                          <LogIn size={20} className="me-2" />
                          Admin Login
                        </>
                      )}
                    </Button>
                    
                    <div className="text-center mb-4">
                      <Link 
                        to="/forgot-password" 
                        className="text-decoration-none"
                        style={{ 
                          color: '#93c5fd',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                      >
                        Forgot your password?
                      </Link>
                    </div>

                    {/* Signup Link */}
                    <div className="text-center">
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Don't have an admin account?{' '}
                      </span>
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={() => navigate('/admin-signup')}
                        style={{
                          color: '#00d4ff',
                          textDecoration: 'none',
                          fontWeight: '500'
                        }}
                      >
                        Register here
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AdminLogin

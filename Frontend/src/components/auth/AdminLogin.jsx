import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { Shield, User, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import cookieAuth from '../../utils/cookieAuth'
import apiService from '../../services/api'
import useScrollAnimation from '../../hooks/useScrollAnimation'

const AdminLogin = ({ showToast, updateAuthState }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const formRef = useScrollAnimation()

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

    try {
      const data = await apiService.adminLogin(formData)

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
      background: 'linear-gradient(135deg, #2d1b69 0%, #1a0033 25%, #0f0f23 50%, #1a1a2e 75%, #16213e 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.08,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ctext x='10' y='30' font-family='Arial' font-size='14' fill='%23ff6b35'%3E&lt;admin&gt;%3C/text%3E%3Ctext x='10' y='50' font-family='Arial' font-size='14' fill='%23ff6b35'%3E&lt;auth&gt;%3C/text%3E%3Ctext x='10' y='70' font-family='Arial' font-size='14' fill='%23ff6b35'%3E&lt;secure&gt;%3C/text%3E%3Ctext x='10' y='90' font-family='Arial' font-size='14' fill='%23ff6b35'%3E&lt;/admin&gt;%3C/text%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '150px 150px'
      }}></div>

      <Container className="py-5 position-relative" style={{ zIndex: 2 }}>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={8} lg={6} xl={5}>
            <div ref={formRef} className="scroll-animate">
              {/* Header Section */}
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                  borderRadius: '50%',
                  boxShadow: '0 0 30px rgba(255, 107, 53, 0.5)'
                }}>
                  <Shield size={40} color="white" />
                </div>
                <h2 style={{
                  color: '#ff6b35',
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
                border: '1px solid rgba(255, 107, 53, 0.2)',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
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
                    {/* Name Field */}
                    <Form.Group className="mb-4">
                      <Form.Label style={{ color: '#ff6b35', fontWeight: '500' }}>
                        <User size={18} className="me-2" />
                        Admin Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your admin name"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '2px solid rgba(255, 107, 53, 0.3)',
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
                      <Form.Label style={{ color: '#ff6b35', fontWeight: '500' }}>
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
                            border: '2px solid rgba(255, 107, 53, 0.3)',
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
                      className="w-100 mb-4"
                      disabled={loading}
                      style={{
                        background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '14px',
                        fontSize: '16px',
                        fontWeight: '600',
                        boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
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
                          color: '#ff6b35',
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

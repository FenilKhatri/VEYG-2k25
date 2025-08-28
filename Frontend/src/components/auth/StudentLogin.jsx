import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { User, Lock, Eye, EyeOff, Zap } from 'lucide-react'
import cookieAuth from '../../utils/cookieAuth'
import apiService from '../../services/api'
import useScrollAnimation from '../../hooks/useScrollAnimation'

const StudentLogin = ({ showToast, updateAuthState }) => {
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
      const data = await apiService.studentLogin(formData)

      if (data.success) {
        // Store auth data in cookies
        const authData = {
          token: data.data.token,
          userId: data.data.student.id,
          userName: data.data.student.name,
          userRole: data.data.student.role,
          isAdmin: data.data.student.isAdmin
        }
        cookieAuth.setAuthData(authData)

        // Update app state immediately
        if (updateAuthState) {
          updateAuthState(authData)
        }

        showToast('Student login successful!', 'success')
        navigate('/')
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
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Geometric Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        backgroundImage: `radial-gradient(circle at 25% 25%, #00d4ff 0%, transparent 50%), 
                         radial-gradient(circle at 75% 75%, #007bff 0%, transparent 50%)`,
        backgroundSize: '400px 400px'
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
                  background: 'linear-gradient(135deg, #00d4ff, #007bff)',
                  borderRadius: '50%',
                  boxShadow: '0 0 30px rgba(0, 212, 255, 0.5)'
                }}>
                  <User size={40} color="white" />
                </div>
                <h2 style={{
                  color: '#00d4ff',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem'
                }}>Student Login</h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Access your VEYG 2K25 student dashboard
                </p>
              </div>

              {/* Login Card */}
              <Card style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
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
                      <Form.Label style={{ color: '#00d4ff', fontWeight: '500' }}>
                        <User size={18} className="me-2" />
                        Student Name
                      </Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Enter your registered name"
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
                      </div>
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
                      className="w-100 mb-4"
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
                          Signing In...
                        </>
                      ) : (
                        <>
                          <Zap size={20} className="me-2" />
                          Sign In
                        </>
                      )}
                    </Button>

                    {/* Register Link */}
                    <div className="text-center">
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Don't have a student account?{' '}
                      </span>
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={() => navigate('/student-signup')}
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

      <style>{`
        .custom-input:focus {
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: #00d4ff !important;
          box-shadow: 0 0 0 0.2rem rgba(0, 212, 255, 0.25) !important;
          color: white !important;
        }
        .custom-input::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
      `}</style>
    </div>
  )
}

export default StudentLogin

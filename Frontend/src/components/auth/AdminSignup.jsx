import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { Shield, User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, Key } from 'lucide-react'
import useScrollAnimation from '../../hooks/useScrollAnimation'

const AdminSignup = ({ showToast }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    secretKey: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSecretKey, setShowSecretKey] = useState(false)
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

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.secretKey !== 'veyg_039') {
      setError('Invalid admin secret key')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        showToast('Admin registration successful! Please login to continue.', 'success')
        navigate('/admin-login')
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('Network error. Please try again.')
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
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ctext x='10' y='30' font-family='Arial' font-size='14' fill='%23ff6b35'%3E&lt;admin&gt;%3C/text%3E%3Ctext x='10' y='50' font-family='Arial' font-size='14' fill='%23ff6b35'%3E&lt;register&gt;%3C/text%3E%3Ctext x='10' y='70' font-family='Arial' font-size='14' fill='%23ff6b35'%3E&lt;secure&gt;%3C/text%3E%3Ctext x='10' y='90' font-family='Arial' font-size='14' fill='%23ff6b35'%3E&lt;/admin&gt;%3C/text%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '150px 150px'
      }}></div>

      <Container className="py-5 position-relative" style={{ zIndex: 2 }}>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={10} lg={8} xl={6}>
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
                }}>Admin Registration</h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Create administrator account for VEYG 2K25
                </p>
              </div>

              {/* Registration Card */}
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
                    <Row>
                      {/* Name Field */}
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ color: '#ff6b35', fontWeight: '500' }}>
                            <User size={18} className="me-2" />
                            Full Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
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
                      </Col>

                      {/* Contact Number Field */}
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ color: '#ff6b35', fontWeight: '500' }}>
                            <Phone size={18} className="me-2" />
                            Contact Number
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            required
                            placeholder="10-digit mobile number"
                            pattern="[0-9]{10}"
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
                      </Col>
                    </Row>

                    {/* Email Field */}
                    <Form.Group className="mb-4">
                      <Form.Label style={{ color: '#ff6b35', fontWeight: '500' }}>
                        <Mail size={18} className="me-2" />
                        Email Address
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email address"
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

                    <Row>
                      {/* Password Field */}
                      <Col md={6}>
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
                              placeholder="Min 6 characters"
                              minLength="6"
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
                      </Col>

                      {/* Confirm Password Field */}
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ color: '#ff6b35', fontWeight: '500' }}>
                            <Lock size={18} className="me-2" />
                            Confirm Password
                          </Form.Label>
                          <div className="position-relative">
                            <Form.Control
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              required
                              placeholder="Confirm your password"
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
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </Button>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Secret Key Field */}
                    <Form.Group className="mb-4">
                      <Form.Label style={{ color: '#ff6b35', fontWeight: '500' }}>
                        <Key size={18} className="me-2" />
                        Admin Secret Key
                      </Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type={showSecretKey ? "text" : "password"}
                          name="secretKey"
                          value={formData.secretKey}
                          onChange={handleChange}
                          required
                          placeholder="Enter admin secret key"
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
                          onClick={() => setShowSecretKey(!showSecretKey)}
                        >
                          {showSecretKey ? <EyeOff size={20} /> : <Eye size={20} />}
                        </Button>
                      </div>
                      <small style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        Contact system administrator for the secret key
                      </small>
                    </Form.Group>

                    {/* Register Button */}
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
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <UserPlus size={20} className="me-2" />
                          Create Admin Account
                        </>
                      )}
                    </Button>

                    {/* Login Link */}
                    <div className="text-center">
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Already have an admin account?{' '}
                      </span>
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={() => navigate('/admin-login')}
                        style={{
                          color: '#ff6b35',
                          textDecoration: 'none',
                          fontWeight: '500'
                        }}
                      >
                        Login here
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

export default AdminSignup

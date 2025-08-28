import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, School, Users } from 'lucide-react'
import { collegesInGujarat, genders } from '../../data/constant'
import useScrollAnimation from '../../hooks/useScrollAnimation'
import apiService from '../../services/api'

const StudentSignup = ({ showToast }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    collegeName: '',
    gender: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

    try {
      const data = await apiService.studentRegister(formData)

      if (data.success) {
        showToast('Student registration successful! Please login to continue.', 'success')
        navigate('/student-login')
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
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
          <Col md={10} lg={8} xl={6}>
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
                  <UserPlus size={40} color="white" />
                </div>
                <h2 style={{
                  color: '#00d4ff',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem'
                }}>Student Registration</h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Join VEYG 2K25 Technical Competition Platform
                </p>
              </div>

              {/* Registration Card */}
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
                    <Row>
                      {/* Name Field */}
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ color: '#00d4ff', fontWeight: '500' }}>
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
                              border: '2px solid rgba(0, 212, 255, 0.3)',
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
                          <Form.Label style={{ color: '#00d4ff', fontWeight: '500' }}>
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
                              border: '2px solid rgba(0, 212, 255, 0.3)',
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
                      <Form.Label style={{ color: '#00d4ff', fontWeight: '500' }}>
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
                          border: '2px solid rgba(0, 212, 255, 0.3)',
                          borderRadius: '12px',
                          color: 'white',
                          padding: '12px 20px',
                          fontSize: '16px'
                        }}
                        className="custom-input"
                      />
                    </Form.Group>

                    <Row>
                      {/* College Field */}
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ color: '#00d4ff', fontWeight: '500' }}>
                            <School size={18} className="me-2" />
                            College Name
                          </Form.Label>
                          <Form.Select
                            name="collegeName"
                            value={formData.collegeName}
                            onChange={handleChange}
                            required
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              border: '2px solid rgba(0, 212, 255, 0.3)',
                              borderRadius: '12px',
                              color: 'white',
                              padding: '12px 20px',
                              fontSize: '16px'
                            }}
                            className="custom-input"
                          >
                            <option value="" style={{ background: '#1a1f2e', color: 'white' }}>Select your college</option>
                            {collegesInGujarat.map((college, idx) => (
                              <option key={idx} value={college} style={{ background: '#1a1f2e', color: 'white' }}>{college}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      {/* Gender Field */}
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ color: '#00d4ff', fontWeight: '500' }}>
                            <Users size={18} className="me-2" />
                            Gender
                          </Form.Label>
                          <Form.Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              border: '2px solid rgba(0, 212, 255, 0.3)',
                              borderRadius: '12px',
                              color: 'white',
                              padding: '12px 20px',
                              fontSize: '16px'
                            }}
                            className="custom-input"
                          >
                            <option value="" style={{ background: '#1a1f2e', color: 'white' }}>Select gender</option>
                            {genders.map((gender, idx) => (
                              <option key={idx} value={gender} style={{ background: '#1a1f2e', color: 'white' }}>{gender}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      {/* Password Field */}
                      <Col md={6}>
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
                              placeholder="Min 6 characters"
                              minLength="6"
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
                      </Col>

                      {/* Confirm Password Field */}
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ color: '#00d4ff', fontWeight: '500' }}>
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
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </Button>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Register Button */}
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
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <UserPlus size={20} className="me-2" />
                          Create Student Account
                        </>
                      )}
                    </Button>

                    {/* Login Link */}
                    <div className="text-center">
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Already have a student account?{' '}
                      </span>
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={() => navigate('/student-login')}
                        style={{
                          color: '#00d4ff',
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

export default StudentSignup

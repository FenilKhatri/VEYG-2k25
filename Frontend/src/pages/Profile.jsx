import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { User, Mail, Phone, Edit3, Save, X } from 'lucide-react'
import PageHeroSection from '../components/HeroSection/PageHeroSection'
import apiService from '../services/api'

const Profile = ({ user, showToast }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    role: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await apiService.getUserProfile()
      if (response.success && response.data) {
        setProfileData(response.data)
        setError('')
      } else {
        throw new Error(response.message || 'Failed to fetch profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError(error.message || 'Failed to load profile data')
      showToast(error.message || 'Failed to load profile data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      // Students can only update their name
      const updateData = {
        name: profileData.name
      }

      const response = await apiService.updateUserProfile(updateData)

      if (response.success) {
        // Refetch profile data to ensure persistence
        await fetchProfile()
        setIsEditing(false)
        showToast('Profile updated successfully!', 'success')
      } else {
        throw new Error(response.message || 'Update failed')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      showToast(error.message || 'Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    fetchProfile() // Reset to original data
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #0a0e1a 0%, #1a1f2e 50%, #0f1419 100%)',
        color: '#00d4ff'
      }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  return (
    <div style={{
      background: 'linear-gradient(145deg, #0a0e1a 0%, #1a1f2e 50%, #0f1419 100%)',
      minHeight: '100vh',
      color: '#f1f5f9'
    }}>
      <PageHeroSection
        title="My Profile"
        subtitle="🎓 Student Profile • VEYG 2K25"
        icon={User}
        description="Manage your personal information and account settings"
      />

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            <Card className="border-0 shadow-lg" style={{ background: '#1e293b' }}>
              <Card.Header
                className="d-flex justify-content-between align-items-center"
                style={{ background: '#334155', border: 'none' }}
              >
                <h4 className="mb-0" style={{ color: '#f1f5f9' }}>
                  <User size={24} className="me-2" />
                  Profile Information
                </h4>
                {!isEditing ? (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    style={{
                      borderColor: '#00d4ff',
                      color: '#00d4ff'
                    }}
                  >
                    <Edit3 size={16} className="me-1" />
                    Edit
                  </Button>
                ) : (
                  <div className="d-flex gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      <Save size={16} className="me-1" />
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      <X size={16} className="me-1" />
                      Cancel
                    </Button>
                  </div>
                )}
              </Card.Header>

              <Card.Body className="p-4">
                <Row>
                  <Col md={6} className="mb-4">
                    <Form.Group>
                      <Form.Label style={{ color: '#94a3b8', fontWeight: '500' }}>
                        <User size={16} className="me-2" />
                        Full Name
                      </Form.Label>
                      {isEditing ? (
                        <Form.Control
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleInputChange}
                          style={{
                            background: '#334155',
                            border: '1px solid #475569',
                            color: '#f1f5f9'
                          }}
                        />
                      ) : (
                        <div
                          className="form-control-plaintext"
                          style={{
                            color: '#f1f5f9',
                            background: '#334155',
                            border: '1px solid #475569',
                            borderRadius: '6px',
                            padding: '8px 12px'
                          }}
                        >
                          {profileData.name || 'Not provided'}
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-4">
                    <Form.Group>
                      <Form.Label style={{ color: '#94a3b8', fontWeight: '500' }}>
                        <Mail size={16} className="me-2" />
                        Email Address
                      </Form.Label>
                      <div
                        className="form-control-plaintext"
                        style={{
                          color: '#f1f5f9',
                          background: '#2d3748',
                          border: '1px solid #4a5568',
                          borderRadius: '6px',
                          padding: '8px 12px'
                        }}
                      >
                        {profileData.email || 'Not provided'}
                        <small className="ms-2 text-muted">(Read-only)</small>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-4">
                    <Form.Group>
                      <Form.Label style={{ color: '#94a3b8', fontWeight: '500' }}>
                        <Phone size={16} className="me-2" />
                        Contact Number
                      </Form.Label>
                      <div
                        className="form-control-plaintext"
                        style={{
                          color: '#f1f5f9',
                          background: '#2d3748',
                          border: '1px solid #4a5568',
                          borderRadius: '6px',
                          padding: '8px 12px'
                        }}
                      >
                        {profileData.contactNumber || 'Not provided'}
                        <small className="ms-2 text-muted">(Read-only)</small>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-4">
                    <Form.Group>
                      <Form.Label style={{ color: '#94a3b8', fontWeight: '500' }}>
                        Role
                      </Form.Label>
                      <div
                        className="form-control-plaintext d-flex align-items-center"
                        style={{
                          color: '#94a3b8',
                          background: '#2d3748',
                          border: '1px solid #4a5568',
                          borderRadius: '6px',
                          padding: '8px 12px'
                        }}
                      >
                        {profileData.role === 'student' ? 'Student' : profileData.role || 'Not provided'}
                        <small className="ms-2 text-muted">(System assigned)</small>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="mt-4 p-3 rounded" style={{ background: '#334155' }}>
                  <h6 style={{ color: '#00d4ff' }}>Profile Information</h6>
                  <p className="mb-0" style={{ color: '#94a3b8', fontSize: '14px' }}>
                    • You can edit your name, email, and contact number<br />
                    • Role is system assigned and cannot be changed<br />
                    • Make sure to save your changes after editing
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Profile

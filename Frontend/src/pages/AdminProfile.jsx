import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { User, Edit3, Save, X, Shield } from 'lucide-react'
import PageHeroSection from '../components/HeroSection/PageHeroSection'
import cookieAuth from '../utils/cookieAuth'
import apiService from '../services/api'

const AdminProfile = ({ showToast }) => {
      const [adminData, setAdminData] = useState({
            name: '',
            email: '',
            role: 'admin'
      })
      const [isEditing, setIsEditing] = useState(false)
      const [loading, setLoading] = useState(true)
      const [saving, setSaving] = useState(false)
      const [error, setError] = useState('')
      const [editedName, setEditedName] = useState('')

      useEffect(() => {
            fetchAdminProfile()
      }, [])

      const fetchAdminProfile = async () => {
            try {
                  setLoading(true)
                  const authData = cookieAuth.getAuthData()

                  if (!authData || !authData.isAdmin) {
                        setError('Admin authentication required')
                        return
                  }

                  // For now, use the data from cookies since we don't have a specific admin profile API
                  setAdminData({
                        name: authData.userName || 'Admin User',
                        email: 'admin@veyg2k25.com', // Default admin email
                        role: 'Administrator'
                  })
                  setEditedName(authData.userName || 'Admin User')
            } catch (error) {
                  console.error('Error fetching admin profile:', error)
                  setError('Failed to load admin profile')
            } finally {
                  setLoading(false)
            }
      }

      const handleSave = async () => {
            try {
                  setSaving(true)
                  setError('')

                  // Validate name
                  if (!editedName.trim()) {
                        setError('Name cannot be empty')
                        return
                  }

                  // Update local state
                  setAdminData(prev => ({ ...prev, name: editedName.trim() }))

                  // Update auth data in cookies
                  const authData = cookieAuth.getAuthData()
                  if (authData) {
                        authData.userName = editedName.trim()
                        cookieAuth.setAuthData(authData)
                  }

                  showToast('Admin profile updated successfully!', 'success')
                  setIsEditing(false)
            } catch (error) {
                  console.error('Error updating admin profile:', error)
                  setError('Failed to update profile')
            } finally {
                  setSaving(false)
            }
      }

      const handleCancel = () => {
            setEditedName(adminData.name)
            setIsEditing(false)
            setError('')
      }

      if (loading) {
            return (
                  <div style={{
                        background: 'linear-gradient(145deg, #0a0e1a 0%, #1a1f2e 50%, #0f1419 100%)',
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                  }}>
                        <Spinner animation="border" style={{ color: '#ff6b35' }} />
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
                        title="Admin Profile"
                        subtitle="👤 Profile Management • VEYG 2K25"
                        icon={Shield}
                        description="Manage your administrator profile settings"
                  />

                  <Container className="py-5">
                        <Row className="justify-content-center">
                              <Col md={8} lg={6}>
                                    <Card style={{
                                          background: 'rgba(255, 255, 255, 0.05)',
                                          border: '1px solid rgba(255, 107, 53, 0.2)',
                                          borderRadius: '20px',
                                          backdropFilter: 'blur(20px)',
                                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                    }}>
                                          <Card.Header style={{
                                                background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '20px 20px 0 0',
                                                padding: '1.5rem'
                                          }}>
                                                <div className="d-flex align-items-center gap-3">
                                                      <div style={{
                                                            width: '60px',
                                                            height: '60px',
                                                            background: 'rgba(255, 255, 255, 0.2)',
                                                            borderRadius: '50%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                      }}>
                                                            <Shield size={30} />
                                                      </div>
                                                      <div>
                                                            <h4 className="mb-1">Administrator Profile</h4>
                                                            <p className="mb-0 opacity-75">VEYG 2K25 Admin Panel</p>
                                                      </div>
                                                </div>
                                          </Card.Header>

                                          <Card.Body className="p-4">
                                                {error && (
                                                      <Alert variant="danger" className="mb-4" style={{
                                                            background: 'rgba(220, 53, 69, 0.1)',
                                                            border: '1px solid rgba(220, 53, 69, 0.3)',
                                                            color: '#ff6b6b'
                                                      }}>
                                                            {error}
                                                      </Alert>
                                                )}

                                                <div className="mb-4">
                                                      <Form.Group className="mb-4">
                                                            <Form.Label style={{ color: '#ff6b35', fontWeight: '500' }}>
                                                                  <User size={18} className="me-2" />
                                                                  Admin Name
                                                            </Form.Label>
                                                            {isEditing ? (
                                                                  <div className="d-flex gap-2">
                                                                        <Form.Control
                                                                              type="text"
                                                                              value={editedName}
                                                                              onChange={(e) => setEditedName(e.target.value)}
                                                                              placeholder="Enter admin name"
                                                                              style={{
                                                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                                                    border: '2px solid rgba(255, 107, 53, 0.3)',
                                                                                    borderRadius: '12px',
                                                                                    color: 'white',
                                                                                    padding: '12px 20px'
                                                                              }}
                                                                              className="custom-input"
                                                                        />
                                                                        <Button
                                                                              variant="success"
                                                                              onClick={handleSave}
                                                                              disabled={saving}
                                                                              style={{ minWidth: '50px' }}
                                                                        >
                                                                              {saving ? <Spinner animation="border" size="sm" /> : <Save size={16} />}
                                                                        </Button>
                                                                        <Button
                                                                              variant="outline-secondary"
                                                                              onClick={handleCancel}
                                                                              style={{ minWidth: '50px' }}
                                                                        >
                                                                              <X size={16} />
                                                                        </Button>
                                                                  </div>
                                                            ) : (
                                                                  <div className="d-flex justify-content-between align-items-center p-3" style={{
                                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                        borderRadius: '12px'
                                                                  }}>
                                                                        <span style={{ color: 'white', fontSize: '1.1rem' }}>
                                                                              {adminData.name}
                                                                        </span>
                                                                        <Button
                                                                              variant="outline-primary"
                                                                              size="sm"
                                                                              onClick={() => setIsEditing(true)}
                                                                              style={{
                                                                                    borderColor: '#ff6b35',
                                                                                    color: '#ff6b35'
                                                                              }}
                                                                        >
                                                                              <Edit3 size={16} className="me-1" />
                                                                              Edit
                                                                        </Button>
                                                                  </div>
                                                            )}
                                                      </Form.Group>

                                                      <Form.Group className="mb-4">
                                                            <Form.Label style={{ color: '#ff6b35', fontWeight: '500' }}>
                                                                  Email Address
                                                            </Form.Label>
                                                            <div className="p-3" style={{
                                                                  background: 'rgba(255, 255, 255, 0.05)',
                                                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                  borderRadius: '12px',
                                                                  color: 'rgba(255, 255, 255, 0.7)'
                                                            }}>
                                                                  {adminData.email}
                                                                  <small className="d-block mt-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                                        Email cannot be changed
                                                                  </small>
                                                            </div>
                                                      </Form.Group>

                                                      <Form.Group className="mb-4">
                                                            <Form.Label style={{ color: '#ff6b35', fontWeight: '500' }}>
                                                                  Role
                                                            </Form.Label>
                                                            <div className="p-3" style={{
                                                                  background: 'rgba(255, 255, 255, 0.05)',
                                                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                  borderRadius: '12px',
                                                                  color: 'rgba(255, 255, 255, 0.7)'
                                                            }}>
                                                                  {adminData.role}
                                                                  <small className="d-block mt-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                                        Role cannot be changed
                                                                  </small>
                                                            </div>
                                                      </Form.Group>
                                                </div>

                                                <div className="text-center">
                                                      <small style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                            Only the admin name can be modified. Other fields are read-only for security purposes.
                                                      </small>
                                                </div>
                                          </Card.Body>
                                    </Card>
                              </Col>
                        </Row>
                  </Container>

                  <style>{`
        .custom-input:focus {
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: #ff6b35 !important;
          box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.25) !important;
          color: white !important;
        }
        .custom-input::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
      `}</style>
            </div>
      )
}

export default AdminProfile
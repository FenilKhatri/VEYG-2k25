import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Modal } from 'react-bootstrap'
import { Trophy, Calendar, Users, DollarSign, Gamepad2 } from 'lucide-react'
import PageHeroSection from '../components/HeroSection/PageHeroSection'
import apiService from '../services/api'
import { getGameById } from '../data/gamesData'
import ReceiptModern from '../components/ReceiptModern'

const RegisteredGames = ({ user, showToast }) => {
  const navigate = useNavigate()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showReceipt, setShowReceipt] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      console.log('Fetching registrations for user:', user)

      const response = await apiService.getMyRegistrations()
      console.log('API Response:', response)
      console.log('Response structure:', {
        success: response.success,
        data: response.data,
        registrations: response.registrations,
        message: response.message
      })

      if (response.success) {
        // Handle different response structures
        const registrationsArray = response.registrations || response.data?.registrations || response.data || []
        console.log('Registrations found:', registrationsArray)
        console.log('Registrations array length:', registrationsArray.length)

        setRegistrations(Array.isArray(registrationsArray) ? registrationsArray : [])

        if (registrationsArray.length === 0) {
          console.log('No registrations found - this might be expected for new registrations')
          setError('')  // Don't set error for empty results
        }
      } else {
        console.error('API response not successful:', response)
        throw new Error(response.message || 'Failed to fetch registrations')
      }
    } catch (error) {
      console.error('Error fetching registrations:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      })
      setError(error.message || 'Failed to load registrations')
      showToast(error.message || 'Failed to load registrations', 'error')
      setRegistrations([])  // Set empty array on error
    } finally {
      setLoading(false)
    }
  }, [user, showToast])

  useEffect(() => {
    if (user) {
      fetchRegistrations()
    } else {
      setLoading(false)
    }
  }, [fetchRegistrations, user])

  // Also refresh when component becomes visible (useful for redirects)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        fetchRegistrations()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [fetchRegistrations, user])

  const handleViewReceipt = (registration) => {
    try {
      // Transform registration data to match Receipt component format
      const gameData = {
        name: registration.gameName,
        gameName: registration.gameName,
        classification: registration.gameDay || 'Day 1',
        registrationFee: registration.totalFee,
        totalFee: registration.totalFee,
        registrationId: registration.registrationId,
        approvalStatus: registration.approvalStatus,
        approvedBy: registration.approvedBy,
        approverDetails: registration.approverDetails,
        approvedAt: registration.approvedAt,
        registrationDetails: {
          registrationType: registration.registrationType,
          registrationId: registration.registrationId,
          teamName: registration.teamName || '',
          registrationDate: registration.registrationDate || registration.createdAt || new Date().toISOString(),
          teamLeader: {
            fullName: registration.teamLeader?.fullName || 'N/A',
            email: registration.teamLeader?.email || 'N/A',
            enrollmentNumber: registration.teamLeader?.enrollmentNumber || 'N/A',
            contactNumber: registration.teamLeader?.contactNumber || 'N/A',
            collegeName: registration.teamLeader?.collegeName || 'N/A'
          },
          teamMembers: registration.teamMembers || [],
          paymentStatus: registration.approvalStatus === 'approved' ? 'confirmed' : 'pending'
        }
      }

      setSelectedGame(gameData)
      setShowReceipt(true)
    } catch (error) {
      console.error('Error preparing receipt:', error)
      showToast('Failed to open receipt', 'error')
    }
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

  if (!user) {
    return (
      <div style={{
        background: 'linear-gradient(145deg, #0a0e1a 0%, #1a1f2e 50%, #0f1419 100%)',
        minHeight: '100vh',
        color: '#f1f5f9'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          padding: '4rem 0 2rem',
          borderBottom: '2px solid #00d4ff'
        }}>
          <Container>
            <Row className="text-center">
              <Col>
                <Trophy size={48} className="mb-3" style={{ color: '#00d4ff' }} />
                <h1 className="display-4 fw-bold mb-3" style={{ color: '#f1f5f9' }}>
                  My Registered Games
                </h1>
                <p className="lead" style={{ color: '#94a3b8' }}>
                  Please login to view your registered games
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/student-login')}
                  style={{
                    background: 'linear-gradient(135deg, #00d4ff 0%, #0ea5e9 100%)',
                    border: 'none'
                  }}
                >
                  Login Now
                </Button>
              </Col>
            </Row>
          </Container>
        </div>
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
        title="My Registered Games"
        subtitle="🎮 Game Registrations • VEYG 2K25"
        icon={Gamepad2}
        description="Track your game registrations, view approval status, and download receipts"
      />

      {/* Debug/Refresh Section */}
      <Container className="py-3">
        <Row className="justify-content-center">
          <Col md={10}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <small style={{ color: '#94a3b8' }}>
                  Last updated: {new Date().toLocaleTimeString()}
                </small>
              </div>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={fetchRegistrations}
                disabled={loading}
                style={{
                  borderColor: '#00d4ff',
                  color: '#00d4ff'
                }}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={10}>

            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            {registrations.length === 0 ? (
              <Row className="justify-content-center">
                <Col md={8}>
                  <Card className="text-center border-0 shadow-lg" style={{ background: '#1e293b' }}>
                    <Card.Body className="py-5">
                      <Trophy size={64} className="mb-4" style={{ color: '#64748b' }} />
                      <h3 className="mb-3" style={{ color: '#f1f5f9' }}>No Registrations Yet</h3>
                      <p className="mb-4" style={{ color: '#94a3b8' }}>
                        You haven't registered for any games yet. Browse our exciting games and register now!
                      </p>
                      <div className="d-flex gap-3 justify-content-center">
                        <Button
                          variant="outline-secondary"
                          onClick={fetchRegistrations}
                          disabled={loading}
                        >
                          {loading ? 'Refreshing...' : 'Refresh'}
                        </Button>
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => navigate('/')}
                          style={{
                            background: 'linear-gradient(135deg, #00d4ff 0%, #0ea5e9 100%)',
                            border: 'none'
                          }}
                        >
                          Browse Games
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            ) : (
              <Row>
                {registrations.map((registration) => {
                  const gameData = getGameById(parseInt(registration.gameId))

                  return (
                    <Col md={6} lg={4} key={registration._id} className="mb-4">
                      <Card className="h-100 border-0 shadow-lg" style={{ background: '#1e293b' }}>
                        <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                          <img
                            src={gameData?.image || '/api/placeholder/400/200'}
                            alt={registration.gameName}
                            style={{
                              width: '100%',
                            }}
                          />
                          <Badge
                            className="position-absolute top-0 end-0 m-2"
                            bg={registration.approvalStatus === 'approved' ? 'success' :
                              registration.approvalStatus === 'rejected' ? 'danger' : 'warning'}
                            style={{ fontSize: '12px' }}
                          >
                            {registration.approvalStatus === 'approved' ? 'Approved' :
                              registration.approvalStatus === 'rejected' ? 'Rejected' : 'Pending Approval'}
                          </Badge>
                        </div>

                        <Card.Body className="d-flex flex-column">
                          <Card.Title style={{ color: '#00d4ff', fontSize: '1.2rem' }}>
                            {registration.gameName || 'Unknown Game'}
                          </Card.Title>

                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Registration ID:</span>
                              <Badge bg="info" style={{ fontSize: '12px' }}>
                                {registration.registrationId || registration._id || 'N/A'}
                              </Badge>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Registration Type:</span>
                              <span style={{ color: '#f1f5f9', fontSize: '14px' }}>
                                {registration.registrationType === 'team' ? 'Team' : 'Individual'}
                              </span>
                            </div>

                            {registration.registrationType === 'team' && (
                              <>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>Team Name:</span>
                                  <span style={{ color: '#f1f5f9', fontSize: '14px' }}>
                                    {registration.teamName || 'N/A'}
                                  </span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>Team Leader:</span>
                                  <span style={{ color: '#f1f5f9', fontSize: '14px' }}>
                                    {registration.teamLeader?.fullName || 'N/A'}
                                  </span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>Team Size:</span>
                                  <span style={{ color: '#f1f5f9', fontSize: '14px' }}>
                                    {1 + (registration.teamMembers?.length || 0)} members
                                  </span>
                                </div>
                              </>
                            )}

                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Approval Status:</span>
                              <Badge bg={registration.approvalStatus === 'approved' ? 'success' :
                                registration.approvalStatus === 'rejected' ? 'danger' : 'warning'}>
                                {registration.approvalStatus === 'approved' ? 'Approved' :
                                  registration.approvalStatus === 'rejected' ? 'Rejected' : 'Pending'}
                              </Badge>
                            </div>

                            {registration.approvalStatus === 'approved' && registration.approvedBy && (
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <span style={{ color: '#94a3b8', fontSize: '14px' }}>Approved By:</span>
                                <span style={{ color: '#22c55e', fontSize: '14px' }}>
                                  {registration.approverDetails?.name || registration.approvedBy}
                                </span>
                              </div>
                            )}

                            {registration.approvalStatus === 'approved' && registration.approvedAt && (
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <span style={{ color: '#94a3b8', fontSize: '14px' }}>Approved On:</span>
                                <span style={{ color: '#22c55e', fontSize: '12px' }}>
                                  {new Date(registration.approvedAt).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            )}

                            {registration.approvalStatus === 'rejected' && registration.rejectedBy && (
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <span style={{ color: '#94a3b8', fontSize: '14px' }}>Rejected By:</span>
                                <span style={{ color: '#ef4444', fontSize: '14px' }}>
                                  {registration.rejectedBy}
                                </span>
                              </div>
                            )}

                            <div className="d-flex justify-content-between align-items-center">
                              <span style={{ color: '#94a3b8', fontSize: '14px' }}>Total Fee:</span>
                              <strong style={{ color: '#00d4ff', fontSize: '1.1rem' }}>
                                ₹{registration.totalFee}
                              </strong>
                            </div>
                          </div>

                          <Button
                            variant="primary"
                            className="w-100 mt-auto"
                            onClick={() => handleViewReceipt(registration)}
                            style={{
                              background: 'linear-gradient(45deg, #00d4ff, #0099cc)',
                              border: 'none',
                              fontWeight: '500'
                            }}
                          >
                            Download Receipt
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  )
                })}
              </Row>
            )}
          </Col>
        </Row>
      </Container>

      {/* Receipt Modal */}
      {showReceipt && (
        <ReceiptModern
          show={showReceipt}
          onHide={() => setShowReceipt(false)}
          registration={selectedGame}
          game={selectedGame}
        />
      )}
    </div>
  )
}

export default RegisteredGames
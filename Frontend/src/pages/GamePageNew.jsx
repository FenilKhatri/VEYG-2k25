import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap'
import { Trophy, Users, Clock, IndianRupee, Calendar, CheckCircle, Zap, Shield, Star, AlertTriangle, BookOpen, Award, AlertCircle, CheckSquare, XCircle } from 'lucide-react'
import { getGameById } from '../data/gamesData'
import RegistrationForm from '../components/RegistrationForm'
import { useAuth } from '../context/AuthContext'

const GamePageNew = ({ isLoggedIn, user, showToast }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { registeredGames, refreshRegistrations } = useAuth()
  const [game, setGame] = useState(null)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isRegistrationExpired, setIsRegistrationExpired] = useState(false)

  // Check if user has registered for this specific game
  const isThisGameRegistered = game && registeredGames && user && registeredGames.some(reg => {
    const gameIdMatch = parseInt(reg.gameId) === game.id || reg.gameId === game.id.toString()
    const userMatch = reg.userId === user.username || reg.userId === user.id || reg.userId === user.name
    return gameIdMatch && userMatch
  })

  // Check if user has already registered for a game on this day
  const hasRegisteredForDay = game && registeredGames && user && registeredGames.some(reg => {
    const registeredGame = getGameById(parseInt(reg.gameId))
    const userMatch = reg.userId === user.username || reg.userId === user.id || reg.userId === user.name
    return registeredGame && registeredGame.day === game.day && userMatch
  })

  useEffect(() => {
    const foundGame = getGameById(parseInt(id))
    if (foundGame) {
      setGame(foundGame)
    } else {
      showToast("Game not found!", "error")
      navigate("/")
    }
    setLoading(false)
  }, [id, navigate, showToast])

  const handleRegisterClick = () => {
    if (!isLoggedIn) {
      showToast("Please login to register for games", "error")
      navigate("/student-login")
      return
    }
    if (isRegistrationExpired) {
      showToast("Registration period has ended", "error")
      return
    }
    setShowRegistrationModal(true)
  }

  const handleRegistrationExpired = () => {
    setIsRegistrationExpired(true)
  }

  const handleGameRegistration = async () => {
    try {
      // Wait a moment for the backend to process the registration
      await new Promise(resolve => setTimeout(resolve, 500))

      // Refresh the registrations data
      await refreshRegistrations()

      setShowRegistrationModal(false)
      showToast("Registration successful! Redirecting to your registered games...", "success")

      // Redirect to registered games page after a short delay
      setTimeout(() => {
        navigate('/registered-games')
      }, 1500)
    } catch (error) {
      console.error('Error refreshing registrations:', error)
      setShowRegistrationModal(false)
      showToast("Registration successful! Redirecting to your registered games...", "success")

      // Still redirect even if refresh fails
      setTimeout(() => {
        navigate('/registered-games')
      }, 1500)
    }
  }

  if (loading || !game) {
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
      margin: 0,
      padding: 0
    }}>
      {/* Hero Section with Game Image */}
      <div style={{
        position: 'relative',
        height: '70vh',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${game.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        marginTop: '-80px',
        paddingTop: '80px'
      }}>
        <Container>
          <Row className="text-center">
            <Col>
              <div style={{
                background: 'rgba(0, 234, 255, 0.1)',
                border: '1px solid rgba(0, 234, 255, 0.3)',
                borderRadius: '25px',
                padding: '8px 20px',
                display: 'inline-block',
                marginBottom: '20px'
              }}>
                <Trophy size={20} style={{ marginRight: '8px', color: '#00eaff' }} />
                <span style={{ color: '#00eaff', fontWeight: '600' }}>Day {game.day} Competition</span>
              </div>

              <h1 style={{
                fontSize: '3.5rem',
                fontWeight: '800',
                marginBottom: '20px',
                background: 'linear-gradient(45deg, #00d4ff, #007bff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
              }}>
                {game.name}
              </h1>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                <Badge bg="primary" style={{ padding: '10px 15px', fontSize: '14px' }}>
                  <Users size={16} style={{ marginRight: '5px' }} />
                  {game.minTeamSize}-{game.maxTeamSize} Members
                </Badge>
                <Badge bg="success" style={{ padding: '10px 15px', fontSize: '14px' }}>
                  <IndianRupee size={16} style={{ marginRight: '5px' }} />
                  ₹{game.baseFee}
                </Badge>
                <Badge bg="warning" style={{ padding: '10px 15px', fontSize: '14px' }}>
                  <Calendar size={16} style={{ marginRight: '5px' }} />
                  Day {game.day}
                </Badge>
              </div>
            </Col>
          </Row>
        </Container>
      </div>zzzzz

      {/* Main Content */}
      <Container style={{ paddingTop: '60px', paddingBottom: '60px' }}>

        <Row>
          {/* Game Details */}
          <Col lg={8}>
            {/* Game Overview */}
            <Card className="mb-4" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)'
            }}>
              <Card.Header style={{
                background: 'rgba(0, 234, 255, 0.1)',
                border: 'none',
                borderRadius: '15px 15px 0 0'
              }}>
                <h4 style={{ color: '#00d4ff', margin: 0, display: 'flex', alignItems: 'center' }}>
                  <Shield size={24} style={{ marginRight: '10px' }} />
                  Game Overview
                </h4>
              </Card.Header>
              <Card.Body style={{ color: '#f1f5f9' }}>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', margin: 0 }}>
                  {game.description}
                </p>
              </Card.Body>
            </Card>

            {/* Requirements Section */}
            {game.requirements && (
              <Card className="mb-4" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '15px',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                top: '30px'
              }}>
                <Card.Header style={{
                  background: 'rgba(220, 38, 127, 0.1)',
                  border: 'none',
                  borderRadius: '15px 15px 0 0'
                }}>
                  <h4 style={{ color: '#ff6b9d', margin: 0, display: 'flex', alignItems: 'center' }}>
                    <AlertCircle size={24} style={{ marginRight: '10px' }} />
                    Requirements & Eligibility
                  </h4>
                </Card.Header>
                <Card.Body style={{ color: '#f1f5f9' }}>
                  <Row>
                    <Col md={12}>
                      <h6 style={{ color: '#ff6b9d', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                        <CheckSquare size={18} style={{ marginRight: '8px' }} />
                        Mandatory Requirements
                      </h6>
                      <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
                        {game.requirements.mandatory?.map((req, index) => (
                          <li key={index} style={{ 
                            marginBottom: '8px', 
                            display: 'flex', 
                            alignItems: 'flex-start',
                            fontSize: '0.95rem'
                          }}>
                            <CheckCircle size={16} style={{ 
                              color: '#10b981', 
                              marginRight: '8px', 
                              marginTop: '2px',
                              flexShrink: 0 
                            }} />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Registration Sidebar */}
          <Col lg={4}>
            <Card style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              position: 'sticky',
              top: '100px'
            }}>
              <Card.Header style={{
                background: 'rgba(0, 234, 255, 0.1)',
                border: 'none',
                borderRadius: '15px 15px 0 0',
                textAlign: 'center'
              }}>
                <h5 style={{ color: '#00d4ff', margin: 0 }}>Registration</h5>
              </Card.Header>
              <Card.Body className="text-center" style={{ color: '#f1f5f9' }}>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: '#00d4ff', marginBottom: '5px' }}>₹{game.baseFee}</h3>
                  <p style={{ color: '#94a3b8', margin: 0 }}>Registration Fee</p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>Team Size:</span>
                    <span>{game.minTeamSize}-{game.maxTeamSize} members</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>Competition Day:</span>
                    <span>Day {game.day}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Type:</span>
                    <span>{game.registrationType}</span>
                  </div>
                </div>

                {isThisGameRegistered ? (
                  <Button
                    variant="success"
                    size="lg"
                    disabled
                    style={{ width: '100%', borderRadius: '10px' }}
                  >
                    <CheckCircle size={20} style={{ marginRight: '8px' }} />
                    Already Registered!
                  </Button>
                ) : hasRegisteredForDay ? (
                  <div>
                    <div style={{
                      background: 'rgba(255, 193, 7, 0.1)',
                      border: '1px solid rgba(255, 193, 7, 0.3)',
                      borderRadius: '10px',
                      padding: '15px',
                      marginBottom: '15px'
                    }}>
                      <p style={{ color: '#ffc107', margin: 0, fontSize: '14px' }}>
                        You have already registered for 1 game on Day {game.day}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="lg"
                      disabled
                      style={{ width: '100%', borderRadius: '10px' }}
                    >
                      Registration Closed
                    </Button>
                  </div>
                ) : isRegistrationExpired ? (
                  <div>
                    <Alert variant="danger" className="mb-3">
                      <AlertTriangle size={16} className="me-2" />
                      <strong>Registration Closed</strong>
                      <div className="mt-1">The registration deadline has passed. No new registrations are accepted.</div>
                    </Alert>
                    <Button
                      variant="secondary"
                      size="lg"
                      disabled
                      style={{ width: '100%', borderRadius: '10px' }}
                    >
                      <AlertTriangle size={20} style={{ marginRight: '8px' }} />
                      Registration Closed
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Alert variant="danger" className="mb-3">
                      <AlertTriangle size={16} className="me-2" />
                      <strong>Registration Closed</strong>
                      <div className="mt-1">Registration for this event has been closed.</div>
                    </Alert>
                    <Button
                      variant="secondary"
                      size="lg"
                      disabled
                      style={{ width: '100%', borderRadius: '10px' }}
                    >
                      <XCircle size={20} style={{ marginRight: '8px' }} />
                      Registration Closed
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <RegistrationForm
        show={showRegistrationModal}
        handleClose={() => setShowRegistrationModal(false)}
        game={game}
        userId={user?.username}
        onRegisterGame={handleGameRegistration}
        showToast={showToast}
        registeredGames={registeredGames}
        isRegistrationExpired={isRegistrationExpired}
      />
    </div>
  )
}

export default GamePageNew

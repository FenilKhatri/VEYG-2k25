import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Nav, Tab } from 'react-bootstrap'
import GamesGrid from './GamesGrid'
import apiService from '../../services/api'

const GamesSection = ({ 
  day1Games = [], 
  day2Games = [], 
  user, 
  isLoggedIn, 
  showToast 
}) => {
  const [registeredGames, setRegisteredGames] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch user's registered games
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      fetchRegisteredGames()
    }
  }, [isLoggedIn, user])

  const fetchRegisteredGames = async () => {
    try {
      const response = await apiService.getRegisteredGames(user.id)
      if (response.success) {
        setRegisteredGames(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching registered games:', error)
    }
  }

  const handleRegister = async (game) => {
    if (!isLoggedIn || !user?.id) {
      showToast?.('Please login to register for games', 'warning')
      return
    }

    setLoading(true)
    try {
      const response = await apiService.registerForGame({
        gameId: game.id,
        userId: user.id
      })

      if (response.success) {
        showToast?.(`Successfully registered for ${game.name}!`, 'success')
        await fetchRegisteredGames() // Refresh registered games
      } else {
        showToast?.(response.message || 'Registration failed', 'error')
      }
    } catch (error) {
      console.error('Registration error:', error)
      showToast?.(error.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      minHeight: '100vh',
      paddingTop: '80px',
      paddingBottom: '80px'
    }}>
      <Container>
        <div className="text-center mb-5">
          <h2 className="text-white fw-bold mb-3" style={{ fontSize: '3rem' }}>
            Technical <span style={{ color: '#00d4ff' }}>Competitions</span>
          </h2>
          <p className="text-light fs-5 mb-0" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Challenge yourself in cutting-edge technical competitions designed to test your skills
          </p>
        </div>

        <Tab.Container defaultActiveKey="day1">
          <Row className="justify-content-center mb-4">
            <Col xs="auto">
              <Nav 
                variant="pills" 
                className="nav-pills-custom"
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '50px',
                  padding: '8px',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 212, 255, 0.2)'
                }}
              >
                <Nav.Item>
                  <Nav.Link 
                    eventKey="day1"
                    style={{
                      borderRadius: '40px',
                      padding: '12px 24px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Day 1 Games ({day1Games.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    eventKey="day2"
                    style={{
                      borderRadius: '40px',
                      padding: '12px 24px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Day 2 Games ({day2Games.length})
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>

          <Tab.Content>
            <Tab.Pane eventKey="day1">
              <GamesGrid
                games={day1Games}
                userId={user?.id}
                registeredGames={registeredGames}
                onRegister={handleRegister}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="day2">
              <GamesGrid
                games={day2Games}
                userId={user?.id}
                registeredGames={registeredGames}
                onRegister={handleRegister}
              />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>

      <style>{`
        .nav-pills-custom .nav-link {
          color: #94a3b8;
          background: transparent;
          border: none;
        }
        
        .nav-pills-custom .nav-link:hover {
          color: #00d4ff;
          background: rgba(0, 212, 255, 0.1);
        }
        
        .nav-pills-custom .nav-link.active {
          color: white;
          background: linear-gradient(135deg, #00d4ff, #007bff);
          box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
        }
      `}</style>
    </section>
  )
}

export default GamesSection

import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { motion } from 'framer-motion'
import GameCard from './GameCard'
import RegistrationRules from '../RegistrationRules'
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
      const response = await apiService.getMyRegistrations()
      if (response.success) {
        setRegisteredGames(response.data?.registrations || [])
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
        gameName: game.name,
        gameDay: game.day,
        registrationType: 'individual',
        totalAmount: game.baseFee
      })

      if (response.success) {
        showToast?.(`Successfully registered for ${game.name}!`, 'success')
        await fetchRegisteredGames()
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

  // Helper functions for registration state
  const isRegisteredForGame = (gameId) => {
    return registeredGames.some(reg => reg.gameId === gameId)
  }

  const hasRegisteredForDay = (day) => {
    return registeredGames.some(reg => reg.gameDay === day || reg.gameDay === `day${day}`)
  }

  const getRegisteredGameForDay = (day) => {
    return registeredGames.find(reg => reg.gameDay === day || reg.gameDay === `day${day}`)
  }

  const renderGameSection = (games, dayLabel) => (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="mb-5"
    >
      {/* Title */}
      <h3
        className="text-center fw-bold mb-3"
        style={{
          fontSize: '2.2rem',
          color: '#fff',
          textShadow: '0 0 20px rgba(0, 234, 255, 0.7)'
        }}
      >
        {dayLabel}: <span style={{ color: '#00d4ff' }}>Choose Your Challenge</span>
      </h3>

      {/* Subtext */}
      <p
        className="text-center text-light mb-4"
        style={{
          fontSize: '1.1rem',
          maxWidth: '600px',
          margin: '0 auto',
          opacity: 0.85
        }}
      >
        {games[0]?.name} <span style={{ color: '#00d4ff', fontWeight: 'bold' }}>OR</span> {games[1]?.name}
      </p>

      {/* Game Cards */}
      <Row className="justify-content-center g-4">
        {games.map((game) => {
          const isThisGameRegistered = isRegisteredForGame(game.id)
          const hasRegForDay = hasRegisteredForDay(game.day)
          const registeredGameForDay = getRegisteredGameForDay(game.day)

          return (
            <Col
              key={game.id}
              xs={12}
              sm={6}
              md={6}
              lg={5}
              className="d-flex"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="w-100"
              >
                <GameCard
                  game={game}
                  userId={user?.id}
                  isThisGameRegistered={isThisGameRegistered}
                  hasRegisteredForDay={hasRegForDay}
                  canRegisterForDay={!hasRegForDay}
                  registrationStatus={game.registrationStatus || "available"}
                  isRegistrationExpired={game.isRegistrationExpired || false}
                  registeredGameName={registeredGameForDay?.gameName}
                  registeredGameId={registeredGameForDay?.gameId}
                  onRegister={handleRegister}
                />
              </motion.div>
            </Col>
          )
        })}
      </Row>
    </motion.div>
  )

  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #050c1f 0%, #0f172a 50%, #1e293b 100%)',
        minHeight: '100vh',
        paddingTop: '80px',
        paddingBottom: '80px'
      }}
    >
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <h2
            className="fw-bold mb-3"
            style={{
              fontSize: '3rem',
              color: '#fff',
              textShadow: '0 0 25px rgba(0, 234, 255, 0.8)'
            }}
          >
            Technical <span style={{ color: '#00d4ff' }}>Competitions</span>
          </h2>
          <p
            className="text-light fs-5 mb-4"
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              opacity: 0.85
            }}
          >
            Choose one game per day. Register for your preferred competition.
          </p>
        </motion.div>

        {/* Registration Rules */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-5"
        >
          <RegistrationRules />
        </motion.div>

        {/* Day 1 Games */}
        {renderGameSection(day1Games, "Day 1")}

        {/* Day 2 Games */}
        {renderGameSection(day2Games, "Day 2")}
      </Container>
    </section>
  )
}

export default GamesSection;
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import GameCard from './GameCard'

const GamesGrid = ({ 
  games = [], 
  userId,
  registeredGames = [],
  onRegister 
}) => {
  if (!games || games.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h4 className="text-light mb-3">No games available</h4>
          <p className="text-muted">Check back later for exciting competitions!</p>
        </div>
      </Container>
    )
  }

  // Helper function to check if user is registered for a specific game
  const isRegisteredForGame = (gameId) => {
    return registeredGames.some(reg => reg.gameId === gameId)
  }

  // Helper function to check if user has registered for a specific day
  const hasRegisteredForDay = (day) => {
    return registeredGames.some(reg => reg.day === day)
  }

  // Get registered game info for a specific day
  const getRegisteredGameForDay = (day) => {
    return registeredGames.find(reg => reg.day === day)
  }

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h2 className="text-white fw-bold mb-3">
          Technical <span style={{ color: '#00d4ff' }}>Competitions</span>
        </h2>
        <p className="text-light fs-5 mb-0">
          Challenge yourself in cutting-edge technical competitions
        </p>
      </div>

      <Row className="g-4">
        {games.map((game) => {
          const isThisGameRegistered = isRegisteredForGame(game.id)
          const hasRegForDay = hasRegisteredForDay(game.day)
          const registeredGameForDay = getRegisteredGameForDay(game.day)
          
          return (
            <Col key={game.id} xs={12} md={6} lg={4}>
              <GameCard
                game={game}
                userId={userId}
                isThisGameRegistered={isThisGameRegistered}
                hasRegisteredForDay={hasRegForDay}
                canRegisterForDay={!hasRegForDay}
                registrationStatus={game.registrationStatus || "available"}
                isRegistrationExpired={game.isRegistrationExpired || false}
                registeredGameName={registeredGameForDay?.gameName}
                registeredGameId={registeredGameForDay?.gameId}
                onRegister={onRegister}
              />
            </Col>
          )
        })}
      </Row>
    </Container>
  )
}

export default GamesGrid

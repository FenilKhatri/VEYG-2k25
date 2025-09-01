import React from 'react'
import { Card, Badge, Button } from 'react-bootstrap'
import { Users, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const GameCard = ({
  game,
  userId,
  isThisGameRegistered = false,
  hasRegisteredForDay = false,
  canRegisterForDay = true,
  registrationStatus = "available",
  isRegistrationExpired = false,
  registeredGameName = null,
  registeredGameId = null,
  onRegister,
  onViewDetails
}) => {
  const navigate = useNavigate()

  const handleViewDetailsClick = () => {
    if (onViewDetails) {
      onViewDetails(game)
    } else {
      navigate(`/game/${game.id}`)
    }
  }

  // Dynamic logo mapping
  const getGameLogo = (gameName) => {
    const logoMap = {
      'Algo Cricket – A Fun Coding Game': 'algo cricket.jpg',
      'BrainGo': 'brain go.jpg',
      'Logo2Logic': 'logic 2 logic.jpg',
      'Blind Code to Key': 'bind coding to key.jpg'
    }
    return logoMap[gameName] || '404 not found.jpg'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="h-100 w-100"
    >
      <Card
        className="game-card h-100"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          borderRadius: '18px',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 25px rgba(0, 234, 255, 0.15)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Card.Header
          className="d-flex justify-content-between align-items-center px-4 py-3"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(0, 140, 255, 0.15))',
            borderBottom: '1px solid rgba(0, 212, 255, 0.25)',
            borderRadius: '16px 16px 0 0'
          }}
        >
          <Badge
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #007bff)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Calendar size={16} className="me-2" />
            Day {game.day}
          </Badge>
          <div
            className="fw-bold"
            style={{
              fontSize: '1.1rem',
              color: '#00eaff'
            }}
          >
            ₹{game.baseFee || 500}
          </div>
        </Card.Header>

        {/* Body */}
        <Card.Body className="p-4 d-flex flex-column">
          <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start mb-3 text-center text-sm-start">
            <div className="me-sm-3 mb-3 mb-sm-0" style={{ flexShrink: 0 }}>
              <img
                src={`/Logo/${getGameLogo(game.name)}`}
                alt={`${game.name} logo`}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: '2px solid rgba(0, 212, 255, 0.3)',
                  boxShadow: '0 0 15px rgba(0, 212, 255, 0.4)'
                }}
                onError={(e) => {
                  e.target.src = '/Logo/algo cricket.jpg'
                }}
              />
            </div>
            <div className="flex-grow-1">
              <h5
                className="fw-bold mb-2"
                style={{
                  fontSize: '1.4rem',
                  color: '#fff',
                  textShadow: '0 0 10px rgba(0, 234, 255, 0.6)'
                }}
              >
                {game.name}
              </h5>
              {game.description && (
                <p
                  className="mb-0"
                  style={{
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    opacity: 0.8,
                    color: '#dffaff'
                  }}
                >
                  {game.description.length > 100
                    ? `${game.description.substring(0, 100)}...`
                    : game.description}
                </p>
              )}
            </div>
          </div>
        </Card.Body>

        {/* Footer */}
        <Card.Footer
          className="px-4 py-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3"
          style={{
            background: 'rgba(0, 0, 0, 0.2)',
            borderTop: '1px solid rgba(0, 212, 255, 0.2)'
          }}
        >
          {/* View Details Button */}
          <Button
            onClick={handleViewDetailsClick}
            variant="outline-light"
            style={{
              borderRadius: '10px',
              fontWeight: '600',
              padding: '10px 24px',
              borderColor: 'rgba(0, 212, 255, 0.5)',
              color: '#00eaff',
              background: 'rgba(0, 212, 255, 0.1)',
              fontSize: '0.95rem'
            }}
          >
            View Details
          </Button>

          {/* Registration Status */}
          {isThisGameRegistered && (
            <Badge
              bg="success"
              className="px-3 py-2 fw-semibold"
              style={{
                fontSize: '0.85rem',
                boxShadow: '0 0 15px rgba(0, 255, 100, 0.3)'
              }}
            >
              ✓ You already registered
            </Badge>
          )}

          {/* Team Size */}
          <div className="d-flex align-items-center">
            <Users size={18} color="#00eaff" className="me-2" />
            <span className="text-light" style={{ fontSize: '1rem' }}>
              Team Size:{" "}
              <span className="text-white fw-semibold">
                {game.maxTeamSize || 1}
              </span>
            </span>
          </div>
        </Card.Footer>

        <style>{`
          .game-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 30px rgba(0, 212, 255, 0.2) !important;
            border-color: rgba(0, 212, 255, 0.5) !important;
          }
        `}</style>
      </Card>
    </motion.div>
  )
}

export default GameCard;
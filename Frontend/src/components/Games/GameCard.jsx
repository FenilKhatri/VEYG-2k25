import React from 'react'
import { Card, Button, Badge } from 'react-bootstrap'
import { Clock, Users, Trophy, Calendar, MapPin, Zap, Target, CheckCircle, AlertTriangle } from 'lucide-react'

const GameCard = ({ 
  game, 
  userId,
  isThisGameRegistered = false,
  hasRegisteredForDay = false,
  canRegisterForDay = true,
  registrationStatus = "available",
  isRegistrationExpired = false,
  registeredGameName,
  registeredGameId,
  onRegister 
}) => {
  if (!game) return null

  const formatINR = (n) =>
    typeof n === "number" ? n.toLocaleString("en-IN", { maximumFractionDigits: 0 }) : n

  // State machine for registration status
  function getRegState() {
    if (!userId) return { key: "login", label: "Login required" }
    if (isThisGameRegistered) return { key: "registered", label: "Already registered" }
    const closed = isRegistrationExpired || registrationStatus === "closed"
    if (closed) return { key: "closed", label: "Registration closed" }
    if (registrationStatus === "full") return { key: "full", label: "Full" }
    if (hasRegisteredForDay || canRegisterForDay === false) {
      return { key: "dayBlocked", label: `Already registered for Day ${game.day}` }
    }
    return { key: "available", label: "Available" }
  }

  const reg = getRegState()
  const isActionDisabled = !reg || reg.key !== "available"
  const seatsLabel = typeof game.seatsLeft === "number" ? `${game.seatsLeft} seats left` : null

  const handleRegisterClick = () => {
    if (isActionDisabled) return
    if (onRegister) onRegister(game)
  }

  return (
    <Card 
      className="h-100 game-card"
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
        border: '1px solid rgba(0, 212, 255, 0.2)',
        borderRadius: '16px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        overflow: 'hidden'
      }}
    >
      {/* Header with gradient overlay */}
      <div style={{
        background: 'linear-gradient(135deg, #00d4ff 0%, #007bff 100%)',
        padding: '20px',
        position: 'relative'
      }}>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge 
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}
          >
            <Zap size={14} className="me-1" />
            Day {game.day}
          </Badge>
          
          {isThisGameRegistered && (
            <Badge bg="success" className="d-flex align-items-center">
              <CheckCircle size={14} className="me-1" />
              Registered
            </Badge>
          )}
        </div>

        <div className="d-flex align-items-center mb-2">
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '8px',
            marginRight: '12px'
          }}>
            <Trophy size={20} color="white" />
          </div>
          <h5 className="mb-0 text-white fw-bold">{game.name}</h5>
        </div>

        {game.tags && game.tags.length > 0 && (
          <div className="d-flex flex-wrap gap-1">
            {game.tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.7rem',
                  fontWeight: '500'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <Card.Body className="p-4">
        {game.description && (
          <p className="text-light mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
            {game.description.length > 120 ? `${game.description.substring(0, 120)}...` : game.description}
          </p>
        )}

        {/* Game Stats */}
        <div className="row g-2 mb-3">
          <div className="col-6">
            <div style={{
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <Users size={16} color="#00d4ff" className="mb-1" />
              <div className="text-white fw-bold" style={{ fontSize: '0.9rem' }}>
                {game.maxTeamSize || '-'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Team Size</div>
            </div>
          </div>
          <div className="col-6">
            <div style={{
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <Trophy size={16} color="#00d4ff" className="mb-1" />
              <div className="text-white fw-bold" style={{ fontSize: '0.9rem' }}>
                ₹{formatINR(game.baseFee)}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Entry Fee</div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {userId && hasRegisteredForDay && !isThisGameRegistered && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px'
          }}>
            <div className="d-flex align-items-start">
              <AlertTriangle size={16} color="#f59e0b" className="me-2 mt-1" />
              <div>
                <div style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: '600' }}>
                  Already registered for Day {game.day}
                </div>
                {registeredGameName && (
                  <div style={{ color: '#f59e0b', fontSize: '0.7rem' }}>
                    {registeredGameName}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {seatsLabel && reg.key === "available" && (
          <div className="text-center mb-3">
            <Badge 
              style={{
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#22c55e',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '4px 12px'
              }}
            >
              {seatsLabel}
            </Badge>
          </div>
        )}

        {/* Action Buttons */}
        <div className="d-grid gap-2">
          <Button
            variant="outline-light"
            size="sm"
            style={{
              borderColor: 'rgba(0, 212, 255, 0.5)',
              color: '#00d4ff',
              background: 'rgba(0, 212, 255, 0.1)',
              borderRadius: '8px'
            }}
            href={`/game/${game.id}`}
          >
            <Target size={16} className="me-2" />
            View Details
          </Button>

          <Button
            onClick={handleRegisterClick}
            disabled={isActionDisabled || !onRegister}
            style={{
              background: isActionDisabled || !onRegister 
                ? 'rgba(100, 116, 139, 0.3)' 
                : 'linear-gradient(135deg, #00d4ff, #007bff)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontWeight: '600',
              boxShadow: !isActionDisabled && onRegister 
                ? '0 4px 15px rgba(0, 212, 255, 0.3)' 
                : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            {reg.key === "available" && onRegister ? (
              <>
                <Zap size={16} className="me-2" />
                Register Now
              </>
            ) : (
              reg.label
            )}
          </Button>
        </div>
      </Card.Body>

      <style>{`
        .game-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 212, 255, 0.2) !important;
          border-color: rgba(0, 212, 255, 0.4) !important;
        }
      `}</style>
    </Card>
  )
}

export default GameCard

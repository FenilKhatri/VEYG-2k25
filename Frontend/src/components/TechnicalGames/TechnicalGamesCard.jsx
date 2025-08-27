import { Badge } from "react-bootstrap"
import { Link } from "react-router-dom"
import { CheckCircle, Users, Calendar, IndianRupee, Zap, Trophy, LogIn } from "lucide-react"
import { getGameById } from "../../data/gamesData"

const TechnicalGameCard = ({ game, registeredGames, userId, isDisabled = false, registrationStatus = 'available' }) => {
  // Check if user has registered for any game on this day
  const hasRegisteredForDay = registeredGames && userId && registeredGames.some(reg => {
    const registeredGame = getGameById(parseInt(reg.gameId))
    return registeredGame && registeredGame.day === game.day && reg.userId === userId
  })
  
  // Check if user has registered for this specific game
  const isThisGameRegistered = registeredGames && userId && registeredGames.some(reg => parseInt(reg.gameId) === game.id && reg.userId === userId)

  return (
    <div className="tech-game-container h-100">
      <div className="tech-game-card position-relative h-100">
        {/* Header Section */}
        <div className="game-header">
          <div className="game-day-badge">
            <Zap size={14} />
            Day {game.day}
          </div>
          {isThisGameRegistered && (
            <div className="registered-badge">
              <CheckCircle size={14} />
              Registered
            </div>
          )}
        </div>

        {/* Game Title & Description */}
        <div className="game-info">
          <div className="game-title-section">
            <Trophy size={20} className="game-icon" />
            <h3 className="game-title">{game.name}</h3>
          </div>
          <p className="game-description">
            {game.description.length > 120 ? `${game.description.substring(0, 120)}...` : game.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-box">
            <Users size={16} className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">{game.maxTeamSize}</span>
              <span className="stat-label">Team Size</span>
            </div>
          </div>
          <div className="stat-box">
            <IndianRupee size={16} className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">₹{game.baseFee}</span>
              <span className="stat-label">Entry Fee</span>
            </div>
          </div>
          <div className="stat-box">
            <Calendar size={16} className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">{game.classification}</span>
              <span className="stat-label">Category</span>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="action-section">
          {!userId ? (
            // Non-logged user - show only view details
            <div className="action-buttons">
              <Link to={`/game/${game.id}`} className="btn-action primary">
                View Details
              </Link>
            </div>
          ) : isThisGameRegistered ? (
            <div className="action-buttons">
              <button className="btn-status registered" disabled>
                <CheckCircle size={16} />
                Registered
              </button>
              <Link to={`/game/${game.id}`} className="btn-action secondary">
                View Details
              </Link>
            </div>
          ) : isDisabled || hasRegisteredForDay ? (
            <div className="action-buttons">
              <div className="warning-text">Already registered for Day {game.day}</div>
              <button className="btn-status disabled" disabled>
                Registration Closed
              </button>
              <Link to={`/game/${game.id}`} className="btn-action secondary">
                View Details
              </Link>
            </div>
          ) : (
            <Link to={`/game/${game.id}`} className="btn-action primary full-width">
              <Zap size={16} />
              Register Now
            </Link>
          )}
        </div>
      </div>

      <style>{`
        .tech-game-container {
          height: 100%;
        }
        
        .tech-game-card {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .tech-game-card:hover {
          transform: translateY(-8px);
          border-color: rgba(0, 212, 255, 0.6);
          box-shadow: 0 20px 40px rgba(0, 212, 255, 0.15);
        }
        
        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .game-day-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(45deg, #007bff, #00d4ff);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .registered-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(45deg, #28a745, #20c997);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .game-info {
          flex: 1;
        }
        
        .game-title-section {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        
        .game-icon {
          color: #00d4ff;
        }
        
        .game-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: white;
          margin: 0;
          background: linear-gradient(45deg, #00d4ff, #007bff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .game-description {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        
        .stat-box {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        
        .stat-box:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(0, 212, 255, 0.3);
        }
        
        .stat-icon {
          color: #00d4ff;
          flex-shrink: 0;
        }
        
        .stat-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .stat-value {
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .stat-label {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.7rem;
        }
        
        .action-section {
          margin-top: auto;
        }
        
        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .warning-text {
          color: #ffc107;
          font-size: 0.8rem;
          text-align: center;
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 8px;
          padding: 8px;
        }
        
        .btn-action, .btn-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          border: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .btn-action.primary {
          background: linear-gradient(45deg, #007bff, #00d4ff);
          color: white;
        }
        
        .btn-action.primary:hover {
          background: linear-gradient(45deg, #0056b3, #00a8cc);
          transform: translateY(-2px);
          color: white;
        }
        
        .btn-action.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .btn-action.secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
        
        .btn-status.registered {
          background: linear-gradient(45deg, #28a745, #20c997);
          color: white;
        }
        
        .btn-status.disabled {
          background: rgba(108, 117, 125, 0.3);
          color: rgba(255, 255, 255, 0.5);
        }
        
        .full-width {
          width: 100%;
        }
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .tech-game-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  )
}

export default TechnicalGameCard

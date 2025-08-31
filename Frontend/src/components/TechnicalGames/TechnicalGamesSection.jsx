import React, { useState } from "react"
import { Container, Row, Col } from "react-bootstrap"
import TechnicalGameCard from "./TechnicalGamesCard"
import { useAuth } from "../../context/AuthContext"
import { useDayWiseRegistration } from "../../hooks/useDayWiseRegistration"
import RegistrationTimer from "../RegistrationTimer"
import { Code, Database, Terminal, Cpu, CheckCircle } from "lucide-react"

const TechnicalGamesSection = ({ day1Games, day2Games }) => {
  const { registeredGames, user } = useAuth()
  const {
    hasDay1Registration,
    hasDay2Registration,
    day1GameName,
    day2GameName,
    isGameRegistered,
    canRegisterForDay
  } = useDayWiseRegistration(registeredGames, user)

  const [isRegistrationExpired, setIsRegistrationExpired] = useState(false)
  const techIcons = [Code, Database, Terminal, Cpu]

  const handleRegistrationExpired = () => {
    setIsRegistrationExpired(true)
  }

  return (
    <section
      id="games"
      className="py-5 position-relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0b0f1a 0%, #1a1f2e 50%, #0f1419 100%)',
        minHeight: '100vh'
      }}
    >
      {/* Tech Pattern Background */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          opacity: 0.03,
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300eaff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          zIndex: 0
        }}
      />

      {/* Floating Tech Icons */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 1 }}>
        {techIcons.map((Icon, index) => (
          <Icon
            key={index}
            size={24}
            className="position-absolute text-primary"
            style={{
              top: `${20 + (index * 20)}%`,
              left: `${10 + (index * 20)}%`,
              opacity: 0.1,
              animation: `float ${3 + index}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>

      <Container style={{ position: 'relative', zIndex: 2 }}>
        {/* Registration Timer - Moved before title */}
        <RegistrationTimer
          deadline="2025-09-13T23:59:59"
          onExpired={handleRegistrationExpired}
        />
        
        <div className="text-center mb-5">
          <h2
            className="display-4 fw-bold mb-3"
            style={{
              background: 'linear-gradient(90deg, #00eaff, #ff00e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 25px rgba(0, 234, 255, 0.5)'
            }}
          >
            Technical Games
          </h2>
          <p
            className="lead"
            style={{
              color: '#9ddfff',
              fontSize: '1.1rem',
              opacity: 0.9
            }}
          >
            Challenge your technical skills and problem-solving abilities
          </p>
        </div>

        {/* Day 1 Games Section */}
        <div className="mb-5">
          <div className="text-center mb-4">
            <div
              className="d-inline-block px-4 py-2 rounded-pill mb-3"
              style={{
                background: 'rgba(0, 234, 255, 0.1)',
                border: '1px solid rgba(0, 234, 255, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h3
                className="fw-bold mb-0"
                style={{
                  color: '#00eaff',
                  fontSize: '1.5rem'
                }}
              >
                <Terminal size={20} className="me-2" />
                Day 1 Games
              </h3>
            </div>
            <p
              style={{
                color: '#b8e6ff',
                opacity: 0.8
              }}
            >
              Start your journey with these exciting challenges
            </p>
            {hasDay1Registration && (
              <div
                className="day-registration-alert d-inline-block px-4 py-3 rounded-pill mb-3"
                style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '2px solid rgba(34, 197, 94, 0.5)',
                  color: '#16a34a',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
                  animation: 'pulse-green 2s infinite',
                  fontSize: '1.1rem'
                }}
              >
                <CheckCircle size={20} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                You already registered 1 game in Day 1: <strong>{day1GameName}</strong>
              </div>
            )}
          </div>
          <div className="d-flex flex-column flex-md-row justify-content-center align-items-center">
            {day1Games.map((game, index) => (
              <React.Fragment key={game.id}>
                <div className="mb-4 mx-md-3" style={{ width: '100%', maxWidth: '500px' }}>
                  <TechnicalGameCard
                    game={game}
                    registeredGames={registeredGames}
                    userId={user?.username || user?.name || user?.id}
                    isThisGameRegistered={isGameRegistered(game.id)}
                    hasRegisteredForDay={hasDay1Registration}
                    canRegisterForDay={canRegisterForDay(1) && !isRegistrationExpired}
                    registrationStatus={isRegistrationExpired ? 'expired' : hasDay1Registration ? 'day_registered' : 'available'}
                    isRegistrationExpired={isRegistrationExpired}
                    registeredGameName={day1GameName}
                    registeredGameId={hasDay1Registration ? registeredGames.find(g => g.gameId?.startsWith('SAF-') && g.day === 1)?.gameId : ''}
                  />
                </div>
                {index < day1Games.length - 1 && (
                  <div className="mb-4 d-flex align-items-center justify-content-center">
                    <div className="mx-4 py-2 px-4 rounded-pill" style={{ background: 'rgba(0, 234, 255, 0.2)', border: '1px solid rgba(0, 234, 255, 0.5)', color: '#00eaff', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      OR
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Day 2 Games Section */}
        <div className="mb-5">
          <div className="text-center mb-4">
            <div
              className="d-inline-block px-4 py-2 rounded-pill mb-3"
              style={{
                background: 'rgba(255, 0, 229, 0.1)',
                border: '1px solid rgba(255, 0, 229, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h3
                className="fw-bold mb-0"
                style={{
                  color: '#ff00e5',
                  fontSize: '1.5rem'
                }}
              >
                <Cpu size={20} className="me-2" />
                Day 2 Games
              </h3>
            </div>
            <p
              style={{
                color: '#b8e6ff',
                opacity: 0.8
              }}
            >
              Continue the adventure with advanced challenges
            </p>
            {hasDay2Registration && (
              <div
                className="day-registration-alert d-inline-block px-4 py-3 rounded-pill mb-3"
                style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '2px solid rgba(34, 197, 94, 0.5)',
                  color: '#16a34a',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
                  animation: 'pulse-green 2s infinite',
                  fontSize: '1.1rem'
                }}
              >
                <CheckCircle size={20} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                You already registered 1 game in Day 2: <strong>{day2GameName}</strong>
              </div>
            )}
          </div>
          <div className="d-flex flex-column flex-md-row justify-content-center align-items-center">
            {day2Games.map((game, index) => (
              <React.Fragment key={game.id}>
                <div className="mb-4 mx-md-3" style={{ width: '100%', maxWidth: '500px' }}>
                  <TechnicalGameCard
                    game={game}
                    registeredGames={registeredGames}
                    userId={user?.username || user?.name || user?.id}
                    isThisGameRegistered={isGameRegistered(game.id)}
                    hasRegisteredForDay={hasDay2Registration}
                    canRegisterForDay={canRegisterForDay(2) && !isRegistrationExpired}
                    registrationStatus={isRegistrationExpired ? 'expired' : hasDay2Registration ? 'day_registered' : 'available'}
                    isRegistrationExpired={isRegistrationExpired}
                    registeredGameName={day2GameName}
                    registeredGameId={hasDay2Registration ? registeredGames.find(g => g.gameId?.startsWith('SAF-') && g.day === 2)?.gameId : ''}
                  />
                </div>
                {index < day2Games.length - 1 && (
                  <div className="mb-4 d-flex align-items-center justify-content-center">
                    <div className="mx-4 py-2 px-4 rounded-pill" style={{ background: 'rgba(0, 234, 255, 0.2)', border: '1px solid rgba(0, 234, 255, 0.5)', color: '#00eaff', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      OR
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Container>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            100% { transform: translateY(-20px); }
          }
          
          @keyframes pulse-green {
            0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
            100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
          }
          
          @keyframes pulse-yellow {
            0% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(255, 193, 7, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); }
          }
          
          .or-separator {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            margin: 10px 0;
          }
          
          .or-separator::before, .or-separator::after {
            content: "";
            flex: 1;
            height: 1px;
            background: linear-gradient(to right, rgba(0, 212, 255, 0), rgba(0, 212, 255, 0.5), rgba(0, 212, 255, 0));
            margin: 0 15px;
          }
          
          .or-separator span {
            padding: 8px 16px;
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid rgba(0, 212, 255, 0.3);
            border-radius: 20px;
            color: #00d4ff;
            font-weight: 600;
            font-size: 0.9rem;
            letter-spacing: 1px;
            box-shadow: 0 0 15px rgba(0, 212, 255, 0.2);
          }
          
          .day-registration-alert {
            transition: all 0.3s ease;
          }
          
          .day-registration-alert:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3) !important;
          }
        `}
      </style>
    </section>
  )
}

export default TechnicalGamesSection
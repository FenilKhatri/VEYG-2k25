import { Container, Row, Col } from "react-bootstrap"
import TechnicalGameCard from "./TechnicalGamesCard"
import { useAuth } from "../../context/AuthContext"
import { Code, Database, Terminal, Cpu } from "lucide-react"

const TechnicalGamesSection = ({ day1Games, day2Games }) => {
  const { registeredGames, user } = useAuth()

  const techIcons = [Code, Database, Terminal, Cpu]

  // Check if user has registered for any game on a specific day
  const hasRegisteredForDay = (dayGames) => {
    if (!registeredGames || !Array.isArray(registeredGames)) return false
    return registeredGames.some(registration =>
      dayGames.some(game => game.id === registration.gameId)
    )
  }

  const hasDay1Registration = hasRegisteredForDay(day1Games)
  const hasDay2Registration = hasRegisteredForDay(day2Games)

  // Get registered game name for a specific day
  const getRegisteredGameName = (dayGames) => {
    if (!registeredGames || !Array.isArray(registeredGames)) return null
    const registration = registeredGames.find(reg =>
      dayGames.some(game => game.id === reg.gameId)
    )
    return registration ? registration.gameName : null
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
                className="alert alert-success d-inline-block px-4 py-2 rounded-pill mb-3"
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#22c55e'
                }}
              >
                ✅ You have registered for: <strong>{getRegisteredGameName(day1Games)}</strong>
              </div>
            )}
          </div>
          <Row className="justify-content-center">
            {day1Games.map((game) => (
              <Col key={game.id} lg={6} md={6} className="mb-4">
                <TechnicalGameCard
                  game={game}
                  registeredGames={registeredGames}
                  userId={user?.username}
                  isDisabled={hasDay1Registration && !registeredGames.some(reg => reg.gameId === game.id)}
                  registrationStatus={hasDay1Registration ? 'day_registered' : 'available'}
                />
              </Col>
            ))}
          </Row>
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
                className="alert alert-success d-inline-block px-4 py-2 rounded-pill mb-3"
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#22c55e'
                }}
              >
                ✅ You have registered for: <strong>{getRegisteredGameName(day2Games)}</strong>
              </div>
            )}
          </div>
          <Row className="justify-content-center">
            {day2Games.map((game) => (
              <Col key={game.id} lg={6} md={6} className="mb-4">
                <TechnicalGameCard
                  game={game}
                  registeredGames={registeredGames}
                  userId={user?.username}
                  isDisabled={hasDay2Registration && !registeredGames.some(reg => reg.gameId === game.id)}
                  registrationStatus={hasDay2Registration ? 'day_registered' : 'available'}
                />
              </Col>
            ))}
          </Row>
        </div>
      </Container>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            100% { transform: translateY(-20px); }
          }
        `}
      </style>
    </section>
  )
}

export default TechnicalGamesSection

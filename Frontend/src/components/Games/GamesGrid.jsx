import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import GameCard from "./GameCard";
import { motion } from "framer-motion";
import "./GamesGrid.css"; // Importing styles

const GamesGrid = ({ 
  games = [], 
  userId,
  registeredGames = [], 
  onRegister 
}) => {
  if (!games || games.length === 0) {
    return (
      <Container className="games-empty py-5">
        <div className="text-center">
          <h4 className="no-games-title">No games available</h4>
          <p className="no-games-subtitle">Check back later for exciting competitions!</p>
        </div>
      </Container>
    );
  }

  // Check if user is registered for a game
  const isRegisteredForGame = (gameId) =>
    registeredGames.some((reg) => reg.gameId === gameId);

  // Check if user has registered for a specific day
  const hasRegisteredForDay = (day) =>
    registeredGames.some((reg) => reg.day === day);

  // Get registered game info for a specific day
  const getRegisteredGameForDay = (day) =>
    registeredGames.find((reg) => reg.day === day);

  return (
    <Container className="games-grid-container py-5">
      <div className="games-header text-center mb-5">
        <motion.h2
          className="games-title fw-bold mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Technical <span className="highlight">Competitions</span>
        </motion.h2>
        <motion.p
          className="games-subtitle fs-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Challenge yourself in cutting-edge technical competitions
        </motion.p>
      </div>

      <Row className="g-4 justify-content-center">
        {games.map((game, index) => {
          const isThisGameRegistered = isRegisteredForGame(game.id);
          const hasRegForDay = hasRegisteredForDay(game.day);
          const registeredGameForDay = getRegisteredGameForDay(game.day);

          return (
            <Col
              key={game.id}
              xs={12}
              sm={6}
              md={6}
              lg={4}
              xl={3}
              className="d-flex"
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="game-card-wrapper"
              >
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
              </motion.div>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default GamesGrid;
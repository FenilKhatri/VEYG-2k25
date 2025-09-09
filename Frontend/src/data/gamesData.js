export const games = [
  // Day 1 Games
  {
    id: 1,
    name: "Algo Cricket – A Fun Coding Game",
    gameCode: "AlgCrc",
    day: 1,
    classification: "Technical",
    description: "A coding-based cricket game where players score runs by solving coding problems. Correct answers earn runs, while mistakes can cost wickets, making coding fun and competitive.",
    image: '/Logo/algo cricket.jpg',
    logo: "🧠",
    baseFee: 60,
    registrationType: "team",
    minTeamSize: 3,
    maxTeamSize: 3,
    estimatedTime: "1-2 hours",
    requirements: {
      mandatory: [
        "- Payment confirmation is mandatory. After registration confirm your payment to register the game. ",
        "- Physical presence is mandatory.",
        "- E-certificates will only be given to those who are physically present and have completed the event."
      ],
    },
  },
  {
    id: 2,
    name: "BrainGo",
    gameCode: "BGo",
    day: 1,
    classification: "Technical",
    description: "A two-round challenge: first, a rapid-fire buzzer quiz with tech, math, and general knowledge questions; second, an Alphabet Bingo round where letters map to numbers. Speed, memory, and strategy decide the winners. Student from any semester may participate in this event",
    image: '/Logo/brain go.jpg',
    logo: "💻",
    baseFee: 60,
    registrationType: "team",
    minTeamSize: 3,
    maxTeamSize: 3,
    estimatedTime: "2-3 Hours",
    requirements: {
      mandatory: [
        "- Payment confirmation is mandatory. After registration confirm your payment to register the game. ",
        "- Physical presence is mandatory.",
        "- E-certificates will only be given to those who are physically present and have completed the event."
      ],
    },
  },
  // Day 2 Games
  {
    id: 3,
    name: "Logo2Logic",
    gameCode: "L2L",
    day: 2,
    classification: "Technical",
    description: " Logo2Logic is a team-based game designed to combine quick thinking with communication skills. The competition will be played in teams of 4 players, where both team members actively participate across two engaging rounds",
    image: '/Logo/logic 2 logic.jpg',
    logo: "🤖",
    baseFee: 60,
    registrationType: "team",
    minTeamSize: 4,
    maxTeamSize: 4,
    estimatedTime: "2 hours",
    requirements: {
      mandatory: [
        "- Payment confirmation is mandatory. After registration confirm your payment to register the game. ",
        "- Physical presence is mandatory.",
        "- E-certificates will only be given to those who are physically present and have completed the event."
      ],
    },
  },
  {
    id: 4,
    name: "Blind Code to Key",
    gameCode: "BCK",
    day: 2,
    classification: "Technical",
    description: "Blind Code To Key is a Two-Round challenge that tests both coding skills and problem-solving ability. In round 1, Players solve coding problems on a locked black screen. In round 2, they hunt QR codes to collect hidden characters and unlock the final key. The game blends logic and coding skills. Open for student who has a knowledge of C.",
    image: '/Logo/blind coding to key.jpg',
    logo: "🧠",
    baseFee: 60,
    registrationType: "team",
    minTeamSize: 2,
    maxTeamSize: 2,
    estimatedTime: "1-2 hour",
    requirements: {
      mandatory: [
        "- Payment confirmation is mandatory. After registration confirm your payment to register the game. ",
        "- Physical presence is mandatory.",
        "- E-certificates will only be given to those who are physically present and have completed the event."
      ],
    },
  },
]

// Calculate total fee based on team size
export const calculateTotalFee = (baseFee, teamSize) => {
  return baseFee * teamSize;
};

export const getGameById = (id) => games.find((game) => game.id === Number.parseInt(id));
export const getAllGames = () => games;
export const getGamesByDay = (day) => games.filter((game) => game.day === day);
export const getDay1Games = () => getGamesByDay(1);
export const getDay2Games = () => getGamesByDay(2);
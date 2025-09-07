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
  },
  // Day 2 Games
  {
    id: 3,
    name: "Logo2Logic",
    gameCode: "L2L",
    day: 2,
    classification: "Technical",
    description: " Logo2Logic is a fun yet challenging event designed to test both your observation and logical thinking skills. Participants will work in teams of two and tackle exciting tasks that blend creativity with problem-solving. From quick recognition to applying coding knowledge, this game ensures a mix of thrill, intellect, and teamwork.",
    image: '/Logo/logic 2 logic.jpg',
    logo: "🤖",
    baseFee: 60,
    registrationType: "team",
    minTeamSize: 4,
    maxTeamSize: 4,
    estimatedTime: "2 hours",
  },
  {
    id: 4,
    name: "Blind Code to Key",
    gameCode: "BCK",
    day: 2,
    classification: "Technical",
    description: "An interesting challenge for coding on blind screen with round one and two with treasure hunt.A coding challenge where players solve problems on a locked screen, then hunt QR codes to unlock the hidden key—mixing logic, coding, and code-breaking.",
    image: '/Logo/blind coding to key.jpg',
    logo: "🧠",
    baseFee: 60,
    registrationType: "team",
    minTeamSize: 2,
    maxTeamSize: 2,
    estimatedTime: "1-2 hour",
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
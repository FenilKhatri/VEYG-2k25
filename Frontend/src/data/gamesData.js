export const games = [
  // Day 1 Games
  {
    id: 1,
    name: "Algo Cricket – A Fun Coding Game",
    gameCode: "AlgCrc",
    day: 1,
    classification: "Technical",
    description: "Algo Cricket is a fun and technical game that combines the thrill of cricket with problem-solving and coding. Players score runs by solving coding problems. Correct answers add runs, while wrong answers may lead to a wicket. It is designed to make coding fun, competitive, and interactive.",
    image: null,
    logo: "🧠",
    baseFee: 150,
    registrationType: "team",
    minTeamSize: 3,
    maxTeamSize: 4,
    rules: [
      "Teams of 3-4 members.",
      "Which semesters can participate in: 3rd, 5th, 7th",
      "Total Round: 1 with three levels l easy,medium and hard.",
      "Total Time: per Round + Coordination + Closing",
      "Description of rounds (2-3 lines): Easy level has 1 point as one run in cricket,medium level has 4 point as 4 in match and hard level has 6 point as six in match.",
      "Each team plays equal overs (e.g., 2 overs each).",
      "Correct answer → Runs scored (based on difficulty).",
      "Wrong answer → Wicket lost.",
      "The team with the highest runs at the end wins.",
      "Tie-breaker: Sudden another coding challenge.",
      "Points : Easy (1 Run)",
      "Medium (4 Run)",
      "Hard (6run)",
    ],
    estimatedTime: "1-2 hours",
  },
  {
    id: 2,
    name: "BrainGo",
    gameCode: "BGo",
    day: 1,
    classification: "Technical",
    description: "The competition begins with a fast-paced quiz round, where teams race to answer tech and General awareness and maths based questions using the buzzer, testing their speed and accuracy. In the second round, the challenge shifts to Alphabet Bingo, where letters are called out and teams must mark the corresponding numbers on their Bingo sheet. Quick thinking, sharp memory, and smart strategy will decide the winners.",
    image: null,
    logo: "💻",
    baseFee: 200,
    registrationType: "both", // Allows both individual and team registration
    minTeamSize: 1,
    maxTeamSize: 3,
    rules: [
      "Team or Individual: Team or solo",
      "If team (Mention number of participants): 3",
      "Which semester can participate in: 1st Sem mostly but open for all.",
      "Total Rounds: 2",
      "Total time: (per Round + Coordination + Closing): 2 Hour +15 mins",
      "Round 1: A fast-paced round where teams compete to answer general awareness,  maths and tech-related rapid-fire questions using the buzzer. The first team to buzz gets the chance to answer — correct answers earn points, while wrong ones lead to a small penalty. These rounds test speed, accuracy, and presence of mind.",
      "Round 2: Teams receive a Bingo sheet (numbers 1–25). The host calls out the Alphabet and teams must quickly convert and mark them if present. To make it more challenging, some binary calls come with a small puzzle or riddle.",
      `Rule & Guidelines: (Point wise)
        1.Each correct answer = +10 points
        2.Wrong answer = –5 points
        3.Pass allowed once per team
      `,
    ],
    estimatedTime: "2-3 Hours",
  },
  // Day 2 Games
  {
    id: 3,
    name: "Logo2Logic",
    gameCode: "L2L",
    day: 2,
    classification: "Technical",
    description: "Logo2Logic combines visual recognition with coding skills. Round 1: Logo Identification - teams identify blurred/partial logos from tech and agricultural companies within 10 seconds, then give a short speech about the selected logo. Round 2: Rebuilder - participants face coding challenges with missing logic lines and must complete the code within the given time limit, testing problem-solving and programming abilities.",
    image: null,
    logo: "🤖",
    baseFee: 300,
    registrationType: "team",
    minTeamSize: 3,
    maxTeamSize: 3,
    rules: [
      "Team: Team or Individual",
      "If team (Mention number of participants): 4",
      "Total time : (per Round + Coordination + Closing): 2 Hours",
      `Description of rounds:
        Round – 1 (Logo Identification) -
          First the logos are shown on the main screen for 10 seconds then any 2 member form team selects the logo and gives the speech on stage.
          Setup: A presentation or PC slideshow displays 20 zoomed-in, blurred, or partial images of logos.
          Logos include:
          • Technology brands (Microsoft, Intel, Python, Arduino, etc.)
          • Agricultural companies/tools (John Deere, Mahindra Tractors, seed
          brands) for the Vegy theme.
          • Each image is displayed for 10 seconds, then automatically moves to
          the next.
          • Teams must identify the correct brand or technology from the image.
          • Once a slide passes, it cannot be shown again
          • Logo identifying - +5 points , speech - out of 10

        Round – 2 (Rebuilder) -
          Codes that have missing logic line and the participants have to write the code.
          • 15 pc with the missing codes in file.
          • Correct fix = +10 points.
          • Wrong/incorrect submission = 0 points (no negative so teams attempt).
      `,
    ],
    estimatedTime: "2 hours",
  },
  {
    id: 4,
    name: "Blind Code to Key",
    gameCode: "BCK",
    day: 2,
    classification: "Technical",
    description: "Blind Code to Key is an intense coding challenge in a strict exam environment. Players solve problems on locked screens to prevent cheating, then hunt for QR codes to unlock hidden keys. This game combines logic, coding, and code-breaking skills, taking participants on an exciting journey from blind coding to key discovery.",
    image: null,
    logo: "🧠",
    baseFee: 250,
    registrationType: "both", // Allows both individual and team registration
    minTeamSize: 1,
    maxTeamSize: 2,
    rules: [
      "Which semester can participate in: 3rd, 5th and 7th",
      "Total Rounds: 2 Rounds",
      "Team or Individual: Team or solo",
      `Time
        Round 1: 25 minutes
        Round 2: 50 minutes
      `,
      "Total: 1 hour 30 minutes",
      "Round 1: Participants face coding problems in a strict exam-like setup. The screen stays black & locked to avoid cheating and distractions. Players must rely on pure logic and coding skill to succeed",
      "Round 2: Players scan QR codes hidden around the area to collect characters. They must arrange them correctly to form a secret key. This round test speed, observation, and puzzle-solving ability.",
      "Venue: Labs and Seminar Hall",
      `Description of rounds:
        Round – 1 -
          •Duration: 20 minutes per player.
          •Locked Screen: Players cannot access their editor while the black screen is active.
          •Automatic Unlocks: Every 5 minutes, the screen unlocks for 30
          •seconds so players can check and continue their code.
          •End of Game: After 20 minutes, the system ends automatically, and the screen unlocks permanently.
          •Permanent Unlock / End Game :Admin can fully unlock the screen or stop the game at any time.
          •Timer Reset: Admin can reset the timer in case of technical issues.

        Round – 2 -
          •Duration: 45 minutes per player
          •Players must search for and scan QR codes hidden around the venue.
          •Each QR code reveals a character/letter. Collect all characters.
          •Arrange the collected characters into the correct password/key.
          •The first player/team to submit the correct key wins the round.
      `,
    ],
    estimatedTime: "1-2 hour",
  },
]

// Calculate total fee based on team size
export const calculateTotalFee = (baseFee, teamSize) => {
  return baseFee * teamSize;
};

export const getGameById = (id) => games.find((game) => game.id === Number.parseInt(id))
export const getAllGames = () => games
export const getGamesByDay = (day) => games.filter((game) => game.day === day)
export const getDay1Games = () => getGamesByDay(1)
export const getDay2Games = () => getGamesByDay(2)

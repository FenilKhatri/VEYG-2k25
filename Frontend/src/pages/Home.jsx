import HeroSection from "../components/HeroSection/HeroSection"
import TechnicalGamesSection from "../components/TechnicalGames/TechnicalGamesSection"
import { getDay1Games, getDay2Games } from "../data/gamesData"

const Home = ({ showToast, user, isLoggedIn }) => {
  const day1Games = getDay1Games()
  const day2Games = getDay2Games()

  return (
    <>
      <HeroSection />
      <TechnicalGamesSection
        day1Games={day1Games}
        day2Games={day2Games}
        user={user}
        isLoggedIn={isLoggedIn}
        showToast={showToast}
      />
    </>
  )
}

export default Home

import HeroSection from "../components/HeroSection/HeroSection"
import SponsorSlider from "../components/SponsorSlider/SponsorSlider"
import TechnicalGamesSection from "../components/TechnicalGames/TechnicalGamesSection"
import AdminStatsCard from "../components/AdminStatsCard/AdminStatsCard"
import { getDay1Games, getDay2Games } from "../data/gamesData"

const Home = ({ showToast, user, isLoggedIn }) => {
  const day1Games = getDay1Games()
  const day2Games = getDay2Games()

  return (
    <>
      <HeroSection />
      <AdminStatsCard user={user} />
      <SponsorSlider />
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

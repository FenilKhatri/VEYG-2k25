import HeroSection from "../components/HeroSection/HeroSection"
import SponsorSlider from "../components/SponsorSlider/SponsorSlider"
import GamesSection from "../components/Games/GamesSection"
import { getDay1Games, getDay2Games } from "../data/gamesData"

const Home = ({ showToast, user, isLoggedIn }) => {
  const day1Games = getDay1Games()
  const day2Games = getDay2Games()

  return (
    <div className="min-h-screen bg-slate-900">
      <HeroSection />
      <SponsorSlider />
      
      <GamesSection
        day1Games={day1Games}
        day2Games={day2Games}
        user={user}
        isLoggedIn={isLoggedIn}
        showToast={showToast}
      />
    </div>
  )
}

export default Home

import Home from "./Home"
import Navbar from "./Navbar"
import Features from "./Features"
import GetStarted from "./GetStarted"


const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Home />
      <Features />
      <GetStarted />
      
    </div>
  )
}

export default LandingPage




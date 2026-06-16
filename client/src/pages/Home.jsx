import BestSellers from "../components/BestSellers"
import FeaturedFoods from "../components/FeaturedFoods"
import Footer from "../components/Footer"
import HeroSection from "../components/HeroSection"
import PublicNavbar from "../components/PublicNavbar"
import SpecialOffers from "../components/SpecialOffers"

const Home = () => {
  return (
    <>
    <PublicNavbar />
    <HeroSection />
    <FeaturedFoods />
    <BestSellers />
    <SpecialOffers />
    <Footer />
    </>
  )
}
export default Home
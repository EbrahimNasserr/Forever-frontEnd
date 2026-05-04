import Hero from "../components/home/Hero.jsx";
import LatestCollection from "../components/home/LatestCollection.jsx";
import BestSeller from "../components/home/BestSeller.jsx";
import OurPolicy from "../components/home/OurPolicy.jsx";

const Home = () => {
  return (
    <main>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
    </main>
  );
};

export default Home;

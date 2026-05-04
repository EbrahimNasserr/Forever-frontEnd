import Hero from "../components/home/Hero.jsx";
import LatestCollection from "../components/home/LatestCollection.jsx";
import BestSeller from "../components/home/BestSeller.jsx";
import OurPolicy from "../components/home/OurPolicy.jsx";
import NewSletter from "../components/home/NewSletter.jsx";

const Home = () => {
  return (
    <main>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewSletter />
    </main>
  );
};

export default Home;

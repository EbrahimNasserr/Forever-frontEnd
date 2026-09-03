import Hero from "../components/home/Hero.jsx";
import FeaturedCategories from "../components/home/FeaturedCategories.jsx";
import LatestCollection from "../components/home/LatestCollection.jsx";
import NewCollection from "../components/home/NewCollection.jsx";
import BestSeller from "../components/home/BestSeller.jsx";
import CustomerReviews from "../components/home/CustomerReviews.jsx";
import AboutBrand from "../components/home/AboutBrand.jsx";
import OurPolicy from "../components/home/OurPolicy.jsx";
import NewSletter from "../components/home/NewSletter.jsx";

/**
 * Props forwarded from App:
 *   onQuickView        (product) => void
 *   wishlistIds        string[]
 *   onToggleWishlist   (id) => void
 *   isInWishlist       (id) => boolean
 */
const Home = ({ onQuickView, wishlistIds = [], onToggleWishlist, isInWishlist }) => (
  <main>
    {/* 1. Full-screen editorial hero */}
    <Hero />

    {/* 2. Shop by category showcase */}
    <FeaturedCategories />

    {/* 3. New arrivals carousel */}
    <LatestCollection
      wishlistIds={wishlistIds}
      onToggleWishlist={onToggleWishlist}
      onQuickView={onQuickView}
    />

    {/* 4. New season editorial feature */}
    <NewCollection />

    {/* 5. Best sellers grid */}
    <BestSeller
      onQuickView={onQuickView}
      wishlistIds={wishlistIds}
      onToggleWishlist={onToggleWishlist}
      isInWishlist={isInWishlist}
    />

    {/* 6. Customer review marquee */}
    <CustomerReviews />

    {/* 7. Brand story & counters */}
    <AboutBrand />

    {/* 8. Policy strip */}
    <OurPolicy />

    {/* 9. Newsletter */}
    <NewSletter />
  </main>
);

export default Home;

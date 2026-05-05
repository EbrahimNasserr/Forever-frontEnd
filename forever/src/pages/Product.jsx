import { useParams } from "react-router-dom";
import Hero from "../components/productDetails/Hero.jsx";

const Product = () => {
  const { id } = useParams();

  return (
    <div>
      <Hero key={id} productId={id} />
    </div>
  );
};

export default Product;

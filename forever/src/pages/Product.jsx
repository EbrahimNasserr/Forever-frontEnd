import { useParams } from "react-router-dom";
import ProductDetails from "../components/productDetails/ProductDetails.jsx";

const Product = () => {
  const { id } = useParams();

  return (
    <div>
      <ProductDetails key={id} productId={id} />
    </div>
  );
};

export default Product;

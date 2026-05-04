import Title from "../share/Title.jsx";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import ProductItem from "../share/ProductItem.jsx";

const BestSeller = () => {
  const products = useSelector((state) => state.products.items);

  const bestSellers = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return [...products].filter((p) => p.bestseller === true).slice(0, 8);
  }, [products]);

  return (
    <section className="my-12 max-w-7xl mx-auto">
      <div className="mb-6">
        <Title title1="Best " title2="Sellers" />
        <p className="text-sm text-gray-500 text-center">
          Our best sellers picked from the catalog.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {bestSellers.map((p) => (
          <ProductItem key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default BestSeller;

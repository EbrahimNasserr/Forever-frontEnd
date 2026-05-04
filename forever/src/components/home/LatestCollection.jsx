import { useMemo } from "react";
import { useSelector } from "react-redux";
import Title from "../share/Title.jsx";
import ProductItem from "../share/ProductItem.jsx";

const LatestCollection = () => {
  const products = useSelector((state) => state.products.items);

  const latest = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return [...products]
      .sort((a, b) => (b?.date ?? 0) - (a?.date ?? 0))
      .slice(0, 8);
  }, [products]);

  return (
    <section className="my-12">
      <div className="mb-6">
        <Title title1="Latest " title2="Collection" />
        <p className="text-sm text-gray-500 text-center">
          New arrivals picked from the catalog.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {latest.map((p) => (
          <ProductItem key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default LatestCollection;

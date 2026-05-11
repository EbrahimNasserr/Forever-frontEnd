import ProductItem from "../share/ProductItem.jsx";

const ProductGrid = ({ products }) => {
  if (!Array.isArray(products) || products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductItem key={p._id} product={p} />
      ))}
    </div>
  );
};

export default ProductGrid;

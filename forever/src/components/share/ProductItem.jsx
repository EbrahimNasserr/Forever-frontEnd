import { Link } from "react-router-dom";

const ProductItem = ({ product }) => {
  return (
    <article className="group rounded-lg border border-gray-200 p-3">
      <Link to={`/product/${product._id}`}>
        <div className="aspect-square overflow-hidden rounded-md bg-gray-50">
          <img
            src={product?.image?.[0]}
            alt={product?.name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>

        <div className="mt-3">
          <h3 className="line-clamp-1 text-sm font-medium">{product?.name}</h3>
          <p className="mt-1 text-sm font-semibold">${product?.price}</p>
        </div>
      </Link>
    </article>
  );
};

export default ProductItem;

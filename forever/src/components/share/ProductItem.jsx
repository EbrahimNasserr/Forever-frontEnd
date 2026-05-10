import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ProductItem = ({ product, index = 0, className = "" }) => {
  const image = product?.image?.[0] ?? product?.images?.[0] ?? "";
  const name = product?.name ?? "Product";
  const description = product?.description ?? "";
  const price = Number(product?.price) || 0;
  const id = product?._id;
  const stock = Number(product?.stock) || 0;
  const sizes = Array.isArray(product?.sizes)
    ? product.sizes
    : Array.isArray(product?.size)
      ? product.size
      : [];
  const colors = Array.isArray(product?.colors)
    ? product.colors
    : Array.isArray(product?.color)
      ? product.color
      : [];

  const safeIndex = Number.isFinite(Number(index)) ? Number(index) : 0;

  const formattedPrice = useMemo(() => `$${price.toFixed(2)}`, [price]);

  const sizesText = sizes.length ? sizes.join(", ") : "N/A";

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        duration: 0.45,
        delay: Math.min(0.4, safeIndex * 0.06),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={["group", className].join(" ")}
    >
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm transition-all duration-300 hover:border-gray-900/20 hover:shadow-xl">
          <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.08, rotate: 1.5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Link
                to={id ? `/product/${id}` : "#"}
                aria-label={name}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <img
                  src={image}
                  alt={name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </Link>
            </motion.div>

            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-70"
              whileHover={{ opacity: 0.35 }}
              transition={{ duration: 0.3 }}
            />

            <motion.div
              className="absolute right-4 top-4 rounded-full bg-gray-900/90 px-3 py-1 text-xs font-semibold text-white"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: Math.min(0.6, safeIndex * 0.06 + 0.2),
                type: "spring",
                stiffness: 220,
              }}
            >
              {stock > 0 ? "In Stock" : "Out of Stock"}
            </motion.div>
          </div>

          <div className="space-y-4 p-5">
            <div className="space-y-1">
              <motion.h3
                className="line-clamp-1 text-sm font-semibold text-gray-900"
                whileHover={{ x: 3 }}
                transition={{ duration: 0.15 }}
              >
                <Link
                  to={id ? `/product/${id}` : "#"}
                  className="focus-visible:outline-none"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {name}
                </Link>
              </motion.h3>
              <p className="line-clamp-1 text-xs text-gray-500">
                {description}
              </p>
            </div>

            <motion.div
              className="text-xl font-bold tracking-tight text-gray-900"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: Math.min(0.7, safeIndex * 0.06 + 0.25) }}
            >
              {formattedPrice}
            </motion.div>

            <div className="flex items-center justify-between gap-3">
              {/* <span className="text-xs font-medium text-gray-500">
                Stock: {stock}
              </span> */}
              <span className="text-xs font-medium text-gray-500">
                 {sizesText}
              </span>
            </div>
            <div className="flex gap-2 mt-1">
              {colors.map((color, idx) => (
                <div
                  key={idx}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
};

export default ProductItem;

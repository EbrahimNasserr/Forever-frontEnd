import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "../../features/cart/useCart";

const ProductItem = ({ product, index = 0, className = "" }) => {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const image = product?.image?.[0] ?? "";
  const name = product?.name ?? "Product";
  const description = product?.description ?? "";
  const price = Number(product?.price) || 0;
  const id = product?._id;

  const safeIndex = Number.isFinite(Number(index)) ? Number(index) : 0;

  const onIncrease = () => setQuantity((q) => Math.min(q + 1, 10));
  const onDecrease = () => setQuantity((q) => Math.max(q - 1, 1));

  const onAddToCart = () => {
    if (!id) return;
    add({ productId: id, quantity, product });
    setIsAdded(true);
    toast.success("Added to cart");
    window.setTimeout(() => setIsAdded(false), 1200);
  };

  const formattedPrice = useMemo(() => `$${price.toFixed(2)}`, [price]);

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
      <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25, ease: "easeOut" }}>
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
                <img src={image} alt={name} className="h-full w-full object-cover" loading="lazy" />
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
              transition={{ delay: Math.min(0.6, safeIndex * 0.06 + 0.2), type: "spring", stiffness: 220 }}
            >
              New
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
              <p className="line-clamp-2 text-xs text-gray-500">{description}</p>
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
              <span className="text-xs font-medium text-gray-500">Quantity</span>
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-1 ring-1 ring-gray-200/70">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onDecrease}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60 hover:bg-gray-900 hover:text-white"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </motion.button>

                <motion.span
                  key={quantity}
                  initial={{ scale: 1.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-7 text-center text-sm font-semibold text-gray-900"
                >
                  {quantity}
                </motion.span>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onIncrease}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60 hover:bg-gray-900 hover:text-white"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAddToCart}
              onPointerDown={(e) => e.stopPropagation()}
              className={[
                "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors",
                isAdded ? "bg-green-600 text-white" : "bg-gray-900 text-white hover:bg-black",
              ].join(" ")}
            >
              <motion.span
                animate={isAdded ? { rotate: 360, scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.45 }}
                className="inline-flex"
              >
                <ShoppingCart className="h-4 w-4" />
              </motion.span>
              {isAdded ? "Added!" : "Add to Cart"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
};

export default ProductItem;

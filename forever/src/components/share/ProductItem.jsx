import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Eye, Heart, Plus } from "lucide-react";
import { useCart } from "../../features/cart/useCart";
import { toast } from "react-toastify";

/**
 * ProductItem
 *
 * Props:
 *   product           object   — product data (_id, name, image/images, price, sizes, colors, etc.)
 *   index             number   — stagger index for entrance animation
 *   className         string   — extra classes on the wrapper
 *   wishlistIds       string[] — currently wishlisted ids (optional)
 *   onToggleWishlist  (id) => void  — toggle wishlist (optional)
 *   onQuickView       (product) => void  — open quick view modal (optional)
 */
const ProductItem = ({
  product,
  index = 0,
  className = "",
  wishlistIds = [],
  onToggleWishlist,
  onQuickView,
}) => {
  /* ── Derived data ── */
  const images = useMemo(() => {
    const imgs = product?.image ?? product?.images;
    return Array.isArray(imgs) ? imgs.filter(Boolean) : [];
  }, [product]);

  const name = product?.name ?? "Product";
  const price = Number(product?.price) || 0;
  const id = product?._id;

  const sizes = useMemo(() => {
    const s = product?.sizes ?? product?.size;
    return Array.isArray(s) ? s.filter(Boolean) : [];
  }, [product]);

  const colors = useMemo(() => {
    const c = product?.colors ?? product?.color;
    return Array.isArray(c) ? c.filter(Boolean) : [];
  }, [product]);

  const category =
    typeof product?.category === "object"
      ? (product.category?.name ?? "")
      : (product?.category ?? "");

  const formattedPrice = useMemo(() => `$${price.toFixed(2)}`, [price]);
  const safeIndex = Number.isFinite(Number(index)) ? Number(index) : 0;

  /* ── Local state ── */
  const [isHovered, setIsHovered] = useState(false);
  const [justAddedSize, setJustAddedSize] = useState(null);

  const isFav = id ? wishlistIds.includes(id) : false;

  const { add } = useCart();

  /* ── Quick-add handler ── */
  const handleQuickAdd = async (size, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!id) return;
    try {
      await add({
        productId: id,
        size: size || sizes[0] || "",
        color: colors[0] ?? "",
        quantity: 1,
        product,
      });
      setJustAddedSize(size);
      toast.success(`${name} added to bag`);
      setTimeout(() => setJustAddedSize(null), 2000);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Failed to add to cart");
    }
  };

  const isJustAdded = justAddedSize !== null;

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.45,
        delay: Math.min(0.4, safeIndex * 0.06),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={[
        "group relative flex flex-col bg-[#FAF8F5] rounded-[32px] overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ── Image Container ── */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#E5E2DD]">

        {/* Primary image */}
        <Link to={id ? `/product/${id}` : "#"} aria-label={name} tabIndex={-1}>
          <img
            src={images[0]}
            alt={name}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered && images[1]
                ? "opacity-0 scale-105"
                : "opacity-100 scale-100 group-hover:scale-105"
            }`}
            loading="lazy"
          />
        </Link>

        {/* Secondary (hover-swap) image */}
        {images[1] && (
          <Link to={id ? `/product/${id}` : "#"} aria-label={name} tabIndex={-1}>
            <img
              src={images[1]}
              alt={`${name} alternate view`}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
              loading="lazy"
            />
          </Link>
        )}

        {/* Category / bestseller badge */}
        {(category || product?.bestseller) && (
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
            {product?.bestseller && (
              <span className="text-[10px] uppercase letter-spaced font-bold text-[#1A1A1A] bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-black/5 shadow-sm">
                Best Seller
              </span>
            )}
            {category && !product?.bestseller && (
              <span className="text-[10px] uppercase letter-spaced font-bold text-[#1A1A1A] bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-black/5 shadow-sm">
                {category}
              </span>
            )}
          </div>
        )}

        {/* Action buttons — top right */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          {/* Wishlist */}
          {onToggleWishlist && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleWishlist(id);
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                isFav
                  ? "bg-[#1A1A1A] text-[#F5F2ED]"
                  : "bg-[#F5F2ED]/90 hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white backdrop-blur-sm"
              }`}
              aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`w-4 h-4 ${isFav ? "fill-[#C86D44] text-[#C86D44]" : ""}`}
              />
            </button>
          )}

          {/* Quick View */}
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-9 h-9 rounded-full bg-[#F5F2ED]/90 hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white flex items-center justify-center transition-all duration-300 shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Hover Quick-Add Size Overlay */}
        {sizes.length > 0 && (
          <div
            className={`absolute inset-x-3 bottom-3 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-black/10 transition-all duration-300 z-20 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3 pointer-events-none"
            }`}
          >
            <div className="text-[10px] uppercase letter-spaced font-bold text-[#1A1A1A]/70 mb-2 text-center">
              Quick Add Size
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {sizes.slice(0, 4).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={(e) => handleQuickAdd(size, e)}
                  className="py-1.5 text-[11px] font-bold text-[#1A1A1A] bg-[#F5F2ED] hover:bg-[#1A1A1A] hover:text-white rounded-lg border border-black/5 transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Product Details ── */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between bg-[#FAF8F5]">
        <div>
          {/* Meta row */}
          <div className="flex items-center justify-between text-[10px] uppercase letter-spaced font-bold text-[#1A1A1A]/50 mb-1.5">
            <span>{category || product?.subCategory || ""}</span>
            {colors.length > 0 && (
              <div className="flex items-center gap-1">
                {colors.slice(0, 4).map((c, i) => (
                  <span
                    key={i}
                    className="w-3 h-3 rounded-full border border-black/20 inline-block"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Name */}
          <Link to={id ? `/product/${id}` : "#"}>
            <h3 className="prata-regular text-xl sm:text-2xl text-[#1A1A1A] font-bold leading-snug hover:opacity-60 transition-opacity line-clamp-2">
              {name}
            </h3>
          </Link>

          {/* Description */}
          {product?.description && (
            <p className="text-xs text-[#1A1A1A]/60 mt-1 line-clamp-1 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Bottom row — price & quick-add button */}
        <div className="mt-5 pt-4 border-t border-black/5 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[#1A1A1A]">
              {formattedPrice}
            </span>
            {product?.originalPrice && (
              <span className="text-xs text-[#1A1A1A]/40 line-through">
                ${Number(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => handleQuickAdd(sizes[0] ?? "", e)}
            className="inline-flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#333] text-[#F5F2ED] px-4 py-2 rounded-full text-[11px] font-bold uppercase letter-spaced transition-all duration-300 hover:scale-105 shrink-0"
          >
            {isJustAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>ADDED</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>BAG</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductItem;

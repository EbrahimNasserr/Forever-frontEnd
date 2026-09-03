import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, Heart, Plus, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import { useGetAllProductsQuery } from "../../features/products/productsApi";
import { useCart } from "../../features/cart/useCart";

// ─── Filter tabs ─────────────────────────────────────────────────────────────

const FILTER_TABS = [
  { id: "all",        label: "All" },
  { id: "Men",        label: "Men" },
  { id: "Women",      label: "Women" },
  { id: "Kids",       label: "Kids" },
];

// ─── Product Card ─────────────────────────────────────────────────────────────

const ProductCard = ({ product, index, onQuickView, isFav = false, onToggleWishlist }) => {
  const navigate = useNavigate();
  const { add } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [showSizes, setShowSizes] = useState(false);

  const img1 = product?.image?.[0] ?? "";
  const img2 = product?.image?.[1] ?? "";
  const sizes = Array.isArray(product?.sizes) ? product.sizes : [];
  const price = Number(product?.price) || 0;

  const handleQuickAdd = async (size, e) => {
    e?.stopPropagation();
    try {
      await add({
        productId: product._id,
        size,
        quantity: 1,
        product,
      });
      setJustAdded(true);
      setShowSizes(false);
      toast.success(`${product.name} added to cart`);
      setTimeout(() => setJustAdded(false), 1800);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (sizes.length <= 1) {
      handleQuickAdd(sizes[0] ?? "", e);
    } else {
      setShowSizes((v) => !v);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.07, 0.35) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setShowSizes(false); }}
      className="group relative flex flex-col bg-[#FAF8F5] rounded-[28px] overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5"
    >
      {/* ── Image container ── */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#EDEAE5] cursor-pointer"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        {/* Primary image */}
        <motion.img
          src={img1}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.06 : 1, opacity: isHovered && img2 ? 0 : 1 }}
          transition={{ duration: 0.55 }}
          loading="lazy"
        />

        {/* Secondary image on hover */}
        {img2 && (
          <motion.img
            src={img2}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.45 }}
            loading="lazy"
          />
        )}

        {/* Bestseller badge */}
        {product.bestseller && (
          <div className="absolute top-3 left-3 bg-[#1A1A1A] text-[#F5F2ED] text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full">
            Best Seller
          </div>
        )}

        {/* Action buttons — top right */}
        <motion.div
          className="absolute top-3 right-3 flex flex-col gap-2"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 8 }}
          transition={{ duration: 0.25 }}
        >
          {/* Wishlist */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(product._id); }}
            className={[
              "w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-300",
              isFav
                ? "bg-[#1A1A1A] text-[#F5F2ED]"
                : "bg-[#F5F2ED]/90 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F5F2ED] backdrop-blur-sm",
            ].join(" ")}
            aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className="size-4" fill={isFav ? "currentColor" : "none"} />
          </button>

          {/* Quick view */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onQuickView?.(product); }}
            className="w-9 h-9 rounded-full bg-[#F5F2ED]/90 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F5F2ED] flex items-center justify-center shadow-md backdrop-blur-sm transition-all duration-300"
            aria-label="Quick View product"
          >
            <Eye className="size-4" />
          </button>
        </motion.div>

        {/* Size picker overlay */}
        <AnimatePresence>
          {showSizes && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm p-3"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/50 mb-2 text-center">
                Select Size
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {sizes.slice(0, 8).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={(e) => handleQuickAdd(size, e)}
                    className="py-1.5 text-[11px] font-bold text-[#1A1A1A] bg-[#F5F2ED] hover:bg-[#1A1A1A] hover:text-white rounded-lg border border-black/8 transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Product details ── */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Meta row */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1A1A1A]/40">
            {product.category}
          </span>
          {product.subCategory && (
            <>
              <span className="w-1 h-1 rounded-full bg-[#1A1A1A]/20" />
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1A1A1A]/40">
                {product.subCategory}
              </span>
            </>
          )}
        </div>

        {/* Name */}
        <h3
          className="text-base font-bold text-[#1A1A1A] leading-snug hover:opacity-60 transition-opacity cursor-pointer line-clamp-2"
          onClick={() => navigate(`/product/${product._id}`)}
        >
          {product.name}
        </h3>

        {/* Sizes preview */}
        {sizes.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {sizes.slice(0, 4).map((s) => (
              <span
                key={s}
                className="text-[10px] font-semibold text-[#1A1A1A]/40 border border-black/10 rounded-md px-1.5 py-0.5"
              >
                {s}
              </span>
            ))}
            {sizes.length > 4 && (
              <span className="text-[10px] text-[#1A1A1A]/30 font-semibold">
                +{sizes.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Price + Add button */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-lg font-bold text-[#1A1A1A]">
            ${price.toFixed(2)}
          </span>

          <button
            type="button"
            onClick={handleAddClick}
            className="inline-flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#333] text-[#F5F2ED] px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Add to bag"
          >
            {justAdded ? (
              <>
                <Check className="size-3.5" />
                Added
              </>
            ) : (
              <>
                <Plus className="size-3.5" />
                Bag
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
};

// ─── BestSeller ───────────────────────────────────────────────────────────────

const BestSeller = ({ onQuickView, wishlistIds = [], onToggleWishlist, isInWishlist }) => {
  const { data: products = [] } = useGetAllProductsQuery();
  const [activeCategory, setActiveCategory] = useState("all");

  const bestSellers = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return [...products].filter((p) => p.bestseller === true).slice(0, 12);
  }, [products]);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return bestSellers;
    return bestSellers.filter((p) => p.category === activeCategory);
  }, [bestSellers, activeCategory]);

  return (
    <section className="py-16 sm:py-20 bg-[#F5F2ED]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* ── Section header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="size-3.5 text-[#1A1A1A]/40" />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/40">
                Perpetual Archive
              </p>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1A1A1A] leading-tight">
              Best Sellers &amp; Editions.
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-xs text-sm text-[#1A1A1A]/50 leading-relaxed sm:text-right"
          >
            Limited release pieces from our core catalog, picked by popularity.
          </motion.p>
        </div>

        {/* ── Filter tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-2 flex-wrap mb-10"
        >
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={[
                "px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] whitespace-nowrap transition-all duration-300",
                activeCategory === tab.id
                  ? "bg-[#1A1A1A] text-[#F5F2ED] shadow-md"
                  : "bg-white/70 text-[#1A1A1A] hover:bg-white border border-black/8",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* ── Product grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {filtered.length > 0 ? (
              filtered.map((product, idx) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={idx}
                  onQuickView={onQuickView}
                  isFav={isInWishlist ? isInWishlist(product._id) : wishlistIds.includes(product._id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-[#1A1A1A]/40 text-sm font-semibold">
                No best sellers in this category yet.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BestSeller;

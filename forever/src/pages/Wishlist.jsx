import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2, ArrowRight, RefreshCw } from "lucide-react";
import { useWishlist } from "../features/wishlist/useWishlist";
import { useCart } from "../features/cart/useCart";
import { toast } from "react-toastify";

/* ── Skeleton card ─────────────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="flex flex-col bg-[#FAF8F5] rounded-[28px] overflow-hidden border border-black/5 animate-pulse">
    <div className="aspect-[3/4] w-full bg-[#E5E2DD]" />
    <div className="p-5 flex flex-col gap-3">
      <div className="h-3 bg-[#E5E2DD] rounded-full w-1/3" />
      <div className="h-4 bg-[#E5E2DD] rounded-full w-3/4" />
      <div className="h-3 bg-[#E5E2DD] rounded-full w-1/2" />
      <div className="h-9 bg-[#E5E2DD] rounded-full mt-2" />
    </div>
  </div>
);

/* ── Product card ──────────────────────────────────────────────────────────── */
const WishlistCard = ({ item, onRemove, onMoveToBag, index }) => {
  const product = item?.product;
  if (!product) return null;

  const images = product.images ?? product.image ?? [];
  const thumb = Array.isArray(images) ? images[0] : images;
  const price = Number(product.price) || 0;
  const category =
    typeof product.category === "object"
      ? (product.category?.name ?? "")
      : (product.category ?? "");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{
        duration: 0.4,
        delay: Math.min(0.35, index * 0.055),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group flex flex-col bg-[#FAF8F5] rounded-[28px] overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#E5E2DD]">
        <Link to={`/product/${product._id}`}>
          {thumb ? (
            <img
              src={thumb}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#1A1A1A]/20">
              <ShoppingBag className="size-12" />
            </div>
          )}
        </Link>

        {/* Remove button */}
        <button
          type="button"
          onClick={() => onRemove(item.productId)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-red-500 text-[#1A1A1A] hover:text-white backdrop-blur-sm border border-black/5 flex items-center justify-center transition-all duration-300 shadow-md opacity-0 group-hover:opacity-100"
          aria-label="Remove from wishlist"
        >
          <Trash2 className="size-4" />
        </button>

        {/* Active indicator dot */}
        {product.isActive === false && (
          <div className="absolute top-4 left-4">
            <span className="text-[10px] uppercase tracking-[0.12em] font-bold text-white bg-red-500/90 px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {category && (
            <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#1A1A1A]/40 mb-1">
              {category}
            </p>
          )}
          <Link to={`/product/${product._id}`}>
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A] leading-snug hover:opacity-60 transition-opacity line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-4 pt-4 border-t border-black/5 flex items-center justify-between gap-3">
          <span className="text-base font-bold text-[#1A1A1A]">
            ${price.toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => onMoveToBag(item)}
            disabled={product.isActive === false}
            className="inline-flex items-center gap-1.5 bg-[#1A1A1A] text-[#F5F2ED] pl-3 pr-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.12em] hover:bg-[#333] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="size-3.5" />
            Add to Bag
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Page ──────────────────────────────────────────────────────────────────── */
const WishlistPage = () => {
  const { items, count, isLoading, remove, clear } = useWishlist();
  const { add } = useCart();

  const handleMoveToBag = async (item) => {
    const product = item?.product;
    if (!product?._id) return;
    try {
      await add({
        productId: product._id,
        size: product.sizes?.[0] ?? "",
        quantity: 1,
        product,
      });
      await remove(item.productId);
      toast.success(`${product.name} moved to bag`);
    } catch {
      toast.error("Failed to add to bag");
    }
  };

  const handleMoveAllToBag = async () => {
    for (const item of items) {
      await handleMoveToBag(item);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED]">
      {/* ── Page header ── */}
      <div className="border-b border-black/8 bg-[#F5F2ED]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-bold text-[#1A1A1A]/40 mb-4">
                <Link to="/" className="hover:text-[#1A1A1A] transition-colors">
                  Home
                </Link>
                <span>/</span>
                <span className="text-[#1A1A1A]">Wishlist</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1A1A1A] flex items-center gap-3">
                Wishlist
                <Heart
                  className={`size-8 transition-all ${
                    count > 0
                      ? "fill-[#C86D44] text-[#C86D44]"
                      : "text-[#1A1A1A]/20"
                  }`}
                />
              </h1>
              <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-[#1A1A1A]/40 mt-2">
                {isLoading
                  ? "Loading your wishlist…"
                  : `${count} saved ${count === 1 ? "piece" : "pieces"}`}
              </p>
            </div>

            {count > 0 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleMoveAllToBag}
                  className="inline-flex items-center gap-2 bg-[#1A1A1A] text-[#F5F2ED] px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#333] transition-all"
                >
                  <ShoppingBag className="size-4" />
                  Move All to Bag
                </button>
                <button
                  type="button"
                  onClick={clear}
                  className="inline-flex items-center gap-2 border border-black/15 text-[#1A1A1A]/60 px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] hover:border-red-400 hover:text-red-500 transition-all"
                >
                  <Trash2 className="size-4" />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-14">

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && count === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="py-28 flex flex-col items-center text-center"
          >
            <div className="relative mb-8">
              <div className="w-28 h-28 rounded-full bg-[#E5E2DD] flex items-center justify-center">
                <Heart className="size-12 text-[#1A1A1A]/20" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#C86D44] flex items-center justify-center shadow-md">
                <RefreshCw className="size-4 text-white" />
              </div>
            </div>

            <h2 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-[#1A1A1A]/50 mb-10 max-w-sm leading-relaxed">
              Save products you love by tapping the heart icon. They'll appear
              here so you can find them easily later.
            </p>

            <Link
              to="/collection"
              className="inline-flex items-center gap-2 bg-[#1A1A1A] text-[#F5F2ED] px-8 py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-[#333] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Browse Collection
              <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        )}

        {/* Grid */}
        {!isLoading && count > 0 && (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6"
            >
              {items.map((item, index) => (
                <WishlistCard
                  key={item.productId}
                  item={item}
                  index={index}
                  onRemove={remove}
                  onMoveToBag={handleMoveToBag}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Continue browsing */}
        {!isLoading && count > 0 && (
          <div className="mt-16 pt-10 border-t border-black/8 flex items-center justify-center">
            <Link
              to="/collection"
              className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
            >
              Continue Browsing
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;

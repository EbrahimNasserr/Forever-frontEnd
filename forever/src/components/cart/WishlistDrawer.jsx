import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Heart, ShoppingBag, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../features/wishlist/useWishlist";
import { useCart } from "../../features/cart/useCart";
import { toast } from "react-toastify";

/**
 * WishlistDrawer
 *
 * Fully self-contained — consumes useWishlist() and useCart() directly.
 * Props:
 *   isOpen   boolean
 *   onClose  () => void
 */
const WishlistDrawer = ({ isOpen, onClose }) => {
  const { items, remove, clear, count, isLoading } = useWishlist();
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
      toast.success(`${product.name} added to bag`);
    } catch {
      toast.error("Failed to add to bag");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 max-w-full flex pl-10 z-10"
          >
            <div className="w-screen max-w-md bg-[#F5F2ED] shadow-2xl flex flex-col border-l border-black/10">

              {/* Header */}
              <div className="px-6 sm:px-8 py-5 border-b border-black/10 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
                    Wishlist
                    <Heart className="size-5 fill-[#C86D44] text-[#C86D44]" />
                  </h2>
                  <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#1A1A1A]/50 mt-0.5">
                    {count} saved {count === 1 ? "piece" : "pieces"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {count > 0 && (
                    <button
                      type="button"
                      onClick={clear}
                      className="text-[10px] uppercase tracking-[0.12em] font-bold text-[#1A1A1A]/40 hover:text-red-500 transition-colors px-2 py-1"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-10 h-10 rounded-full border border-black/10 hover:border-black flex items-center justify-center text-[#1A1A1A] transition-colors"
                    aria-label="Close wishlist"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-5">
                {isLoading ? (
                  /* Loading skeleton */
                  <div className="flex flex-col gap-5">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="flex gap-4 pb-5 border-b border-black/8 animate-pulse">
                        <div className="w-24 h-32 rounded-2xl bg-[#E5E2DD] shrink-0" />
                        <div className="flex-1 flex flex-col gap-3 justify-center">
                          <div className="h-3 bg-[#E5E2DD] rounded-full w-3/4" />
                          <div className="h-3 bg-[#E5E2DD] rounded-full w-1/2" />
                          <div className="h-3 bg-[#E5E2DD] rounded-full w-1/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : count === 0 ? (
                  /* Empty state */
                  <div className="py-20 flex flex-col items-center text-center">
                    <Heart className="size-12 text-[#1A1A1A]/15 mb-4" />
                    <p className="font-serif text-2xl text-[#1A1A1A]/50 italic mb-3">
                      Nothing saved yet.
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#1A1A1A]/35 mb-8">
                      Tap the heart on any product to save it here.
                    </p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="bg-[#1A1A1A] text-[#F5F2ED] px-7 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#333] transition-all"
                    >
                      Browse Collection
                    </button>
                  </div>
                ) : (
                  /* Item list */
                  <div className="flex flex-col gap-5">
                    {items.map((item) => {
                      const product = item?.product;
                      if (!product) return null;
                      const images = product.images ?? product.image ?? [];
                      const thumb = Array.isArray(images) ? images[0] : images;
                      const price = Number(product.price) || 0;

                      return (
                        <div
                          key={item.productId}
                          className="flex gap-4 pb-5 border-b border-black/8 last:border-0"
                        >
                          {/* Thumbnail */}
                          <Link
                            to={`/product/${product._id}`}
                            onClick={onClose}
                            className="w-24 h-32 rounded-2xl overflow-hidden bg-[#E5E2DD] shrink-0 border border-black/5 hover:opacity-90 transition-opacity"
                          >
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#1A1A1A]/20">
                                <ShoppingBag className="size-8" />
                              </div>
                            )}
                          </Link>

                          {/* Details */}
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                to={`/product/${product._id}`}
                                onClick={onClose}
                                className="font-serif text-base font-bold text-[#1A1A1A] leading-snug hover:opacity-60 transition-opacity line-clamp-2"
                              >
                                {product.name}
                              </Link>
                              <button
                                type="button"
                                onClick={() => remove(item.productId)}
                                className="text-[#1A1A1A]/30 hover:text-red-500 transition-colors p-1 shrink-0"
                                aria-label="Remove from wishlist"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>

                            {(product.category || product.subCategory) && (
                              <p className="text-[11px] uppercase tracking-[0.1em] text-[#1A1A1A]/40 font-semibold mt-1">
                                {product.category}
                                {product.subCategory ? ` · ${product.subCategory}` : ""}
                              </p>
                            )}

                            <div className="flex items-center justify-between mt-3">
                              <span className="text-sm font-bold text-[#1A1A1A]">
                                ${price.toFixed(2)}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleMoveToBag(item)}
                                className="inline-flex items-center gap-1.5 bg-[#1A1A1A] text-[#F5F2ED] pl-3 pr-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.12em] hover:bg-[#333] transition-all"
                              >
                                <ShoppingBag className="size-3" />
                                Add to Bag
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {count > 0 && (
                <div className="px-6 sm:px-8 py-4 bg-white border-t border-black/10 shrink-0 flex items-center justify-between">
                  <Link
                    to="/wishlist"
                    onClick={onClose}
                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#1A1A1A] hover:opacity-60 transition-opacity"
                  >
                    View Full Wishlist
                    <ArrowRight className="size-3.5" />
                  </Link>
                  <Link
                    to="/collection"
                    onClick={onClose}
                    className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
                  >
                    Continue Browsing
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WishlistDrawer;

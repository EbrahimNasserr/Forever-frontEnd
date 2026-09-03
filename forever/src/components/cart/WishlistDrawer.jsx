import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCart } from "../../features/cart/useCart";
import { toast } from "react-toastify";

/**
 * Props:
 *  isOpen        boolean
 *  onClose       () => void
 *  wishlistIds   string[]          — from useWishlist()
 *  onToggle      (id: string) => void
 */
const WishlistDrawer = ({ isOpen, onClose, wishlistIds = [], onToggle }) => {
  const { add } = useCart();
  const allProducts = useSelector((state) => state.products.items);

  // Resolve full product objects from IDs
  const savedProducts = Array.isArray(allProducts)
    ? allProducts.filter((p) => wishlistIds.includes(p._id))
    : [];

  const handleMoveToBag = async (product) => {
    try {
      await add({
        productId: product._id,
        size: product.sizes?.[0] ?? "",
        quantity: 1,
        product,
      });
      onToggle(product._id); // remove from wishlist after adding
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
                  <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                    Wishlist
                  </h2>
                  <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#1A1A1A]/50 mt-0.5">
                    {savedProducts.length} saved{" "}
                    {savedProducts.length === 1 ? "piece" : "pieces"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-10 h-10 rounded-full border border-black/10 hover:border-black flex items-center justify-center text-[#1A1A1A] transition-colors"
                  aria-label="Close wishlist"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-5">
                {savedProducts.length === 0 ? (
                  <div className="py-20 flex flex-col items-center text-center">
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
                  <div className="flex flex-col gap-5">
                    {savedProducts.map((product) => (
                      <div
                        key={product._id}
                        className="flex gap-4 pb-5 border-b border-black/8"
                      >
                        {/* Thumbnail */}
                        <Link
                          to={`/product/${product._id}`}
                          onClick={onClose}
                          className="w-24 h-32 rounded-2xl overflow-hidden bg-[#E5E2DD] shrink-0 border border-black/5"
                        >
                          <img
                            src={product.image?.[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
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
                              onClick={() => onToggle(product._id)}
                              className="text-[#1A1A1A]/30 hover:text-red-500 transition-colors p-1 shrink-0"
                              aria-label="Remove from wishlist"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>

                          <p className="text-[11px] uppercase tracking-[0.1em] text-[#1A1A1A]/40 font-semibold mt-1">
                            {product.category}
                            {product.subCategory ? ` · ${product.subCategory}` : ""}
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            <span className="text-sm font-bold text-[#1A1A1A]">
                              ${Number(product.price).toFixed(2)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleMoveToBag(product)}
                              className="inline-flex items-center gap-1.5 bg-[#1A1A1A] text-[#F5F2ED] pl-3 pr-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.12em] hover:bg-[#333] transition-all"
                            >
                              <ShoppingBag className="size-3" />
                              Add to Bag
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {savedProducts.length > 0 && (
                <div className="px-6 sm:px-8 py-4 bg-white border-t border-black/10 shrink-0">
                  <Link
                    to="/collection"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors"
                  >
                    Continue Browsing
                    <ArrowRight className="size-3.5" />
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

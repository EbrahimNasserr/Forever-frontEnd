import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingBag, X } from "lucide-react";
import { useCart } from "../../features/cart/useCart";
import { toast } from "react-toastify";

/**
 * Props:
 *  product     object | null   — the product to preview (null = closed)
 *  onClose     () => void
 *  wishlistIds string[]
 *  onToggleWishlist (id) => void
 */
const QuickViewModal = ({ product, onClose, wishlistIds = [], onToggleWishlist }) => {
  const navigate = useNavigate();
  const { add } = useCart();

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  const images = product?.image ?? [];
  const sizes = product?.sizes ?? [];
  const isFav = product ? wishlistIds.includes(product._id) : false;
  const currentSize = selectedSize || sizes[0] || "";
  const price = Number(product?.price) || 0;

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await add({
        productId: product._id,
        size: currentSize,
        quantity: 1,
        product,
      });
      toast.success(`${product.name} added to bag`);
      onClose();
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleViewFull = () => {
    onClose();
    navigate(`/product/${product._id}`);
  };

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-[#F5F2ED] w-full max-w-4xl rounded-[36px] overflow-hidden shadow-2xl border border-black/10 z-10 my-auto"
          >
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-[#1A1A1A] hover:text-white backdrop-blur-md border border-black/10 flex items-center justify-center text-[#1A1A1A] transition-colors"
              aria-label="Close quick view"
            >
              <X className="size-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 max-h-[88vh] overflow-y-auto">

              {/* ── Left: images ── */}
              <div className="bg-[#EBE7DF] p-6 sm:p-8 flex flex-col gap-4">
                <div
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-black/8 bg-stone-200 cursor-pointer"
                  onClick={handleViewFull}
                >
                  <img
                    src={images[activeImgIdx] ?? images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                  {product.bestseller && (
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#1A1A1A] bg-white/90 px-3 py-1.5 rounded-full">
                        Best Seller
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImgIdx(idx)}
                        className={[
                          "w-14 h-18 rounded-xl overflow-hidden border-2 transition-all",
                          activeImgIdx === idx
                            ? "border-[#1A1A1A] scale-105"
                            : "border-transparent opacity-60 hover:opacity-100",
                        ].join(" ")}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Right: details ── */}
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  {/* Meta */}
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.15em] font-bold text-[#1A1A1A]/40">
                    <span>{product.category}</span>
                    <span>{product.subCategory}</span>
                  </div>

                  {/* Name */}
                  <h2
                    className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-bold leading-tight cursor-pointer hover:opacity-60 transition-opacity"
                    onClick={handleViewFull}
                  >
                    {product.name}
                  </h2>

                  {/* Price */}
                  <div className="text-2xl font-bold text-[#1A1A1A]">
                    ${price.toFixed(2)}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#1A1A1A]/55 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Size selection */}
                  {sizes.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.15em] font-bold text-[#1A1A1A]/40 mb-2">
                        <span>Select Size</span>
                        <button
                          type="button"
                          onClick={handleViewFull}
                          className="hover:text-[#1A1A1A] transition-colors"
                        >
                          Size Guide →
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {sizes.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSelectedSize(s)}
                            className={[
                              "py-2 px-3 text-xs font-bold uppercase rounded-xl border transition-all",
                              currentSize === s
                                ? "bg-[#1A1A1A] text-[#F5F2ED] border-[#1A1A1A]"
                                : "bg-white text-[#1A1A1A] border-black/15 hover:border-[#1A1A1A]",
                            ].join(" ")}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab info */}
                  <div className="border-t border-black/10 pt-4">
                    <div className="flex gap-5 border-b border-black/10 pb-2 mb-3 text-[11px] uppercase tracking-[0.12em] font-bold">
                      {["details", "fit"].map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={[
                            "pb-1 transition-colors capitalize",
                            activeTab === tab
                              ? "border-b-2 border-[#1A1A1A] text-[#1A1A1A]"
                              : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]/70",
                          ].join(" ")}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <div className="text-xs text-[#1A1A1A]/55 leading-relaxed">
                      {activeTab === "details" && (
                        <p>
                          {product.description || "Quality materials, expertly crafted for everyday wear."}
                        </p>
                      )}
                      {activeTab === "fit" && (
                        <p>
                          Available in sizes {sizes.join(", ") || "S / M / L / XL"}.
                          We recommend ordering your true size. Returns are free
                          within 30 days.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action row */}
                <div className="flex items-center gap-3 pt-4 border-t border-black/10">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#1A1A1A] hover:bg-[#333] text-[#F5F2ED] py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] transition-all shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02]"
                  >
                    <ShoppingBag className="size-4" />
                    <span>Add to Bag — ${price.toFixed(2)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleWishlist?.(product._id)}
                    className={[
                      "p-4 rounded-full border transition-all",
                      isFav
                        ? "bg-[#1A1A1A] border-[#1A1A1A] text-[#F5F2ED]"
                        : "border-black/20 hover:border-[#1A1A1A] text-[#1A1A1A] bg-white",
                    ].join(" ")}
                    aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      className="size-4"
                      fill={isFav ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                {/* View full page link */}
                <button
                  type="button"
                  onClick={handleViewFull}
                  className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors text-center"
                >
                  View Full Product Page →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;

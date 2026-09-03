import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShieldCheck,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "../../features/cart/useCart";

// ─── helpers ─────────────────────────────────────────────────────────────────

const FREE_SHIPPING_THRESHOLD = 400;

const formatPrice = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(n) || 0
  );

// ─── CartSidebar ─────────────────────────────────────────────────────────────

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items: cart, isAuthenticated, summary, remove, setQuantity, clear } = useCart();
  const products = useSelector((state) => state.products.items);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Resolve full product data for each cart item
  const cartItems = useMemo(() => {
    if (!Array.isArray(cart)) return [];
    return cart
      .map((item) => {
        const productId = item.productId ?? item.product?._id ?? item.product;
        const product = Array.isArray(products)
          ? products.find((p) => String(p?._id) === String(productId))
          : null;
        const data = item.product ?? product ?? null;
        if (!data) return null;
        const unitPrice = Number(item.price ?? data.price) || 0;
        return {
          ...item,
          product: {
            ...data,
            image:
              Array.isArray(data.image) && data.image.length
                ? data.image
                : typeof item.image === "string"
                  ? [item.image]
                  : [],
            name: data.name ?? item.name ?? "",
            price: unitPrice,
          },
          productId,
          lineTotal: unitPrice * (Number(item.quantity) || 0),
        };
      })
      .filter(Boolean);
  }, [cart, products]);

  const subtotal = Number(summary?.subtotal) || 0;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const finalTotal = subtotal - discount;
  const progressToFree = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const itemCount = useMemo(
    () => cartItems.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0),
    [cartItems]
  );

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "FOREVER10") {
      setPromoApplied(true);
      toast.success("10% discount applied!");
    } else {
      toast.error('Try "FOREVER10" for 10% off');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      onClose?.();
      navigate("/login");
      return;
    }
    onClose?.();
    navigate("/place-order");
  };

  const handleQuantity = async (item, delta) => {
    const newQty = (Number(item.quantity) || 1) + delta;
    if (newQty <= 0) {
      await remove({ cartItem: item, productId: item.productId, size: item.size, color: item.color ?? "" });
    } else {
      await setQuantity({ cartItem: item, productId: item.productId, size: item.size, color: item.color ?? "", quantity: newQty });
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
            <div className="w-screen max-w-md sm:max-w-lg bg-[#F5F2ED] shadow-2xl flex flex-col border-l border-black/10">

              {/* ── Header ── */}
              <div className="px-6 sm:px-8 py-5 border-b border-black/10 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                    Shopping Bag
                  </h2>
                  <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#1A1A1A]/50 mt-0.5">
                    {itemCount} {itemCount === 1 ? "item" : "items"} selected
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-10 h-10 rounded-full border border-black/10 hover:border-black flex items-center justify-center text-[#1A1A1A] transition-colors"
                  aria-label="Close bag"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* ── Free shipping progress ── */}
              <div className="bg-[#EAE6DE] px-6 sm:px-8 py-3 border-b border-black/10 shrink-0">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.12em] mb-1.5 text-[#1A1A1A]">
                  <span>
                    {remainingForFree === 0
                      ? "✓ Free shipping unlocked!"
                      : `Add ${formatPrice(remainingForFree)} for free shipping`}
                  </span>
                  <span>{Math.round(progressToFree)}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#1A1A1A] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToFree}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* ── Items / empty / complete ── */}
              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-5">
                {orderComplete ? (
                  /* Order success state */
                  <div className="py-16 flex flex-col items-center text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5"
                    >
                      <Check className="size-8" />
                    </motion.div>
                    <h3 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-2">
                      Order Placed!
                    </h3>
                    <p className="text-sm text-[#1A1A1A]/60 max-w-xs leading-relaxed mb-7">
                      Your order has been confirmed. Check your email for
                      dispatch details.
                    </p>
                    <button
                      type="button"
                      onClick={() => { setOrderComplete(false); onClose?.(); }}
                      className="bg-[#1A1A1A] text-[#F5F2ED] px-8 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#333] transition-all"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : cartItems.length === 0 ? (
                  /* Empty state */
                  <div className="py-20 flex flex-col items-center text-center">
                    <p className="font-serif text-2xl text-[#1A1A1A]/50 italic mb-3">
                      Your bag is empty.
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#1A1A1A]/40 mb-8">
                      Add products to get started.
                    </p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="bg-[#1A1A1A] text-[#F5F2ED] px-7 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#333] transition-all"
                    >
                      Discover Collection
                    </button>
                  </div>
                ) : (
                  /* Cart items */
                  <div className="flex flex-col gap-5">
                    {cartItems.map((item) => (
                      <div
                        key={`${item.productId}-${item.size}-${item.color}`}
                        className="flex gap-4 pb-5 border-b border-black/8"
                      >
                        {/* Thumbnail */}
                        <Link
                          to={`/product/${item.productId}`}
                          onClick={onClose}
                          className="w-24 h-32 rounded-2xl overflow-hidden bg-[#E5E2DD] shrink-0 border border-black/5"
                        >
                          <img
                            src={item.product?.image?.[0]}
                            alt={item.product?.name ?? ""}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </Link>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to={`/product/${item.productId}`}
                              onClick={onClose}
                              className="font-serif text-base font-bold text-[#1A1A1A] leading-snug hover:opacity-60 transition-opacity line-clamp-2"
                            >
                              {item.product?.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() =>
                                remove({
                                  cartItem: item,
                                  productId: item.productId,
                                  size: item.size,
                                  color: item.color ?? "",
                                })
                              }
                              className="text-[#1A1A1A]/30 hover:text-red-500 transition-colors p-1 shrink-0"
                              aria-label="Remove item"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1A1A1A]/40 mt-1">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && (
                              <>
                                <span>•</span>
                                <span>{item.color}</span>
                              </>
                            )}
                          </div>

                          {/* Qty + price */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1 border border-black/10 rounded-full bg-white/70 px-1">
                              <button
                                type="button"
                                onClick={() => handleQuantity(item, -1)}
                                className="p-1.5 text-[#1A1A1A] hover:opacity-50 transition-opacity"
                                aria-label="Decrease"
                              >
                                <Minus className="size-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-[#1A1A1A] min-w-[1.5rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQuantity(item, 1)}
                                className="p-1.5 text-[#1A1A1A] hover:opacity-50 transition-opacity"
                                aria-label="Increase"
                              >
                                <Plus className="size-3" />
                              </button>
                            </div>
                            <span className="text-sm font-bold text-[#1A1A1A]">
                              {formatPrice(item.lineTotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Promo code */}
                    <form onSubmit={handleApplyPromo} className="pt-1">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="size-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30" />
                          <input
                            type="text"
                            placeholder='Promo code (try "FOREVER10")'
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="w-full bg-white border border-black/10 rounded-xl pl-9 pr-3 py-2.5 text-xs uppercase tracking-wider focus:outline-none focus:border-[#1A1A1A] transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-[#1A1A1A] text-[#F5F2ED] px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-[#333] transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {promoApplied && (
                        <p className="text-[11px] text-emerald-700 font-semibold mt-1.5">
                          ✓ 10% discount applied
                        </p>
                      )}
                    </form>
                  </div>
                )}
              </div>

              {/* ── Checkout footer ── */}
              {cartItems.length > 0 && !orderComplete && (
                <div className="px-6 sm:px-8 py-6 bg-white border-t border-black/10 shrink-0">
                  {/* Totals */}
                  <div className="flex flex-col gap-2 mb-5 text-[11px] uppercase tracking-[0.1em] font-semibold text-[#1A1A1A]/60">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-[#1A1A1A] font-bold">{formatPrice(subtotal)}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Discount (10%)</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className={remainingForFree === 0 ? "text-emerald-700 font-bold" : "text-[#1A1A1A]"}>
                        {remainingForFree === 0 ? "FREE" : "Calculated at checkout"}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-black/10 text-sm font-bold text-[#1A1A1A]">
                      <span>Estimated Total</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-[#1A1A1A] text-[#F5F2ED] py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#333] hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{isCheckingOut ? "Processing…" : "Secure Checkout"}</span>
                    <ArrowRight className="size-4" />
                  </button>

                  <div className="mt-3 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[#1A1A1A]/40 font-semibold">
                    <ShieldCheck className="size-3.5" />
                    <span>256-Bit Encrypted • 30-Day Returns</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;

import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  Lock,
  Gift,
  Heart,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "../features/cart/useCart";
import { useWishlist } from "../features/wishlist/useWishlist";

const FREE_SHIPPING_THRESHOLD = 250;

const Cart = () => {
  const {
    items: cart,
    isAuthenticated,
    summary,
    remove,
    setQuantity,
    clear,
  } = useCart();

  const { toggle: toggleWishlist } = useWishlist();
  const products = useSelector((state) => state.products.items);

  /* ── Resolve items: merge cart entries with full product data ── */
  const items = (Array.isArray(cart) ? cart : [])
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

  const subtotal = Number(summary?.subtotal) || 0;
  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0
      ? 0
      : Number(summary?.shipping) || 0;
  const total = subtotal + shipping;
  const amountToFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  /* ── Debounced quantity updates ── */
  const [quantityDrafts, setQuantityDrafts] = useState({});
  const timersRef = useRef({});

  const queueUpdate = (item, nextQty, key, msg = "Quantity updated") => {
    clearTimeout(timersRef.current[key]);
    timersRef.current[key] = setTimeout(async () => {
      try {
        await setQuantity({
          cartItem: item,
          productId: item.productId,
          size: item.size,
          color: item.color,
          quantity: nextQty,
        });
        toast.success(msg);
      } catch (err) {
        toast.error(err?.data?.message || err?.message || "Failed to update");
      }
    }, 500);
  };

  const flushUpdate = async (item, key) => {
    clearTimeout(timersRef.current[key]);
    const raw = quantityDrafts[key];
    const parsed = Number(raw);
    const next = Number.isFinite(parsed) ? Math.max(1, Math.floor(parsed)) : 1;
    setQuantityDrafts((prev) => ({ ...prev, [key]: String(next) }));
    try {
      await setQuantity({
        cartItem: item,
        productId: item.productId,
        size: item.size,
        color: item.color,
        quantity: next,
      });
      toast.success("Quantity updated");
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Failed to update");
    }
  };

  /* ── Gift note ── */
  const [calligraphyGift, setCalligraphyGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1A1A] pt-8 pb-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-8">
        <div className="flex items-center gap-3 text-[11px] uppercase letter-spaced font-bold text-[#1A1A1A]/60">
          <Link to="/" className="hover:text-[#1A1A1A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A]">Shopping Bag</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 mb-10 border-b border-black/10 gap-4">
          <div>
            <span className="text-[10px] uppercase letter-spaced font-bold text-[#B36B42] block mb-2">
              SESSION VAULT & COMMISSIONS
            </span>
            <h1 className="prata-regular text-3xl sm:text-5xl font-bold text-[#1A1A1A]">
              Your Shopping Bag
            </h1>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-xs uppercase letter-spaced font-bold text-[#1A1A1A]/70">
              {items.length} {items.length === 1 ? "Piece" : "Pieces"}{" "}
              Commissioned
            </span>
            {items.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  clear().then(() => toast.success("Cart cleared"))
                }
                className="text-[11px] uppercase letter-spaced font-bold text-[#1A1A1A]/50 hover:text-rose-600 transition-colors underline"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* ── EMPTY STATE ── */}
        {items.length === 0 ? (
          <div className="py-16 text-center max-w-xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-[#FAF8F5] border border-black/10 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <ShoppingBag className="w-8 h-8 stroke-[1.5] text-[#1A1A1A]/50" />
            </div>
            <h2 className="prata-regular text-3xl font-bold text-[#1A1A1A] mb-3">
              Your Commission Bag is Vacant.
            </h2>
            <p className="text-sm text-[#1A1A1A]/70 leading-relaxed mb-8">
              Pieces in our limited runs are reserved in your private session
              bag once acquired. Discover our active collection or revisit your
              saved silhouettes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/collection"
                className="bg-[#1A1A1A] hover:bg-black text-[#F5F2ED] px-8 py-4 rounded-full text-xs font-bold uppercase letter-spaced transition-all shadow-xl hover:scale-[1.02]"
              >
                Explore Collection
              </Link>
              <Link
                to="/"
                className="bg-white hover:bg-stone-50 text-[#1A1A1A] border border-black/15 hover:border-black px-8 py-4 rounded-full text-xs font-bold uppercase letter-spaced transition-all"
              >
                Return Home
              </Link>
            </div>
          </div>
        ) : (
          /* ── POPULATED BAG ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left — Line Items */}
            <div className="lg:col-span-7 space-y-6">
              {/* Complimentary Courier Progress */}
              <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-black/5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold uppercase letter-spaced mb-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#B36B42]" />
                    <span>White-Glove Global Courier</span>
                  </div>
                  <span>
                    {subtotal >= FREE_SHIPPING_THRESHOLD
                      ? "Complimentary Delivery Unlocked"
                      : `$${amountToFree.toFixed(2)} away from Free`}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                  <div
                    className="h-full bg-[#1A1A1A] transition-all duration-700 rounded-full"
                    style={{
                      width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((item) => {
                    const key = `${item.productId}-${item.size ?? ""}-${item.color ?? ""}`;
                    const rawDraft = quantityDrafts[key] ?? String(item.quantity ?? 1);
                    const parsedDraft = Number(rawDraft);
                    const safeDraft = Number.isFinite(parsedDraft)
                      ? Math.max(1, Math.floor(parsedDraft))
                      : 1;

                    return (
                      <motion.div
                        key={key}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        className="bg-[#FAF8F5] p-6 rounded-[28px] border border-black/5 shadow-sm flex flex-col sm:flex-row gap-6 hover:border-black/15 transition-all"
                      >
                        {/* Thumbnail */}
                        <Link
                          to={`/product/${item.productId}`}
                          className="w-24 sm:w-28 aspect-[3/4] rounded-2xl overflow-hidden bg-stone-200 shrink-0 group"
                        >
                          <img
                            src={item.product?.image?.[0]}
                            alt={item.product?.name ?? ""}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </Link>

                        {/* Info & Controls */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="text-[10px] uppercase letter-spaced font-bold text-[#B36B42]">
                                {item.product?.category ?? "Forever"}
                                {item.product?.subCategory
                                  ? ` · ${item.product.subCategory}`
                                  : ""}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  remove({
                                    cartItem: item,
                                    productId: item.productId,
                                    color: item.color,
                                    size: item.size,
                                  }).then(() =>
                                    toast.success("Item removed from cart")
                                  )
                                }
                                className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                                title="Remove piece"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <Link
                              to={`/product/${item.productId}`}
                              className="prata-regular text-xl font-bold text-[#1A1A1A] hover:text-stone-600 transition-colors"
                            >
                              {item.product?.name}
                            </Link>

                            <div className="flex flex-wrap items-center gap-3 text-xs mt-3 mb-4">
                              {item.size && (
                                <span className="bg-[#F5F2ED] px-3 py-1 rounded-full border border-black/5 font-semibold text-[#1A1A1A]">
                                  Size: {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span className="flex items-center gap-1.5 bg-[#F5F2ED] px-3 py-1 rounded-full border border-black/5 font-semibold text-[#1A1A1A]">
                                  <span
                                    className="w-3 h-3 rounded-full border border-black/20 inline-block shrink-0"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  Color
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Qty stepper & Price */}
                          <div className="flex items-center justify-between pt-4 border-t border-black/5">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center border border-black/15 rounded-full bg-white px-2 py-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = Math.max(1, safeDraft - 1);
                                    setQuantityDrafts((prev) => ({
                                      ...prev,
                                      [key]: String(next),
                                    }));
                                    queueUpdate(
                                      item,
                                      next,
                                      key,
                                      "Quantity decreased"
                                    );
                                  }}
                                  className="p-1 text-stone-500 hover:text-[#1A1A1A] transition-colors"
                                  aria-label="Decrease"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <input
                                  type="number"
                                  min={1}
                                  value={rawDraft}
                                  onChange={(e) => {
                                    const nextRaw = e.target.value.replace(
                                      /[^\d]/g,
                                      ""
                                    );
                                    setQuantityDrafts((prev) => ({
                                      ...prev,
                                      [key]: nextRaw,
                                    }));
                                    const p = Number(nextRaw);
                                    if (Number.isFinite(p) && p > 0)
                                      queueUpdate(
                                        item,
                                        Math.max(1, Math.floor(p)),
                                        key
                                      );
                                  }}
                                  onBlur={() => flushUpdate(item, key)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      flushUpdate(item, key);
                                    }
                                  }}
                                  className="w-8 text-center text-xs font-bold outline-none bg-transparent"
                                  aria-label="Quantity"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = safeDraft + 1;
                                    setQuantityDrafts((prev) => ({
                                      ...prev,
                                      [key]: String(next),
                                    }));
                                    queueUpdate(
                                      item,
                                      next,
                                      key,
                                      "Quantity increased"
                                    );
                                  }}
                                  className="p-1 text-stone-500 hover:text-[#1A1A1A] transition-colors"
                                  aria-label="Increase"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Save for later */}
                              <button
                                type="button"
                                onClick={() => {
                                  toggleWishlist(item.productId);
                                  remove({
                                    cartItem: item,
                                    productId: item.productId,
                                    color: item.color,
                                    size: item.size,
                                  });
                                  toast.success(
                                    `${item.product?.name} saved to wishlist`
                                  );
                                }}
                                className="text-[11px] text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:underline flex items-center gap-1 font-semibold"
                              >
                                <Heart className="w-3.5 h-3.5" />
                                <span>Save for later</span>
                              </button>
                            </div>

                            <div className="text-right">
                              <span className="font-bold text-base text-[#1A1A1A]">
                                ${item.lineTotal.toFixed(2)}
                              </span>
                              {item.quantity > 1 && (
                                <span className="block text-[10px] text-stone-400">
                                  ${item.product.price.toFixed(2)} each
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Gift Calligraphy Note */}
              <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-black/5 shadow-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={calligraphyGift}
                    onChange={(e) => setCalligraphyGift(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#1A1A1A]"
                  />
                  <div className="flex items-center gap-2 text-xs font-bold uppercase letter-spaced text-[#1A1A1A]">
                    <Gift className="w-4 h-4 text-[#B36B42]" />
                    <span>Include Complimentary Handwritten Calligraphy Card</span>
                  </div>
                </label>

                <AnimatePresence>
                  {calligraphyGift && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-black/10 overflow-hidden"
                    >
                      <textarea
                        rows={2}
                        placeholder="Inscribe your personal message for the recipient..."
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        className="w-full bg-[#F5F2ED] border border-black/10 rounded-2xl p-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-black resize-none"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right — Order Summary */}
            <div className="lg:col-span-5 space-y-6">
              {/* Order Ledger */}
              <div className="bg-[#FAF8F5] p-8 rounded-[36px] border border-black/5 shadow-md">
                <h3 className="prata-regular text-2xl font-bold text-[#1A1A1A] mb-6">
                  Commission Ledger
                </h3>

                <div className="space-y-3.5 text-xs text-[#1A1A1A]/70 pb-6 border-b border-black/10">
                  <div className="flex justify-between">
                    <span>Silhouettes Subtotal</span>
                    <span className="font-bold text-[#1A1A1A]">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Climate-Controlled Courier</span>
                    <span className="font-bold text-[#1A1A1A]">
                      {shipping === 0 ? "Complimentary" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbon-Neutral Packaging & Archival Dustbag</span>
                    <span className="text-emerald-700 font-semibold">
                      Included
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between py-6 border-b border-black/10">
                  <div>
                    <span className="block prata-regular text-xl font-bold text-[#1A1A1A]">
                      Final Acquisition
                    </span>
                    <span className="text-[10px] text-stone-400 uppercase letter-spaced">
                      Taxes & Import Duties Reconciled
                    </span>
                  </div>
                  <span className="prata-regular text-3xl font-bold text-[#1A1A1A]">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Checkout CTA */}
                <Link
                  to="/place-order"
                  className={`w-full mt-6 bg-[#1A1A1A] hover:bg-black text-[#F5F2ED] py-4 rounded-full text-xs font-bold uppercase letter-spaced transition-all duration-300 shadow-xl flex items-center justify-center gap-3 hover:scale-[1.01] ${
                    !isAuthenticated ? "opacity-50 pointer-events-none" : ""
                  }`}
                  aria-disabled={!isAuthenticated}
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed to White-Glove Checkout</span>
                </Link>

                {!isAuthenticated && (
                  <p className="mt-3 text-center text-[11px] text-[#1A1A1A]/60">
                    <Link
                      to="/login"
                      className="underline font-bold hover:text-[#1A1A1A]"
                    >
                      Sign in
                    </Link>{" "}
                    to complete your commission.
                  </p>
                )}

                <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-[#1A1A1A]/50">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    256-Bit Encrypted
                  </span>
                  <span>·</span>
                  <span>Direct Atelier Dispatch</span>
                </div>
              </div>

              {/* Reassurance Strip */}
              <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
                {[
                  {
                    icon: Truck,
                    text: "Complimentary courier on orders over $250",
                  },
                  {
                    icon: CheckCircle2,
                    text: "30-day atelier returns & exchanges",
                  },
                  {
                    icon: ShieldCheck,
                    text: "Authenticity guaranteed on every piece",
                  },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 text-xs text-[#1A1A1A]/70"
                  >
                    <Icon className="w-4 h-4 text-[#B36B42] shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <Link
                to="/collection"
                className="flex items-center justify-center gap-2 text-xs font-bold uppercase letter-spaced text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                <span>Continue Exploring Collection</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

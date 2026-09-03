import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Feather, Info, ShieldCheck, Sparkles } from "lucide-react";
import { useCart } from "../../features/cart/useCart";
import { toast } from "react-toastify";

// ─── Static look definitions ──────────────────────────────────────────────────
// Images are Unsplash fashion photos — no CORS issues, load fast.

const LOOKS = [
  {
    id: "look-01",
    title: "The Sculptural Overcoat",
    tag: "Look 01 — Architectural Silhouette",
    fabric: "85% Virgin Wool, 15% Mongolian Cashmere",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
    pins: [
      {
        id: "pin-a",
        x: "38%",
        y: "26%",
        title: "Hand-Canvassed Lapel",
        desc: "Internal horsehair chest canvas moulds to body temperature over time.",
      },
      {
        id: "pin-b",
        x: "62%",
        y: "54%",
        title: "Concealed Horn Buttons",
        desc: "Matte water-buffalo horn hidden within a double-face seam.",
      },
      {
        id: "pin-c",
        x: "45%",
        y: "80%",
        title: "Sweeping Split Hem",
        desc: "Unlined split vent delivers maximum fluid movement.",
      },
    ],
  },
  {
    id: "look-02",
    title: "The Architecture Blazer",
    tag: "Look 02 — Sculpted Hourglass",
    fabric: "100% Super 140s Wool Gabardine",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
    pins: [
      {
        id: "pin-a",
        x: "50%",
        y: "22%",
        title: "Sharp Peak Lapel",
        desc: "Pure silk grosgrain under-collar backing for structure.",
      },
      {
        id: "pin-b",
        x: "35%",
        y: "50%",
        title: "Nipped Waist Geometry",
        desc: "Dual curved internal darts contour the natural waist.",
      },
    ],
  },
  {
    id: "look-03",
    title: "The Columnar Silk Dress",
    tag: "Look 03 — Liquid Silk Bias",
    fabric: "100% Heavy Mulberry Silk Crepe (40 Momme)",
    image:
      "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1200&q=85",
    pins: [
      {
        id: "pin-a",
        x: "52%",
        y: "30%",
        title: "Bias Cut Cascade",
        desc: "Cut at 45° grain for second-skin contouring.",
      },
      {
        id: "pin-b",
        x: "48%",
        y: "75%",
        title: "Rolled Hand Hem",
        desc: "Traditional Como silk rolling with raw silk thread.",
      },
    ],
  },
];

// ─── Hotspot pin ──────────────────────────────────────────────────────────────

const HotspotPin = ({ pin, isOpen, onToggle }) => (
  <div
    style={{ top: pin.y, left: pin.x }}
    className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
  >
    <button
      type="button"
      onClick={onToggle}
      className="relative w-8 h-8 rounded-full bg-white/95 shadow-2xl flex items-center justify-center hover:scale-125 transition-transform duration-300 focus:outline-none"
      aria-label={`Inspect: ${pin.title}`}
    >
      <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-50 pointer-events-none" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#141414]" />
    </button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.92 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-60 bg-[#141414] text-[#FAF9F6] p-4 rounded-2xl shadow-2xl border border-white/10 z-40 pointer-events-none"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-white mb-1">
            {pin.title}
          </p>
          <p className="text-[11px] text-white/50 leading-relaxed">{pin.desc}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// ─── NewCollection ────────────────────────────────────────────────────────────

const NewCollection = () => {
  const navigate = useNavigate();
  const { add } = useCart();
  const allProducts = useSelector((state) => state.products.items);

  const [activeLookIdx, setActiveLookIdx] = useState(0);
  const [activePin, setActivePin] = useState(null);

  const currentLook = LOOKS[activeLookIdx];

  // Match the look to a real bestseller product for add-to-cart
  const matchedProduct = Array.isArray(allProducts)
    ? allProducts.find((p) => p?.bestseller) ?? allProducts[activeLookIdx] ?? null
    : null;

  const handleAddToCart = async () => {
    if (!matchedProduct) {
      navigate("/collection");
      return;
    }
    try {
      await add({
        productId: matchedProduct._id,
        size: matchedProduct.sizes?.[0] ?? "",
        quantity: 1,
        product: matchedProduct,
      });
      toast.success(`${matchedProduct.name} added to cart`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <section
      id="new-collection"
      className="py-24 sm:py-36 bg-[#F5F2ED] border-b border-black/5 relative overflow-hidden"
    >
      {/* Decorative watermark */}
      <div className="absolute top-12 right-8 text-[120px] lg:text-[200px] font-serif font-bold italic text-[#1A1A1A]/[0.025] select-none pointer-events-none leading-none">
        NEW
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: copy + controls ── */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/50 mb-4">
              <Sparkles className="size-3.5" />
              <span>New Season Collection</span>
            </div>

            <h2 className="font-serif text-4xl sm:text-6xl text-[#1A1A1A] font-bold leading-[1.05] tracking-tight mb-6">
              Sculpted by <br />
              <em className="italic font-normal">Pure</em> Intention.
            </h2>

            <blockquote className="border-l-2 border-[#1A1A1A] pl-6 py-2 my-6 text-base sm:text-lg text-[#1A1A1A]/70 font-serif italic leading-relaxed">
              "True luxury is the radical elimination of the unnecessary until only
              proportion, tactile weight, and silence remain."
              <footer className="text-[10px] uppercase tracking-[0.15em] font-bold font-sans not-italic text-[#1A1A1A]/40 mt-3">
                — Creative Director, Forever Commerce
              </footer>
            </blockquote>

            <p className="text-sm text-[#1A1A1A]/55 leading-relaxed mb-8">
              This season investigates structural tension between architectural
              proportion and unstructured drape — sourced from organic mills and
              built to outlast trends.
            </p>

            {/* Craft points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-black/8 mb-8">
              {[
                {
                  Icon: Feather,
                  title: "Lightweight Construction",
                  sub: "Unlined double-face fabric for all-season wear.",
                },
                {
                  Icon: ShieldCheck,
                  title: "Quality Guaranteed",
                  sub: "Each piece inspected before dispatch.",
                },
              ].map(({ Icon, title, sub }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="size-3.5 text-white/70" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1A1A1A]">
                      {title}
                    </h3>
                    <p className="text-xs text-[#1A1A1A]/50 mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Look selector */}
            <div className="flex flex-col gap-3 mb-8">
              <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#1A1A1A]/40">
                Select Look ({activeLookIdx + 1} / {LOOKS.length})
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {LOOKS.map((look, idx) => (
                  <button
                    key={look.id}
                    type="button"
                    onClick={() => {
                      setActiveLookIdx(idx);
                      setActivePin(null);
                    }}
                    className={[
                      "px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300",
                      activeLookIdx === idx
                        ? "bg-[#1A1A1A] text-[#F5F2ED] shadow-md"
                        : "bg-white/80 text-[#1A1A1A] hover:bg-white border border-black/8",
                    ].join(" ")}
                  >
                    Look 0{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex items-center gap-2 bg-[#1A1A1A] text-[#F5F2ED] px-7 py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#333] transition-all shadow-xl hover:-translate-y-0.5"
              >
                <span>
                  {matchedProduct ? `Add "${matchedProduct.name}" to Bag` : "Shop Collection"}
                </span>
                <ArrowRight className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/collection")}
                className="p-3.5 rounded-full border border-black/10 hover:border-[#1A1A1A] hover:bg-white transition-all text-[#1A1A1A]"
                aria-label="Browse full collection"
                title="Browse full collection"
              >
                <Info className="size-4" />
              </button>
            </div>
          </div>

          {/* ── Right: interactive look image ── */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLook.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-[32px] overflow-hidden border border-black/5 aspect-[3/4] bg-[#E5E2DD] group shadow-2xl"
              >
                <img
                  src={currentLook.image}
                  alt={currentLook.title}
                  className="w-full h-full object-cover object-center transition-transform duration-[1200ms] group-hover:scale-105"
                />

                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

                {/* Top label */}
                <div className="absolute top-5 left-5 z-20">
                  <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-white bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                    {currentLook.tag}
                  </span>
                </div>

                {/* Hotspot pins */}
                {currentLook.pins.map((pin) => (
                  <HotspotPin
                    key={pin.id}
                    pin={pin}
                    isOpen={activePin === pin.id}
                    onToggle={() =>
                      setActivePin(activePin === pin.id ? null : pin.id)
                    }
                  />
                ))}

                {/* Bottom info bar */}
                <div className="absolute bottom-5 inset-x-5 z-20 flex items-end justify-between text-white pointer-events-none">
                  <div>
                    <p className="text-[10px] tracking-[0.18em] uppercase text-white/50 mb-0.5">
                      Composition
                    </p>
                    <p className="text-xs font-semibold text-white">
                      {currentLook.fabric}
                    </p>
                  </div>
                  <span className="text-[10px] tracking-[0.15em] uppercase text-white/60 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    Tap pins to inspect
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Decorative offset frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-[#1A1A1A]/8 rounded-[36px] pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewCollection;

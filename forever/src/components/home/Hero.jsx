import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, ChevronRight, Compass, Play, Sparkles } from "lucide-react";
import { assets } from "../../assets/assets.js";
import { setVideoOpen } from "../../features/cart/cartSlice.js";

// ─── helpers ────────────────────────────────────────────────────────────────

const pickFeaturedProducts = (items) => {
  if (!Array.isArray(items) || items.length === 0) return [];
  const bestSellers = items.filter((p) => p?.bestseller === true);
  const latestSorted = [...items].sort((a, b) => (b?.date ?? 0) - (a?.date ?? 0));
  const first = bestSellers[0] ?? latestSorted[0];
  const second = bestSellers[1] ?? latestSorted[1] ?? items[1];
  return [first, second].filter(Boolean);
};

// ─── Hero ────────────────────────────────────────────────────────────────────

const Hero = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.products.items);
  const featured = useMemo(() => pickFeaturedProducts(items), [items]);

  // Paris time
  const [timeInParis, setTimeInParis] = useState("");
  useEffect(() => {
    const updateTime = () => {
      setTimeInParis(
        new Date().toLocaleTimeString("en-GB", {
          timeZone: "Europe/Paris",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, []);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const imageParallaxX = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const imageParallaxY = useTransform(smoothY, [-0.5, 0.5], [-15, 15]);
  const tagParallaxX = useTransform(smoothX, [-0.5, 0.5], [25, -25]);
  const tagParallaxY = useTransform(smoothY, [-0.5, 0.5], [20, -20]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const scrollToCollection = () => {
    document
      .getElementById("collection-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const mainProduct = featured[0] ?? null;
  const secondProduct = featured[1] ?? null;
  const mainImg = mainProduct?.image?.[0] ?? assets.hero_img;
  const secondImg = secondProduct?.image?.[0] ?? assets.hero_img;

  const galleryItems = [
    { num: "01", label: "Categories", name: "Topwear" },
    { num: "02", label: "Categories", name: "Bottomwear" },
    { num: "03", label: "Categories", name: "Winterwear" },
  ];

  return (
    <section
      className="relative w-full overflow-hidden bg-[#F5F2ED] min-h-screen"
      onMouseMove={handleMouseMove}
    >
      {/* Mesh background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-stone-200/60 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-stone-300/40 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* ── Top editorial bar ── */}
        <div className="flex items-center justify-between pt-6 pb-4 border-b border-black/10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]/60"
          >
            <span>Spring / Summer 2024 Edition</span>
            <span className="w-1 h-1 rounded-full bg-[#1A1A1A]/30" />
            <span>Forever Commerce</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden sm:flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]/60"
          >
            <span>Atelier Clocks: {timeInParis || "–– : –– : ––"} CET</span>
            <span className="w-1 h-1 rounded-full bg-[#1A1A1A]/30" />
            <span>Limited Archive</span>
          </motion.div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-12 lg:py-16">
          {/* Left — branding */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/50 mb-5">
                Spring / Summer 2024
              </p>
              <h1 className="font-serif leading-[0.9] text-[#1A1A1A]">
                <span className="block text-6xl sm:text-7xl lg:text-8xl font-bold">
                  The Art
                </span>
                <span className="block text-6xl sm:text-7xl lg:text-8xl font-bold italic">
                  Of Living.
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="max-w-md text-sm sm:text-base text-[#1A1A1A]/60 leading-relaxed"
            >
              Exploring the intersection of architectural minimalism and
              performance tailoring. A curated dialogue between form and
              function.
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center gap-5"
            >
              <button
                type="button"
                onClick={() => navigate("/collection")}
                className="inline-flex items-center gap-2 bg-[#1A1A1A] text-[#F5F2ED] px-7 py-3.5 rounded-full text-[12px] font-bold uppercase tracking-[0.15em] hover:bg-[#333] transition-all hover:-translate-y-0.5 shadow-lg"
              >
                <Sparkles className="size-3.5" />
                Shop Now
              </button>

              <button
                type="button"
                onClick={() => dispatch(setVideoOpen(true))}
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.15em] font-bold border-b border-[#1A1A1A] pb-1 text-[#1A1A1A] hover:opacity-50 transition-opacity"
              >
                <Play className="size-3" fill="currentColor" />
                View Lookbook
              </button>
            </motion.div>
          </div>

          {/* Right — visuals */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Main visual card */}
            <motion.div
              style={{ x: imageParallaxX, y: imageParallaxY }}
              className="relative w-[320px] sm:w-[380px] lg:w-[420px]"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9 }}
                className="relative rounded-[28px] overflow-hidden shadow-2xl bg-[#E5E2DD] aspect-[3/4] cursor-pointer"
                onClick={() =>
                  mainProduct?._id
                    ? navigate(`/product/${mainProduct._id}`)
                    : navigate("/collection")
                }
              >
                <img
                  src={mainImg}
                  alt={mainProduct?.name ?? "Featured product"}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                {/* Featured product floating badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute bottom-5 left-5 right-5 bg-white/80 backdrop-blur-md rounded-2xl px-4 py-3"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/50 mb-0.5">
                    Featured Product
                  </p>
                  <p className="text-sm font-bold text-[#1A1A1A] truncate">
                    {mainProduct?.name ?? "Sculptural Overcoat"}
                  </p>
                </motion.div>
              </motion.div>

              {/* Decorative frame offset */}
              <div className="absolute -top-3 -left-3 w-full h-full border-2 border-[#1A1A1A]/10 rounded-[32px] pointer-events-none" />
            </motion.div>

            {/* Floating secondary card */}
            {secondProduct && (
              <motion.div
                style={{ x: tagParallaxX, y: tagParallaxY }}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 sm:-right-8 top-12 w-36 sm:w-44 cursor-pointer"
                onClick={() => navigate(`/product/${secondProduct._id}`)}
              >
                <div className="rounded-2xl overflow-hidden shadow-xl bg-[#E5E2DD] aspect-[3/4]">
                  <img
                    src={secondImg}
                    alt={secondProduct.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            )}

            {/* Vertical accent text */}
            <div className="hidden lg:flex absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A]/30 whitespace-nowrap">
                ESTABLISHED IN FOREVER — 2024
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom gallery preview bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="border-t border-black/10 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-8">
            {galleryItems.map((item) => (
              <button
                key={item.num}
                type="button"
                onClick={() => navigate("/collection")}
                className="flex items-center gap-3 group"
              >
                <span className="text-[10px] font-bold text-[#1A1A1A]/30 tracking-widest">
                  {item.num}
                </span>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#1A1A1A]/40 font-semibold">
                    {item.label}
                  </p>
                  <p className="text-sm font-bold text-[#1A1A1A] group-hover:opacity-50 transition-opacity">
                    {item.name}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={scrollToCollection}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors"
          >
            <ArrowDown className="size-4 animate-bounce" />
            Explore
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

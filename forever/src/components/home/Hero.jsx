import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { assets } from "../../assets/assets.js";

const stats = [
  { label: "Products Sold", value: "50K+", icon: TrendingUp },
  { label: "Happy Customers", value: "25K+", icon: Star },
  { label: "Global Reach", value: "120+", icon: Zap },
];

const pickFeaturedProducts = (items) => {
  if (!Array.isArray(items) || items.length === 0) return [];

  const bestSellers = items.filter((p) => p?.bestseller === true);
  const latestSorted = [...items].sort(
    (a, b) => (b?.date ?? 0) - (a?.date ?? 0),
  );

  const first = bestSellers[0] ?? latestSorted[0];
  const second = bestSellers[1] ?? latestSorted[1] ?? items[1];
  const third = bestSellers[2] ?? latestSorted[2] ?? items[2];

  return [first, second, third].filter(Boolean);
};

const seeded = (seed) => {
  // Deterministic pseudo-random in [0, 1) (stable across renders)
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const Particle = ({ delay = 0, x = 0, y = 0, duration = 4 }) => {
  return (
    <motion.div
      className="absolute size-1 rounded-full bg-black/50"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ y: [0, -30, 0], opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
      transition={{ duration, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
};

const FloatingShape = ({ index, size, x, y, duration }) => {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl opacity-20"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background:
          index % 3 === 0
            ? "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)"
            : index % 3 === 1
              ? "radial-gradient(circle, rgba(148,163,184,0.20) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(15,23,42,0.35) 0%, transparent 70%)",
      }}
      animate={{
        x: [0, 90, -90, 0],
        y: [0, -90, 90, 0],
        scale: [1, 1.2, 0.85, 1],
      }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    />
  );
};

const MagneticButton = ({ children, onClick, variant = "primary" }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.25);
    y.set((e.clientY - centerY) * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const classes =
    variant === "primary"
      ? "bg-black text-white hover:bg-black/90 shadow-2xl cursor-pointer"
      : "bg-white/10 text-black hover:bg-white/90 ring-1 ring-white/20 backdrop-blur border cursor-pointer";

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
    >
      <button
        type="button"
        onClick={onClick}
        className={[
          "inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-semibold",
          "transition-colors",
          classes,
        ].join(" ")}
      >
        {children}
      </button>
    </motion.div>
  );
};

const ProductCard = ({ product, index, isMain = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const img = product?.image?.[0] ?? assets.hero_img;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ scale: isMain ? 1.03 : 1.08, rotateY: 4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={["relative", isMain ? "w-full h-full" : ""].join(" ")}
    >
      <div
        className={[
          "overflow-hidden rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl",
          isMain ? "h-full" : "",
        ].join(" ")}
      >
        <div className="relative">
          <motion.img
            src={img}
            alt={product?.name ?? "Product"}
            className={[
              "w-full object-cover",
              isMain ? "h-[400px]" : "h-48",
            ].join(" ")}
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.6 }}
            loading="lazy"
          />

          {product?.bestseller && (
            <span className="absolute left-4 top-4 rounded-full bg-white text-zinc-950 px-3 py-1 text-xs font-semibold">
              Best Seller
            </span>
          )}

          <motion.div
            className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"
            animate={{ opacity: isHovered ? 1 : 0.65 }}
          />
        </div>

        <div className={[isMain ? "p-7" : "p-4", "text-white"].join(" ")}>
          <h3
            className={[isMain ? "text-3xl" : "text-lg", "font-bold"].join(" ")}
          >
            {product?.name ?? "Featured product"}
          </h3>
          <p className="mt-1 text-sm text-white/60">
            {product?.category ? `${product.category} • ` : ""}
            {product?.subCategory ?? "New in"}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <span
              className={[isMain ? "text-4xl" : "text-2xl", "font-bold"].join(
                " ",
              )}
            >
              ${product?.price ?? "--"}
            </span>
            <span className="text-sm text-white/50 line-clamp-1">
              {product?.sizes?.length
                ? `${product.sizes.length} sizes`
                : "Limited"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const items = useSelector((state) => state.products.items);

  const featured = useMemo(() => pickFeaturedProducts(items), [items]);
  const slides = useMemo(() => {
    const base = featured.length ? featured : [null, null, null];
    return base.slice(0, 3).map((p, idx) => ({
      id: p?._id ?? `fallback-${idx}`,
      title:
        idx === 0
          ? "Latest Arrivals"
          : idx === 1
            ? "Best Sellers"
            : "New Season",
      subtitle: "Forever Commerce",
      description:
        p?.description ??
        "Discover our newest pieces — crafted for everyday comfort and effortless style.",
      product: p,
      accent:
        idx === 0
          ? "rgba(255,255,255,0.20)"
          : idx === 1
            ? "rgba(148,163,184,0.22)"
            : "rgba(15,23,42,0.35)",
    }));
  }, [featured]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const containerRef = useRef(null);

  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) nextSlide();
    }, 6500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide, isDragging]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const shapes = useMemo(
    () =>
      [...Array(5)].map((_, i) => ({
        index: i,
        size: 200 + seeded(i * 13.1) * 260,
        x: seeded(i * 19.7) * 100,
        y: seeded(i * 29.3) * 100,
        duration: 18 + seeded(i * 41.9) * 12,
      })),
    [],
  );

  const particles = useMemo(
    () =>
      [...Array(18)].map((_, i) => ({
        i,
        x: seeded(i * 7.7) * 100,
        y: seeded(i * 11.9) * 100,
        duration: 3 + seeded(i * 17.3) * 4,
        delay: i * 0.2,
      })),
    [],
  );

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      rotateY: dir > 0 ? 25 : -25,
    }),
    center: { x: 0, opacity: 1, scale: 1, rotateY: 0 },
    exit: (dir) => ({
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      rotateY: dir < 0 ? 25 : -25,
    }),
  };

  const current = slides[currentSlide] ?? slides[0];
  const mainProduct = current?.product ?? null;

  const floatingProducts = useMemo(() => {
    if (!Array.isArray(items) || items.length < 2) return [];
    const pool = items.filter(Boolean);
    const a = pool[(currentSlide + 2) % pool.length];
    const b = pool[(currentSlide + 5) % pool.length];
    return [a, b].filter(Boolean);
  }, [items, currentSlide]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" />
        <div className="absolute inset-0 opacity-60 " />

        {shapes.map((s) => (
          <FloatingShape
            key={s.index}
            index={s.index}
            size={s.size}
            x={s.x}
            y={s.y}
            duration={s.duration}
          />
        ))}
        {particles.map((p) => (
          <Particle
            key={p.i}
            delay={p.delay}
            x={p.x}
            y={p.y}
            duration={p.duration}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="min-h-[calc(100vh-160px)] flex flex-col">
          <div className="flex-1 flex items-center">
            <div className="grid w-full items-center gap-12 lg:grid-cols-2">
              {/* Left */}
              <div className="space-y-8">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentSlide}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="space-y-6"
                  >
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ring-white/15 backdrop-blur">
                      <span className="inline-block size-1.5 rounded-full bg-white/70" />
                      {current?.subtitle ?? "Forever Commerce"}
                    </div>

                    <motion.h1
                      className="prata-regular text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.8 }}
                    >
                      {current?.title ?? "Shop the Collection"}
                    </motion.h1>

                    <motion.p
                      className="max-w-xl text-base sm:text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 }}
                    >
                      {current?.description}
                    </motion.p>

                    <motion.div
                      className="flex flex-wrap gap-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <MagneticButton
                        onClick={() => navigate("/collection")}
                        variant="primary"
                      >
                        <ShoppingCart className="size-4" />
                        Shop Now
                      </MagneticButton>

                      <MagneticButton
                        onClick={() => {
                          if (mainProduct?._id)
                            navigate(`/product/${mainProduct._id}`);
                          else navigate("/collection");
                        }}
                        variant="ghost"
                      >
                        <Sparkles className="size-4" />
                        View Product
                      </MagneticButton>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                {/* Stats */}
                <motion.div
                  className="grid grid-cols-3 gap-3 pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl p-4 text-center"
                    >
                      <stat.icon className="mx-auto mb-2 size-5" />
                      <div className="text-xl font-bold">
                        {stat.value}
                      </div>
                      <div className="text-[11px]">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right */}
              <div className="relative">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentSlide}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    className="relative"
                    onPointerDown={() => setIsDragging(true)}
                    onPointerUp={() => setIsDragging(false)}
                    onPointerCancel={() => setIsDragging(false)}
                    onPointerLeave={() => setIsDragging(false)}
                  >
                    <Link
                      to={
                        mainProduct?._id
                          ? `/product/${mainProduct._id}`
                          : "/collection"
                      }
                    >
                      <ProductCard product={mainProduct} index={0} isMain />
                    </Link>

                    {/* Floating products */}
                    {floatingProducts[0] && (
                      <motion.div
                        className="absolute -right-6 top-12 w-44 sm:w-48"
                        animate={{ y: [0, -18, 0], rotate: [0, 4, 0] }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Link to={`/product/${floatingProducts[0]._id}`}>
                          <ProductCard
                            product={floatingProducts[0]}
                            index={1}
                          />
                        </Link>
                      </motion.div>
                    )}

                    {/* {floatingProducts[1] && (
                      <motion.div
                        className="absolute -left-6 bottom-12 w-44 sm:w-48"
                        animate={{ y: [0, 18, 0], rotate: [0, -4, 0] }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1,
                        }}
                      >
                        <Link to={`/product/${floatingProducts[1]._id}`}>
                          <ProductCard
                            product={floatingProducts[1]}
                            index={2}
                          />
                        </Link>
                      </motion.div>
                    )} */}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Bottom controls */}
          <div className="mt-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="inline-flex cursor-pointer size-11 items-center justify-center rounded-full hover:bg-black/10 ring-1 ring-black/15"
                onClick={prevSlide}
                aria-label="Previous"
              >
                <ChevronLeft className="size-5" />
              </button>

              <div className="flex gap-2">
                {slides.map((s, i) => (
                  <motion.button
                    key={s.id}
                    type="button"
                    className={[
                      "h-2 rounded-full transition-all",
                      i === currentSlide ? "w-8 bg-black" : "w-2 bg-black/30",
                    ].join(" ")}
                    onClick={() => {
                      setDirection(i > currentSlide ? 1 : -1);
                      setCurrentSlide(i);
                    }}
                    whileHover={{ scale: 1.15 }}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                className="inline-flex cursor-pointer size-11 items-center justify-center rounded-full hover:bg-black/10 ring-1 ring-black/15"
                onClick={nextSlide}
                aria-label="Next"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cursor glow */}
      <motion.div
        className="absolute z-0 size-96 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{
          background: current?.accent ?? "rgba(255,255,255,0.18)",
          x: mouseX,
          y: mouseY,
        }}
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </section>
  );
};

export default Hero;

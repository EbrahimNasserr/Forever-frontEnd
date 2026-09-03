import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// ─── Category definitions ─────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "Men",
    title: "Menswear",
    tag: "Tailoring",
    subtitle: "Architectural cuts and performance suiting built for the modern man.",
  },
  {
    id: "Women",
    title: "Womenswear",
    tag: "Silhouettes",
    subtitle: "Sculptural silhouettes that balance proportion with fluid movement.",
  },
  {
    id: "Kids",
    title: "Kids",
    tag: "Essentials",
    subtitle: "Durable everyday pieces designed to move as fast as they do.",
  },
  {
    id: "all",
    title: "New Arrivals",
    tag: "Latest",
    subtitle: "Fresh additions to the catalog — curated for each new season.",
  },
];

// ─── CategoryCard ─────────────────────────────────────────────────────────────

const CategoryCard = ({ category, image, itemCount, index, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    onClick={onClick}
    className="group relative h-[480px] sm:h-[540px] rounded-[32px] overflow-hidden cursor-pointer bg-[#E5E2DD] hover:shadow-2xl transition-all duration-500 border border-black/5"
    data-cursor-label="EXPLORE"
  >
    {/* Background image */}
    {image ? (
      <img
        src={image}
        alt={category.title}
        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
        loading="lazy"
      />
    ) : (
      <div className="w-full h-full bg-gradient-to-br from-stone-300 to-stone-600" />
    )}

    {/* Gradient vignette */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity duration-500 group-hover:opacity-95" />

    {/* Top meta */}
    <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-serif italic text-2xl text-white/90">
          0{index + 1}
        </span>
        <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-white/90 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
          {category.tag}
        </span>
      </div>
      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-transform duration-300 group-hover:rotate-45 group-hover:bg-white group-hover:text-black">
        <ArrowUpRight className="size-4" />
      </div>
    </div>

    {/* Bottom content */}
    <div className="absolute bottom-6 left-6 right-6 text-white transition-transform duration-300 group-hover:-translate-y-1">
      <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-white/70 mb-1.5">
        {itemCount} ITEMS
      </div>
      <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-snug mb-2">
        {category.title}
      </h3>
      <p className="text-xs text-white/80 line-clamp-2 leading-relaxed font-light">
        {category.subtitle}
      </p>
      <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between text-[11px] uppercase tracking-[0.15em] font-bold text-white opacity-90 group-hover:opacity-100">
        <span>View Catalog</span>
        <span>→</span>
      </div>
    </div>
  </motion.div>
);

// ─── FeaturedCategories ───────────────────────────────────────────────────────

const FeaturedCategories = () => {
  const navigate = useNavigate();
  const allProducts = useSelector((state) => state.products.items);

  const enrichedCategories = useMemo(() => {
    if (!Array.isArray(allProducts)) return CATEGORIES.map((c) => ({ ...c, image: null, itemCount: 0 }));

    return CATEGORIES.map((cat) => {
      const pool =
        cat.id === "all"
          ? allProducts
          : allProducts.filter(
              (p) => String(p?.category).toLowerCase() === cat.id.toLowerCase()
            );
      // Pick a bestseller image first, fallback to first available
      const hero =
        pool.find((p) => p?.bestseller)?.image?.[0] ?? pool[0]?.image?.[0] ?? null;
      return { ...cat, image: hero, itemCount: pool.length };
    });
  }, [allProducts]);

  const handleSelect = (categoryId) => {
    if (categoryId === "all") {
      navigate("/collection");
    } else {
      navigate(`/collection?category=${categoryId}`);
    }
    // Dispatch custom event so BestSeller filter tab reacts if on same page
    window.dispatchEvent(new CustomEvent("filter-category", { detail: categoryId }));
  };

  return (
    <section
      id="categories"
      className="py-24 sm:py-32 bg-[#F5F2ED] border-b border-black/5 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/50 block mb-3">
              SHOP BY CATEGORY
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl text-[#1A1A1A] font-bold tracking-tight leading-none">
              Curated <em className="italic font-normal">Categories.</em>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-sm text-[#1A1A1A]/60 max-w-md leading-relaxed"
          >
            Every garment is conceived to balance proportion with the tactile intimacy
            of quality materials — built to last, not just the season.
          </motion.p>
        </div>

        {/* 4-card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {enrichedCategories.map((cat, index) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              image={cat.image}
              itemCount={cat.itemCount}
              index={index}
              onClick={() => handleSelect(cat.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;

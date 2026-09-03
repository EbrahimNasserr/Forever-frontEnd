import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Heart,
  RefreshCw,
  Ruler,
  Scissors,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  X,
  ZoomIn,
} from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "../../features/cart/useCart";
import { useWishlist } from "../../features/wishlist/useWishlist";
import { useGetProductByIdQuery, useGetAllProductsQuery } from "../../features/products/productsApi";
import ErrorState from "../share/ErrorState.jsx";
import ProductDetailsSkeleton from "../share/ProductDetailsSkeleton.jsx";
import Reviews from "./Reviews.jsx";

/* ─── Dossier tab definitions ─────────────────────────────────────────── */
const DOSSIER_TABS = [
  { id: "description", label: "Couture Architecture" },
  { id: "provenance", label: "Yarn & Provenance" },
  { id: "care", label: "Preservation & Care" },
  { id: "courier", label: "White-Glove Courier" },
];

/* ─── Size guide rows ──────────────────────────────────────────────────── */
const sizeMetrics = (sizes, unit) =>
  sizes.map((s, i) => ({
    size: s,
    chest: unit === "cm" ? 104 + i * 4 : (41 + i * 1.5).toFixed(1),
    shoulder: unit === "cm" ? 44 + i * 1.5 : (17.3 + i * 0.6).toFixed(1),
    sleeve: unit === "cm" ? 62 + i * 1 : (24.4 + i * 0.4).toFixed(1),
    length: unit === "cm" ? 122 + i * 1 : (48 + i * 0.4).toFixed(1),
  }));

/* ─── Inline ScrollReveal ──────────────────────────────────────────────── */
const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════════════ */

const Hero = ({ productId }) => {
  const params = useParams();
  const id = productId ?? params?.id;

  const { add } = useCart();
  const { toggle: toggleWishlist, isInWishlist } = useWishlist();

  const { data: product, isLoading } = useGetProductByIdQuery(id, { skip: !id });
  const { data: allProducts = [] } = useGetAllProductsQuery();

  /* ── Derived data ── */
  const images = useMemo(() => {
    const imgs = product?.image ?? product?.images;
    return Array.isArray(imgs) ? imgs.filter(Boolean) : [];
  }, [product]);

  const sizes = useMemo(() => {
    const s = product?.sizes ?? product?.size;
    return Array.isArray(s) ? s.filter(Boolean) : [];
  }, [product]);

  const colors = useMemo(() => {
    const c = product?.colors ?? product?.color;
    return Array.isArray(c) ? c.filter(Boolean) : [];
  }, [product]);

  const { averageRating, reviewsCount } = useMemo(() => {
    const raw = product?.rating ?? product?.stars ?? product?.averageRating ?? null;
    const value = raw == null ? null : Number(raw);
    const countRaw = product?.reviewsCount ?? product?.reviewCount;
    const count = countRaw == null ? null : Number(countRaw);
    return {
      averageRating: Number.isFinite(value) ? Math.max(0, Math.min(5, value)) : null,
      reviewsCount: Number.isFinite(count) && count >= 0 ? count : null,
    };
  }, [product]);

  const relatedProducts = useMemo(
    () =>
      Array.isArray(allProducts)
        ? allProducts
            .filter(
              (p) =>
                String(p?._id) !== String(id) &&
                (product?.category ? p?.category === product.category : true)
            )
            .slice(0, 3)
        : [],
    [allProducts, id, product?.category]
  );

  /* ── Local UI state ── */
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const [activeDossierTab, setActiveDossierTab] = useState("description");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideUnit, setSizeGuideUnit] = useState("cm");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const [showStickyBar, setShowStickyBar] = useState(false);
  const purchaseSectionRef = useRef(null);

  /* ── Sync selections when product changes ── */
  useEffect(() => {
    setSelectedSize(sizes[0] ?? "");
    setSelectedColor(colors[0] ?? "");
    setActiveImageIdx(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Sticky bar on scroll ── */
  useEffect(() => {
    const onScroll = () => {
      if (!purchaseSectionRef.current) return;
      setShowStickyBar(purchaseSectionRef.current.getBoundingClientRect().bottom < 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const displaySize = selectedSize && sizes.includes(selectedSize) ? selectedSize : (sizes[0] ?? "");
  const displayColor = selectedColor && colors.includes(selectedColor) ? selectedColor : (colors[0] ?? "");
  const displayImageIdx = images.length ? Math.min(activeImageIdx, images.length - 1) : 0;
  const isFav = isInWishlist(product?._id);

  /* ── Handlers ── */
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    });
  };

  const handleAddToCart = async () => {
    try {
      await add({
        productId: product?._id,
        size: displaySize,
        color: displayColor,
        quantity,
        product,
      });
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2200);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Failed to add to cart");
    }
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard");
    } catch {
      toast.info("Copy the URL from the address bar");
    }
  };

  /* ── Guards ── */
  if (!id)
    return (
      <ErrorState
        title="Missing product id"
        message="We couldn't figure out which product to show."
        actionLabel="Back to collection"
        actionTo="/collection"
      />
    );
  if (isLoading) return <ProductDetailsSkeleton />;
  if (!product)
    return (
      <ErrorState
        title="Product not found"
        message="This product may have been removed or the link is incorrect."
        actionLabel="Back to collection"
        actionTo="/collection"
      />
    );

  const categoryName =
    typeof product.category === "object"
      ? (product.category?.name ?? "")
      : (product.category ?? "");

  /* ══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1A1A] pt-6 pb-28">

      {/* ── 1. Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase letter-spaced font-bold text-[#1A1A1A]/60 border-b border-black/10 pb-4">
          <div className="flex items-center gap-2.5">
            <Link to="/" className="hover:text-[#1A1A1A] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/collection" className="hover:text-[#1A1A1A] transition-colors capitalize">
              {categoryName || "Collection"}
            </Link>
            <span>/</span>
            <span className="text-[#1A1A1A] line-clamp-1">{product.name}</span>
          </div>
          <Link
            to="/collection"
            className="flex items-center gap-1.5 hover:text-[#1A1A1A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Collection</span>
          </Link>
        </div>
      </div>

      {/* ── 2. Main Gallery + Dossier Grid ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">

          {/* LEFT — Interactive Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Main stage with zoom lens */}
            <div
              className="relative aspect-[3/4] w-full rounded-[36px] overflow-hidden bg-stone-200 border border-black/10 shadow-xl cursor-crosshair group select-none"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              onClick={() => setIsLightboxOpen(true)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${product._id}-${displayImageIdx}`}
                  src={images[displayImageIdx]}
                  alt={`${product.name} view ${displayImageIdx + 1}`}
                  className="w-full h-full object-cover object-center"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  loading="eager"
                />
              </AnimatePresence>

              {/* Zoom lens overlay */}
              {isZooming && images[displayImageIdx] && (
                <div
                  className="absolute inset-0 pointer-events-none hidden md:block"
                  style={{
                    backgroundImage: `url(${images[displayImageIdx]})`,
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundSize: "240%",
                  }}
                />
              )}

              {/* Category badge */}
              <div className="absolute top-5 left-5 z-10 pointer-events-none">
                {categoryName && (
                  <span className="text-[10px] uppercase letter-spaced font-bold text-[#1A1A1A] bg-white/95 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-sm border border-black/5">
                    {categoryName}
                    {product.subCategory ? ` · ${product.subCategory}` : ""}
                  </span>
                )}
              </div>

              {/* Fullscreen button */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(true); }}
                className="absolute bottom-5 right-5 w-11 h-11 rounded-full bg-white/90 hover:bg-[#1A1A1A] hover:text-white backdrop-blur-md border border-black/10 flex items-center justify-center text-[#1A1A1A] shadow-md transition-all group-hover:scale-105"
                title="Open fullscreen view"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {/* Hover tip */}
              <div className="absolute bottom-5 left-5 hidden md:flex items-center gap-2 text-[10px] uppercase letter-spaced font-bold text-[#1A1A1A]/70 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-black/5 pointer-events-none">
                <ZoomIn className="w-3 h-3" />
                <span>Hover to inspect detail</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 sm:w-24 aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      displayImageIdx === idx
                        ? "border-[#1A1A1A] shadow-md scale-105"
                        : "border-black/10 opacity-70 hover:opacity-100 hover:border-black/30"
                    }`}
                    aria-label={`Select view ${idx + 1}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      0{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Provenance callout */}
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-black/5 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-white border border-black/10 flex items-center justify-center shrink-0 text-[#B36B42]">
                <Scissors className="w-5 h-5" />
              </div>
              <div className="text-xs text-[#1A1A1A]/75 leading-relaxed">
                <span className="font-bold text-[#1A1A1A] block uppercase letter-spaced text-[10px] mb-1">
                  Hand-Numbered Bespoke Commission
                </span>
                Every piece in this edition includes a discreet blind-embossed
                provenance patch with its individual edition number and
                tailor's initial stitch.
              </div>
            </div>
          </div>

          {/* RIGHT — Silhouette Dossier (5 cols) */}
          <div ref={purchaseSectionRef} className="lg:col-span-5 flex flex-col">
            {/* Edition header */}
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-[10px] uppercase letter-spaced font-bold text-[#B36B42]">
                {categoryName}
                {product.subCategory ? ` · ${product.subCategory}` : ""}
              </span>
              {averageRating !== null && (
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-[#B36B42] text-[#B36B42]" />
                  <span className="text-[#1A1A1A]">{averageRating.toFixed(1)}</span>
                  {reviewsCount !== null && (
                    <a
                      href="#patron-reflections"
                      className="text-[#1A1A1A]/60 hover:text-[#1A1A1A] underline font-sans ml-1"
                    >
                      ({reviewsCount})
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="prata-regular text-3xl sm:text-4xl xl:text-5xl font-bold text-[#1A1A1A] tracking-tight mb-3">
              {product.name}
            </h1>

            {/* Pricing */}
            <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-black/10">
              <span className="text-3xl font-bold text-[#1A1A1A]">${Number(product.price).toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-[#1A1A1A]/40 line-through">
                  ${Number(product.originalPrice).toFixed(2)}
                </span>
              )}
              <span className="text-[11px] text-[#1A1A1A]/60 uppercase letter-spaced font-bold ml-auto">
                VAT Included
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-[#1A1A1A]/80 leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* Color Selector */}
            {colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="uppercase letter-spaced font-bold text-[#1A1A1A]/70">
                    Selected Colorway
                  </span>
                  <span className="font-bold text-[#1A1A1A] capitalize">{displayColor}</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {colors.map((c) => {
                    const isSelected = displayColor === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        title={c}
                        className={`relative flex items-center gap-2 p-1 rounded-full border transition-all ${
                          isSelected
                            ? "border-[#1A1A1A] ring-2 ring-[#1A1A1A]/30 scale-105"
                            : "border-transparent hover:border-black/20"
                        }`}
                      >
                        <span
                          className="w-7 h-7 rounded-full border border-black/20 shadow-inner block"
                          style={{ backgroundColor: c }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="uppercase letter-spaced font-bold text-[#1A1A1A]/70">
                    Atelier Sizing
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center gap-1.5 uppercase letter-spaced font-bold text-[#B36B42] hover:text-[#1A1A1A] transition-colors"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Fit Dossier</span>
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {sizes.map((s) => {
                    const isSelected = displaySize === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        aria-pressed={isSelected}
                        className={`py-3 px-2 rounded-2xl text-xs font-bold uppercase letter-spaced transition-all border text-center ${
                          isSelected
                            ? "bg-[#1A1A1A] text-[#F5F2ED] border-[#1A1A1A] shadow-md scale-[1.02]"
                            : "bg-white text-[#1A1A1A] border-black/15 hover:border-black hover:bg-stone-50"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Qty + CTA + Wishlist + Share */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
              {/* Quantity stepper */}
              <div className="flex items-center justify-between bg-white border border-black/15 rounded-full px-4 py-3.5 w-full sm:w-36 shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-6 h-6 flex items-center justify-center text-sm font-bold text-[#1A1A1A] hover:opacity-60 disabled:opacity-30 transition-opacity"
                >
                  −
                </button>
                <span className="text-xs font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-6 h-6 flex items-center justify-center text-sm font-bold text-[#1A1A1A] hover:opacity-60 transition-opacity"
                >
                  +
                </button>
              </div>

              {/* Primary CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 w-full py-4 px-8 rounded-full text-xs font-bold uppercase letter-spaced transition-all shadow-xl flex items-center justify-center gap-2.5 ${
                  justAdded
                    ? "bg-emerald-800 text-white"
                    : "bg-[#1A1A1A] hover:bg-black text-[#F5F2ED] hover:scale-[1.02]"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      Commission Piece — ${(Number(product.price) * quantity).toFixed(2)}
                    </span>
                  </>
                )}
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => toggleWishlist(product._id)}
                className={`p-4 rounded-full border transition-all shadow-sm ${
                  isFav
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                    : "bg-white text-[#1A1A1A] border-black/15 hover:border-black hover:bg-stone-50"
                }`}
                title={isFav ? "Remove from wishlist" : "Save to wishlist"}
              >
                <Heart className={`w-4 h-4 ${isFav ? "fill-[#C86D44] text-[#C86D44]" : ""}`} />
              </button>

              {/* Share */}
              <button
                type="button"
                onClick={handleShare}
                className="p-4 rounded-full bg-white text-[#1A1A1A] border border-black/15 hover:border-black hover:bg-stone-50 transition-all shadow-sm"
                title="Copy link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Private fitting link */}
            <div className="pb-6 border-b border-black/10">
              <Link
                to="/contact"
                className="text-xs font-bold uppercase letter-spaced text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors underline flex items-center gap-1.5"
              >
                <span>Reserve Private Salon Fitting (Paris / NYC / Tokyo)</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Value props */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              {[
                { icon: Truck, text: "Complimentary Global Courier (2–4 Days)" },
                { icon: RefreshCw, text: "30-Day Atelier Returns & Exchanges" },
                { icon: ShieldCheck, text: "Authenticity Guaranteed on Every Piece" },
                { icon: Scissors, text: "Complimentary Lifetime Seam Maintenance" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-xs text-[#1A1A1A]/75">
                  <Icon className="w-4 h-4 text-[#B36B42] shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Atelier Dossier Tabs ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-24">
        <Reveal>
          <div className="bg-[#FAF8F5] rounded-[40px] p-8 sm:p-12 border border-black/5 shadow-sm">
            <div className="text-[10px] uppercase letter-spaced font-bold text-[#B36B42] mb-2">
              TECHNICAL ATELIER SPECIFICATION
            </div>
            <h2 className="prata-regular text-3xl font-bold text-[#1A1A1A] mb-8">
              The Silhouette Dossier
            </h2>

            {/* Tab buttons */}
            <div className="flex flex-wrap gap-3 pb-6 border-b border-black/10 mb-8">
              {DOSSIER_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveDossierTab(tab.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase letter-spaced transition-all ${
                    activeDossierTab === tab.id
                      ? "bg-[#1A1A1A] text-[#F5F2ED] shadow-md"
                      : "bg-white text-[#1A1A1A]/70 hover:text-[#1A1A1A] border border-black/10 hover:border-black/25"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDossierTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {activeDossierTab === "description" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#1A1A1A]/80 leading-relaxed">
                    <div>
                      <h4 className="prata-regular text-lg font-bold text-[#1A1A1A] mb-3">
                        Structural Construction
                      </h4>
                      <p className="mb-4">
                        Patterned in our central Paris atelier with meticulous
                        focus on balance and line. Seam lines are blind-finished
                        by hand, eliminating rigid bulk while allowing natural
                        drape over body contours.
                      </p>
                      {product.description && (
                        <p className="text-xs text-[#1A1A1A]/70 whitespace-pre-line">
                          {product.description}
                        </p>
                      )}
                    </div>
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/5">
                      <span className="text-[10px] uppercase letter-spaced font-bold text-[#1A1A1A]/60 block mb-2">
                        PRODUCT DETAILS
                      </span>
                      <ul className="space-y-2.5 text-xs text-[#1A1A1A]/80">
                        {[
                          `Category: ${categoryName}`,
                          product.subCategory && `Sub-category: ${product.subCategory}`,
                          sizes.length && `Available sizes: ${sizes.join(", ")}`,
                          `Price: $${Number(product.price).toFixed(2)}`,
                          product.bestseller && "Best Seller",
                        ]
                          .filter(Boolean)
                          .map((detail) => (
                            <li key={detail} className="flex items-start gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-[#B36B42] shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeDossierTab === "provenance" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#1A1A1A]/80 leading-relaxed">
                    <div>
                      <h4 className="prata-regular text-lg font-bold text-[#1A1A1A] mb-3">
                        The Heritage Mill
                      </h4>
                      <p className="mb-4">
                        The textiles for this silhouette are sourced from
                        heritage mills utilizing pure glacial water in the
                        finishing stages to preserve natural fiber oils, resulting
                        in extraordinary tensile memory and unmatched softness.
                      </p>
                      <p className="text-xs text-[#1A1A1A]/70">
                        100% traceable fiber passport registered via encrypted
                        NFC thread in the interior care label.
                      </p>
                    </div>
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/5">
                      <h4 className="prata-regular text-lg font-bold text-[#1A1A1A] mb-3">
                        Sustainable Craft Standards
                      </h4>
                      <div className="space-y-3 text-xs text-[#1A1A1A]/75">
                        <p>• Zero synthetic nylon blend additions for 100% biodegradation potential.</p>
                        <p>• Natural vegetable, mineral, or low-impact closed-loop fiber dyes.</p>
                        <p>• Certified fair-wage artisanal production across all partner ateliers.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeDossierTab === "care" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#1A1A1A]/80 leading-relaxed">
                    <div>
                      <h4 className="prata-regular text-lg font-bold text-[#1A1A1A] mb-3">
                        Preservation Guidance
                      </h4>
                      <p className="mb-4">
                        Natural luxury fibers breathe and recover naturally when
                        rested between wearings. Hang on a contoured hanger and
                        air in indirect ventilation.
                      </p>
                      <div className="space-y-2 text-xs text-[#1A1A1A]/75">
                        <p>• Specialist gentle dry clean only when genuinely necessary.</p>
                        <p>• Do not iron directly; refresh with light indirect vertical steam.</p>
                        <p>• Store in the provided cotton garment bag with natural cedar blocks.</p>
                      </div>
                    </div>
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/5">
                      <h4 className="prata-regular text-lg font-bold text-[#1A1A1A] mb-2">
                        Lifetime Atelier Guarantee
                      </h4>
                      <p className="text-xs text-[#1A1A1A]/70 leading-relaxed mb-4">
                        Should a seam loosen or a button require replacement after
                        years of patronage, our workshops restore any Forever
                        garment without charge.
                      </p>
                      <Link
                        to="/contact"
                        className="text-xs font-bold uppercase letter-spaced text-[#1A1A1A] underline"
                      >
                        Contact Repair Service
                      </Link>
                    </div>
                  </div>
                )}

                {activeDossierTab === "courier" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#1A1A1A]/80 leading-relaxed">
                    <div>
                      <h4 className="prata-regular text-lg font-bold text-[#1A1A1A] mb-3">
                        White-Glove Courier Logistics
                      </h4>
                      <p className="mb-4">
                        Each order is hand-inspected by an atelier tailor before
                        wrapping in archival acid-free tissue and dispatching in a
                        rigid presentation case via carbon-neutral express courier.
                      </p>
                      <div className="space-y-2 text-xs text-[#1A1A1A]/75">
                        <p>• EU & UK: 1–2 Business Days (Complimentary Express)</p>
                        <p>• North America & Asia-Pacific: 2–4 Business Days</p>
                        <p>• Same-day chauffeur courier in Central Paris & Manhattan.</p>
                      </div>
                    </div>
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/5">
                      <h4 className="prata-regular text-lg font-bold text-[#1A1A1A] mb-2">
                        30-Day Atelier Return Policy
                      </h4>
                      <p className="text-xs text-[#1A1A1A]/70 leading-relaxed mb-4">
                        Pieces may be tried in the comfort of your residence and
                        returned within 30 days in unworn state. Prepaid return
                        courier labels are included in every dispatch box.
                      </p>
                      <Link
                        to="/contact"
                        className="text-xs font-bold uppercase letter-spaced text-[#1A1A1A] underline"
                      >
                        Initiate Exchange or Return
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>

      {/* ── 4. Complete the Silhouette ── */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-24">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-black/10 gap-4">
              <div>
                <span className="text-[10px] uppercase letter-spaced font-bold text-[#B36B42] block mb-1">
                  STYLED BY ATELIER DIRECTORS
                </span>
                <h2 className="prata-regular text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
                  Complete The Silhouette
                </h2>
              </div>
              <span className="text-xs text-[#1A1A1A]/60 uppercase letter-spaced font-bold">
                Curated Ensemble Pairings
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {relatedProducts.map((rel, idx) => (
                <Reveal key={rel._id} delay={idx * 0.08}>
                  <Link
                    to={`/product/${rel._id}`}
                    className="bg-[#FAF8F5] rounded-[32px] p-6 border border-black/5 hover:border-black/20 transition-all group shadow-sm flex flex-col justify-between block"
                  >
                    <div>
                      <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-5 bg-stone-200">
                        <img
                          src={rel.image?.[0] ?? rel.images?.[0]}
                          alt={rel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                      </div>
                      <div className="text-[10px] uppercase letter-spaced font-bold text-[#B36B42] mb-1">
                        {typeof rel.category === "object" ? rel.category?.name : rel.category}
                      </div>
                      <h4 className="prata-regular text-xl font-bold text-[#1A1A1A] mb-1 group-hover:text-stone-600 transition-colors">
                        {rel.name}
                      </h4>
                    </div>
                    <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                      <span className="font-bold text-sm text-[#1A1A1A]">
                        ${Number(rel.price).toFixed(2)}
                      </span>
                      <span className="text-xs font-bold uppercase letter-spaced text-[#1A1A1A] underline group-hover:opacity-60">
                        Inspect Piece →
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      )}

      {/* ── 5. Patron Reflections (Reviews) ── */}
      <div id="patron-reflections" className="max-w-7xl mx-auto px-6 sm:px-12 mb-16">
        <Reveal>
          <div className="bg-[#FAF8F5] rounded-[40px] p-8 sm:p-12 border border-black/5 shadow-sm">
            <div className="mb-8 pb-6 border-b border-black/10">
              <span className="text-[10px] uppercase letter-spaced font-bold text-[#B36B42] block mb-1">
                VERIFIED COLLECTOR ASSESSMENTS
              </span>
              <h2 className="prata-regular text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-2">
                Patron Reflections
              </h2>
              <p className="text-xs text-[#1A1A1A]/65">
                Genuine appraisals from private salon clients and global patrons.
              </p>
            </div>
            <Reviews
              productId={id}
              averageRating={averageRating}
              reviewsCount={reviewsCount}
            />
          </div>
        </Reveal>
      </div>

      {/* ── 6. Size Guide Modal ── */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeGuideOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-[#F5F2ED] w-full max-w-2xl rounded-[36px] overflow-hidden p-6 sm:p-10 border border-black/10 shadow-2xl z-10 my-auto"
            >
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white border border-black/10 flex items-center justify-center text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between mb-4 pr-12">
                <span className="text-[10px] uppercase letter-spaced font-bold text-[#B36B42]">
                  ATELIER MEASUREMENT MATRIX
                </span>
                <div className="flex items-center bg-white rounded-full p-1 border border-black/10">
                  {["cm", "in"].map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setSizeGuideUnit(u)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                        sizeGuideUnit === u
                          ? "bg-[#1A1A1A] text-white shadow-sm"
                          : "text-[#1A1A1A]/70"
                      }`}
                    >
                      {u === "cm" ? "Metric (cm)" : "Imperial (in)"}
                    </button>
                  ))}
                </div>
              </div>

              <h3 className="prata-regular text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-2">
                Garment Measurement Dossier
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 mb-6">
                All measurements taken with the garment laid flat on our granite
                cutting table.
              </p>

              <div className="overflow-x-auto mb-6 bg-white rounded-2xl border border-black/10 p-2">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-black/10 text-[10px] uppercase letter-spaced font-bold text-[#1A1A1A]/60">
                      {["Size", "Chest", "Shoulder", "Sleeve", "Length"].map((h) => (
                        <th key={h} className="p-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeMetrics(sizes, sizeGuideUnit).map((row) => (
                      <tr
                        key={row.size}
                        className={`border-b border-black/5 last:border-0 ${
                          displaySize === row.size ? "bg-amber-50/60 font-bold" : ""
                        }`}
                      >
                        <td className="p-3 font-bold text-[#1A1A1A]">{row.size}</td>
                        <td className="p-3 text-[#1A1A1A]/80">{row.chest} {sizeGuideUnit}</td>
                        <td className="p-3 text-[#1A1A1A]/80">{row.shoulder} {sizeGuideUnit}</td>
                        <td className="p-3 text-[#1A1A1A]/80">{row.sleeve} {sizeGuideUnit}</td>
                        <td className="p-3 text-[#1A1A1A]/80">{row.length} {sizeGuideUnit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#1A1A1A]/75">
                <div>
                  <span className="font-bold text-[#1A1A1A] block mb-0.5">
                    Model Proportions
                  </span>
                  <span>
                    Model is 180 cm / 5'11" wearing size{" "}
                    {sizes[1] ?? sizes[0] ?? "M"}.
                  </span>
                </div>
                <Link
                  to="/contact"
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="shrink-0 text-xs font-bold uppercase letter-spaced text-[#B36B42] hover:text-[#1A1A1A] underline"
                >
                  Consult Master Tailor →
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 7. Fullscreen Lightbox ── */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 p-4 sm:p-8 flex items-center justify-center bg-black/95">
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative max-w-5xl max-h-[90vh] flex items-center justify-center">
              <motion.img
                key={displayImageIdx}
                src={images[displayImageIdx]}
                alt={product.name}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIdx(
                        (displayImageIdx - 1 + images.length) % images.length
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors shadow-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIdx((displayImageIdx + 1) % images.length)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors shadow-lg"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 8. Sticky Purchase Dock ── */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-black/10 shadow-2xl z-40 py-3.5 px-6 sm:px-12"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                {images[0] && (
                  <img
                    src={images[0]}
                    alt={product.name}
                    className="w-12 h-14 rounded-xl object-cover bg-stone-200 shrink-0"
                  />
                )}
                <div className="min-w-0 hidden sm:block">
                  <h4 className="prata-regular text-base font-bold text-[#1A1A1A] truncate">
                    {product.name}
                  </h4>
                  <span className="text-[11px] text-[#1A1A1A]/60 uppercase letter-spaced font-bold">
                    {displaySize && `${displaySize} · `}
                    {displayColor}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-lg text-[#1A1A1A]">
                  ${Number(product.price).toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="bg-[#1A1A1A] hover:bg-black text-[#F5F2ED] px-6 sm:px-8 py-3 rounded-full text-xs font-bold uppercase letter-spaced transition-all shadow-md flex items-center gap-2 hover:scale-[1.02]"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;

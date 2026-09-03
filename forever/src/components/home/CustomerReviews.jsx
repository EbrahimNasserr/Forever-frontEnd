import { motion } from "framer-motion";
import { CheckCircle, Quote, Sparkles, Star } from "lucide-react";

// ─── Static review data ───────────────────────────────────────────────────────

const REVIEWS = [
  {
    id: 1,
    rating: 5,
    quote:
      "The craftsmanship is extraordinary. I've worn this coat every day this winter and it only gets better — the wool has a sculptural weight that photographs beautifully.",
    author: "Alexandra M.",
    role: "Architect, Stockholm",
  },
  {
    id: 2,
    rating: 5,
    quote:
      "Finally a brand that understands quietness as luxury. No logos, no noise — just an impeccably proportioned silhouette that feels like it was made for me.",
    author: "James L.",
    role: "Creative Director, London",
  },
  {
    id: 3,
    rating: 5,
    quote:
      "I ordered the merino trousers and the fit is surgical. The provenance document was a thoughtful touch — knowing exactly where the wool came from matters.",
    author: "Camille D.",
    role: "Stylist, Paris",
  },
  {
    id: 4,
    rating: 5,
    quote:
      "Received within 48 hours with the most elegant packaging I've ever encountered. The garment itself exceeded every expectation.",
    author: "Yuki T.",
    role: "Photographer, Tokyo",
  },
  {
    id: 5,
    rating: 5,
    quote:
      "The overcoat is simply the most considered piece of clothing I own. The hand-stitched canvas chest and horn buttons are details you only notice on close inspection.",
    author: "Marco B.",
    role: "Collector, Milan",
  },
  {
    id: 6,
    rating: 5,
    quote:
      "I've been searching for a brand that builds clothes to last a generation. This is it. The knitwear has the density and drape of something from decades ago.",
    author: "Sophie R.",
    role: "Interior Designer, Zürich",
  },
];

// Duplicate for seamless infinite loop
const MARQUEE_ITEMS = [...REVIEWS, ...REVIEWS];

// ─── ReviewCard ───────────────────────────────────────────────────────────────

const ReviewCard = ({ review }) => (
  <div className="w-[320px] sm:w-[400px] shrink-0 bg-[#FAF8F5] p-6 sm:p-7 rounded-[28px] border border-black/5 shadow-sm flex flex-col justify-between">
    <div>
      {/* Stars + quote icon */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="size-4 fill-[#C86D44] text-[#C86D44]" />
          ))}
        </div>
        <Quote className="size-5 text-black/15" />
      </div>

      {/* Quote */}
      <p className="font-serif text-lg text-[#1A1A1A] leading-relaxed italic mb-5">
        "{review.quote}"
      </p>
    </div>

    {/* Author footer */}
    <div className="pt-4 border-t border-black/8 flex items-center justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1A1A1A]">
          {review.author}
        </p>
        <p className="text-xs text-[#1A1A1A]/50 mt-0.5">{review.role}</p>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
        <CheckCircle className="size-3" />
        Verified
      </div>
    </div>
  </div>
);

// ─── CustomerReviews ──────────────────────────────────────────────────────────

const CustomerReviews = () => (
  <section className="py-20 sm:py-28 bg-[#F5F2ED] border-b border-black/5 overflow-hidden">
    {/* Section header */}
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 mb-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/50 mb-4">
          <Sparkles className="size-3.5" />
          <span>Critical Praise &amp; Private Commissions</span>
        </div>
        <h2 className="font-serif text-4xl sm:text-6xl font-bold text-[#1A1A1A] leading-tight tracking-tight">
          Press &amp; <em className="font-normal">Client</em> Reviews.
        </h2>
        <p className="mt-4 text-sm text-[#1A1A1A]/50 max-w-md mx-auto">
          Scrutinised by international critics and treasured by collectors
          worldwide.
        </p>
      </motion.div>
    </div>

    {/* Marquee track */}
    <div className="relative w-full">
      {/* Gradient edge fades */}
      <div className="absolute left-0 inset-y-0 w-20 sm:w-36 bg-gradient-to-r from-[#F5F2ED] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-20 sm:w-36 bg-gradient-to-l from-[#F5F2ED] to-transparent z-10 pointer-events-none" />

      {/* Outer wrapper — hover pauses */}
      <div className="overflow-hidden" style={{ cursor: "default" }}>
        <div
          className="flex gap-5 px-4"
          style={{
            animation: "forever-marquee 55s linear infinite",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
        >
          {MARQUEE_ITEMS.map((review, idx) => (
            <ReviewCard key={`${review.id}-${idx}`} review={review} />
          ))}
        </div>
      </div>
    </div>

    <style>{`
      @keyframes forever-marquee {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}</style>
  </section>
);

export default CustomerReviews;

import { useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RelatedProducts = ({ category, subCategory, currentProductId }) => {
  const products = useSelector((state) => state.products.items);
  const trackRef = useRef(null);

  const related = useMemo(() => {
    if (!Array.isArray(products)) return [];
    if (!category) return [];

    return products
      .filter((p) => String(p?._id) !== String(currentProductId))
      .filter((p) => (category ? p?.category === category : true))
      .filter((p) => (subCategory ? p?.subCategory === subCategory : true))
      .slice(0, 12);
  }, [products, category, subCategory, currentProductId]);

  const scrollByCard = useCallback((dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-related-card]");
    const delta = card
      ? card.getBoundingClientRect().width + 16
      : Math.max(260, el.clientWidth * 0.8);
    el.scrollBy({ left: dir * delta, behavior: "smooth" });
  }, []);

  if (!related.length) return null;

  return (
    <section className="mt-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            You may also like
          </p>
          <h2 className="mt-2 text-lg font-semibold text-gray-900">
            Related products
          </h2>
        </div>
      </div>

      <div className="relative mt-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-white to-transparent" />

        <div className="absolute right-0 top-0 z-20 flex -translate-y-14 items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2 text-gray-900 shadow-sm ring-1 ring-black/5 hover:bg-gray-50"
            aria-label="Scroll related products left"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2 text-gray-900 shadow-sm ring-1 ring-black/5 hover:bg-gray-50"
            aria-label="Scroll related products right"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <motion.div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {related.map((p) => (
            <motion.div
              key={p._id}
              data-related-card
              className="w-[72%] shrink-0 snap-start sm:w-[44%] md:w-[32%] lg:w-[24%]"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <Link
                to={`/product/${p._id}`}
                className="group block overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
              >
                <div className="overflow-hidden bg-gray-50">
                  <motion.img
                    src={p?.image?.[0]}
                    alt={p?.name ?? ""}
                    className="aspect-square w-full object-cover"
                    loading="lazy"
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  />
                </div>
                <div className="p-3">
                  <p className="line-clamp-1 text-sm font-semibold text-gray-900">
                    {p?.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {p?.category}
                    {p?.subCategory ? ` · ${p.subCategory}` : ""}
                  </p>
                  <p className="mt-2 text-sm font-bold text-gray-900">
                    ${p?.price}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default RelatedProducts;

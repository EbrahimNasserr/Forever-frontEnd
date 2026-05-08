import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Title from "../share/Title.jsx";
import ProductItem from "../share/ProductItem.jsx";
import { useGetAllProductsQuery } from "../../features/products/productsApi";

const LatestCollection = () => {
  const { data: products = [] } = useGetAllProductsQuery();
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);
  const x = useMotionValue(0);

  const latest = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return [...products]
      .sort((a, b) => (b?.date ?? 0) - (a?.date ?? 0))
      .slice(0, 8);
  }, [products]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const nextWidth = el.scrollWidth - el.offsetWidth;
      setWidth(Math.max(0, nextWidth));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [latest.length]);

  const scrollTo = (direction) => {
    const currentX = x.get();
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const scrollAmount = containerWidth * 0.8;

    let newX =
      direction === "left" ? currentX + scrollAmount : currentX - scrollAmount;
    newX = Math.max(Math.min(newX, 0), -width);

    animate(x, newX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 1,
    });
  };

  return (
    <section className="my-12 max-w-7xl mx-auto">
      <div className="mb-6">
        <Title title1="Latest " title2="Collection" />
        <p className="text-sm text-gray-500 text-center">
          New arrivals picked from the catalog.
        </p>
      </div>

      <div className="relative group/slider">
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => scrollTo("left")}
          className="absolute left-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/85 shadow-lg backdrop-blur-sm transition-opacity group-hover/slider:opacity-100 sm:flex opacity-0"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5 text-gray-900" />
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => scrollTo("right")}
          className="absolute right-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/85 shadow-lg backdrop-blur-sm transition-opacity group-hover/slider:opacity-100 sm:flex opacity-0"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 text-gray-900" />
        </motion.button>

        <motion.div
          ref={containerRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing"
          whileTap={{ cursor: "grabbing" }}
        >
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            dragElastic={0.08}
            style={{ x }}
            className="flex gap-4 py-4 sm:gap-6"
          >
            {latest.map((p, idx) => (
              <ProductItem
                key={p._id}
                product={p}
                index={idx}
                className="min-w-[260px] max-w-[260px] sm:min-w-[320px] sm:max-w-[320px]"
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestCollection;

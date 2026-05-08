import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useGetAllProductsQuery } from "../../features/products/productsApi";

const SearchBar = ({ isOpen, onClose }) => {
  const { data: products = [] } = useGetAllProductsQuery();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target)) handleClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen, handleClose]);

  const filtered = useMemo(() => {
    if (!Array.isArray(products)) return [];
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => {
        const hay = [
          p?.name,
          p?.category,
          p?.subCategory,
          p?.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 10);
  }, [products, query]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="absolute left-0 right-0 top-full z-50 flex justify-center px-4 pb-4"
          role="dialog"
          aria-label="Search products"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <motion.div
            ref={panelRef}
            className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xl ring-1 ring-black/5"
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <motion.div
              className="flex items-center gap-2 border-b border-gray-100 px-3 py-2 sm:px-4"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeOut", delay: 0.04 }}
            >
              <Search className="size-5 shrink-0 text-gray-400" aria-hidden />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, categories…"
                className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-gray-900 outline-none placeholder:text-gray-400"
                autoComplete="off"
              />
              <motion.button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close search"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="size-5" />
              </motion.button>
            </motion.div>

            <div className="max-h-[min(60vh,420px)] overflow-y-auto px-3 py-2 sm:px-4">
              <AnimatePresence mode="wait" initial={false}>
                {query.trim() === "" ? (
                  <motion.p
                    key="hint"
                    className="py-10 text-center text-sm text-gray-500"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                  >
                    Type to search our catalog — try &quot;top&quot;, &quot;women&quot;,
                    or &quot;jacket&quot;.
                  </motion.p>
                ) : filtered.length === 0 ? (
                  <motion.p
                    key="empty"
                    className="py-10 text-center text-sm text-gray-500"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                  >
                    No products match &quot;{query.trim()}&quot;.
                  </motion.p>
                ) : (
                  <motion.ul
                    key="results"
                    className="divide-y divide-gray-50"
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.03, delayChildren: 0.02 },
                      },
                    }}
                  >
                    {filtered.map((p) => (
                      <motion.li
                        key={p._id}
                        variants={{
                          hidden: { opacity: 0, y: 8 },
                          show: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                      >
                        <Link
                          to={`/product/${p._id}`}
                          onClick={handleClose}
                          className="flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-gray-50"
                        >
                          <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                            <img
                              src={p?.image?.[0]}
                              alt=""
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-sm font-medium text-gray-900">
                              {p?.name}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500">
                              {p?.category}
                              {p?.subCategory ? ` · ${p.subCategory}` : ""}
                            </p>
                          </div>
                          <span className="shrink-0 text-sm font-semibold text-gray-900">
                            ${p?.price}
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default SearchBar;

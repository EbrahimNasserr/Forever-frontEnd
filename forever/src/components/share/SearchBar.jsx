import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Search, X } from "lucide-react";

const SearchBar = ({ isOpen, onClose }) => {
  const products = useSelector((state) => state.products.items);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex justify-center p-4 pt-20 sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        aria-label="Close search"
        onClick={handleClose}
      />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xl ring-1 ring-black/5">
        <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2 sm:px-4">
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
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close search"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="max-h-[min(60vh,420px)] overflow-y-auto px-3 py-2 sm:px-4">
          {query.trim() === "" && (
            <p className="py-10 text-center text-sm text-gray-500">
              Type to search our catalog — try &quot;top&quot;, &quot;women&quot;,
              or &quot;jacket&quot;.
            </p>
          )}
          {query.trim() !== "" && filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-gray-500">
              No products match &quot;{query.trim()}&quot;.
            </p>
          )}
          <ul className="divide-y divide-gray-50">
            {filtered.map((p) => (
              <li key={p._id}>
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
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

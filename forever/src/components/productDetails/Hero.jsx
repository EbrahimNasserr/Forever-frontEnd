import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import ErrorState from "../share/ErrorState.jsx";
import ProductDetailsSkeleton from "../share/ProductDetailsSkeleton.jsx";
import Reviews from "./Reviews.jsx";
import RelatedProducts from "./RelatedProducts.jsx";

const ProductDetails = ({ productId }) => {
  const params = useParams();
  const id = productId ?? params?.id;
  const products = useSelector((state) => state.products.items);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  const product = useMemo(() => {
    if (!id) return null;
    if (!Array.isArray(products)) return null;
    return products.find((p) => String(p?._id) === String(id)) ?? null;
  }, [products, id]);

  const images = useMemo(() => {
    const imgs = product?.image;
    return Array.isArray(imgs) ? imgs.filter(Boolean) : [];
  }, [product]);

  const sizes = useMemo(() => {
    const s = product?.sizes;
    return Array.isArray(s) ? s.filter(Boolean) : [];
  }, [product]);

  const { ratingValue, ratingCount } = useMemo(() => {
    const rawValue =
      product?.rating ?? product?.stars ?? product?.ratingValue ?? null;
    const value = rawValue == null ? null : Number(rawValue);
    const countRaw =
      product?.ratingCount ?? product?.reviewsCount ?? product?.reviewCount;
    const count = countRaw == null ? null : Number(countRaw);
    return {
      ratingValue: Number.isFinite(value)
        ? Math.max(0, Math.min(5, value))
        : null,
      ratingCount: Number.isFinite(count) && count >= 0 ? count : null,
    };
  }, [product]);

  const displayImageIdx = useMemo(() => {
    if (!images.length) return 0;
    return Math.min(activeImageIdx, images.length - 1);
  }, [activeImageIdx, images.length]);

  const displaySize = useMemo(() => {
    if (selectedSize && sizes.includes(selectedSize)) return selectedSize;
    return sizes[0] ?? "";
  }, [selectedSize, sizes]);

  if (!id) {
    return (
      <ErrorState
        title="Missing product id"
        message="We couldn’t figure out which product to show."
        actionLabel="Back to collection"
        actionTo="/collection"
      />
    );
  }

  if (!Array.isArray(products)) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <ErrorState
        title="Product not found"
        message="This product may have been removed or the link is incorrect."
        actionLabel="Back to collection"
        actionTo="/collection"
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-black/5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={`${product?._id}-${displayImageIdx}`}
                src={images[displayImageIdx]}
                alt={product?.name ?? "Product image"}
                className="aspect-square w-full object-cover"
                loading="lazy"
                initial={{ opacity: 0, scale: 0.96, rotate: -0.4 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.02, rotate: 0.3 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            </AnimatePresence>
          </motion.div>

          {images.length > 1 ? (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {images.map((src, idx) => {
                const isActive = idx === displayImageIdx;
                return (
                  <motion.button
                    key={`${src}-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    className={[
                      "shrink-0 overflow-hidden rounded-xl ring-1 transition",
                      isActive
                        ? "ring-gray-900"
                        : "ring-gray-200 hover:ring-gray-300",
                    ].join(" ")}
                    aria-label={`Select image ${idx + 1}`}
                  >
                    <img
                      src={src}
                      alt=""
                      className="size-16 object-cover sm:size-20"
                      loading="lazy"
                    />
                  </motion.button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {product?.category}
            {product?.subCategory ? ` · ${product.subCategory}` : ""}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
            {product?.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const filled = ratingValue != null && ratingValue >= i + 1;
                return (
                  <Star
                    key={i}
                    className={[
                      "size-4",
                      filled ? "text-amber-500" : "text-gray-300",
                    ].join(" ")}
                    fill={filled ? "currentColor" : "none"}
                    aria-hidden
                  />
                );
              })}
            </div>
            <p className="text-sm text-gray-600">
              {ratingValue != null ? ratingValue.toFixed(1) : "No reviews yet"}
              {ratingCount != null ? ` · ${ratingCount} reviews` : ""}
            </p>
          </div>
          <p className="mt-3 text-xl font-semibold text-gray-900">
            ${product?.price}
          </p>

          {product?.description && (
            <p className="mt-5 whitespace-pre-line text-sm leading-6 text-gray-600">
              {product.description}
            </p>
          )}

          {sizes.length ? (
            <div className="mt-7">
              <p className="text-sm font-semibold text-gray-900">Select size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {sizes.map((s) => {
                  const isActive = s === displaySize;
                  return (
                    <motion.button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className={[
                        "rounded-xl border px-4 py-2 text-sm font-semibold transition-colors",
                        isActive
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
                      ].join(" ")}
                      aria-pressed={isActive}
                    >
                      {s}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/cart"
              className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Go to cart
            </Link>
            <Link
              to="/collection"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              Continue shopping
            </Link>
          </div>
          <div className="mt-5 flex flex-col gap-2 text-sm text-gray-500 border-t-2 pt-4">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-2 border-b border-gray-200">
          {[
            { id: "description", label: "Description" },
            { id: "reviews", label: "Reviews" },
          ].map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={[
                  "relative -mb-px rounded-t-xl px-4 py-3 text-sm font-semibold transition-colors",
                  isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-900",
                ].join(" ")}
                aria-pressed={isActive}
              >
                {t.label}
                {isActive ? (
                  <motion.span
                    layoutId="product-details-tab-underline"
                    className="absolute inset-x-2 bottom-0 h-0.5 rounded bg-gray-900"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="pt-6">
          <AnimatePresence mode="wait" initial={false}>
            {activeTab === "description" ? (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
                  <p className="text-sm leading-7 text-gray-600 whitespace-pre-line">
                    {product?.description ||
                      "No description is available for this product yet."}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <Reviews ratingValue={ratingValue} ratingCount={ratingCount} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <RelatedProducts
        currentProductId={product?._id}
        category={product?.category}
        subCategory={product?.subCategory}
      />
    </div>
  );
};

export default ProductDetails;

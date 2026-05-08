import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "../features/cart/useCart";

const Cart = () => {
  const {
    items: cart,
    isAuthenticated,
    summary,
    clear,
    remove,
    setQuantity,
  } = useCart();
  const products = useSelector((state) => state.products.items);
  const items = (Array.isArray(cart) ? cart : [])
    .map((item) => {
      const productId = item.productId ?? item.product?._id ?? item.product;
      const product = Array.isArray(products)
        ? products.find((p) => String(p?._id) === String(productId))
        : null;
      const data = item.product ?? product ?? null;
      if (!data) return null;
      const unitPrice = Number(item.price ?? data.price) || 0;
      return {
        ...item,
        product: {
          ...data,
          image:
            Array.isArray(data.image) && data.image.length
              ? data.image
              : typeof item.image === "string"
                ? [item.image]
                : [],
          name: data.name ?? item.name ?? "",
          price: unitPrice,
        },
        productId,
        lineTotal: unitPrice * (Number(item.quantity) || 0),
      };
    })
    .filter(Boolean);

  const subtotal = Number(summary?.subtotal) || 0;
  const shipping = Number(summary?.shipping) || 0;
  const total = Number(summary?.total) || subtotal + shipping;
  const [quantityDrafts, setQuantityDrafts] = useState({});
  const debouncedTimersRef = useRef({});

  const queueQuantityUpdate = (item, nextQuantity, key, showSuccessText = "Quantity updated") => {
    if (debouncedTimersRef.current[key]) {
      window.clearTimeout(debouncedTimersRef.current[key]);
    }

    debouncedTimersRef.current[key] = window.setTimeout(async () => {
      try {
        await setQuantity({
          cartItem: item,
          productId: item.productId,
          size: item.size,
          quantity: nextQuantity,
        });
        toast.success(showSuccessText);
      } catch (err) {
        const message = err?.data?.message || err?.message || "Failed to update quantity";
        toast.error(message);
      }
    }, 500);
  };

  const flushQuantityUpdate = async (item, key) => {
    if (debouncedTimersRef.current[key]) {
      window.clearTimeout(debouncedTimersRef.current[key]);
    }
    const raw = quantityDrafts[key];
    const parsed = Number(raw);
    const nextQuantity = Number.isFinite(parsed) ? Math.max(1, Math.floor(parsed)) : 1;
    setQuantityDrafts((prev) => ({ ...prev, [key]: String(nextQuantity) }));
    try {
      await setQuantity({
        cartItem: item,
        productId: item.productId,
        size: item.size,
        quantity: nextQuantity,
      });
      toast.success("Quantity updated");
    } catch (err) {
      const message = err?.data?.message || err?.message || "Failed to update quantity";
      toast.error(message);
    }
  };

  return (
    <section className="mx-auto max-w-6xl py-8 sm:py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Shopping cart
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">
            Your cart
          </h1>
        </div>
        {items.length ? (
          <button
            type="button"
            onClick={() => clear().then(() => toast.success("Cart cleared"))}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Clear cart
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-500">Your cart is empty.</p>
          <Link
            to="/collection"
            className="mt-4 inline-flex rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color ?? ""}`}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <img
                    src={item.product?.image?.[0]}
                    alt={item.product?.name ?? ""}
                    className="size-24 rounded-xl bg-gray-50 object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                      {item.product?.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Size: {item.size || "-"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      ${item.product?.price} each
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      ${item.lineTotal.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  {(() => {
                    const itemKey = `${item.productId}-${item.size ?? ""}-${item.color ?? ""}`;
                    const rawDraft = quantityDrafts[itemKey] ?? String(item.quantity ?? 1);
                    const parsedDraft = Number(rawDraft);
                    const safeDraft = Number.isFinite(parsedDraft)
                      ? Math.max(1, Math.floor(parsedDraft))
                      : 1;

                    return (
                      <div className="inline-flex items-center rounded-xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        const next = Math.max(1, safeDraft - 1);
                        setQuantityDrafts((prev) => ({ ...prev, [itemKey]: String(next) }));
                        queueQuantityUpdate(item, next, itemKey, "Quantity decreased");
                      }}
                      className="p-2 text-gray-700 hover:bg-gray-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-4" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={rawDraft}
                      onChange={(e) => {
                        const nextRaw = e.target.value.replace(/[^\d]/g, "");
                        setQuantityDrafts((prev) => ({ ...prev, [itemKey]: nextRaw }));
                        const nextParsed = Number(nextRaw);
                        if (!Number.isFinite(nextParsed) || nextParsed <= 0) return;
                        queueQuantityUpdate(
                          item,
                          Math.max(1, Math.floor(nextParsed)),
                          itemKey,
                        );
                      }}
                      onBlur={() => flushQuantityUpdate(item, itemKey)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          flushQuantityUpdate(item, itemKey);
                        }
                      }}
                      className="w-14 border-x border-gray-200 px-2 py-1 text-center text-sm font-semibold outline-none"
                      aria-label="Quantity"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = safeDraft + 1;
                        setQuantityDrafts((prev) => ({ ...prev, [itemKey]: String(next) }));
                        queueQuantityUpdate(item, next, itemKey, "Quantity increased");
                      }}
                      className="p-2 text-gray-700 hover:bg-gray-50"
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                    );
                  })()}

                  <button
                    type="button"
                    onClick={() =>
                      remove({
                        cartItem: item,
                        productId: item.productId,
                        size: item.size,
                      }).then(() => toast.success("Item removed from cart"))
                    }
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="size-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Order summary
            </h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/place-order"
              className={`mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Proceed to checkout
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
};

export default Cart;

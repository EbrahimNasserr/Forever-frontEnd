import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "../features/cart/useCart";

const Cart = () => {
  const { items: cart, isAuthenticated, clear, remove, setQuantity } = useCart();
  const products = useSelector((state) => state.products.items);
  const items = (Array.isArray(cart) ? cart : [])
    .map((item) => {
      const productId = item.productId ?? item.product?._id ?? item.productId;
      const product = Array.isArray(products)
        ? products.find((p) => String(p?._id) === String(productId))
        : null;
      const data = product ?? item.product;
      if (!data) return null;
      return {
        ...item,
        product: data,
        lineTotal: (Number(data.price) || 0) * (Number(item.quantity) || 0),
      };
    })
    .filter(Boolean);

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const shipping = items.length ? 10 : 0;
  const total = subtotal + shipping;

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
                key={`${item.productId}-${item.size}`}
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
                  <div className="inline-flex items-center rounded-xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity({
                          cartItem: item,
                          productId: item.productId,
                          size: item.size,
                          quantity: item.quantity - 1,
                        }).then(() => toast.success("Quantity decreased"))
                      }
                      className="p-2 text-gray-700 hover:bg-gray-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="min-w-9 px-2 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity({
                          cartItem: item,
                          productId: item.productId,
                          size: item.size,
                          quantity: item.quantity + 1,
                        }).then(() => toast.success("Quantity increased"))
                      }
                      className="p-2 text-gray-700 hover:bg-gray-50"
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>

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

import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "../../features/cart/useCart";

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items: cart, isAuthenticated, summary, remove, setQuantity } = useCart();
  const products = useSelector((state) => state.products.items);
  const cartItems = useMemo(() => {
    if (!Array.isArray(cart)) return [];
    return cart
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
  }, [cart, products]);

  const subtotal = Number(summary?.subtotal) || 0;

  const itemCount = useMemo(
    () => cartItems.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0),
    [cartItems],
  );

  const goToCart = () => {
    onClose?.();
    navigate("/cart");
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-70">
          <motion.button
            type="button"
            aria-label="Close cart sidebar"
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          <motion.aside
            className="absolute right-0 top-0 h-full w-full max-w-md border-l border-gray-200 bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 sm:px-5">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="size-5 text-gray-900" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                    Cart ({itemCount})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  aria-label="Close cart"
                >
                  <X className="size-5" />
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                  <ShoppingBag className="size-10 text-gray-300" />
                  <p className="mt-4 text-sm font-semibold text-gray-900">
                    Your cart is empty
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Add products to see them here.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-5 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
                    {cartItems.map((item) => (
                      <div
                        key={`${item.productId}-${item.size}`}
                        className="rounded-2xl border border-gray-200 p-3"
                      >
                        <div className="flex gap-3">
                          <img
                            src={item.product?.image?.[0]}
                            alt={item.product?.name ?? ""}
                            className="size-18 rounded-xl bg-gray-50 object-cover"
                            loading="lazy"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                              {item.product?.name}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              Size: {item.size || "-"}
                            </p>
                            <p style={{ backgroundColor: item.color }} className="mt-1 px-2 py-2 w-fit rounded-full text-xs text-gray-500">
                            </p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">
                              ${item.product?.price}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-xl border border-gray-200">
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity({
                                  cartItem: item,
                                  productId: item.productId,
                                  size: item.size,
                                  quantity: item.quantity - 1,
                                })
                              }
                              className="p-2 text-gray-700 hover:bg-gray-50"
                            >
                              <Minus className="size-4" />
                            </button>
                            <span className="min-w-8 px-2 text-center text-sm font-semibold">
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
                                })
                              }
                              className="p-2 text-gray-700 hover:bg-gray-50"
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
                              })
                            }
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="size-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 px-4 py-4 sm:px-5">
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-gray-600">Subtotal</p>
                      <p className="text-base font-semibold text-gray-900">
                        ${subtotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={goToCart}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        View cart
                      </button>
                      <Link
                        to="/place-order"
                        onClick={onClose}
                        className={`rounded-xl bg-gray-900 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-gray-800 ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        Checkout
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

export default CartSidebar;

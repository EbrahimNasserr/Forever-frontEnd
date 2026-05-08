import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { assets } from "../assets/assets";
import { CreditCard, Truck } from "lucide-react";
import { placeOrder } from "../features/orders/ordersSlice";
import { toast } from "react-toastify";
import { useCart } from "../features/cart/useCart";

const PlaceOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.items);
  const { items: cart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const items = useMemo(
    () =>
      (Array.isArray(cart) ? cart : [])
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
        .filter(Boolean),
    [cart, products]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.lineTotal, 0),
    [items]
  );
  const shipping = items.length ? 10 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = () => {
    const required = [
      form.firstName,
      form.lastName,
      form.email,
      form.street,
      form.city,
      form.country,
      form.phone,
    ];
    if (required.some((v) => !String(v).trim())) {
      toast.error("Please complete shipping information.");
      return;
    }

    dispatch(
      placeOrder({
        items,
        shippingInfo: form,
        paymentMethod,
        summary: {
          subtotal,
          shipping,
          tax,
          total,
        },
        status: "Order placed",
      })
    );

    toast.success("Order placed successfully.");
    navigate("/orders");
  };

  return (
    <section className="mx-auto max-w-7xl py-8 sm:py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Checkout
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
          Place your order
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            Your cart is empty. Add products before checkout.
          </p>
          <Link
            to="/collection"
            className="mt-4 inline-flex rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Go to collection
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <Truck className="size-5 text-gray-900" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                Shipping information
              </h2>
            </div>

            <form className="grid gap-4 sm:grid-cols-2">
              <input
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                placeholder="First name"
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring"
              />
              <input
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                placeholder="Last name"
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring"
              />
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="Email address"
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring sm:col-span-2"
              />
              <input
                name="street"
                value={form.street}
                onChange={onChange}
                placeholder="Street address"
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring sm:col-span-2"
              />
              <input
                name="city"
                value={form.city}
                onChange={onChange}
                placeholder="City"
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring"
              />
              <input
                name="state"
                value={form.state}
                onChange={onChange}
                placeholder="State"
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring"
              />
              <input
                name="zipCode"
                value={form.zipCode}
                onChange={onChange}
                placeholder="Zip code"
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring"
              />
              <input
                name="country"
                value={form.country}
                onChange={onChange}
                placeholder="Country"
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="Phone number"
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring sm:col-span-2"
              />
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <CreditCard className="size-5 text-gray-900" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                  Payment method
                </h2>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("stripe")}
                  className={[
                    "flex w-full items-center justify-between rounded-xl border px-4 py-3 transition",
                    paymentMethod === "stripe"
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:bg-gray-50",
                  ].join(" ")}
                >
                  <img src={assets.stripe_logo} alt="Stripe" className="h-5 w-auto" />
                  <span className="text-xs font-semibold uppercase text-gray-500">
                    Card payment
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("razorpay")}
                  className={[
                    "flex w-full items-center justify-between rounded-xl border px-4 py-3 transition",
                    paymentMethod === "razorpay"
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:bg-gray-50",
                  ].join(" ")}
                >
                  <img
                    src={assets.razorpay_logo}
                    alt="Razorpay"
                    className="h-5 w-auto"
                  />
                  <span className="text-xs font-semibold uppercase text-gray-500">
                    UPI / Card
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={[
                    "flex w-full items-center justify-between rounded-xl border px-4 py-3 transition",
                    paymentMethod === "cod"
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:bg-gray-50",
                  ].join(" ")}
                >
                  <span className="text-sm font-semibold text-gray-900">
                    Cash on Delivery
                  </span>
                  <span className="text-xs font-semibold uppercase text-gray-500">
                    COD
                  </span>
                </button>
              </div>
            </div>

            <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                Order summary
              </h2>

              <div className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={item.product?.image?.[0]}
                      alt={item.product?.name ?? ""}
                      className="size-14 rounded-lg bg-gray-50 object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-semibold text-gray-900">
                        {item.product?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty {item.quantity} {item.size ? `· ${item.size}` : ""}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      ${item.lineTotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3 border-t border-gray-200 pt-4 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Place order
              </button>
            </aside>
          </div>
        </div>
      )}
    </section>
  );
};

export default PlaceOrder;

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { assets } from "../assets/assets";
import { CreditCard, Truck } from "lucide-react";
import { usePlaceOrderMutation } from "../features/orders/ordersApi";
import { addOrder } from "../features/orders/ordersSlice";
import {
  initialOrderForm,
  buildOrderPayload,
  validateOrderForm,
} from "../features/orders/orderHelpers";
import { toast } from "react-toastify";
import { useCart } from "../features/cart/useCart";

const PlaceOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.items);
  const { items: cart, clear } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [form, setForm] = useState(initialOrderForm);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const [placeOrderApi, { isLoading }] = usePlaceOrderMutation();

  const items = useMemo(
    () =>
      (Array.isArray(cart) ? cart : [])
        .map((item) => {
          const productId =
            item.productId ?? item.product?._id ?? item.productId;
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
    [cart, products],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.lineTotal, 0),
    [items],
  );
  const shipping = items.length ? 10 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!validateOrderForm(form, paymentMethod, billingSameAsShipping)) {
      toast.error("Please complete all required order details.");
      return;
    }

    const payload = buildOrderPayload(
      form,
      paymentMethod,
      billingSameAsShipping,
    );

    try {
      const order = await placeOrderApi(payload).unwrap();
      dispatch(
        addOrder({
          ...order,
          items,
          summary: { subtotal, shipping, tax, total },
          shippingAddress: payload.shippingAddress,
          billingAddress: payload.billingAddress,
          paymentMethod,
          notes: payload.notes,
          status: order?.status ?? "Order placed",
        }),
      );
      await clear();
      toast.success("Order placed successfully.");
      navigate("/orders");
    } catch (err) {
      const message =
        err?.data?.message || err?.error || "Unable to place order.";
      toast.error(message);
    }
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
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="Phone number"
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring sm:col-span-2"
              />
              <input
                name="shippingStreet"
                value={form.shippingStreet}
                onChange={onChange}
                placeholder="Shipping street"
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring sm:col-span-2"
              />
              <input
                name="shippingCity"
                value={form.shippingCity}
                onChange={onChange}
                placeholder="Shipping city"
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring"
              />
              <input
                name="shippingState"
                value={form.shippingState}
                onChange={onChange}
                placeholder="Shipping state"
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring"
              />
              <input
                name="shippingZipCode"
                value={form.shippingZipCode}
                onChange={onChange}
                placeholder="Shipping zip code"
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring"
              />
              <input
                name="shippingCountry"
                value={form.shippingCountry}
                onChange={onChange}
                placeholder="Shipping country"
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring"
              />

              <div className="sm:col-span-2">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={billingSameAsShipping}
                    onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  Billing address is same as shipping
                </label>
              </div>

              {!billingSameAsShipping && (
                <>
                  <input
                    name="billingStreet"
                    value={form.billingStreet}
                    onChange={onChange}
                    placeholder="Billing street"
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring sm:col-span-2"
                  />
                  <input
                    name="billingCity"
                    value={form.billingCity}
                    onChange={onChange}
                    placeholder="Billing city"
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring"
                  />
                  <input
                    name="billingState"
                    value={form.billingState}
                    onChange={onChange}
                    placeholder="Billing state"
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring"
                  />
                  <input
                    name="billingZipCode"
                    value={form.billingZipCode}
                    onChange={onChange}
                    placeholder="Billing zip code"
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring"
                  />
                  <input
                    name="billingCountry"
                    value={form.billingCountry}
                    onChange={onChange}
                    placeholder="Billing country"
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring"
                  />
                </>
              )}

              <textarea
                name="notes"
                value={form.notes}
                onChange={onChange}
                placeholder="Order notes (optional)"
                rows={4}
                className="sm:col-span-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none ring-gray-900/15 focus:ring"
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
                  <img
                    src={assets.stripe_logo}
                    alt="Stripe"
                    className="h-5 w-auto"
                  />
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
                  onClick={() => setPaymentMethod("cash_on_delivery")}
                  className={[
                    "flex w-full items-center justify-between rounded-xl border px-4 py-3 transition",
                    paymentMethod === "cash_on_delivery"
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
                disabled={isLoading}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Placing order..." : "Place order"}
              </button>
            </aside>
          </div>
        </div>
      )}
    </section>
  );
};

export default PlaceOrder;

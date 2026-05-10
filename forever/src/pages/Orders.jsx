import { Link } from "react-router-dom";
import { PackageCheck } from "lucide-react";
import { useGetOrdersQuery } from "../features/orders/ordersApi";

const formatDate = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
};

const formatCurrency = (value) => {
  return `$${Number(value || 0).toFixed(2)}`;
};

const formatAddress = (address) => {
  if (!address) return "-";
  return [
    address.street,
    address.city,
    address.state,
    address.zipCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
};

const humanPaymentMethod = (method) => {
  if (!method) return "Cash on Delivery";
  return method
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
};

const Orders = () => {
  const { data, isLoading, isFetching, isError, error } = useGetOrdersQuery();
  const orders = data?.orders ?? [];

  return (
    <section className="mx-auto max-w-6xl py-8 sm:py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Account
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
          My orders
        </h1>
      </div>

      {isLoading || isFetching ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <PackageCheck className="mx-auto size-10 text-gray-300" />
          <p className="mt-4 text-sm font-semibold text-gray-900">
            Loading orders…
          </p>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-red-700">
            Unable to load orders.
          </p>
          <p className="mt-2 text-sm text-red-600">
            {error?.data?.message || error?.error || "Please try again later."}
          </p>
        </div>
      ) : !Array.isArray(orders) || orders.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <PackageCheck className="mx-auto size-10 text-gray-300" />
          <p className="mt-4 text-sm font-semibold text-gray-900">
            No orders yet
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Your placed orders will show here.
          </p>
          <Link
            to="/collection"
            className="mt-5 inline-flex rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <article
              key={order._id ?? order.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {order._id ?? order.id}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {order.status || "pending"}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Payment: {humanPaymentMethod(order.paymentMethod)}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Shipping address
                    </p>
                    <p className="mt-3 text-sm text-gray-600">
                      {formatAddress(order.shippingAddress)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Billing address
                    </p>
                    <p className="mt-3 text-sm text-gray-600">
                      {formatAddress(order.billingAddress)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
                  <div className="space-y-3">
                    {(Array.isArray(order.items) ? order.items : []).map(
                      (item, idx) => {
                        const imageSrc =
                          item.image ||
                          item.product?.images?.[0] ||
                          item.product?.image?.[0] ||
                          "";
                        const title =
                          item.name || item.product?.name || "Product";
                        const lineTotal =
                          Number(item.lineTotal || item.price || 0) *
                          Number(item.quantity || 1);

                        return (
                          <div
                            key={`${item._id || item.product?._id || idx}-${item.size}-${idx}`}
                            className="flex items-center gap-3 rounded-xl border border-gray-200 p-3"
                          >
                            <img
                              src={imageSrc}
                              alt={title}
                              className="size-14 rounded-lg bg-gray-50 object-cover"
                              loading="lazy"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-1 text-sm font-semibold text-gray-900">
                                {title}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty {item.quantity}{" "}
                                {item.size ? `· ${item.size}` : ""}{" "}
                                {item.color ? `· ${item.color}` : ""}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatCurrency(lineTotal)}
                            </p>
                          </div>
                        );
                      },
                    )}
                  </div>

                  <aside className="h-fit rounded-xl bg-gray-50 p-4">
                    <p className="text-sm font-semibold text-gray-900">
                      Summary
                    </p>
                    <div className="mt-3 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Subtotal</span>
                        <span>
                          {formatCurrency(
                            order.summary?.subtotal ?? order.subtotal,
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Shipping</span>
                        <span>
                          {formatCurrency(
                            order.summary?.shipping ?? order.shipping,
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Tax</span>
                        <span>
                          {formatCurrency(order.summary?.tax ?? order.tax)}
                        </span>
                      </div>
                      <div className="h-px bg-gray-200" />
                      <div className="flex items-center justify-between font-semibold text-gray-900">
                        <span>Total</span>
                        <span>
                          {formatCurrency(order.summary?.total ?? order.total)}
                        </span>
                      </div>
                      <div className="pt-3 text-xs uppercase tracking-[0.18em] text-gray-500">
                        Payment method:{" "}
                        {humanPaymentMethod(order.paymentMethod)}
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Orders;

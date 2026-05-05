import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { PackageCheck } from "lucide-react";

const formatDate = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
};

const Orders = () => {
  const orders = useSelector((state) => state.products.orders);

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

      {!Array.isArray(orders) || orders.length === 0 ? (
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
              key={order.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {order.id}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {order.status}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Payment: {String(order.paymentMethod || "cod").toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_260px]">
                <div className="space-y-3">
                  {(Array.isArray(order.items) ? order.items : []).map((item, idx) => (
                    <div
                      key={`${item.productId}-${item.size}-${idx}`}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 p-3"
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
                        ${Number(item.lineTotal || 0).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <aside className="h-fit rounded-xl bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-900">Summary</p>
                  <div className="mt-3 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span>${Number(order.summary?.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Shipping</span>
                      <span>${Number(order.summary?.shipping || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tax</span>
                      <span>${Number(order.summary?.tax || 0).toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-gray-200" />
                    <div className="flex items-center justify-between font-semibold text-gray-900">
                      <span>Total</span>
                      <span>${Number(order.summary?.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </aside>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Orders;

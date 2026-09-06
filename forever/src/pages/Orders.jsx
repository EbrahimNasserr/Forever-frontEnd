import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowUpRight } from "lucide-react";

import { useGetOrdersQuery } from "../features/orders/ordersApi";
import { matchesFilter } from "../components/orders/orderUtils";

import OrdersHeader from "../components/orders/OrdersHeader";
import ConciergeStrip from "../components/orders/ConciergeStrip";
import OrderFilters from "../components/orders/OrderFilters";
import OrderSkeleton from "../components/orders/OrderSkeleton";
import OrderCard from "../components/orders/OrderCard";
import OrderDossierModal from "../components/orders/OrderDossierModal";
import ReturnModal from "../components/orders/ReturnModal";

const Orders = () => {
  const { data, isLoading, isFetching, isError, error } = useGetOrdersQuery();
  const orders = data?.orders ?? [];

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);
  const [returnOrder, setReturnOrder] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  /* ── Filtered + searched list ── */
  const filteredOrders = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return orders.filter((order) => {
      if (!matchesFilter(order, selectedFilter)) return false;
      if (!q) return true;
      const id = (order._id || order.id || "").toLowerCase();
      const itemMatch = (Array.isArray(order.items) ? order.items : []).some(
        (it) => (it.name || it.product?.name || "").toLowerCase().includes(q),
      );
      return id.includes(q) || itemMatch;
    });
  }, [orders, selectedFilter, searchQuery]);

  /* ── Filter tab counts ── */
  const counts = useMemo(
    () => ({
      all: orders.length,
      transit: orders.filter((o) => matchesFilter(o, "transit")).length,
      delivered: orders.filter((o) => matchesFilter(o, "delivered")).length,
      atelier: orders.filter((o) => matchesFilter(o, "atelier")).length,
    }),
    [orders],
  );

  const filterTabs = [
    { id: "all",       label: "All Commissions",  count: counts.all },
    { id: "transit",   label: "In Transit",        count: counts.transit },
    { id: "delivered", label: "Delivered",          count: counts.delivered },
    { id: "atelier",   label: "Atelier Crafting",  count: counts.atelier },
  ];

  /* ── Copy order ID ── */
  const handleCopy = (id) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1a1a1a] pt-24 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <OrdersHeader orderCount={orders.length} />

        <ConciergeStrip />

        <OrderFilters
          tabs={filterTabs}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* ── Content states ── */}
        {isLoading || isFetching ? (
          <OrderSkeleton />
        ) : isError ? (
          <ErrorState message={error?.data?.message || error?.error} />
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            hasOrders={orders.length > 0}
            hasActiveFilters={!!searchQuery || selectedFilter !== "all"}
            onReset={() => { setSelectedFilter("all"); setSearchQuery(""); }}
          />
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order._id || order.id}
                order={order}
                copiedId={copiedId}
                onCopy={handleCopy}
                onViewDossier={setActiveOrder}
                onReturn={setReturnOrder}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <OrderDossierModal
        order={activeOrder}
        onClose={() => setActiveOrder(null)}
      />

      <ReturnModal
        order={returnOrder}
        onClose={() => setReturnOrder(null)}
      />
    </div>
  );
};

/* ─── Local micro-components (page-level only) ────────────── */

const ErrorState = ({ message }) => (
  <div className="bg-white rounded-3xl p-12 text-center border border-red-200 my-8 max-w-xl mx-auto shadow-sm">
    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
      <Package className="w-7 h-7 text-red-400" />
    </div>
    <h3 className="font-serif text-2xl text-[#1a1a1a] mb-2">
      Unable to Load Orders
    </h3>
    <p className="text-xs text-black/60 max-w-sm mx-auto mb-6 leading-relaxed">
      {message || "Please try again later."}
    </p>
    <button
      onClick={() => window.location.reload()}
      className="px-6 py-2.5 rounded-full bg-[#1a1a1a] text-white text-xs uppercase tracking-wider font-semibold hover:bg-black/80 transition-colors cursor-pointer"
    >
      Retry
    </button>
  </div>
);

const EmptyState = ({ hasOrders, hasActiveFilters, onReset }) => (
  <div className="bg-white rounded-3xl p-12 text-center border border-black/10 my-8 max-w-xl mx-auto shadow-sm">
    <div className="w-16 h-16 rounded-full bg-[#EBE8E3] flex items-center justify-center mx-auto mb-4">
      <Package className="w-7 h-7 text-black/30" />
    </div>
    <h3 className="font-serif text-2xl text-[#1a1a1a] mb-2">
      No Commissions Found
    </h3>
    <p className="text-xs text-black/60 max-w-sm mx-auto mb-6 leading-relaxed">
      {hasOrders
        ? "No orders match your current filters. Try clearing the search or changing the filter."
        : "You haven't placed any orders yet. Explore the collection to get started."}
    </p>
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="px-5 py-2.5 rounded-full border border-black/15 text-xs uppercase tracking-wider font-semibold text-[#1a1a1a] hover:bg-[#EBE8E3] transition-colors cursor-pointer"
        >
          Reset Filters
        </button>
      )}
      <Link
        to="/collection"
        className="px-6 py-2.5 rounded-full bg-[#1a1a1a] text-white text-xs uppercase tracking-wider font-semibold hover:bg-black/80 transition-colors flex items-center gap-2"
      >
        <span>Shop Collection</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  </div>
);

export default Orders;

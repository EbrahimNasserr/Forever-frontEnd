import { Truck, ChevronRight, ShieldCheck, Printer, RotateCcw, Copy, Check, Package } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate, formatCurrency, humanPaymentMethod } from "./orderUtils";

const OrderCard = ({ order, copiedId, onCopy, onViewDossier, onReturn }) => {
  const orderId = order._id || order.id;
  const items = Array.isArray(order.items) ? order.items : [];
  const total = order.summary?.total ?? order.total ?? 0;

  return (
    <div className="bg-white rounded-3xl border border-black/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* ── Top bar ── */}
      <div className="bg-[#FAF8F5] px-6 sm:px-8 py-5 border-b border-black/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Reference */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-black/50 block">
              Order Reference
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono font-bold text-sm text-[#1a1a1a]">
                {orderId}
              </span>
              <button
                onClick={() => onCopy(orderId)}
                className="p-1 hover:bg-black/5 rounded text-black/50 hover:text-black transition-colors cursor-pointer"
                title="Copy order ID"
              >
                {copiedId === orderId ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-black/10" />

          {/* Date */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-black/50 block">
              Order Date
            </span>
            <span className="text-xs font-medium text-[#1a1a1a]">
              {formatDate(order.createdAt)}
            </span>
          </div>

          <div className="hidden sm:block w-px h-8 bg-black/10" />

          {/* Total */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-black/50 block">
              Total
            </span>
            <span className="text-xs font-bold text-[#1a1a1a]">
              {formatCurrency(total)}
            </span>
          </div>

          <div className="hidden sm:block w-px h-8 bg-black/10" />

          {/* Payment */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-black/50 block">
              Payment
            </span>
            <span className="text-xs font-medium text-[#1a1a1a]">
              {humanPaymentMethod(order.paymentMethod)}
            </span>
          </div>
        </div>

        {/* Status + CTA */}
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <button
            onClick={() => onViewDossier(order)}
            className="px-4 py-2 rounded-full border border-black/15 hover:border-black text-xs font-semibold tracking-wider uppercase text-[#1a1a1a] hover:bg-[#EBE8E3] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>View Dossier</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Items ── */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="divide-y divide-black/5">
          {items.map((item, idx) => {
            const imageSrc =
              item.image ||
              item.product?.images?.[0] ||
              item.product?.image?.[0] ||
              "";
            const title = item.name || item.product?.name || "Product";
            const unitPrice = Number(item.price || item.lineTotal || 0);
            const lineTotal = unitPrice * Number(item.quantity || 1);

            return (
              <div
                key={`${item._id || item.product?._id || idx}-${idx}`}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-[#EBE8E3] overflow-hidden flex-shrink-0 border border-black/10">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-black/20" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-black/50 font-semibold block">
                      Allocated Piece
                    </span>
                    <h4 className="font-serif text-lg text-[#1a1a1a] font-medium leading-snug">
                      {title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {item.size && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#EBE8E3] text-[11px] font-medium text-[#1a1a1a]">
                          Size: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#EBE8E3] text-[11px] font-medium text-[#1a1a1a]">
                          Color: {item.color}
                        </span>
                      )}
                      <span className="text-xs text-black/50">
                        Qty: {item.quantity || 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-black/5">
                  <span className="font-serif text-base sm:text-lg font-bold text-[#1a1a1a]">
                    {formatCurrency(lineTotal)}
                  </span>
                  {item.quantity > 1 && (
                    <span className="text-[11px] text-black/50">
                      ({formatCurrency(unitPrice)} each)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer actions ── */}
        <div className="pt-6 border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-black/50">
            <ShieldCheck className="w-4 h-4 text-black/70" />
            <span>Insured by our White-Glove Guarantee</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-full border border-black/10 text-xs font-semibold text-[#1a1a1a] hover:bg-[#FAF8F5] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-black/60" />
              <span>Print Receipt</span>
            </button>

            <button
              onClick={() => onReturn(order)}
              className="px-4 py-2 rounded-full border border-black/10 text-xs font-semibold text-[#1a1a1a] hover:bg-[#FAF8F5] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-black/60" />
              <span>Alteration / Return</span>
            </button>

            <button
              onClick={() => onViewDossier(order)}
              className="px-5 py-2 rounded-full bg-[#1a1a1a] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black/80 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Order Details</span>
              <Truck className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;

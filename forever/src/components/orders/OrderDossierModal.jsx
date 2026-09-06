import { motion, AnimatePresence } from "framer-motion";
import { X, Check, MapPin, CreditCard, Printer, Mail, Package } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate, formatCurrency, formatAddress, humanPaymentMethod, buildTimelineSteps } from "./orderUtils";

const OrderDossierModal = ({ order, onClose }) => {
  if (!order) return null;

  const orderId = order._id || order.id;
  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = order.summary?.subtotal ?? order.subtotal ?? 0;
  const shipping = order.summary?.shipping ?? order.shipping ?? 0;
  const tax = order.summary?.tax ?? order.tax ?? 0;
  const total = order.summary?.total ?? order.total ?? 0;
  const shipAddr = formatAddress(order.shippingAddress);
  const timelineSteps = buildTimelineSteps(order.status);

  return (
    <AnimatePresence>
      {order && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-4xl bg-[#F5F2ED] text-[#1a1a1a] rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl border border-black/10 flex flex-col my-auto max-h-[92vh]"
          >
            {/* Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-black/10 flex items-center justify-between bg-white flex-shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-black/50">
                    Bespoke Commission Dossier
                  </span>
                  <span className="w-1 h-1 rounded-full bg-black/40" />
                  <span className="font-mono text-xs font-bold text-[#1a1a1a]">
                    {orderId}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-light text-[#1a1a1a]">
                  Order Summary & Fulfilment Status
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[#EBE8E3] text-black/50 hover:text-[#1a1a1a] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-8">

              {/* Status + timeline */}
              <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-black/50 block mb-2">
                      Current Status
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-black/50 block mb-1">
                      Order Placed
                    </span>
                    <p className="text-sm font-bold text-[#1a1a1a]">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="pt-6">
                  <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-black/50 mb-4">
                    Fulfilment Journey
                  </p>
                  <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-black/15">
                    {timelineSteps.map((step, i) => (
                      <div key={i} className="relative">
                        <div
                          className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            step.done
                              ? "bg-[#1a1a1a] text-white shadow-sm"
                              : "bg-[#EBE8E3] text-black/40 border border-black/20"
                          }`}
                        >
                          {step.done ? <Check className="w-3 h-3" /> : i + 1}
                        </div>
                        <div>
                          <span
                            className={`font-serif text-sm font-semibold ${
                              step.done ? "text-[#1a1a1a]" : "text-black/35"
                            }`}
                          >
                            {step.title}
                          </span>
                          <p
                            className={`text-xs font-light mt-0.5 ${
                              step.done ? "text-black/60" : "text-black/30"
                            }`}
                          >
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Commissioned pieces */}
              <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-sm">
                <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-black/50 mb-4">
                  Commissioned Pieces ({items.length})
                </h4>
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
                        key={idx}
                        className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-16 rounded-xl bg-[#EBE8E3] overflow-hidden flex-shrink-0 border border-black/10">
                            {imageSrc ? (
                              <img
                                src={imageSrc}
                                alt={title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-5 h-5 text-black/20" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h5 className="font-serif text-base text-[#1a1a1a] font-medium">
                              {title}
                            </h5>
                            <div className="flex items-center gap-2 text-xs text-black/60 mt-1 flex-wrap">
                              {item.size && <span>Size: {item.size}</span>}
                              {item.size && item.color && <span>•</span>}
                              {item.color && <span>Color: {item.color}</span>}
                              {(item.size || item.color) && <span>•</span>}
                              <span>Qty: {item.quantity || 1}</span>
                            </div>
                          </div>
                        </div>
                        <span className="font-serif text-base font-bold text-[#1a1a1a] flex-shrink-0">
                          {formatCurrency(lineTotal)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Address + Payment grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping address */}
                <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 text-xs uppercase font-bold tracking-[0.2em] text-black/50">
                    <MapPin className="w-4 h-4 text-[#1a1a1a]" />
                    <span>Shipping Destination</span>
                  </div>
                  {shipAddr ? (
                    <>
                      {shipAddr.name && (
                        <p className="text-sm font-semibold text-[#1a1a1a]">
                          {shipAddr.name}
                        </p>
                      )}
                      <p className="text-xs text-black/70 mt-1 font-light leading-relaxed">
                        {shipAddr.line1}
                        {shipAddr.line1 && shipAddr.line2 && <br />}
                        {shipAddr.line2}
                      </p>
                      {shipAddr.phone && (
                        <p className="text-xs text-black/50 mt-2 font-mono">
                          Tel: {shipAddr.phone}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-black/50 italic">
                      No address on record.
                    </p>
                  )}
                </div>

                {/* Payment breakdown */}
                <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-xs uppercase font-bold tracking-[0.2em] text-black/50">
                      <CreditCard className="w-4 h-4 text-[#1a1a1a]" />
                      <span>Payment Breakdown</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-black/70">
                        <span>Subtotal</span>
                        <span className="font-medium text-[#1a1a1a]">
                          {formatCurrency(subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-black/70">
                        <span>Shipping</span>
                        <span className="font-medium text-[#1a1a1a]">
                          {shipping === 0 ? "Free" : formatCurrency(shipping)}
                        </span>
                      </div>
                      {tax > 0 && (
                        <div className="flex justify-between text-black/70">
                          <span>Tax</span>
                          <span className="font-medium text-[#1a1a1a]">
                            {formatCurrency(tax)}
                          </span>
                        </div>
                      )}
                      <div className="pt-3 border-t border-black/10 flex justify-between font-bold text-[#1a1a1a]">
                        <span className="text-sm">Total</span>
                        <span className="font-serif text-lg">
                          {formatCurrency(total)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-black/10 text-[11px] text-black/50">
                    Method: {humanPaymentMethod(order.paymentMethod)}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 sm:px-8 py-4 border-t border-black/10 bg-white flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-full border border-black/15 text-xs font-semibold text-[#1a1a1a] hover:bg-[#EBE8E3] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-black/60" />
                <span>Print Invoice</span>
              </button>

              <div className="flex items-center gap-3">
                <a
                  href="mailto:support@forever.com"
                  className="px-5 py-2.5 rounded-full border border-black/15 text-xs font-semibold text-[#1a1a1a] hover:bg-[#EBE8E3] transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-black/60" />
                  <span>Contact Support</span>
                </a>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#1a1a1a] text-white text-xs uppercase tracking-wider font-semibold hover:bg-black/80 transition-colors cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OrderDossierModal;

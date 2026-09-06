import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, CheckCircle2 } from "lucide-react";

const ReturnModal = ({ order, onClose }) => {
  const [submitted, setSubmitted] = useState(false);

  // Reset submitted state whenever a new order is opened
  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  if (!order) return null;

  const orderId = order._id || order.id;
  const defaultAddress = order.shippingAddress
    ? [
        order.shippingAddress.street || order.shippingAddress.address,
        order.shippingAddress.city,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <AnimatePresence>
      {order && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg bg-[#F5F2ED] rounded-3xl p-6 sm:p-8 border border-black/10 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-black/10">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-black/50 block">
                  White-Glove Service
                </span>
                <h3 className="font-serif text-2xl text-[#1a1a1a]">
                  Alteration &amp; Return
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-black/50 hover:text-[#1a1a1a] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!submitted ? (
              /* ── Form ── */
              <div className="py-6 space-y-4 text-xs">
                <p className="text-black/70 leading-relaxed font-light">
                  Every order includes complimentary tailor adjustments and
                  insured 30-day courier retrieval from your address.
                </p>

                <div>
                  <label className="block text-[11px] font-medium text-black/50 mb-1">
                    Order Reference
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={orderId}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-white font-mono font-bold text-[#1a1a1a] select-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-black/50 mb-1">
                    Service Requested
                  </label>
                  <select className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-white text-xs text-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] outline-none cursor-pointer">
                    <option>Tailor Alteration (Sleeve / Hem / Waist)</option>
                    <option>Size Exchange (Subject to availability)</option>
                    <option>Direct Return &amp; Account Credit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-black/50 mb-1">
                    Courier Pickup Address
                  </label>
                  <input
                    type="text"
                    defaultValue={defaultAddress}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-white text-xs text-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-black/50 mb-1">
                    Instructions for Tailors or Courier
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Please shorten trousers 1.5 cm with hand-stitched cuffs."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-white text-xs text-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] outline-none resize-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    onClick={handleClose}
                    className="px-5 py-2.5 rounded-full border border-black/15 text-xs font-semibold text-black/70 hover:bg-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setSubmitted(true)}
                    className="px-6 py-2.5 rounded-full bg-[#1a1a1a] text-white text-xs uppercase tracking-wider font-semibold hover:bg-black/80 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span>Dispatch Request</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* ── Success state ── */
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-700" />
                </div>
                <h4 className="font-serif text-2xl text-[#1a1a1a]">
                  Request Dispatched
                </h4>
                <p className="text-xs text-black/60 max-w-sm mx-auto leading-relaxed">
                  Our support team will confirm courier collection within 2
                  hours. Your garment will be handled with full white-glove
                  care.
                </p>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full bg-[#1a1a1a] text-white text-xs uppercase tracking-wider font-semibold hover:bg-black/80 transition-colors cursor-pointer"
                >
                  Return to Orders
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReturnModal;

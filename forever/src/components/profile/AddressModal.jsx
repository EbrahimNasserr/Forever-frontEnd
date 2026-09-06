import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[11px] font-medium text-black/50 mb-1">{label}</label>
    {children}
  </div>
);

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-white text-xs text-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] outline-none";

const AddressModal = ({ isOpen, isEditing, form, onChange, onSubmit, onClose }) => (
  <AnimatePresence>
    {isOpen && (
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
            <h3 className="font-serif text-2xl text-[#1a1a1a]">
              {isEditing ? "Edit Residence" : "Add White-Glove Destination"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-black/50 hover:text-[#1a1a1a] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="py-6 space-y-4 text-xs">
            <Field label="Residence Label (e.g. Paris Primary Residence)">
              <input
                type="text"
                required
                value={form.label}
                onChange={(e) => onChange({ ...form, label: e.target.value })}
                className={inputCls}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name">
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => onChange({ ...form, firstName: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Last Name">
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => onChange({ ...form, lastName: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Street Address">
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => onChange({ ...form, address: e.target.value })}
                className={inputCls}
              />
            </Field>

            <Field label="Suite, Apartment, or Concierge Instructions">
              <input
                type="text"
                value={form.apartment}
                onChange={(e) => onChange({ ...form, apartment: e.target.value })}
                className={inputCls}
              />
            </Field>

            <div className="grid grid-cols-3 gap-3">
              <Field label="City">
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => onChange({ ...form, city: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Postal Code">
                <input
                  type="text"
                  required
                  value={form.postalCode}
                  onChange={(e) => onChange({ ...form, postalCode: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Country">
                <input
                  type="text"
                  required
                  value={form.country}
                  onChange={(e) => onChange({ ...form, country: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Telephone for Courier">
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => onChange({ ...form, phone: e.target.value })}
                className={inputCls}
              />
            </Field>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="addr-default"
                checked={form.isDefault}
                onChange={(e) => onChange({ ...form, isDefault: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="addr-default" className="text-xs text-black/70 cursor-pointer">
                Set as Primary White-Glove Destination
              </label>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-black/10">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-black/15 text-xs font-semibold text-black/70 hover:bg-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#1a1a1a] text-white text-xs uppercase tracking-wider font-semibold hover:bg-black/80 transition-colors cursor-pointer"
              >
                Save Destination
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default AddressModal;

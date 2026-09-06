import { useState } from "react";
import { MapPin, Edit3, Trash2, Check, Plus } from "lucide-react";
import AddressModal from "./AddressModal";

const EMPTY_FORM = {
  label: "",
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  country: "France",
  postalCode: "",
  phone: "",
  isDefault: false,
};

const AddressesTab = ({ addresses, userFirstName, userLastName, userPhone, onUpdate, onShowSuccess }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openNew = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      firstName: userFirstName,
      lastName: userLastName,
      phone: userPhone,
      isDefault: addresses.length === 0,
    });
    setModalOpen(true);
  };

  const openEdit = (addr) => {
    setEditingId(addr.id);
    setForm({
      label: addr.label,
      firstName: addr.firstName,
      lastName: addr.lastName,
      address: addr.address,
      apartment: addr.apartment || "",
      city: addr.city,
      country: addr.country,
      postalCode: addr.postalCode,
      phone: addr.phone,
      isDefault: addr.isDefault,
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    let updated;
    if (editingId) {
      updated = addresses.map((a) => {
        if (a.id === editingId) return { ...a, ...form };
        return form.isDefault ? { ...a, isDefault: false } : a;
      });
    } else {
      const newAddr = { id: `addr-${Date.now()}`, ...form };
      if (newAddr.isDefault) {
        updated = addresses.map((a) => ({ ...a, isDefault: false }));
        updated.push(newAddr);
      } else {
        updated = [...addresses, newAddr];
      }
    }
    onUpdate(updated);
    setModalOpen(false);
    onShowSuccess("Residence saved to patron dossier.");
  };

  const handleDelete = (id) => {
    let updated = addresses.filter((a) => a.id !== id);
    if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
      updated[0] = { ...updated[0], isDefault: true };
    }
    onUpdate(updated);
    onShowSuccess("Destination removed from registry.");
  };

  const handleSetDefault = (id) => {
    const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    onUpdate(updated);
    onShowSuccess("Default delivery destination updated.");
  };

  return (
    <div className="space-y-6">
      {/* Title row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-black/50 block">
            White-Glove Courier Destinations
          </span>
          <h3 className="font-serif text-2xl text-[#1a1a1a]">Saved Residences & Suites</h3>
        </div>
        <button
          onClick={openNew}
          className="px-5 py-2.5 rounded-full bg-[#1a1a1a] text-white text-xs uppercase tracking-wider font-semibold hover:bg-black/80 transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Destination</span>
        </button>
      </div>

      {/* Empty state */}
      {addresses.length === 0 && (
        <div className="bg-white rounded-3xl p-10 text-center border border-black/10 shadow-sm">
          <MapPin className="w-8 h-8 text-black/20 mx-auto mb-3" />
          <p className="text-xs text-black/50">No saved destinations yet. Add your first white-glove delivery address.</p>
        </div>
      )}

      {/* Address cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="bg-white rounded-3xl p-6 border border-black/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-black/10 mb-4">
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-[#1a1a1a] flex-shrink-0" />
                  <h4 className="font-serif text-base font-semibold text-[#1a1a1a] truncate">
                    {addr.label}
                  </h4>
                </div>
                {addr.isDefault && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1a1a1a] text-white text-[9px] uppercase font-bold tracking-wider flex-shrink-0">
                    Primary
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-[#1a1a1a]">
                {addr.firstName} {addr.lastName}
              </p>
              <p className="text-xs text-black/70 font-light mt-1 leading-relaxed">
                {addr.address}
                {addr.apartment && <><br />{addr.apartment}</>}
                <br />
                {addr.postalCode} {addr.city}, {addr.country}
              </p>
              <p className="text-xs text-black/50 font-mono mt-3">Tel: {addr.phone}</p>
            </div>

            <div className="pt-5 border-t border-black/10 mt-6 flex items-center justify-between text-xs">
              {!addr.isDefault ? (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-black/60 hover:text-black font-semibold underline cursor-pointer"
                >
                  Set as Primary
                </button>
              ) : (
                <span className="text-emerald-700 font-medium flex items-center gap-1 text-[11px]">
                  <Check className="w-3 h-3" /> Default Delivery
                </span>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(addr)}
                  className="p-1.5 rounded-full hover:bg-[#EBE8E3] text-black/60 hover:text-black transition-colors cursor-pointer"
                  title="Edit address"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                {addresses.length > 1 && (
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-1.5 rounded-full hover:bg-rose-50 text-black/40 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete destination"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddressModal
        isOpen={modalOpen}
        isEditing={Boolean(editingId)}
        form={form}
        onChange={setForm}
        onSubmit={handleSave}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default AddressesTab;

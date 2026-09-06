import { Mail, Phone } from "lucide-react";

const PersonalTab = ({ form, onChange, onSubmit, conciergeRep }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* ── Personal details form ── */}
    <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-sm">
      <div className="pb-4 border-b border-black/10 mb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-black/50 block">
          Identity & Communication
        </span>
        <h3 className="font-serif text-2xl text-[#1a1a1a]">Patron Personal Details</h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-black/50 mb-1.5">
              First Name
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => onChange({ ...form, firstName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#FAF8F5] focus:bg-white focus:ring-1 focus:ring-[#1a1a1a] outline-none text-xs text-[#1a1a1a] font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-black/50 mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => onChange({ ...form, lastName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#FAF8F5] focus:bg-white focus:ring-1 focus:ring-[#1a1a1a] outline-none text-xs text-[#1a1a1a] font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-black/50 mb-1.5">
              Patron Dispatch Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => onChange({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#FAF8F5] focus:bg-white focus:ring-1 focus:ring-[#1a1a1a] outline-none text-xs text-[#1a1a1a] font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-black/50 mb-1.5">
              Private Telephone (Courier Updates)
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => onChange({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#FAF8F5] focus:bg-white focus:ring-1 focus:ring-[#1a1a1a] outline-none text-xs text-[#1a1a1a] font-medium"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-black/10 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-[11px] text-black/50">
            Data is encrypted and stored securely.
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-[#1a1a1a] text-white text-xs uppercase tracking-wider font-semibold hover:bg-black/80 transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>

    {/* ── Concierge advisor card ── */}
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-sm flex flex-col justify-between">
      <div>
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-black/50 block mb-1">
          Private Client Relationship
        </span>
        <h3 className="font-serif text-2xl text-[#1a1a1a]">Your Senior Advisor</h3>
        <p className="text-xs text-black/60 font-light mt-2 leading-relaxed">
          Every patron is paired with a dedicated client director to coordinate
          private viewings, seasonal commissions, and bespoke alterations.
        </p>

        <div className="my-6 p-4 rounded-2xl bg-[#FAF8F5] border border-black/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center font-serif text-base font-bold flex-shrink-0 select-none">
            {conciergeRep?.initials ?? "JV"}
          </div>
          <div>
            <h4 className="font-serif text-base font-bold text-[#1a1a1a]">
              {conciergeRep?.name ?? "Julian Vance"}
            </h4>
            <p className="text-[11px] text-black/50">
              {conciergeRep?.title ?? "Senior Client Director"}
            </p>
            <p className="text-[11px] text-[#1a1a1a] font-mono mt-0.5">
              {conciergeRep?.phone ?? "+33 1 42 68 55 00"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t border-black/10">
        <a
          href={`mailto:${conciergeRep?.email ?? "support@forever.com"}`}
          className="w-full py-3 rounded-full bg-[#1a1a1a] text-white text-xs uppercase tracking-wider font-semibold hover:bg-black/80 transition-colors flex items-center justify-center gap-2"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Request Private Viewing</span>
        </a>
        <a
          href={`tel:${conciergeRep?.phone ?? "+18005551234"}`}
          className="w-full py-2.5 rounded-full border border-black/10 text-xs uppercase tracking-wider font-semibold text-[#1a1a1a] hover:bg-[#FAF8F5] transition-colors flex items-center justify-center gap-2"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Private Desk</span>
        </a>
      </div>
    </div>
  </div>
);

export default PersonalTab;

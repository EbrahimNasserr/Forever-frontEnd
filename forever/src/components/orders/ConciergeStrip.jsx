import { Mail, Phone } from "lucide-react";

const ConciergeStrip = () => (
  <div className="my-6 p-4 sm:p-5 rounded-2xl bg-[#EBE8E3]/70 border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div className="flex items-center gap-3.5">
      <div className="w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center font-serif text-sm font-semibold select-none flex-shrink-0">
        JV
      </div>
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50 block">
          Dedicated Concierge Advisor
        </span>
        <p className="text-xs text-[#1a1a1a] font-medium">
          Julian Vance is managing your allocation, delivery schedules &amp;
          tailoring requests.
        </p>
      </div>
    </div>

    <div className="flex items-center gap-3 flex-shrink-0">
      <a
        href="mailto:support@forever.com"
        className="px-4 py-2 rounded-full bg-white hover:bg-white/80 border border-black/10 text-[11px] font-semibold tracking-wider uppercase text-[#1a1a1a] transition-all flex items-center gap-1.5"
      >
        <Mail className="w-3.5 h-3.5 text-black/60" />
        <span>Contact Advisor</span>
      </a>
      <a
        href="tel:+18005551234"
        className="px-4 py-2 rounded-full bg-white hover:bg-white/80 border border-black/10 text-[11px] font-semibold tracking-wider uppercase text-[#1a1a1a] transition-all flex items-center gap-1.5"
      >
        <Phone className="w-3.5 h-3.5 text-black/60" />
        <span>Direct Line</span>
      </a>
    </div>
  </div>
);

export default ConciergeStrip;

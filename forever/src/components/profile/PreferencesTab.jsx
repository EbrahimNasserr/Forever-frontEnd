import { Sparkles } from "lucide-react";

const PREFERENCES = [
  {
    key: "privateTrunkShows",
    title: "Private Trunk Show Invitations",
    desc: "Exclusive access to invite-only salon presentations in Paris, Milan, Zurich, and Tokyo before public release.",
  },
  {
    key: "digitalLookbookEarlyAccess",
    title: "Digital Lookbook Early Access",
    desc: "Receive digital lookbooks and archive reservation codes 48 hours prior to global dispatch.",
  },
  {
    key: "smsCourierTracking",
    title: "Real-Time Courier SMS Directives",
    desc: "SMS alerts when white-glove driver is within 30 minutes of concierge arrival.",
  },
  {
    key: "physicalGazette",
    title: "Biannual Print Gazette",
    desc: "Hardcover editorial publication dispatched complimentary to your primary residence.",
  },
];

const PreferencesTab = ({ preferences, firstName, lastName, onToggle }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* ── Toggles ── */}
    <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-sm space-y-6">
      <div className="pb-4 border-b border-black/10">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-black/50 block">
          VIP Patron Status
        </span>
        <h3 className="font-serif text-2xl text-[#1a1a1a]">Communications & Privileges</h3>
      </div>

      <div className="divide-y divide-black/5">
        {PREFERENCES.map((pref) => {
          const isOn = Boolean(preferences?.[pref.key]);
          return (
            <div
              key={pref.key}
              className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
            >
              <div className="max-w-xl">
                <h4 className="font-serif text-base font-semibold text-[#1a1a1a]">{pref.title}</h4>
                <p className="text-xs text-black/60 font-light mt-0.5 leading-relaxed">{pref.desc}</p>
              </div>

              <button
                type="button"
                onClick={() => onToggle(pref.key)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                  isOn ? "bg-[#1a1a1a]" : "bg-[#EBE8E3]"
                }`}
                aria-checked={isOn}
                role="switch"
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    isOn ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>

    {/* ── Digital membership card ── */}
    <div className="bg-[#1a1a1a] text-[#F5F2ED] rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <span className="font-serif text-xl italic font-bold">FOREVER.</span>
          <span className="text-[10px] font-mono tracking-widest text-white/50">MEMBERSHIP</span>
        </div>

        <div className="my-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center text-amber-200 mb-3 border border-white/20">
            <Sparkles className="w-7 h-7" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/60 block">
            Patron Member
          </span>
          <h4 className="font-serif text-xl font-medium mt-1">
            {firstName} {lastName}
          </h4>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 text-center">
        <p className="text-[10px] text-white/50 leading-relaxed">
          Present this credential at any Forever salon globally for immediate
          concierge admission & private dressing suites.
        </p>
      </div>
    </div>
  </div>
);

export default PreferencesTab;

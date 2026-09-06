import { Printer } from "lucide-react";

const SILHOUETTES = [
  {
    id: "tailored",
    title: "Structured Tailored",
    desc: "Hourglass contour, roped shoulders, sharp waist pinch.",
  },
  {
    id: "classic",
    title: "Classic Atelier",
    desc: "Timeless balance with gentle chest ease.",
  },
  {
    id: "relaxed",
    title: "Relaxed Architectural",
    desc: "Fluid dropped shoulders, generous puddle break, effortless drape.",
  },
];

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-[#FAF8F5] text-xs font-semibold text-[#1a1a1a] focus:bg-white focus:ring-1 focus:ring-[#1a1a1a] outline-none";

const numCls =
  "w-full px-3.5 py-2 rounded-xl border border-black/10 bg-[#FAF8F5] text-xs font-mono text-[#1a1a1a] focus:bg-white focus:ring-1 focus:ring-[#1a1a1a] outline-none";

const TailoringTab = ({ form, onChange, onSubmit }) => (
  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-sm">
    <div className="pb-4 border-b border-black/10 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-black/50 block">
          Couture Specifications
        </span>
        <h3 className="font-serif text-2xl text-[#1a1a1a]">
          Bespoke Tailoring & Measurement Matrix
        </h3>
      </div>
      <span className="text-xs text-black/50 font-light max-w-xs sm:text-right">
        Used by our master tailors when finishing your garments.
      </span>
    </div>

    <form onSubmit={onSubmit} className="space-y-6 text-xs">
      {/* Silhouette selector */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-black/50 mb-2">
          Preferred Tailoring Drape
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SILHOUETTES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange({ ...form, silhouette: s.id })}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                form.silhouette === s.id
                  ? "bg-[#FAF8F5] border-[#1a1a1a] ring-1 ring-[#1a1a1a]"
                  : "border-black/10 hover:border-black/30"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-serif text-sm font-bold text-[#1a1a1a]">{s.title}</span>
                {form.silhouette === s.id && (
                  <span className="w-2 h-2 rounded-full bg-[#1a1a1a]" />
                )}
              </div>
              <p className="text-[11px] text-black/60 font-light leading-relaxed">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Standard sizes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-black/10">
        <div>
          <label className="block text-[11px] font-medium text-black/50 mb-1">
            Jacket / Overcoat Size
          </label>
          <input
            type="text"
            value={form.jacketSize}
            onChange={(e) => onChange({ ...form, jacketSize: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-black/50 mb-1">
            Trouser Waist & Length
          </label>
          <input
            type="text"
            value={form.trouserSize}
            onChange={(e) => onChange({ ...form, trouserSize: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-black/50 mb-1">
            Footwear Dimension
          </label>
          <input
            type="text"
            value={form.shoeSize}
            onChange={(e) => onChange({ ...form, shoeSize: e.target.value })}
            className={inputCls}
          />
        </div>
      </div>

      {/* Precise measurements */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-black/10">
        {[
          { key: "heightCm", label: "Height (cm)" },
          { key: "chestCm", label: "Chest / Bust (cm)" },
          { key: "waistCm", label: "Waist (cm)" },
          { key: "hipsCm", label: "Hips (cm)" },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block text-[11px] font-medium text-black/50 mb-1">{label}</label>
            <input
              type="number"
              value={form[key] ?? ""}
              onChange={(e) => onChange({ ...form, [key]: Number(e.target.value) })}
              className={numCls}
            />
          </div>
        ))}
      </div>

      {/* Sleeve + tailor notes */}
      <div className="space-y-4 pt-4 border-t border-black/10">
        <div>
          <label className="block text-[11px] font-medium text-black/50 mb-1">
            Sleeve & Cuff Adjustment
          </label>
          <input
            type="text"
            value={form.sleeveAdjustment ?? ""}
            onChange={(e) => onChange({ ...form, sleeveAdjustment: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-black/50 mb-1">
            Special Tailoring Directives for the Cutting Room
          </label>
          <textarea
            rows={3}
            value={form.tailorNotes ?? ""}
            onChange={(e) => onChange({ ...form, tailorNotes: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-[#FAF8F5] text-xs text-[#1a1a1a] resize-none focus:bg-white focus:ring-1 focus:ring-[#1a1a1a] outline-none"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-black/10 flex items-center justify-between flex-wrap gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2 rounded-full border border-black/15 text-xs font-semibold text-[#1a1a1a] hover:bg-[#FAF8F5] flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Tailor Sheet</span>
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-full bg-[#1a1a1a] text-white text-xs uppercase tracking-wider font-semibold hover:bg-black/80 transition-colors cursor-pointer"
        >
          Save Measurement Profile
        </button>
      </div>
    </form>
  </div>
);

export default TailoringTab;

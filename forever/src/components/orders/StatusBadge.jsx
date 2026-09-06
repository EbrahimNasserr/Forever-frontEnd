import { CheckCircle2, Clock, Sparkles } from "lucide-react";

const getStatusConfig = (status = "") => {
  const s = status.toLowerCase();
  if (s.includes("deliver"))
    return {
      label: "Delivered & Handed Over",
      icon: <CheckCircle2 className="w-3 h-3 text-emerald-700" />,
      cls: "bg-[#EBE8E3] text-[#1a1a1a] border-black/10",
    };
  if (s.includes("ship") || s.includes("transit"))
    return {
      label: "Courier Dispatched",
      dot: true,
      cls: "bg-emerald-100 text-emerald-900 border-emerald-300",
      dotCls: "bg-emerald-600",
    };
  if (s.includes("process") || s.includes("tailor"))
    return {
      label: "Atelier Hand-Crafting",
      icon: <Clock className="w-3 h-3 text-amber-700" />,
      cls: "bg-amber-100 text-amber-900 border-amber-300",
    };
  return {
    label: "Fabric Bolt Allocated",
    icon: <Sparkles className="w-3 h-3 text-sky-700" />,
    cls: "bg-sky-100 text-sky-900 border-sky-300",
  };
};

const StatusBadge = ({ status }) => {
  const cfg = getStatusConfig(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${cfg.cls}`}
    >
      {cfg.dot ? (
        <span
          className={`w-1.5 h-1.5 rounded-full animate-pulse ${cfg.dotCls}`}
        />
      ) : (
        cfg.icon
      )}
      {cfg.label}
    </span>
  );
};

export default StatusBadge;

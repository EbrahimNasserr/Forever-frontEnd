import { User, MapPin, Ruler, Bell } from "lucide-react";

const TABS = [
  { id: "personal",    label: "Personal Dossier",       icon: User },
  { id: "addresses",   label: "Destinations",            icon: MapPin },
  { id: "tailoring",   label: "Bespoke Measurements",    icon: Ruler },
  { id: "preferences", label: "Patron Privileges",       icon: Bell },
];

const ProfileTabs = ({ activeTab, onTabChange }) => (
  <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-black/10 scrollbar-none">
    {TABS.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        onClick={() => onTabChange(id)}
        className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer flex-shrink-0 ${
          activeTab === id
            ? "bg-[#1a1a1a] text-white shadow-sm"
            : "bg-white hover:bg-[#EBE8E3] text-black/70 border border-black/10"
        }`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{label}</span>
      </button>
    ))}
  </div>
);

export default ProfileTabs;

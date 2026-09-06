import { Link } from "react-router-dom";
import { User, Package, Compass, ChevronRight, ExternalLink, LogOut } from "lucide-react";
import { getInitials } from "./profileUtils";

const ProfileHeader = ({
  firstName,
  lastName,
  email,
  memberSince,
  ordersCount,
  primaryCity,
  tailoringSummary,
  conciergeRep,
  onLogout,
}) => {
  const initials = getInitials(firstName, lastName);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-sm mb-8">
      {/* Top row — identity + nav toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-black/10">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-[#1a1a1a] text-[#F5F2ED] flex items-center justify-center font-serif text-2xl font-bold border-2 border-[#EBE8E3] shadow-md flex-shrink-0 select-none">
            {initials}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase px-2.5 py-0.5 rounded-full bg-[#1a1a1a] text-white">
                Patron Member
              </span>
              <span className="text-xs font-mono text-black/50">{email}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#1a1a1a]">
              {firstName} {lastName}
            </h1>
            <p className="text-xs text-black/50 font-light mt-0.5">
              Member since {memberSince}
            </p>
          </div>
        </div>

        {/* View toggle + logout */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <div className="flex items-center gap-2 bg-[#F5F2ED] p-1.5 rounded-full border border-black/10">
            <button className="px-5 py-2 rounded-full bg-[#1a1a1a] text-[#F5F2ED] text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center gap-2 cursor-default">
              <User className="w-3.5 h-3.5" />
              <span>My Profile</span>
            </button>
            <Link
              to="/orders"
              className="px-5 py-2 rounded-full text-black/70 hover:text-[#1a1a1a] hover:bg-black/5 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Orders ({ordersCount})</span>
            </Link>
            <Link
              to="/collection"
              className="px-5 py-2 rounded-full text-black/70 hover:text-[#1a1a1a] hover:bg-black/5 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Shop Archive</span>
            </Link>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-full border border-black/10 bg-white hover:bg-rose-50 hover:border-rose-200 text-xs font-semibold uppercase tracking-wider text-black/60 hover:text-rose-600 transition-all flex items-center gap-2 cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
        {/* Orders */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-black/5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-black/50 font-semibold block mb-1">
            Active Commissions
          </span>
          <p className="font-serif text-xl font-bold text-[#1a1a1a]">
            {ordersCount} Orders Handled
          </p>
          <Link
            to="/orders"
            className="text-[11px] text-[#1a1a1a] font-semibold underline mt-1 hover:opacity-70 flex items-center gap-1"
          >
            <span>View Order Dossiers</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Primary city */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-black/5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-black/50 font-semibold block mb-1">
            Default Shipping City
          </span>
          <p className="font-serif text-xl font-bold text-[#1a1a1a] capitalize">
            {primaryCity || "Not set"}
          </p>
          <span className="text-[11px] text-black/50 mt-1 block">
            Used for courier dispatch priority
          </span>
        </div>

        {/* Concierge */}
        {conciergeRep && (
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-black/5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/50 font-semibold block mb-1">
              Dedicated Advisor
            </span>
            <p className="font-serif text-lg font-bold text-[#1a1a1a] truncate">
              {conciergeRep.name}
            </p>
            <a
              href={`mailto:${conciergeRep.email}`}
              className="text-[11px] text-[#1a1a1a] font-semibold underline mt-1 hover:opacity-70 flex items-center gap-1"
            >
              <span>Direct Dispatch</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;

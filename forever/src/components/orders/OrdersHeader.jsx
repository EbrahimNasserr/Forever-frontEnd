import { Link } from "react-router-dom";
import { Package, Compass } from "lucide-react";

const OrdersHeader = ({ orderCount }) => (
  <>
    {/* Breadcrumb */}
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-black/50 mb-6">
      <Link to="/" className="hover:text-[#1a1a1a] transition-colors">
        Atelier
      </Link>
      <span>/</span>
      <span className="text-[#1a1a1a] font-bold">Commissions Ledger</span>
    </div>

    {/* Title row */}
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-black/10">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase px-2.5 py-1 rounded-full bg-[#1a1a1a] text-white">
            Order History
          </span>
          <span className="text-xs font-mono text-black/50">
            {orderCount} commission{orderCount !== 1 ? "s" : ""}
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1a1a1a] tracking-tight">
          My Orders & Commissions
        </h1>
        <p className="text-sm text-black/60 font-light mt-2 max-w-2xl leading-relaxed">
          Track your orders, review allocation timelines, and manage returns or
          alterations for every piece in your wardrobe.
        </p>
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-2 bg-[#EBE8E3] p-1.5 rounded-full border border-black/10 self-start lg:self-auto flex-shrink-0">
        <button className="px-5 py-2 rounded-full bg-[#1a1a1a] text-[#F5F2ED] text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center gap-2 cursor-default">
          <Package className="w-3.5 h-3.5" />
          <span>Orders ({orderCount})</span>
        </button>
        <Link
          to="/collection"
          className="px-5 py-2 rounded-full text-black/70 hover:text-[#1a1a1a] hover:bg-black/5 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Explore Collection</span>
        </Link>
      </div>
    </div>
  </>
);

export default OrdersHeader;

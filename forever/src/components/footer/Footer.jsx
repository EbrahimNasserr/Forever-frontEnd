import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Globe, MessageCircle, Play } from "lucide-react";
import { assets } from "../../assets/assets";

// ─── Live clock hook ──────────────────────────────────────────────────────────

const useClock = (timeZone) => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          timeZone,
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timeZone]);
  return time;
};

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer = () => {
  const parisTime = useClock("Europe/Paris");
  const tokyoTime = useClock("Asia/Tokyo");
  const nyTime = useClock("America/New_York");

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const SHOP_LINKS = [
    { to: "/collection", label: "New Arrivals" },
    { to: "/collection?category=Men", label: "Menswear" },
    { to: "/collection?category=Women", label: "Womenswear" },
    { to: "/collection?category=Kids", label: "Kids" },
    { to: "/cart", label: "Shopping Bag" },
  ];

  const COMPANY_LINKS = [
    { to: "/about", label: "Our Story" },
    { to: "/contact", label: "Contact" },
    { to: "/orders", label: "Track Orders" },
    { to: "/login", label: "Account" },
  ];

  return (
    <footer className="bg-[#1A1A1A] text-[#F5F2ED] pt-20 pb-12 border-t border-black overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* ── World clocks ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-12 border-b border-white/10 text-[11px] uppercase tracking-[0.15em] font-semibold text-white/40">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span>
              <span className="text-white">Forever HQ: </span>
              Paris • {parisTime || "––:––"} CET
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span>
              <span className="text-white">Tokyo: </span>
              Ginza • {tokyoTime || "––:––"} JST
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span>
              <span className="text-white">New York: </span>
              SoHo • {nyTime || "––:––"} EST
            </span>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-16">
          {/* Brand column */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div>
              <Link to="/">
                <img src={assets.logo} alt="Forever Commerce" className="h-9 w-auto brightness-0 invert mb-4" />
              </Link>
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/30 block mb-4">
                QUALITY ESSENTIALS & CURATED COLLECTIONS
              </span>
              <p className="text-sm text-white/40 leading-relaxed max-w-sm">
                Forever Commerce is built for modern shoppers who want fashion
                that feels good and looks great. From browse to checkout, every
                step is crafted to be smooth and trustworthy.
              </p>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 text-white/50">
              {[
                { href: "https://instagram.com", Icon: Globe, label: "Instagram" },
                { href: "https://twitter.com", Icon: MessageCircle, label: "Twitter" },
                { href: "https://youtube.com", Icon: Play, label: "YouTube" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-white/20 hover:border-white hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.18em] font-bold text-white mb-6">
                Shop
              </h3>
              <ul className="flex flex-col gap-3.5">
                {SHOP_LINKS.map(({ to, label }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-[11px] uppercase tracking-[0.14em] text-white/40 hover:text-white transition-colors font-semibold"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] uppercase tracking-[0.18em] font-bold text-white mb-6">
                Company
              </h3>
              <ul className="flex flex-col gap-3.5">
                {COMPANY_LINKS.map(({ to, label }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-[11px] uppercase tracking-[0.14em] text-white/40 hover:text-white transition-colors font-semibold"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] uppercase tracking-[0.18em] font-bold text-white mb-6">
                Support
              </h3>
              <ul className="flex flex-col gap-3.5 text-[11px] uppercase tracking-[0.12em] font-semibold">
                <li className="text-white">support@forever.com</li>
                <li className="text-white/40">+1 (000) 000-0000</li>
                <li className="text-white/40">24 / 7 Live Chat</li>
                <li className="text-white/40">30-Day Free Returns</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5 text-[10px] uppercase tracking-[0.15em] text-white/30 font-semibold">
          <div className="flex flex-wrap items-center gap-5">
            <span>© {new Date().getFullYear()} Forever Commerce. All rights reserved.</span>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Refunds</a>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 text-white hover:text-white/60 transition-colors group cursor-pointer"
            aria-label="Back to top"
          >
            <span className="text-[10px] uppercase tracking-[0.18em] font-bold">Back to Top</span>
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1">
              <ArrowUp className="size-3.5" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

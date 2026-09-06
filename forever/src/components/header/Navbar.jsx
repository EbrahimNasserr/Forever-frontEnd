import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  X,
  LogOut,
} from "lucide-react";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import SearchBar from "../share/SearchBar.jsx";
import { getAccessToken } from "../../store/tokenStorage";
import { clearSession } from "../../store/authSlice";
import { selectCartCount } from "../../features/cart/cartSelectors";
import { selectWishlistCount } from "../../features/wishlist/wishlistSelectors";

// ─── constants ───────────────────────────────────────────────────────────────

const NavLinks = [
  { to: "/", label: "Home" },
  { to: "/collection", label: "Collection" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const ProfileDropdown = [
  { to: "/profile", label: "My Profile" },
  { to: "/orders", label: "Orders" },
];

// ─── Mobile Sidebar ──────────────────────────────────────────────────────────

const MobileSidebar = ({ isOpen, onClose, isAuthenticated, onLogout }) => {
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e) => {
      if (!sidebarRef.current?.contains(e.target)) onClose();
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={[
        "fixed inset-0 z-50 sm:hidden",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.aside
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? "0%" : "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-[#F5F2ED] shadow-2xl flex flex-col"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
          <img src={assets.logo} alt="logo" className="h-7 w-auto" />
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 text-[#1A1A1A] transition-colors"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {NavLinks.map((link, idx) => (
            <motion.div
              key={link.to}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 20 }}
              transition={{ delay: idx * 0.06, duration: 0.3 }}
            >
              <NavLink
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-[0.12em] transition-colors",
                    isActive
                      ? "bg-[#1A1A1A] text-[#F5F2ED]"
                      : "text-[#1A1A1A] hover:bg-black/5",
                  ].join(" ")
                }
              >
                {link.label}
                <ArrowRight className="size-4 opacity-40" />
              </NavLink>
            </motion.div>
          ))}

          <div className="my-4 h-px bg-black/10" />

          {/* Account links */}
          {isAuthenticated ? (
            <>
              {ProfileDropdown.map((item, idx) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 20 }}
                  transition={{ delay: (NavLinks.length + idx) * 0.06, duration: 0.3 }}
                >
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      [
                        "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-colors",
                        isActive
                          ? "bg-[#1A1A1A] text-[#F5F2ED]"
                          : "text-[#1A1A1A]/60 hover:bg-black/5 hover:text-[#1A1A1A]",
                      ].join(" ")
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
              {/* Mobile logout */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 20 }}
                transition={{ delay: (NavLinks.length + ProfileDropdown.length) * 0.06, duration: 0.3 }}
              >
                <button
                  type="button"
                  onClick={() => { onClose(); onLogout(); }}
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </motion.div>
            </>
          ) : (
            <NavLink
              to="/login"
              onClick={onClose}
              className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-[#1A1A1A]/60 hover:bg-black/5 hover:text-[#1A1A1A] transition-colors"
            >
              Sign In
              <ArrowRight className="size-4 opacity-40" />
            </NavLink>
          )}
        </nav>
      </motion.aside>
    </div>
  );
};

// ─── Navbar ──────────────────────────────────────────────────────────────────

const Navbar = ({ onOpenCart, onOpenWishlist }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const profileMenuRef = useRef(null);
  const isAuthenticated = useSelector((state) => Boolean(state.auth?.isAuthenticated));
  const token = getAccessToken();
  const canShowProfile = Boolean(token) && isAuthenticated;
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);

  const handleLogout = () => {
    dispatch(clearSession());
    setIsProfileOpen(false);
    toast.success("You've been signed out.");
    navigate("/login");
  };

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close profile dropdown on outside click / escape
  useEffect(() => {
    if (!isProfileOpen) return;
    const onPointerDown = (e) => {
      if (!profileMenuRef.current?.contains(e.target)) setIsProfileOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsProfileOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isProfileOpen]);

  return (
    <>
      {/* ── Announcement ticker ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1A1A1A] text-[#F5F2ED] py-2.5 px-4"
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 hidden sm:block">
            Forever Commerce • New Arrivals
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80 text-center flex-1">
            Complimentary Shipping Over $400 &nbsp;•&nbsp; New Season Now Live
          </p>
          <NavLink
            to="/collection"
            className="hidden sm:flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors"
          >
            Explore
            <ArrowRight className="size-3" />
          </NavLink>
        </div>
      </motion.div>

      {/* ── Main header ── */}
      <div
        className={[
          "sticky top-0 z-40 transition-all duration-300",
          isScrolled
            ? "bg-[#F5F2ED]/95 backdrop-blur-md shadow-sm border-b border-black/8"
            : "bg-[#F5F2ED]",
        ].join(" ")}
      >
        <header className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* ── Left: mobile menu + desktop nav links ── */}
            <div className="flex items-center gap-6">
              {/* Mobile: hamburger + search */}
              <div className="flex items-center gap-2 sm:hidden">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 -ml-2 text-[#1A1A1A] hover:opacity-60 transition-opacity"
                  aria-label="Open navigation menu"
                >
                  <Menu className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-[#1A1A1A] hover:opacity-60 transition-opacity"
                  aria-label="Search"
                >
                  <Search className="size-5" />
                </button>
              </div>

              {/* Desktop left nav links */}
              <nav className="hidden sm:flex items-center gap-7">
                {NavLinks.slice(0, 2).map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      [
                        "text-[11px] font-bold uppercase tracking-[0.15em] transition-opacity",
                        isActive ? "text-[#1A1A1A]" : "text-[#1A1A1A]/50 hover:text-[#1A1A1A]",
                      ].join(" ")
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* ── Centre: logo ── */}
            <NavLink
              to="/"
              className="absolute left-1/2 -translate-x-1/2 flex-shrink-0"
              aria-label="Forever Commerce home"
            >
              <img src={assets.logo} alt="Forever Commerce" className="h-8 sm:h-9 w-auto" />
            </NavLink>

            {/* ── Right: desktop nav links + actions ── */}
            <div className="flex items-center gap-5 sm:gap-6">
              {/* Desktop right nav links */}
              <nav className="hidden sm:flex items-center gap-7">
                {NavLinks.slice(2).map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      [
                        "text-[11px] font-bold uppercase tracking-[0.15em] transition-opacity",
                        isActive ? "text-[#1A1A1A]" : "text-[#1A1A1A]/50 hover:text-[#1A1A1A]",
                      ].join(" ")
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              {/* Desktop search */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors"
                aria-label="Search catalog"
              >
                <Search className="size-4" />
              </button>

              {/* Profile */}
              {canShowProfile ? (
                <div className="relative hidden sm:block" ref={profileMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={isProfileOpen}
                    aria-label="Open profile menu"
                    className="flex items-center justify-center hover:opacity-60 transition-opacity"
                  >
                    <img src={assets.profile_icon} alt="profile" className="size-5" />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-9 z-50 min-w-48 origin-top-right rounded-2xl border border-black/8 bg-[#F5F2ED] shadow-xl p-1.5"
                        role="menu"
                      >
                        {ProfileDropdown.map((item) => (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setIsProfileOpen(false)}
                            className={({ isActive }) =>
                              [
                                "block w-full px-4 py-2.5 rounded-xl text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors",
                                isActive
                                  ? "bg-[#1A1A1A] text-[#F5F2ED]"
                                  : "text-[#1A1A1A] hover:bg-black/5",
                              ].join(" ")
                            }
                            role="menuitem"
                          >
                            {item.label}
                          </NavLink>
                        ))}
                        {/* Logout */}
                        <div className="mt-1 pt-1 border-t border-black/8">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-[12px] font-semibold uppercase tracking-[0.1em] text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            role="menuitem"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  aria-label="Sign in"
                  className="hidden sm:flex items-center justify-center hover:opacity-60 transition-opacity"
                >
                  <img src={assets.profile_icon} alt="" className="size-5" />
                </button>
              )}

              {/* Wishlist */}
              <button
                type="button"
                onClick={onOpenWishlist}
                className="relative hidden sm:flex items-center justify-center hover:opacity-60 transition-opacity p-1"
                aria-label="Open wishlist"
              >
                <Heart
                  className={`size-5 transition-all duration-300 ${
                    wishlistCount > 0
                      ? "fill-[#C86D44] text-[#C86D44]"
                      : "text-[#1A1A1A]"
                  }`}
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 size-4 rounded-full bg-[#C86D44] text-white text-[9px] font-bold flex items-center justify-center">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart bag button */}
              <button
                type="button"
                onClick={onOpenCart}
                className="relative flex items-center gap-2 bg-[#1A1A1A] text-[#F5F2ED] pl-4 pr-5 py-2.5 rounded-full hover:bg-[#333] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                aria-label="Open shopping bag"
              >
                <ShoppingBag className="size-4" />
                <span className="hidden sm:inline text-[11px] font-bold uppercase tracking-[0.1em]">
                  Bag
                </span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </div>

      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isAuthenticated={canShowProfile}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Navbar;

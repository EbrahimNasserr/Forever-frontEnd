import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { assets } from "../../assets/assets";
import SearchBar from "../share/SearchBar.jsx";

const NavLinks = [
  {
    to: "/",
    label: "Home",
  },
  {
    to: "/collection",
    label: "Collection",
  },
  {
    to: "/about",
    label: "About",
  },
  {
    to: "/contact",
    label: "Contact",
  },
];

const ProfileDropdown = [
  {
    to: "/profile",
    label: "My Profile",
  },
  {
    to: "/orders",
    label: "Orders",
  },
  {
    to: "/logout",
    label: "Logout",
  },
];

const MobileSidebar = ({ isOpen, onClose }) => {
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e) => {
      if (!sidebarRef.current) return;
      if (!sidebarRef.current.contains(e.target)) onClose();
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
      <div
        className={[
          "absolute inset-0 bg-black/35 transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      <aside
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        className={[
          "absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl ring-1 ring-black/5 transition-transform duration-200",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-gray-200/70 px-4 py-4">
          <img src={assets.logo} alt="logo" className="h-7 w-auto" />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            x
          </button>
        </div>

        <div className="px-2 py-3">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Menu
          </p>
          <nav className="flex flex-col">
            {NavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "mx-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="my-4 h-px bg-gray-200/70" />

          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Account
          </p>
          <nav className="flex flex-col">
            {ProfileDropdown.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "mx-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
};

const Navbar = ({ onOpenCart }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const cartCount = useSelector((state) =>
    Array.isArray(state.products.cart)
      ? state.products.cart.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0)
      : 0
  );

  useEffect(() => {
    if (!isProfileOpen) return;

    const onPointerDown = (e) => {
      if (!profileMenuRef.current) return;
      if (!profileMenuRef.current.contains(e.target)) setIsProfileOpen(false);
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
      <div className="relative">
        <header className="flex items-center border-b border-gray-500 justify-between py-5 font-medium">
          <NavLink to="/">
            <img src={assets.logo} alt="logo" className="w-24 h-auto" />
          </NavLink>
          <nav className="hidden sm:block">
            <ul className="flex items-center gap-5 text-sm text-gray-500">
              {NavLinks.map((link) => (
                <li key={link.to}>
                  <NavLink className="flex items-center flex-col" to={link.to}>
                    <span className="uppercase tracking-wider pb-1">
                      {link.label}
                    </span>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
              className="inline-flex items-center justify-center rounded-lg p-0.5 text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20"
            >
              <img
                src={assets.search_icon}
                alt=""
                className="size-5 cursor-pointer"
              />
            </button>
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
                className="inline-flex items-center justify-center"
              >
                <img
                  src={assets.profile_icon}
                  alt="profile"
                  className="size-5 cursor-pointer"
                />
              </button>

              <div
                className={[
                  "absolute right-0 top-7 z-50 min-w-44 origin-top-right rounded-xl border border-gray-200/60 bg-white/90 p-1 shadow-lg ring-1 ring-black/5 backdrop-blur-sm transition-all duration-150",
                  isProfileOpen
                    ? "scale-100 opacity-100"
                    : "pointer-events-none scale-95 opacity-0",
                ].join(" ")}
                role="menu"
              >
                <ul className="flex flex-col text-sm text-gray-700">
                  {ProfileDropdown.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        onClick={() => setIsProfileOpen(false)}
                        className={({ isActive }) =>
                          [
                            "block w-full rounded-lg px-3 py-2 text-left transition-colors",
                            "hover:bg-gray-100 hover:text-gray-900",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20",
                            isActive
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                          ].join(" ")
                        }
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenCart}
              className="relative"
              aria-label="Open cart sidebar"
            >
              <img
                src={assets.cart_icon}
                alt="cart"
                className="size-5 cursor-pointer"
              />
              <span className="absolute -bottom-3 leading-4 w-4 text-center aspect-square -right-3 bg-red-500 text-white text-xs rounded-full">
                {cartCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isSidebarOpen}
              className="sm:hidden"
            >
              <img
                src={assets.menu_icon}
                alt="menu"
                className="size-5 cursor-pointer"
              />
            </button>
          </div>
        </header>

        <SearchBar
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      </div>

      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
};

export default Navbar;

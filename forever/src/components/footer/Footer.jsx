import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-[5vw] md:grid-cols-3 md:px-[7vw] lg:px-[9vw]">
        <div>
          <Link to="/" className="inline-flex items-center gap-2">
            <img src={assets.logo} alt="Forever" className="h-8 w-auto" />
          </Link>
          <p className="mt-4 max-w-sm text-sm text-gray-600">
            Quality essentials, curated collections, and a smooth shopping
            experience from browse to checkout.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 md:col-span-2 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>
                <Link className="hover:text-gray-900" to="/collection">
                  Collection
                </Link>
              </li>
              <li>
                <Link className="hover:text-gray-900" to="/cart">
                  Cart
                </Link>
              </li>
              <li>
                <Link className="hover:text-gray-900" to="/orders">
                  Orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>
                <Link className="hover:text-gray-900" to="/about">
                  About
                </Link>
              </li>
              <li>
                <Link className="hover:text-gray-900" to="/contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link className="hover:text-gray-900" to="/login">
                  Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Support</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li className="leading-relaxed">
                <span className="font-medium text-gray-900">Email:</span>{" "}
                support@forever.com
              </li>
              <li className="leading-relaxed">
                <span className="font-medium text-gray-900">Phone:</span> +1
                (000) 000-0000
              </li>
              <li className="leading-relaxed">
                <span className="font-medium text-gray-900">Hours:</span> 24/7
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-gray-500 sm:flex-row sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
          <p>© {new Date().getFullYear()} Forever. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-900">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-900">
              Terms
            </a>
            <a href="#" className="hover:text-gray-900">
              Refunds
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

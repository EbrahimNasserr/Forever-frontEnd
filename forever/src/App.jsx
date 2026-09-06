import { useState } from "react";
import { Route, Routes } from "react-router-dom";

// Pages
import Home from "./pages/Home.jsx";
import Collection from "./pages/Collection.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Product from "./pages/Product.jsx";
import Cart from "./pages/Cart.jsx";
import PlaceOrder from "./pages/PlaceOrder.jsx";
import Orders from "./pages/Orders.jsx";
import Profile from "./pages/Profile.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentCancel from "./pages/PaymentCancel.jsx";
import Login from "./pages/auth/Login.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import WishlistPage from "./pages/Wishlist.jsx";

// Layout
import Navbar from "./components/header/Navbar.jsx";
import Footer from "./components/footer/Footer.jsx";
import RequireAuth from "./components/auth/RequireAuth.jsx";

// Overlays
import CartSidebar from "./components/cart/CartSidebar.jsx";
import WishlistDrawer from "./components/cart/WishlistDrawer.jsx";
import CampaignVideoModal from "./components/home/CampaignVideoModal.jsx";
import QuickViewModal from "./components/share/QuickViewModal.jsx";
import CustomCursor from "./components/share/CustomCursor.jsx";

// Wishlist — selector-driven (no local state needed)
import { useSelector } from "react-redux";
import { useWishlist } from "./features/wishlist/useWishlist.js";
import { selectWishlistCount } from "./features/wishlist/wishlistSelectors.js";

// Smooth scroll
import { useLenis } from "./hooks/useLenis.js";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  // Smooth scroll — initialised once for the app lifetime
  useLenis();

  // Cart sidebar
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist drawer
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Wishlist state — hook provides toggle/isInWishlist for prop-drilling,
  // count comes directly from the Redux selector for the Navbar badge.
  const { wishlistIds, toggle: toggleWishlist, isInWishlist } = useWishlist();
  const wishlistCount = useSelector(selectWishlistCount);

  // Quick view modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <div>
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        wishlistCount={wishlistCount}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                onQuickView={setQuickViewProduct}
                wishlistIds={wishlistIds}
                onToggleWishlist={toggleWishlist}
                isInWishlist={isInWishlist}
              />
            }
          />
          <Route
            path="/collection"
            element={
              <Collection
                wishlistIds={wishlistIds}
                onToggleWishlist={toggleWishlist}
                onQuickView={setQuickViewProduct}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route
            path="/place-order"
            element={
              <RequireAuth>
                <PlaceOrder />
              </RequireAuth>
            }
          />
          <Route
            path="/orders"
            element={
              <RequireAuth>
                <Orders />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/cancel" element={<PaymentCancel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>

      <Footer />

      {/* Global overlays */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* WishlistDrawer is now self-contained — no wishlist props needed */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        wishlistIds={wishlistIds}
        onToggleWishlist={toggleWishlist}
      />

      <CampaignVideoModal />
      <CustomCursor />

      <ToastContainer
        position="top-right"
        autoClose={1800}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  );
};

export default App;

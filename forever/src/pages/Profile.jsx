import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { clearSession } from "../store/authSlice";
import { useGetOrdersQuery } from "../features/orders/ordersApi";
import { parseUserName, formatMemberSince } from "../components/profile/profileUtils";

import ProfileSuccessBanner from "../components/profile/ProfileSuccessBanner";
import ProfileHeader       from "../components/profile/ProfileHeader";
import ProfileTabs         from "../components/profile/ProfileTabs";
import PersonalTab         from "../components/profile/PersonalTab";
import AddressesTab        from "../components/profile/AddressesTab";
import TailoringTab        from "../components/profile/TailoringTab";
import PreferencesTab      from "../components/profile/PreferencesTab";

/* ─── Static concierge data (no backend endpoint for this) ── */
const CONCIERGE = {
  name: "Julian Vance",
  initials: "JV",
  title: "Senior Client Director",
  phone: "+1 800 555 1234",
  email: "support@forever.com",
};

/* ─── Default tailor profile for new users ─────────────────── */
const DEFAULT_TAILORING = {
  silhouette: "classic",
  jacketSize: "",
  trouserSize: "",
  shoeSize: "",
  heightCm: 0,
  chestCm: 0,
  waistCm: 0,
  hipsCm: 0,
  sleeveAdjustment: "",
  tailorNotes: "",
};

/* ─── Default preferences ───────────────────────────────────── */
const DEFAULT_PREFS = {
  privateTrunkShows: false,
  digitalLookbookEarlyAccess: false,
  smsCourierTracking: true,
  physicalGazette: false,
};

/* ══════════════════════════════════════════════════════════════
   PROFILE PAGE
══════════════════════════════════════════════════════════════ */
const Profile = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const user       = useSelector((state) => state.auth.user);

  /* User name fields */
  const { firstName: parsedFirst, lastName: parsedLast } = parseUserName(user);

  /* Orders count */
  const { data: ordersData } = useGetOrdersQuery();
  const ordersCount = ordersData?.orders?.length ?? 0;

  /* ── Local state ─────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState("personal");
  const [successMsg, setSuccessMsg] = useState(null);

  /* Personal form */
  const [personalForm, setPersonalForm] = useState({
    firstName: parsedFirst,
    lastName:  parsedLast,
    email:     user?.email ?? "",
    phone:     user?.phone ?? "",
  });

  /* Addresses — persisted locally (no backend endpoint) */
  const [addresses, setAddresses] = useState([]);

  /* Tailoring */
  const [tailoringForm, setTailoringForm] = useState(DEFAULT_TAILORING);

  /* Preferences */
  const [preferences, setPreferences] = useState(DEFAULT_PREFS);

  /* ── Helpers ─────────────────────────────────────────────── */
  const showSuccess = useCallback((msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  }, []);

  /* ── Handlers ────────────────────────────────────────────── */
  const handleLogout = () => {
    dispatch(clearSession());
    toast.success("You've been signed out.");
    navigate("/login");
  };

  const handleSavePersonal = (e) => {
    e.preventDefault();
    // In a real app: dispatch a PATCH /api/me mutation here
    showSuccess("Patron dossier updated successfully.");
  };

  const handleSaveTailoring = (e) => {
    e.preventDefault();
    showSuccess("Bespoke measurements saved to archive.");
  };

  const handleTogglePreference = (key) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
    showSuccess("Privilege preferences updated.");
  };

  /* Primary delivery city for the header stat */
  const primaryCity = addresses.find((a) => a.isDefault)?.city ?? null;

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1a1a1a] pt-24 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-black/50 mb-6">
          <Link to="/" className="hover:text-[#1a1a1a] transition-colors">
            Atelier
          </Link>
          <span>/</span>
          <span className="text-[#1a1a1a] font-bold">Patron Dossier & Profile</span>
        </div>

        {/* Floating success banner */}
        <ProfileSuccessBanner message={successMsg} />

        {/* Header card */}
        <ProfileHeader
          firstName={personalForm.firstName}
          lastName={personalForm.lastName}
          email={user?.email ?? ""}
          memberSince={formatMemberSince(user?.createdAt)}
          ordersCount={ordersCount}
          primaryCity={primaryCity}
          conciergeRep={CONCIERGE}
          onLogout={handleLogout}
        />

        {/* Tab navigation */}
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* ── Tab panels ── */}
        {activeTab === "personal" && (
          <PersonalTab
            form={personalForm}
            onChange={setPersonalForm}
            onSubmit={handleSavePersonal}
            conciergeRep={CONCIERGE}
          />
        )}

        {activeTab === "addresses" && (
          <AddressesTab
            addresses={addresses}
            userFirstName={personalForm.firstName}
            userLastName={personalForm.lastName}
            userPhone={personalForm.phone}
            onUpdate={setAddresses}
            onShowSuccess={showSuccess}
          />
        )}

        {activeTab === "tailoring" && (
          <TailoringTab
            form={tailoringForm}
            onChange={setTailoringForm}
            onSubmit={handleSaveTailoring}
          />
        )}

        {activeTab === "preferences" && (
          <PreferencesTab
            preferences={preferences}
            firstName={personalForm.firstName}
            lastName={personalForm.lastName}
            onToggle={handleTogglePreference}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;

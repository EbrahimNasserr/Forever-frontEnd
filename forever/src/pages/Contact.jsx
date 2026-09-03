import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Send,
  Shield,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";

const locations = [
  {
    id: "paris",
    name: "Paris Atelier",
    address: "18 Rue Saint-Honoré, 75001 Paris, France",
    hours: "Tue – Sat: 11:00 – 19:00 CET",
    phone: "+33 1 42 68 55 00",
    email: "paris@forever.com",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "tokyo",
    name: "Tokyo Salon",
    address: "6-Chōme Ginza, Chuo City, Tokyo 104-0061, Japan",
    hours: "Wed – Sun: 12:00 – 20:00 JST",
    phone: "+81 3 5537 2000",
    email: "tokyo@forever.com",
    image:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "newyork",
    name: "New York House",
    address: "94 Greene Street, SoHo, New York, NY 10012, USA",
    hours: "Mon – Sat: 10:00 – 18:00 EST",
    phone: "+1 212 966 3400",
    email: "soho@forever.com",
    image:
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "virtual",
    name: "Virtual Consult",
    address: "Private Encrypted High-Definition Video Suite",
    hours: "Available 24/7 by appointment across all time zones",
    phone: "+33 1 42 68 55 99",
    email: "virtual@forever.com",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
  },
];

const faqs = [
  {
    q: "How does a private salon appointment unfold?",
    a: "Each appointment is held in complete exclusivity. You will be welcomed with artisanal refreshments, guided through tactile fabric swatches, and fitted directly by our master tailor with personalized silhouette adjustments.",
  },
  {
    q: "What is the standard lead time for bespoke tailoring commissions?",
    a: "Because each piece is crafted in mono-materials and hand-finished with numbered certificates, bespoke commissions require 4 to 6 weeks. Express atelier service can be arranged for private collectors.",
  },
  {
    q: "Do you offer international white-glove courier delivery?",
    a: "Yes. All completed commissions are transported via climate-controlled courier with direct signature handoff in over 85 countries worldwide. Complimentary courier service is extended on all orders over $250.",
  },
  {
    q: "What is your return and exchange policy?",
    a: "Pieces may be tried in the comfort of your residence and returned within 30 days of receipt in unworn state with original tags intact. Prepaid return courier labels are included in every dispatch box.",
  },
];

const Contact = () => {
  const [salonLocation, setSalonLocation] = useState("paris");
  const [inquiryType, setInquiryType] = useState("Private Salon Fitting");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("14:00 - 15:30");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please provide your name and email address.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const code = `FOREVER-${salonLocation.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setBookingConfirmed({
        code,
        location: locations.find((l) => l.id === salonLocation)?.name ?? "Paris Atelier",
        date: date || "Date on File",
        time: timeSlot,
      });
      toast.success(`Appointment confirmed — Ref: ${code}`);
    }, 900);
  };

  const copyCode = () => {
    if (!bookingConfirmed) return;
    navigator.clipboard.writeText(bookingConfirmed.code).catch(() => {});
    setCopied(true);
    toast.success("Reservation code copied");
    setTimeout(() => setCopied(false), 2500);
  };

  const activeLoc = locations.find((l) => l.id === salonLocation);

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1A1A] pt-8 pb-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-8">
        <div className="flex items-center gap-3 text-[11px] uppercase letter-spaced font-bold text-[#1A1A1A]/60">
          <Link to="/" className="hover:text-[#1A1A1A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A]">Contact & Appointments</span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 mb-16 sm:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 text-[11px] uppercase letter-spaced font-bold text-[#1A1A1A]/60 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#B36B42]" />
            <span>DIRECT ATELIER LIAISON · PRIVATE SALON ACCESS</span>
          </div>
          <h1 className="prata-regular text-4xl sm:text-6xl font-bold leading-tight tracking-tight text-[#1A1A1A] mb-6">
            Private Commissions & Appointments.
          </h1>
          <p className="text-base sm:text-lg text-[#1A1A1A]/70 leading-relaxed">
            Our private appointment salons in Paris, Tokyo, and New York offer
            dedicated fittings, custom bespoke pattern drafting, and private
            archival viewings. Complete the dossier below to reserve your
            session.
          </p>
        </motion.div>
      </section>

      {/* Main Layout — Form + Directory */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 mb-24 sm:mb-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left — Appointment Booking Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#FAF8F5] p-8 sm:p-12 rounded-[36px] border border-black/5 shadow-md">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-black/10">
                <div>
                  <span className="text-[10px] uppercase letter-spaced font-bold text-[#B36B42] block mb-1">
                    BESPOKE INQUIRY DOSSIER
                  </span>
                  <h2 className="prata-regular text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                    Reserve Private Consultation
                  </h2>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#F5F2ED] border border-black/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 stroke-[1.5] text-[#1A1A1A]" />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {/* ── Confirmation View ── */}
                {bookingConfirmed ? (
                  <motion.div
                    key="confirmed"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-[#F5F2ED] border border-black/10 rounded-3xl p-8 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#1A1A1A] text-[#F5F2ED] flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <CheckCircle2 className="w-8 h-8 stroke-[1.75]" />
                    </div>
                    <span className="text-[10px] uppercase letter-spaced font-bold text-[#B36B42] block mb-1">
                      CONFIRMATION CERTIFICATE
                    </span>
                    <h3 className="prata-regular text-3xl font-bold text-[#1A1A1A] mb-3">
                      Your Salon Session is Reserved
                    </h3>
                    <p className="text-sm text-[#1A1A1A]/70 max-w-md mx-auto mb-8 leading-relaxed">
                      Our Head of Atelier has received your dossier. A
                      personalised invitation and itinerary have been dispatched
                      to your email address.
                    </p>

                    {/* Reservation Card */}
                    <div className="bg-[#FAF8F5] border border-black/10 rounded-2xl p-6 text-left max-w-md mx-auto mb-8 shadow-sm">
                      <div className="flex items-center justify-between pb-4 border-b border-black/10 mb-4">
                        <span className="text-xs uppercase letter-spaced font-bold text-[#1A1A1A]/60">
                          Reservation Reference
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#1A1A1A]">
                            {bookingConfirmed.code}
                          </span>
                          <button
                            type="button"
                            onClick={copyCode}
                            className="p-1 rounded hover:bg-black/5 text-[#1A1A1A]"
                            title="Copy code"
                          >
                            {copied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 text-xs">
                        {[
                          ["Salon House", bookingConfirmed.location],
                          ["Date", bookingConfirmed.date],
                          ["Time Slot", bookingConfirmed.time],
                        ].map(([label, value]) => (
                          <div key={label} className="flex justify-between">
                            <span className="text-[#1A1A1A]/60">{label}:</span>
                            <span className="font-bold text-[#1A1A1A]">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setBookingConfirmed(null)}
                      className="text-xs font-bold uppercase letter-spaced underline text-[#1A1A1A] hover:opacity-60 transition-opacity"
                    >
                      Draft Another Inquiry
                    </button>
                  </motion.div>
                ) : (
                  /* ── Booking Form ── */
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {/* 1. Location Picker */}
                    <div>
                      <label className="block text-[11px] uppercase letter-spaced font-bold text-[#1A1A1A]/70 mb-3">
                        1. Select Atelier House
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {locations.map((loc) => (
                          <button
                            key={loc.id}
                            type="button"
                            onClick={() => setSalonLocation(loc.id)}
                            className={`py-3 px-2 rounded-2xl text-center border text-xs font-bold transition-all ${
                              salonLocation === loc.id
                                ? "bg-[#1A1A1A] text-[#F5F2ED] border-[#1A1A1A] shadow-md"
                                : "bg-[#F5F2ED] text-[#1A1A1A] border-black/10 hover:border-black/30"
                            }`}
                          >
                            <span className="block truncate">{loc.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Inquiry Type */}
                    <div>
                      <label className="block text-[11px] uppercase letter-spaced font-bold text-[#1A1A1A]/70 mb-3">
                        2. Purpose of Appointment
                      </label>
                      <select
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="w-full bg-[#F5F2ED] border border-black/10 rounded-2xl px-4 py-3.5 text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-black transition-colors"
                      >
                        <option>Private Salon Fitting &amp; Try-On</option>
                        <option>Bespoke Haute Couture Commission (Custom Sizing)</option>
                        <option>Archival Provenance Consultation</option>
                        <option>Press &amp; Editorial Wardrobe Loans</option>
                        <option>General Product Inquiry</option>
                      </select>
                    </div>

                    {/* 3. Client Credentials */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase letter-spaced font-bold text-[#1A1A1A]/70 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Eleanor Vance"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-[#F5F2ED] border border-black/10 rounded-2xl px-4 py-3 text-xs text-[#1A1A1A] placeholder:text-stone-400 focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase letter-spaced font-bold text-[#1A1A1A]/70 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="eleanor@domain.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#F5F2ED] border border-black/10 rounded-2xl px-4 py-3 text-xs text-[#1A1A1A] placeholder:text-stone-400 focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    {/* 4. Phone / Date / Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase letter-spaced font-bold text-[#1A1A1A]/70 mb-2">
                          Phone / WhatsApp
                        </label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-[#F5F2ED] border border-black/10 rounded-2xl px-4 py-3 text-xs text-[#1A1A1A] placeholder:text-stone-400 focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase letter-spaced font-bold text-[#1A1A1A]/70 mb-2">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-[#F5F2ED] border border-black/10 rounded-2xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase letter-spaced font-bold text-[#1A1A1A]/70 mb-2">
                          Time Window
                        </label>
                        <select
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          className="w-full bg-[#F5F2ED] border border-black/10 rounded-2xl px-3 py-3 text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-black"
                        >
                          <option value="11:00 - 12:30">Morning (11:00 – 12:30)</option>
                          <option value="14:00 - 15:30">Afternoon (14:00 – 15:30)</option>
                          <option value="16:30 - 18:00">Evening (16:30 – 18:00)</option>
                        </select>
                      </div>
                    </div>

                    {/* 5. Notes */}
                    <div>
                      <label className="block text-[10px] uppercase letter-spaced font-bold text-[#1A1A1A]/70 mb-2">
                        Specific Requests or Notes (Optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Mention any specific pieces, sizing notes, or tailoring requests..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-[#F5F2ED] border border-black/10 rounded-2xl p-4 text-xs text-[#1A1A1A] placeholder:text-stone-400 focus:outline-none focus:border-black resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#1A1A1A] hover:bg-black text-[#F5F2ED] py-4 rounded-full text-xs font-bold uppercase letter-spaced transition-all duration-300 shadow-xl flex items-center justify-center gap-3 hover:scale-[1.01] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Transmitting Dossier to Master Tailor…</span>
                      ) : (
                        <>
                          <span>Transmit Appointment Dossier</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right — Concierge Directory */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Direct Channels */}
            <div className="bg-[#FAF8F5] p-8 rounded-[36px] border border-black/5 shadow-sm">
              <span className="text-[10px] uppercase letter-spaced font-bold text-[#B36B42] block mb-1">
                DISCREET LIAISON
              </span>
              <h3 className="prata-regular text-2xl font-bold text-[#1A1A1A] mb-4">
                Client Concierge Lines
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 leading-relaxed mb-6">
                For urgent garment inquiries, sizing consultations, or immediate
                commission assistance, reach our private desk directly:
              </p>
              <div className="space-y-3">
                <a
                  href="mailto:concierge@forever.com"
                  className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#F5F2ED] hover:bg-white border border-black/5 transition-all text-xs font-bold text-[#1A1A1A]"
                >
                  <div className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase letter-spaced text-[#1A1A1A]/50">
                      Private Email Desk
                    </span>
                    <span>concierge@forever.com</span>
                  </div>
                </a>
                <a
                  href="tel:+33142685500"
                  className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#F5F2ED] hover:bg-white border border-black/5 transition-all text-xs font-bold text-[#1A1A1A]"
                >
                  <div className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase letter-spaced text-[#1A1A1A]/50">
                      Global Concierge Line
                    </span>
                    <span>+33 1 42 68 55 00 (Paris HQ)</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Selected Location Preview */}
            {activeLoc && (
              <div className="bg-[#FAF8F5] rounded-[36px] overflow-hidden border border-black/5 shadow-sm">
                <div className="aspect-[16/9] bg-stone-200 overflow-hidden relative">
                  <img
                    src={activeLoc.image}
                    alt={activeLoc.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-black/10 text-[10px] uppercase letter-spaced font-bold text-[#1A1A1A]">
                    {activeLoc.name}
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex items-start gap-3 mb-3 text-xs text-[#1A1A1A]">
                    <MapPin className="w-4 h-4 text-[#B36B42] shrink-0 mt-0.5" />
                    <span className="font-semibold">{activeLoc.address}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-3 text-xs text-[#1A1A1A]/70">
                    <Clock className="w-4 h-4 text-[#B36B42] shrink-0" />
                    <span>{activeLoc.hours}</span>
                  </div>
                  <div className="pt-4 border-t border-black/5 text-[11px] text-[#1A1A1A]/60 flex items-center justify-between">
                    <span>Valet &amp; Private Entrance Available</span>
                    <Shield className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-6 sm:px-12 mb-20">
        <div className="text-center mb-12">
          <span className="text-[11px] uppercase letter-spaced font-bold text-[#1A1A1A]/60 block mb-2">
            CLIENT PROTOCOLS &amp; INQUIRIES
          </span>
          <h2 className="prata-regular text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
            Frequently Addressed Queries
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.q}
                className="bg-[#FAF8F5] rounded-3xl border border-black/5 overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="prata-regular text-lg font-bold text-[#1A1A1A]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-500 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-xs sm:text-sm text-[#1A1A1A]/70 leading-relaxed border-t border-black/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dark CTA Banner */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-[#1A1A1A] text-[#F5F2ED] rounded-[40px] p-8 sm:p-12 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-8"
        >
          <div className="max-w-xl">
            <span className="text-[11px] uppercase letter-spaced font-bold text-stone-400 block mb-2">
              NEED A FASTER RESPONSE?
            </span>
            <h3 className="prata-regular text-2xl sm:text-3xl font-bold mb-3">
              Chat with our private concierge team anytime.
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              We typically respond within a few hours. For urgent commissions,
              include your order or reference number so we can assist you with
              priority attention.
            </p>
          </div>
          <a
            href="mailto:concierge@forever.com"
            className="shrink-0 bg-[#F5F2ED] hover:bg-white text-[#1A1A1A] px-8 py-4 rounded-full text-xs font-bold uppercase letter-spaced transition-all shadow-lg"
          >
            Email Concierge Desk
          </a>
        </motion.section>
      </div>
    </div>
  );
};

export default Contact;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  Feather,
  Layers,
  CheckCircle2,
  Award,
} from "lucide-react";

const ScrollReveal = ({ children, delay = 0, yOffset = 30 }) => (
  <motion.div
    initial={{ opacity: 0, y: yOffset }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

const timelineMilestones = [
  {
    year: "2018",
    title: "The Founding in Paris 1er",
    description:
      "Conceived in a quiet courtyard atelier on Rue Saint-Honoré. The vision was radical: rejecting seasonal churn in favor of singular, numbered mono-material silhouettes.",
    badge: "Genesis",
  },
  {
    year: "2021",
    title: "The Brutalist Tokyo Salon",
    description:
      "Established our second home in Ginza 6-Chōme, forged from raw poured concrete, cedar timber, and brushed titanium — bridging Parisian haute couture with Japanese wabi-sabi precision.",
    badge: "Expansion",
  },
  {
    year: "2023",
    title: "NFC Provenance Micro-Tags",
    description:
      "Every commissioned garment is woven with an encrypted cryptographic NFC chip, guaranteeing authenticity, artisan signatures, and lifetime restoration registry.",
    badge: "Innovation",
  },
  {
    year: "2025",
    title: "New York Commission House",
    description:
      "Opened our SoHo private salon on Greene Street, offering private fitting salons and bespoke tailoring consultations for North American collectors.",
    badge: "Milestone",
  },
  {
    year: "2026",
    title: "The Zero-Blend Circular Vault",
    description:
      "Committed to 100% unblended natural fibers — pure cashmere, raw silk, virgin wool — allowing garments to be perpetually re-loomed and guaranteed for a century of wear.",
    badge: "Present Day",
  },
];

const craftPillars = [
  {
    icon: Feather,
    title: "Mono-Material Purity",
    description:
      "We strictly forbid synthetic blending. Double-faced cashmere from Biella, organic mulberry silk from Lyon, and full-grain vegetable-tanned leather from Tuscany.",
  },
  {
    icon: Compass,
    title: "Architectural Proportions",
    description:
      "Garments engineered with architectural draftsmanship: dropped shoulders, razor-cut lapels, and weight-balanced hems designed to drape effortlessly.",
  },
  {
    icon: Layers,
    title: "Numbered Micro-Editions",
    description:
      "We never mass-produce. Each run is strictly limited to 50–100 numbered pieces worldwide, signed by the master tailor who oversaw its construction.",
  },
];

const artisans = [
  {
    name: "Henriette Laurent",
    role: "Master Tailor & Head of Atelier, Paris",
    experience: "38 Years Haute Couture Heritage",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    quote:
      "A truly magnificent coat does not shout. It commands the room through the quiet weight of pure cashmere and the architectural balance of its lapel.",
  },
  {
    name: "Kenzo Mori",
    role: "Master Leather Craftsman, Tokyo",
    experience: "26 Years Fine Saddlery & Garmentry",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    quote:
      "We treat leather not as fabric, but as living sculpture. Every edge is burnished by hand with natural beeswax until it gleams like obsidian.",
  },
];

const About = () => {
  const [clocks, setClocks] = useState({ paris: "", tokyo: "", newYork: "" });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClocks({
        paris: now.toLocaleTimeString("en-GB", {
          timeZone: "Europe/Paris",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
        tokyo: now.toLocaleTimeString("en-GB", {
          timeZone: "Asia/Tokyo",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
        newYork: now.toLocaleTimeString("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1A1A] pt-8 pb-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-8">
        <div className="flex items-center gap-3 text-[11px] uppercase letter-spaced font-bold text-[#1A1A1A]/60">
          <Link to="/" className="hover:text-[#1A1A1A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A]">About Forever</span>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 mb-20 sm:mb-32">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 text-[11px] uppercase letter-spaced font-bold text-[#1A1A1A]/60 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#B36B42]" />
            <span>ESTABLISHED 2018 · PARIS · TOKYO · NEW YORK</span>
          </div>

          <h1 className="prata-regular text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight text-[#1A1A1A] mb-8">
            The Architecture of Silence & Permanence.
          </h1>

          <p className="text-lg sm:text-xl text-[#1A1A1A]/70 leading-relaxed max-w-3xl mb-10">
            Forever was founded upon a singular, unwavering conviction: true
            luxury requires no logos, no seasonal hysteria, and no synthetic
            compromise. We create timeless, architectural garments engineered to
            outlive trends and gain character with every decade of wear.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="bg-[#1A1A1A] hover:bg-black text-[#F5F2ED] px-8 py-4 rounded-full text-xs font-bold uppercase letter-spaced transition-all duration-300 shadow-xl flex items-center gap-3 hover:scale-[1.02]"
            >
              <span>Schedule Private Fitting</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/collection"
              className="bg-white hover:bg-stone-50 text-[#1A1A1A] border border-black/15 hover:border-black px-8 py-4 rounded-full text-xs font-bold uppercase letter-spaced transition-all"
            >
              Explore Collection
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Editorial Dual Imagery Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 mb-24 sm:mb-36">
        <ScrollReveal yOffset={40}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10">
            <div className="md:col-span-7 rounded-[32px] overflow-hidden relative aspect-[4/3] bg-stone-200 shadow-xl border border-black/5 group">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1400&q=85"
                alt="Atelier drafting room"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-8 text-[#F5F2ED]">
                <span className="text-[10px] uppercase letter-spaced font-bold text-white/70 mb-1">
                  Drafting Table No. 4 · Paris
                </span>
                <p className="prata-regular text-2xl font-bold">
                  "Every millimeter cut by hand using Japanese high-carbon shears."
                </p>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col justify-between gap-6">
              <div className="rounded-[32px] overflow-hidden relative aspect-[4/3] bg-stone-200 shadow-xl border border-black/5 group">
                <img
                  src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=85"
                  alt="Fine double-faced wool drape"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-[#F5F2ED]">
                  <span className="text-[10px] uppercase letter-spaced font-bold text-white/70">
                    Tactile Weight: 680 GSM Raw Melton Wool
                  </span>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-8 sm:p-10 rounded-[32px] border border-black/5 shadow-sm">
                <div className="text-[10px] uppercase letter-spaced font-bold text-[#B36B42] mb-2">
                  THE FOREVER MANIFESTO
                </div>
                <h3 className="prata-regular text-2xl font-bold text-[#1A1A1A] mb-3">
                  Restraint Over Ornamentation.
                </h3>
                <p className="text-sm text-[#1A1A1A]/70 leading-relaxed">
                  We believe the most potent garments eliminate superfluous
                  noise. Our patterns are drafted to accentuate pure drape,
                  natural fiber luster, and sculptural poise.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Craft Pillars */}
      <section className="py-20 bg-[#EBE7DF] border-y border-black/5 mb-24 sm:mb-36">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] uppercase letter-spaced font-bold text-[#1A1A1A]/60 block mb-2">
              OUR UNCOMPROMISING DISCIPLINES
            </span>
            <h2 className="prata-regular text-3xl sm:text-5xl font-bold text-[#1A1A1A]">
              Three Pillars of Haute Craft
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {craftPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <ScrollReveal key={pillar.title} delay={idx * 0.15} yOffset={30}>
                  <div className="bg-[#FAF8F5] p-8 sm:p-10 rounded-[32px] border border-black/5 shadow-sm h-full flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-[#F5F2ED] border border-black/10 flex items-center justify-center text-[#1A1A1A] mb-6 shadow-inner">
                        <Icon className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <h3 className="prata-regular text-2xl font-bold text-[#1A1A1A] mb-4">
                        {pillar.title}
                      </h3>
                      <p className="text-sm text-[#1A1A1A]/70 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                    <div className="pt-6 mt-6 border-t border-black/5 flex items-center gap-2 text-[10px] uppercase letter-spaced font-bold text-[#1A1A1A]/50">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Certified Atelier Standard</span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Heritage Timeline */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 mb-24 sm:mb-36">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[11px] uppercase letter-spaced font-bold text-[#1A1A1A]/60 block mb-2">
              CHRONICLE OF PERMANENCE
            </span>
            <h2 className="prata-regular text-3xl sm:text-5xl font-bold text-[#1A1A1A]">
              The Heritage Timeline
            </h2>
          </div>
          <p className="text-sm text-[#1A1A1A]/70 max-w-md">
            From our quiet beginnings in the 1er arrondissement to our global
            private salons, explore the milestones that define our house.
          </p>
        </div>

        <div className="relative border-l-2 border-black/10 ml-4 sm:ml-8 pl-8 sm:pl-12 space-y-12">
          {timelineMilestones.map((item, idx) => (
            <ScrollReveal key={item.year} delay={idx * 0.1} yOffset={25}>
              <div className="relative group">
                <div className="absolute -left-[41px] sm:-left-[57px] top-1.5 w-6 h-6 rounded-full bg-[#FAF8F5] border-4 border-[#1A1A1A] group-hover:scale-125 transition-transform" />
                <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-[28px] border border-black/5 shadow-sm max-w-3xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="prata-regular text-2xl sm:text-3xl font-bold text-[#B36B42]">
                      {item.year}
                    </span>
                    <span className="text-[10px] uppercase letter-spaced font-bold bg-[#1A1A1A] text-white px-3 py-1 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="prata-regular text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#1A1A1A]/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Master Artisans */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 mb-24 sm:mb-36">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] uppercase letter-spaced font-bold text-[#1A1A1A]/60 block mb-2">
            MASTERS OF THE CRAFT
          </span>
          <h2 className="prata-regular text-3xl sm:text-5xl font-bold text-[#1A1A1A]">
            The Hands Behind the Garments
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {artisans.map((artisan, idx) => (
            <ScrollReveal key={artisan.name} delay={idx * 0.15} yOffset={35}>
              <div className="bg-[#FAF8F5] rounded-[36px] overflow-hidden border border-black/5 shadow-md flex flex-col h-full">
                <div className="aspect-[4/3] bg-stone-200 overflow-hidden relative">
                  <img
                    src={artisan.image}
                    alt={artisan.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-black/10">
                    <span className="text-[10px] uppercase letter-spaced font-bold text-[#1A1A1A]">
                      {artisan.experience}
                    </span>
                  </div>
                </div>

                <div className="p-8 sm:p-10 flex flex-col flex-1">
                  <h3 className="prata-regular text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-1">
                    {artisan.name}
                  </h3>
                  <p className="text-xs uppercase letter-spaced font-bold text-[#B36B42] mb-6">
                    {artisan.role}
                  </p>
                  <blockquote className="prata-regular text-base sm:text-lg italic text-[#1A1A1A]/80 leading-relaxed border-l-2 border-black/20 pl-4 mb-6 flex-1">
                    "{artisan.quote}"
                  </blockquote>
                  <div className="pt-4 border-t border-black/5 flex items-center justify-between text-xs text-[#1A1A1A]/60">
                    <span>Full Guild Accreditation</span>
                    <Award className="w-4 h-4 text-[#B36B42]" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Global Atelier Clocks */}
      <section className="py-20 bg-[#1A1A1A] text-[#F5F2ED] rounded-[40px] max-w-7xl mx-6 sm:mx-12 lg:mx-auto px-8 sm:px-16 mb-24 shadow-2xl">
        <div className="max-w-3xl mb-12">
          <span className="text-[11px] uppercase letter-spaced font-bold text-stone-400 block mb-2">
            GLOBAL APPOINTMENT HOUSES
          </span>
          <h2 className="prata-regular text-3xl sm:text-5xl font-bold leading-tight mb-4">
            Visit Our Salons by Private Appointment
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Experience our full archival vault, tactile fabric swatches, and
            bespoke tailoring consultations in our Paris, Tokyo, and New York
            houses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              label: "Paris Atelier",
              time: clocks.paris || "14:30:00",
              address: "18 Rue Saint-Honoré",
              city: "75001 Paris, France",
              hours: "Tue – Sat: 11:00 – 19:00 CET",
            },
            {
              label: "Tokyo Salon",
              time: clocks.tokyo || "22:30:00",
              address: "6-Chōme Ginza, Chuo City",
              city: "Tokyo 104-0061, Japan",
              hours: "Wed – Sun: 12:00 – 20:00 JST",
            },
            {
              label: "New York House",
              time: clocks.newYork || "08:30:00",
              address: "94 Greene Street, SoHo",
              city: "New York, NY 10012, USA",
              hours: "Mon – Sat: 10:00 – 18:00 EST",
            },
          ].map((salon) => (
            <div
              key={salon.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase letter-spaced text-stone-300">
                  {salon.label}
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  {salon.time}
                </span>
              </div>
              <p className="prata-regular text-xl font-bold mb-1">{salon.address}</p>
              <p className="text-xs text-stone-400 mb-4">{salon.city}</p>
              <div className="text-[10px] text-stone-400 uppercase letter-spaced">
                {salon.hours}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
          <div className="flex items-center gap-3 text-xs text-stone-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Private fitting rooms with discreet VIP concierge service</span>
          </div>
          <Link
            to="/contact"
            className="w-full sm:w-auto bg-[#F5F2ED] hover:bg-white text-[#1A1A1A] px-8 py-3.5 rounded-full text-xs font-bold uppercase letter-spaced transition-all text-center"
          >
            Request Salon Appointment
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;

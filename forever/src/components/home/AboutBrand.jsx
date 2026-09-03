import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Compass, Eye, ShieldCheck } from "lucide-react";
import { assets } from "../../assets/assets.js";

// ─── Animated counter ────────────────────────────────────────────────────────

const useCounter = (target, duration = 1800, triggered = false) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    const steps = 60;
    const stepTime = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setValue(Math.round(target * (step / steps)));
      if (step >= steps) { clearInterval(timer); setValue(target); }
    }, stepTime);
    return () => clearInterval(timer);
  }, [triggered, target, duration]);
  return value;
};

// ─── Principles data ─────────────────────────────────────────────────────────

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "1. Trusted Quality",
    body: "Every product is carefully curated for durability and style. We partner only with verified suppliers who meet our standards — no compromise on materials.",
  },
  {
    icon: Compass,
    title: "2. Transparent Sourcing",
    body: "We believe you deserve to know where your clothes come from. Our supply chain is audited end-to-end so you can shop with confidence and conscience.",
  },
  {
    icon: Eye,
    title: "3. Customer First",
    body: "From easy returns to responsive support, every touchpoint is designed around your experience — not our convenience.",
  },
];

// ─── Stat item ────────────────────────────────────────────────────────────────

const Stat = ({ value, suffix, label, sub, triggered }) => {
  const count = useCounter(value, 1800, triggered);
  return (
    <div className="flex flex-col items-center sm:items-start gap-1">
      <span className="font-serif text-4xl sm:text-5xl font-bold text-[#F5F2ED] leading-none">
        {count}{suffix}
      </span>
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#F5F2ED]/60">
        {label}
      </p>
      <p className="text-xs text-[#F5F2ED]/40 max-w-[160px] text-center sm:text-left">
        {sub}
      </p>
    </div>
  );
};

// ─── AboutBrand ───────────────────────────────────────────────────────────────

const AboutBrand = () => {
  const navigate = useNavigate();
  const [countersTriggered, setCountersTriggered] = useState(false);

  return (
    <section className="py-20 sm:py-28 bg-[#F5F2ED] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* ── Section header ── */}
        <div className="mb-14 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-4">
              The Brand Manifesto
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-tight">
              The Discipline of{" "}
              <em className="font-normal italic">Quiet Permanence.</em>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 text-sm sm:text-base text-[#1A1A1A]/55 leading-relaxed max-w-xl"
          >
            Forever Commerce is built for modern shoppers who want fashion that
            feels good and looks great. We reject the churn of fast fashion in
            pursuit of pieces that earn their place in your wardrobe for years.
          </motion.p>
        </div>

        {/* ── Main content grid ── */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-14">

          {/* Left — layered images */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Primary image */}
            <div className="relative rounded-[28px] overflow-hidden aspect-[4/5] bg-[#E5E2DD] shadow-xl">
              <img
                src={assets.about_img}
                alt="About Forever Commerce"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Caption overlay */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/80 backdrop-blur-md rounded-2xl px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/50 mb-0.5">
                  Our Story
                </p>
                <p className="text-sm font-bold text-[#1A1A1A]">
                  Style, comfort and confidence in one place.
                </p>
              </div>
            </div>

            {/* Decorative offset frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-[#1A1A1A]/8 rounded-[32px] pointer-events-none" />
          </motion.div>

          {/* Right — principles */}
          <div className="flex flex-col gap-8">
            {PRINCIPLES.map((p, idx) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex gap-5"
                >
                  <div className="shrink-0 w-10 h-10 rounded-2xl bg-[#1A1A1A] flex items-center justify-center mt-0.5">
                    <Icon className="size-4 text-[#F5F2ED]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1A1A1A] mb-1.5">
                      {p.title}
                    </h3>
                    <p className="text-sm text-[#1A1A1A]/55 leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            <motion.button
              type="button"
              onClick={() => navigate("/about")}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="self-start inline-flex items-center gap-2 bg-[#1A1A1A] text-[#F5F2ED] px-7 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#333] transition-all hover:-translate-y-0.5 shadow-lg mt-2"
            >
              Read Our Story
              <Award className="size-3.5" />
            </motion.button>
          </div>
        </div>

        {/* ── Animated counters banner ── */}
        <motion.div
          onViewportEnter={() => setCountersTriggered(true)}
          viewport={{ once: true, margin: "-50px" }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-[#1A1A1A] rounded-[32px] p-8 sm:p-12 lg:p-14 shadow-2xl"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            <Stat
              value={50}
              suffix="K+"
              label="Products Sold"
              sub="Across all categories"
              triggered={countersTriggered}
            />
            <Stat
              value={25}
              suffix="K+"
              label="Happy Customers"
              sub="And growing every month"
              triggered={countersTriggered}
            />
            <Stat
              value={120}
              suffix="+"
              label="Countries Served"
              sub="Global courier network"
              triggered={countersTriggered}
            />
            <Stat
              value={98}
              suffix="%"
              label="Satisfaction Rate"
              sub="Based on verified reviews"
              triggered={countersTriggered}
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutBrand;

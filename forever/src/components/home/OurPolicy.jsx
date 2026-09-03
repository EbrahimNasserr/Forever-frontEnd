import { motion } from "framer-motion";
import { RefreshCcw, ShieldCheck, Headphones } from "lucide-react";

const POLICIES = [
  {
    Icon: RefreshCcw,
    title: "Easy Exchange Policy",
    description: "Hassle-free exchanges on all orders within 30 days of delivery.",
  },
  {
    Icon: ShieldCheck,
    title: "7-Day Return Policy",
    description: "Changed your mind? Return any item in original condition, no questions asked.",
  },
  {
    Icon: Headphones,
    title: "24 / 7 Customer Support",
    description: "Our team is available around the clock via email, chat, and phone.",
  },
];

const OurPolicy = () => (
  <section className="py-16 sm:py-20 bg-[#F5F2ED] border-t border-black/5">
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {POLICIES.map(({ Icon, title, description }, idx) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="flex flex-col items-center text-center gap-4 bg-white rounded-[24px] px-8 py-10 border border-black/5 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] flex items-center justify-center shrink-0">
              <Icon className="size-5 text-[#F5F2ED]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-[0.1em] mb-2">
                {title}
              </h3>
              <p className="text-xs text-[#1A1A1A]/50 leading-relaxed">
                {description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default OurPolicy;

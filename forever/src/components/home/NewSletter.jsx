import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Mail, Shield, Sparkles } from "lucide-react";

const NewSletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success"
  const [memberNumber, setMemberNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");

    // Simulate async subscription
    setTimeout(() => {
      const num = Math.floor(1000 + Math.random() * 9000).toString();
      setMemberNumber(num);
      setStatus("success");
    }, 900);
  };

  return (
    <section
      id="newsletter"
      className="py-24 sm:py-32 bg-[#F5F2ED] border-b border-black/5 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[36px] overflow-hidden bg-[#1A1A1A] text-[#F5F2ED] p-8 sm:p-14 lg:p-20 border border-white/10 shadow-2xl"
        >
          {/* Ambient glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-stone-700/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-white/40 mb-4">
              <Sparkles className="size-3.5 text-white/30" />
              <span>Private Previews & Early Access</span>
            </div>

            <h2 className="font-serif text-4xl sm:text-6xl text-white font-bold leading-tight mb-4 tracking-tight">
              Enter the{" "}
              <em className="italic font-normal">Private</em> List.
            </h2>

            <p className="text-sm text-white/50 leading-relaxed mb-10 max-w-lg mx-auto">
              Be first to know about new arrivals, exclusive drops, and seasonal
              promotions. Unsubscribe any time — no spam, ever.
            </p>

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/15 max-w-md mx-auto"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                    className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="size-6" />
                  </motion.div>
                  <h3 className="font-serif text-2xl text-white font-bold mb-2">
                    You're on the list!
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Member #{memberNumber} confirmed. We've sent a welcome note to{" "}
                    <span className="font-semibold text-white">{email}</span>.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="max-w-md mx-auto flex flex-col gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="relative flex items-center">
                    <Mail className="size-4 absolute left-5 text-white/30 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/10 text-white placeholder:text-white/30 pl-12 pr-36 py-4 rounded-full border border-white/20 focus:border-white/50 focus:outline-none text-sm transition-all backdrop-blur-md"
                    />
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="absolute right-2 bg-white text-[#1A1A1A] hover:bg-[#F5F2ED] px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:scale-105 flex items-center gap-1.5 shadow-md disabled:opacity-50"
                    >
                      <span>{status === "loading" ? "Joining…" : "Subscribe"}</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-white/30 uppercase tracking-[0.15em] pt-1">
                    <Shield className="size-3.5" />
                    <span>Strict privacy. Unsubscribe at any time.</span>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewSletter;

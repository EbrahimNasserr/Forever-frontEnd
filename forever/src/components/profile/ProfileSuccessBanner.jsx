import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const ProfileSuccessBanner = ({ message }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="fixed top-24 right-6 z-50 bg-[#1a1a1a] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs border border-white/10"
      >
        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <Check className="w-3 h-3 text-white" />
        </div>
        <span className="font-medium">{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ProfileSuccessBanner;

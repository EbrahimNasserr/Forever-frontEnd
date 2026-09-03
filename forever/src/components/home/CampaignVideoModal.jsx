import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Pause, Play, Sparkles, Volume2, VolumeX, X } from "lucide-react";
import { setVideoOpen } from "../../features/cart/cartSlice.js";

const CampaignVideoModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.cart.ui.isVideoOpen);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const close = () => dispatch(setVideoOpen(false));

  const handleShopClick = () => {
    close();
    const target = document.getElementById("collection-section");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl bg-[#141414] rounded-[32px] overflow-hidden shadow-2xl border border-white/10 z-10 flex flex-col"
          >
            {/* Close */}
            <button
              type="button"
              onClick={close}
              className="absolute top-5 right-5 z-30 w-10 h-10 rounded-full bg-white/15 hover:bg-white hover:text-black text-white backdrop-blur-md flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            {/* Cinema frame */}
            <div className="relative aspect-video w-full bg-black overflow-hidden group">
              <motion.img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85"
                alt="Campaign Film"
                className="w-full h-full object-cover object-center"
                animate={{ scale: isPlaying ? 1.08 : 1 }}
                transition={{ duration: 12, ease: "linear" }}
              />

              {/* Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Play / Pause centre */}
              <button
                type="button"
                onClick={() => setIsPlaying((v) => !v)}
                className="absolute inset-0 flex items-center justify-center focus:outline-none"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-2xl"
                >
                  {isPlaying ? (
                    <Pause className="size-8 fill-white" />
                  ) : (
                    <Play className="size-8 fill-white ml-1" />
                  )}
                </motion.div>
              </button>

              {/* Bottom controls */}
              <div className="absolute bottom-5 inset-x-5 z-20 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsMuted((v) => !v)}
                    className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors"
                    aria-label="Toggle mute"
                  >
                    {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                  </button>
                  <span className="text-[11px] text-white/70 uppercase tracking-widest font-semibold">
                    VOL. IV — "SILENT MONOLITH" (02:45 / 4K UHD)
                  </span>
                </div>
                <span className="hidden sm:block text-[10px] text-white/50 uppercase tracking-widest font-semibold">
                  MILAN • COMO • PARIS
                </span>
              </div>
            </div>

            {/* Credits bar */}
            <div className="p-6 sm:p-8 bg-[#18181A] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#A8A297] mb-1 font-semibold">
                  <Sparkles className="size-3.5 text-[#C86D44]" />
                  <span>Cinematic Archive</span>
                </div>
                <h3 className="font-serif text-2xl text-white font-normal">
                  Direction by Lucien Bergère
                </h3>
                <p className="text-xs text-[#A8A297] mt-0.5">
                  Original score performed on vintage analog synthesizers &amp; live cello.
                </p>
              </div>

              <button
                type="button"
                onClick={handleShopClick}
                className="inline-flex items-center gap-2 bg-white text-black px-7 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-[#FAF9F6] hover:scale-105 transition-all shrink-0"
              >
                Shop the Collection
                <ArrowRight className="size-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CampaignVideoModal;

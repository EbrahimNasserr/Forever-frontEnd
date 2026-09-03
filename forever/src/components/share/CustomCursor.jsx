import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom cursor — renders only on fine-pointer (desktop) devices.
 * Follows the mouse with a spring-inertia ring + a sharp centre dot.
 * Expands on hover over interactive elements; shows a label when
 * the hovered element carries a [data-cursor-label] attribute.
 */
const CustomCursor = () => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [label, setLabel] = useState("");

  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);

  // Dot tracks the raw position instantly
  // Ring follows with spring inertia
  const ringX = useSpring(rawX, { damping: 28, stiffness: 350 });
  const ringY = useSpring(rawY, { damping: 28, stiffness: 350 });

  useEffect(() => {
    // Don't render on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onOver = (e) => {
      const el = e.target;
      if (!el) return;

      const interactive = el.closest(
        "button, a, input, textarea, select, [role='button'], [data-cursor-hover]"
      );
      const cursorLabel = el
        .closest("[data-cursor-label]")
        ?.getAttribute("data-cursor-label") ?? "";

      setHovered(Boolean(interactive));
      setLabel(cursorLabel);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover", onOver);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onOver);
    };
  // rawX / rawY are stable motion values — no stale closure risk
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  const ringSize = hovered ? (label ? 80 : 48) : 28;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block overflow-hidden">
      {/* Spring-following ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border pointer-events-none flex items-center justify-center"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          backgroundColor: hovered
            ? label
              ? "rgba(20,20,20,0.88)"
              : "rgba(20,20,20,0.06)"
            : "transparent",
          borderColor: hovered ? "rgba(20,20,20,0.15)" : "rgba(20,20,20,0.35)",
        }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
      >
        {label && (
          <span className="text-[9px] tracking-widest uppercase font-semibold text-[#FAF9F6] text-center leading-tight px-1">
            {label}
          </span>
        )}
      </motion.div>

      {/* Sharp centre dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#141414] pointer-events-none"
        style={{
          x: rawX,
          y: rawY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ scale: hovered ? 0 : 1, opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
};

export default CustomCursor;

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Initialises Lenis smooth scroll for the lifetime of the component that
 * calls this hook (intended to be called once in App).
 *
 * Lenis drives its own rAF loop internally via `lenis.raf()`, so no
 * external animation frame is needed.
 */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}

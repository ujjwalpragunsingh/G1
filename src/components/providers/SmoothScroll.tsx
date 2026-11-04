"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Smooth, eased mouse-wheel scrolling and smooth jumps to sections (#showcase, #contact…).
// Touch screens keep their native scrolling, and Lenis switches itself off
// for visitors who prefer reduced motion.
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      // Clicking through to another page stops any glide that's still running
      stopInertiaOnNavigate: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    return () => lenis.destroy();
  }, []);

  return null;
}

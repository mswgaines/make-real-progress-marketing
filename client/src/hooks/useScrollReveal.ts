/**
 * useScrollReveal — Intersection Observer hook for scroll-triggered animations
 * Design: Make Real Progress — "The Journey"
 */

import { useEffect, useRef } from "react";

export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger children with .reveal class
            const children = entry.target.querySelectorAll(".reveal");
            children.forEach((child, i) => {
              setTimeout(() => {
                child.classList.add("visible");
              }, i * 90);
            });
            // Also reveal the container itself if it has .reveal
            if (entry.target.classList.contains("reveal")) {
              entry.target.classList.add("visible");
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

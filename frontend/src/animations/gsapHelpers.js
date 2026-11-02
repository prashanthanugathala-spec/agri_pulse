import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Hook to animate page-level entrance elements cleanly
 * Cleans up with gsap.context() on unmount
 */
export const usePageEntrance = (containerRef, deps = []) => {
  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Animate main header / title
      gsap.fromTo(
        '.animate-header',
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );

      // Animate cards staggered
      const cards = gsap.utils.toArray('.animate-card');
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.06,
            ease: 'power2.out',
            clearProps: 'transform'
          }
        );
      }

      // Animate any data metrics
      const metrics = gsap.utils.toArray('.animate-metric');
      if (metrics.length > 0) {
        gsap.fromTo(
          metrics,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.4, delay: 0.1, ease: 'back.out(1.4)' }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, deps);
};

/**
 * Hook for scroll-triggered reveal
 */
export const useScrollReveal = (targetRef, options = {}) => {
  useEffect(() => {
    if (!targetRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targetRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: targetRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            ...options
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);
};

/**
 * Micro-interaction helper for hover states
 */
export const buttonPressAnimation = (e) => {
  if (prefersReducedMotion()) return;
  gsap.to(e.currentTarget, { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 });
};

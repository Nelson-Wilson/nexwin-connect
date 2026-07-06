import { useEffect, type RefObject } from 'react';
import VanillaTilt from 'vanilla-tilt';

interface TiltHTMLElement extends HTMLElement {
  vanillaTilt?: { destroy: () => void };
}

/**
 * Attaches the same 3D tilt-on-hover effect used across the legacy
 * catalogue (see Categories.tsx) to every `.tilt-card` element found inside
 * `containerRef`. Scoped to the container so sibling sections using the same
 * class name don't get double-initialised.
 */
export function useTilt(containerRef: RefObject<HTMLElement | null>, selector = '.tilt-card') {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll(selector)) as TiltHTMLElement[];
    if (cards.length === 0) return;

    VanillaTilt.init(cards, {
      max: 10,
      speed: 300,
      glare: true,
      'max-glare': 0.12,
      scale: 1.02,
    });

    return () => {
      cards.forEach((card) => card.vanillaTilt?.destroy());
    };
  }, [containerRef, selector]);
}

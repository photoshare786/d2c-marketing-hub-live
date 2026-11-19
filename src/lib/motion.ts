import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(ScrollTrigger, SplitText, Observer);

export const EASE_EDITORIAL = 'power3.out';
export const EASE_EXPO = 'power4.out';
export const EASE_CURTAIN = 'expo.inOut';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { gsap, ScrollTrigger, SplitText, Observer };

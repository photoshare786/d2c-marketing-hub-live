import { useEffect, useRef } from 'react';
import { gsap, EASE_CURTAIN, prefersReducedMotion } from '../lib/motion';

interface SectionTransitionCurtainProps {
  transitionState: {
    active: boolean;
    label: string;
    onMidpoint: () => void;
    onDone: () => void;
  } | null;
}

export function SectionTransitionCurtain({
  transitionState,
}: SectionTransitionCurtainProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!transitionState?.active) return;

    if (prefersReducedMotion()) {
      transitionState.onMidpoint();
      transitionState.onDone();
      return;
    }

    const overlay = overlayRef.current;
    const label = labelRef.current;
    if (!overlay) return;

    const ctx = gsap.context(() => {
      gsap.set(overlay, { yPercent: 100, display: 'flex' });
      if (label) gsap.set(label, { opacity: 0, y: 12 });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
          transitionState.onDone();
        },
      });

      tl.to(overlay, {
        yPercent: 0,
        duration: 0.36,
        ease: EASE_CURTAIN,
      })
        .to(
          label,
          {
            opacity: 1,
            y: 0,
            duration: 0.18,
            ease: 'power2.out',
          },
          '-=0.16'
        )
        .add(() => {
          transitionState.onMidpoint();
        })
        .to(
          label,
          {
            opacity: 0,
            y: -10,
            duration: 0.15,
            ease: 'power2.in',
          },
          '+=0.08'
        )
        .to(
          overlay,
          {
            yPercent: -100,
            duration: 0.42,
            ease: EASE_CURTAIN,
          },
          '-=0.06'
        );
    }, overlayRef);

    return () => ctx.revert();
  }, [transitionState]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{ display: 'none' }}
      className="fixed inset-0 z-[90] bg-[#111111] border-t border-[#B6FF4A]/40 items-center justify-center pointer-events-none"
    >
      <span
        ref={labelRef}
        className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-white"
      >
        {transitionState?.label || 'D2C Marketing Hub'}
      </span>
    </div>
  );
}

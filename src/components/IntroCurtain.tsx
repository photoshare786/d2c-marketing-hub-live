import { useEffect, useRef, useState } from 'react';
import { gsap, SplitText, EASE_CURTAIN, EASE_EXPO, prefersReducedMotion } from '../lib/motion';

interface IntroCurtainProps {
  onComplete: () => void;
}

export function IntroCurtain({ onComplete }: IntroCurtainProps) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const logoMaskRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const bgPreviewRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const finishIntro = () => {
    try {
      sessionStorage.setItem('d2c_intro_seen', '1');
    } catch {
      // Ignore storage errors in restricted environments
    }
    setDismissed(true);
    onComplete();
  };

  const handleSkip = () => {
    if (tlRef.current) {
      tlRef.current.kill();
    }
    if (!curtainRef.current) {
      finishIntro();
      return;
    }
    gsap.to(curtainRef.current, {
      yPercent: -100,
      duration: 0.55,
      ease: EASE_CURTAIN,
      onComplete: finishIntro,
    });
  };

  useEffect(() => {
    if (prefersReducedMotion()) {
      finishIntro();
      return;
    }

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      const counterObj = { value: 0 };

      if (statementRef.current) {
        split = SplitText.create(statementRef.current, {
          type: 'chars,words',
        });
        gsap.set(split.chars, { yPercent: 115, opacity: 0 });
      }

      gsap.set(logoMaskRef.current, {
        clipPath: 'inset(0 100% 0 0)',
      });
      gsap.set(bgPreviewRef.current, {
        clipPath: 'inset(38% 34% 38% 34% round 16px)',
        opacity: 0,
        scale: 1.12,
      });
      gsap.set(progressBarRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
      });

      const tl = gsap.timeline({
        onComplete: finishIntro,
      });
      tlRef.current = tl;

      // 1-3: Logo clipping mask reveal + progress sweep
      tl.to(
        logoMaskRef.current,
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.65,
          ease: EASE_CURTAIN,
        },
        0.1
      )
        .to(
          progressBarRef.current,
          {
            scaleX: 1,
            duration: 1.65,
            ease: 'power2.inOut',
          },
          0.15
        )
        .to(
          counterObj,
          {
            value: 100,
            duration: 1.65,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = `${String(
                  Math.round(counterObj.value)
                ).padStart(2, '0')}%`;
              }
            },
          },
          0.15
        );

      // 4: Staggered character reveal on editorial statement
      if (split) {
        tl.to(
          split.chars,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.018,
            ease: EASE_EXPO,
          },
          0.42
        );
      }

      // 5: Smooth mask background visual reveal
      tl.to(
        bgPreviewRef.current,
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          opacity: 0.34,
          scale: 1,
          duration: 0.85,
          ease: EASE_CURTAIN,
        },
        0.95
      );

      // 6: Intro curtain sweeps open upward
      tl.to(
        curtainRef.current,
        {
          yPercent: -100,
          duration: 0.78,
          ease: EASE_CURTAIN,
        },
        1.85
      );
    }, curtainRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (dismissed) return null;

  return (
    <div
      ref={curtainRef}
      role="region"
      aria-label="Opening brand reveal"
      className="fixed inset-0 z-[100] bg-[#111111] text-white flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden"
    >
      {/* Masked Background Studio Visual */}
      <div
        ref={bgPreviewRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <img
          src="/src/assets/images/hero_agency_showcase_1795031675646.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#111111]/60" />
      </div>

      {/* Top Row: Clipped Logo Reveal & Skip Action */}
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div ref={logoMaskRef} className="overflow-hidden">
          <span className="font-display text-lg sm:text-xl font-semibold tracking-tight text-white">
            D2C Marketing Hub
          </span>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="px-4 py-2 rounded-full border border-white/20 text-xs font-medium tracking-wide text-white/80 hover:text-[#111111] hover:bg-[#B6FF4A] hover:border-[#B6FF4A] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          Skip Intro
        </button>
      </div>

      {/* Center Statement: Staggered Character Entrance */}
      <div className="relative z-10 max-w-5xl">
        <p className="text-xs uppercase tracking-[0.18em] text-[#B6FF4A] mb-4">
          Your Digital Growth · Our Creative Intelligence
        </p>
        <div
          ref={statementRef}
          className="font-display font-medium tracking-[-0.03em] leading-[1.02] text-white overflow-hidden"
          style={{ fontSize: 'clamp(2.25rem, 6vw, 5.5rem)' }}
        >
          Creative Intelligence Meets Growth.
        </div>
      </div>

      {/* Bottom Row: Animated Progress Line & Counter */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-white/60">
          <span>Preparing Studio Experience</span>
          <span ref={counterRef} className="font-mono-num text-[#B6FF4A]">
            00%
          </span>
        </div>
        <div className="h-[2px] w-full bg-white/15 overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full w-full bg-[#B6FF4A]"
          />
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, Observer, prefersReducedMotion } from '../lib/motion';
import { MagneticButton } from './MagneticButton';
import { SplitHeading } from './motion/SplitTypography';

interface CollaborateSectionProps {
  onStartProject: () => void;
}

const TRACK_ONE_PHRASES = [
  "LET'S CREATE SOMETHING GREAT.",
  'DIGITAL EXPERIENCES THAT MATTER.',
  "LET'S CREATE SOMETHING GREAT.",
  'DIGITAL EXPERIENCES THAT MATTER.',
];

const TRACK_TWO_PHRASES = [
  'CREATIVITY MEETS TECHNOLOGY.',
  "LET'S BUILD YOUR NEXT BIG IDEA.",
  'CREATIVITY MEETS TECHNOLOGY.',
  "LET'S BUILD YOUR NEXT BIG IDEA.",
];

export function CollaborateSection({ onStartProject }: CollaborateSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackOneRef = useRef<HTMLDivElement>(null);
  const trackTwoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tlOne = trackOneRef.current
        ? gsap.to(trackOneRef.current, {
            xPercent: -50,
            duration: 28,
            repeat: -1,
            ease: 'none',
          })
        : null;

      const tlTwo = trackTwoRef.current
        ? gsap.fromTo(
            trackTwoRef.current,
            { xPercent: -50 },
            {
              xPercent: 0,
              duration: 34,
              repeat: -1,
              ease: 'none',
            }
          )
        : null;

      // Subtle scroll-velocity acceleration via GSAP Observer
      const observer = Observer.create({
        type: 'wheel,touch',
        onChangeY: (self) => {
          const boost = Math.min(2.6, 1 + Math.abs(self.deltaY) * 0.015);
          if (tlOne) {
            gsap.to(tlOne, {
              timeScale: boost,
              duration: 0.25,
              overwrite: true,
              onComplete: () => {
                gsap.to(tlOne, { timeScale: 1, duration: 0.8 });
              },
            });
          }
          if (tlTwo) {
            gsap.to(tlTwo, {
              timeScale: boost,
              duration: 0.25,
              overwrite: true,
              onComplete: () => {
                gsap.to(tlTwo, { timeScale: 1, duration: 0.8 });
              },
            });
          }
        },
      });

      const el = sectionRef.current;
      const pauseAll = () => {
        tlOne?.pause();
        tlTwo?.pause();
      };
      const resumeAll = () => {
        tlOne?.play();
        tlTwo?.play();
      };

      const marqueeBox = el?.querySelector('.marquee-interactive-zone');
      marqueeBox?.addEventListener('mouseenter', pauseAll);
      marqueeBox?.addEventListener('mouseleave', resumeAll);

      return () => {
        observer.kill();
        marqueeBox?.removeEventListener('mouseenter', pauseAll);
        marqueeBox?.removeEventListener('mouseleave', resumeAll);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#111111] text-white py-24 lg:py-36 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[780px] h-[420px] rounded-full bg-[#B6FF4A]/[0.06] blur-[120px]"
      />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col items-start lg:items-center lg:text-center max-w-4xl lg:mx-auto mb-16 lg:mb-20">
          <p className="text-xs uppercase tracking-[0.18em] text-[#B6FF4A] mb-6">
            Start a Conversation
          </p>

          <SplitHeading
            as="h2"
            className="font-display font-medium tracking-[-0.035em] leading-[1.0] text-white uppercase mb-8"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
              textWrap: 'balance',
            }}
          >
            LET&apos;S SEE IF WE ARE A GOOD FIT.
          </SplitHeading>

          <p className="text-base sm:text-lg leading-[1.65] text-white/70 max-w-[50ch] mb-10">
            Tell us what you are building, where your current digital presence
            falls short, and what kind of growth you want to unlock next.
          </p>

          <MagneticButton
            onClick={onStartProject}
            className="px-8 py-4 rounded-full bg-[#B6FF4A] text-[#111111] hover:bg-[#c8ff75] font-semibold text-sm sm:text-base transition-colors gap-2.5"
          >
            <span>START A PROJECT</span>
            <ArrowUpRight className="w-4 h-4" />
          </MagneticButton>
        </div>
      </div>

      {/* Seamless Dual-Track GSAP Infinite Marquee */}
      <div className="marquee-interactive-zone border-y border-white/10 divide-y divide-white/10 select-none overflow-hidden">
        <div className="py-5 sm:py-7 overflow-hidden">
          <div
            ref={trackOneRef}
            className="flex items-center gap-12 sm:gap-16 w-max will-change-transform"
          >
            {[...TRACK_ONE_PHRASES, ...TRACK_ONE_PHRASES].map((phrase, idx) => (
              <span
                key={`t1-${idx}`}
                className={`font-display text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight whitespace-nowrap ${
                  idx % 2 === 1 ? 'text-[#B6FF4A]' : 'text-white/90'
                }`}
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>

        <div className="py-5 sm:py-7 overflow-hidden bg-[#151515]">
          <div
            ref={trackTwoRef}
            className="flex items-center gap-12 sm:gap-16 w-max will-change-transform"
          >
            {[...TRACK_TWO_PHRASES, ...TRACK_TWO_PHRASES].map((phrase, idx) => (
              <span
                key={`t2-${idx}`}
                className={`font-display text-2xl sm:text-4xl lg:text-5xl font-medium tracking-tight whitespace-nowrap ${
                  idx % 2 === 0 ? 'text-white/55' : 'text-white'
                }`}
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

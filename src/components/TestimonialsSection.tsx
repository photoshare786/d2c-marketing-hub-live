import { useState, useEffect, useRef, useCallback, type TouchEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { gsap, EASE_EDITORIAL, prefersReducedMotion } from '../lib/motion';
import { PARTNERSHIP_APPROACH_SLIDES } from '../data/agencyData';

const AUTO_SLIDE_INTERVAL_MS = 6000;

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteContainerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const reduced = prefersReducedMotion();
  const slides = PARTNERSHIP_APPROACH_SLIDES;
  const activeItem = slides[index];

  useEffect(() => {
    if (reduced || !quoteContainerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        quoteContainerRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: EASE_EDITORIAL,
          clearProps: 'transform',
          scrollTrigger: {
            trigger: quoteContainerRef.current,
            start: 'top 84%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  // Automatic 6-second rotation paused during hover or keyboard focus
  useEffect(() => {
    if (reduced || isPaused) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, AUTO_SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [index, isPaused, reduced, slides.length]);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsPaused(true);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    setIsPaused(false);
    if (!start) return;

    const touch = e.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;

    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: reduced ? 0 : dir > 0 ? 40 : -40,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: reduced ? 0 : dir > 0 ? -40 : 40,
    }),
  };

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      className="bg-white text-[#111111] py-24 lg:py-36 border-t border-black/10 overflow-x-clip"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-10 border-b border-black/10 mb-14 lg:mb-20">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#111111]/55">
              THE PARTNERSHIP PERSPECTIVE · OUR APPROACH
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="font-mono-num text-xs text-[#111111]/55 mr-2"
              aria-live="polite"
            >
              0{index + 1} / 0{slides.length}
            </span>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous approach principle"
              className="w-11 h-11 rounded-full border border-black/15 flex items-center justify-center hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next approach principle"
              className="w-11 h-11 rounded-full border border-black/15 flex items-center justify-center hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          className="max-w-5xl overflow-hidden"
          ref={quoteContainerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.blockquote
              key={activeItem.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
              <p
                className="font-display font-medium tracking-[-0.025em] leading-[1.22] text-[#111111]"
                style={{
                  fontSize: 'clamp(1.65rem, 3.4vw, 3rem)',
                  textWrap: 'balance',
                }}
              >
                {activeItem.quote}
              </p>

              <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-8 border-t border-black/10">
                <span className="font-mono-num text-xs uppercase tracking-[0.14em] text-[#111111]/45">
                  Principle {activeItem.number} · D2C Marketing Hub
                </span>

                <span className="text-xs uppercase tracking-[0.14em] font-medium text-[#111111]/65">
                  {activeItem.category}
                </span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

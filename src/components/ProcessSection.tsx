import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { PROCESS_STAGES } from '../data/agencyData';
import { SplitHeading } from './motion/SplitTypography';

const STAGE_VISUALS = [
  '/src/assets/images/process_01_research_1795078405406.jpg',
  '/src/assets/images/process_02_strategy_1795078428375.jpg',
  '/src/assets/images/process_03_design_1795078404705.jpg',
  '/src/assets/images/process_04_development_1795078405738.jpg',
  '/src/assets/images/process_05_optimization_1795078404761.jpg',
];

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const currentStage = PROCESS_STAGES[activeIndex];

  useEffect(() => {
    if (progressLineRef.current) {
      gsap.set(progressLineRef.current, {
        scaleX: (activeIndex + 1) / PROCESS_STAGES.length,
      });
    }
    // Initialize progress bar width on mount without conflicting inline transform during scrub
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || !pinRef.current) return;

    const mm = gsap.matchMedia();

    // Desktop (>= 1024px & sufficient viewport height): ScrollTrigger-driven horizontal timeline progression
    mm.add('(min-width: 1024px) and (min-height: 700px)', () => {
      const triggerEl = pinRef.current;
      if (!triggerEl) return;

      ScrollTrigger.create({
        trigger: triggerEl,
        start: 'top top',
        end: '+=2000',
        pin: true,
        pinSpacing: true,
        scrub: 0.4,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressLineRef.current) {
            gsap.set(progressLineRef.current, { scaleX: self.progress });
          }
          const idx = Math.min(
            PROCESS_STAGES.length - 1,
            Math.floor(self.progress * PROCESS_STAGES.length)
          );
          setActiveIndex(idx);
        },
      });
    });

    return () => mm.revert();
  }, []);

  const handleManualStageClick = (idx: number) => {
    setActiveIndex(idx);
    if (progressLineRef.current) {
      gsap.to(progressLineRef.current, {
        scaleX: (idx + 1) / PROCESS_STAGES.length,
        duration: 0.45,
        ease: 'power3.out',
      });
    }
  };

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative bg-[#101010] text-white overflow-x-clip"
    >
      <div
        ref={pinRef}
        className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-20 pb-14 lg:pt-[84px] lg:pb-6 lg:min-h-screen flex flex-col justify-center"
      >
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-5 border-b border-white/12 mb-5">
          <div className="lg:col-span-8">
            <p className="text-xs uppercase tracking-[0.16em] text-[#A4A8B0] mb-2">
              Our Process · Horizontal Timeline
            </p>
            <SplitHeading
              as="h2"
              className="font-display font-medium tracking-[-0.03em] leading-[1.06] text-white"
              style={{
                fontSize: 'clamp(1.85rem, 3.2vw, 3rem)',
                textWrap: 'balance',
              }}
            >
              Crafting Digital Growth, Step by Step.
            </SplitHeading>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-end">
            <p className="text-sm sm:text-base leading-[1.55] text-[#C8CBD0]">
              Five structured stages keep every brand, website, and acquisition
              campaign grounded in research and measurable iteration.
            </p>
          </div>
        </div>

        {/* Horizontal Timeline Track & Animated Progress Line */}
        <div className="mb-5">
          <div className="relative h-[2px] w-full bg-white/12 mb-3.5 overflow-hidden">
            <div
              ref={progressLineRef}
              className="h-full w-full bg-[#B4FF35] origin-left"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {PROCESS_STAGES.map((stage, idx) => {
              const isActive = idx === activeIndex;
              const isPassed = idx <= activeIndex;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => handleManualStageClick(idx)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`px-3.5 py-2.5 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#1B1B1B] border-[#B4FF35]/75 text-white'
                      : isPassed
                      ? 'bg-[#161616] border-white/15 text-[#D0D4DC] hover:border-white/30'
                      : 'bg-transparent border-white/8 text-[#8D929C] hover:text-white/85 hover:border-white/20'
                  }`}
                >
                  <span
                    className={`font-mono-num text-xs block mb-0.5 ${
                      isActive ? 'text-[#B4FF35]' : 'text-[#8D929C]'
                    }`}
                  >
                    {stage.number}
                  </span>
                  <span className="font-display text-base lg:text-[17px] font-medium block truncate">
                    {stage.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Crossfading Stage Details + Visual Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left: Stage Number Transition & Content Crossfade */}
          <div className="lg:col-span-7 rounded-2xl bg-[#1B1B1B] border border-white/10 p-5 sm:p-6 lg:p-7 flex flex-col justify-between min-h-[260px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStage.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-3.5 sm:space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-xs uppercase tracking-[0.14em] text-[#B4FF35]">
                    Stage {currentStage.number} of 05
                  </span>
                  <span className="text-xs text-[#A4A8B0]">
                    {currentStage.focusLabel}
                  </span>
                </div>

                <div className="flex items-baseline gap-3.5">
                  <span className="font-mono-num text-3xl sm:text-4xl font-medium text-[#B4FF35]">
                    {currentStage.number}.
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-white">
                    {currentStage.title}
                  </h3>
                </div>

                <p className="text-sm sm:text-base leading-[1.6] text-[#C8CBD0] max-w-[54ch]">
                  {currentStage.summary}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {currentStage.items.map((item, itemIdx) => (
                    <div
                      key={item}
                      className="px-3.5 py-2.5 rounded-xl bg-[#242424] border border-white/10 flex items-center justify-between gap-3 transition-colors duration-200 hover:border-[#B4FF35]/40"
                    >
                      <span className="text-sm font-medium text-white">
                        {item}
                      </span>
                      <span className="font-mono-num text-xs text-[#A4A8B0]">
                        0{itemIdx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Synchronized Stage Visual Preview */}
          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-white/10 bg-[#1B1B1B] relative min-h-[240px] lg:min-h-[260px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={STAGE_VISUALS[activeIndex]}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={STAGE_VISUALS[activeIndex]}
                  alt={`${currentStage.title} phase visual`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010]/88 via-[#101010]/20 to-transparent" />
                <div className="absolute bottom-5 left-6 right-6">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#B4FF35] mb-1">
                    {currentStage.focusLabel}
                  </p>
                  <p className="font-display text-xl font-medium text-white">
                    {currentStage.number}. {currentStage.title}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

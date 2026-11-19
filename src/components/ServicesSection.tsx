import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import {
  gsap,
  ScrollTrigger,
  EASE_CURTAIN,
  EASE_EDITORIAL,
  prefersReducedMotion,
} from '../lib/motion';
import { SERVICES_LIST } from '../data/agencyData';
import { ServiceVisualShowcase } from './ServiceVisualShowcase';
import { MagneticButton } from './MagneticButton';
import { SplitHeading } from './motion/SplitTypography';
import type { PortfolioFilter } from './PortfolioSection';

interface ServicesSectionProps {
  onSeeProjects: (filter: PortfolioFilter, projectId?: string) => void;
  onScrollToY?: (top: number) => void;
}

const STICKY_TOP_OFFSET = 84;
const STEP_BAND_HYSTERESIS = 0.05;

export function ServicesSection({
  onSeeProjects,
  onScrollToY,
}: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const detailStageRef = useRef<HTMLDivElement>(null);

  const [activeServiceId, setActiveServiceId] = useState<string>(SERVICES_LIST[0].id);
  const [hoveredCapability, setHoveredCapability] = useState<string | null>(null);
  const [isDesktopSticky, setIsDesktopSticky] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(min-width: 1024px) and (min-height: 640px)').matches;
  });

  const activeIndexRef = useRef<number>(0);
  const isDesktopStickyRef = useRef<boolean>(isDesktopSticky);
  const programmaticTargetRef = useRef<{ index: number; until: number } | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const catchupTimerRef = useRef<number | null>(null);

  const reduced = prefersReducedMotion();
  const activeService =
    SERVICES_LIST.find((s) => s.id === activeServiceId) ?? SERVICES_LIST[0];

  useEffect(() => {
    isDesktopStickyRef.current = isDesktopSticky;
  }, [isDesktopSticky]);

  // Track responsive desktop sticky eligibility
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(min-width: 1024px) and (min-height: 640px)');
    const updateMatch = () => {
      setIsDesktopSticky(mql.matches);
      ScrollTrigger.refresh();
    };
    updateMatch();
    mql.addEventListener('change', updateMatch);
    return () => mql.removeEventListener('change', updateMatch);
  }, []);

  // Preload all 12 service showcase images so scroll transitions render instantaneously
  useEffect(() => {
    SERVICES_LIST.forEach((service) => {
      const img = new Image();
      img.src = service.image;
    });
  }, []);

  const syncServiceFromScroll = useCallback((immediate = false) => {
    if (!isDesktopStickyRef.current) return;
    const runwayEl = runwayRef.current;
    const stageEl = stageRef.current;
    if (!runwayEl || !stageEl) return;

    const maxTravel = runwayEl.offsetHeight - stageEl.offsetHeight;
    if (maxTravel <= 20) return;

    const runwayRect = runwayEl.getBoundingClientRect();
    const rawScrolled = STICKY_TOP_OFFSET - runwayRect.top;
    const progress = Math.min(1, Math.max(0, rawScrolled / maxTravel));

    const total = SERVICES_LIST.length;
    const exactPos = progress * total;
    const targetIdx = Math.min(total - 1, Math.max(0, Math.floor(exactPos)));
    const currentIdx = activeIndexRef.current;

    // If user just clicked an index item, keep clicked item active until smooth scroll reaches its band
    const progTarget = programmaticTargetRef.current;
    if (progTarget) {
      if (Date.now() < progTarget.until && targetIdx !== progTarget.index) {
        return;
      }
      programmaticTargetRef.current = null;
    }

    if (targetIdx === currentIdx) return;

    if (!immediate) {
      if (targetIdx > currentIdx && exactPos < currentIdx + 1 + STEP_BAND_HYSTERESIS) {
        return;
      }
      if (targetIdx < currentIdx && exactPos > currentIdx - STEP_BAND_HYSTERESIS) {
        return;
      }
    }

    // Prevent skipping an adjacent service during rapid wheel flicks, while snapping cleanly on reloads or big jumps
    const delta = targetIdx - currentIdx;
    const nextIdx =
      !immediate && Math.abs(delta) === 2
        ? currentIdx + Math.sign(delta)
        : targetIdx;

    activeIndexRef.current = nextIdx;
    setHoveredCapability(null);
    setActiveServiceId(SERVICES_LIST[nextIdx].id);

    if (catchupTimerRef.current !== null) {
      window.clearTimeout(catchupTimerRef.current);
      catchupTimerRef.current = null;
    }
    if (nextIdx !== targetIdx) {
      catchupTimerRef.current = window.setTimeout(() => {
        catchupTimerRef.current = null;
        syncServiceFromScroll(true);
      }, 150);
    }
  }, []);

  // Scroll + Resize listener synced with rAF (works seamlessly with Lenis smooth wheel, trackpad, scrollbar & reload)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial sync on mount / reload
    syncServiceFromScroll(true);

    const scheduleSync = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null;
        syncServiceFromScroll(false);
      });
    };

    const handleResize = () => {
      syncServiceFromScroll(true);
      ScrollTrigger.refresh();
    };

    window.addEventListener('scroll', scheduleSync, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', scheduleSync);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (catchupTimerRef.current !== null) {
        window.clearTimeout(catchupTimerRef.current);
        catchupTimerRef.current = null;
      }
    };
  }, [syncServiceFromScroll, isDesktopSticky]);

  // Entrance reveal (opacity-only / clearProps transform so CSS position: sticky is never blocked)
  useEffect(() => {
    if (reduced || !detailStageRef.current) return;

    const ctx = gsap.context(() => {
      const el = detailStageRef.current;
      if (!el) return;

      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: EASE_EDITORIAL,
          clearProps: 'transform',
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            once: true,
          },
        }
      );

      const visualMask = el.querySelector<HTMLElement>('.service-visual-mask');
      if (visualMask) {
        gsap.fromTo(
          visualMask,
          { clipPath: 'inset(8% 0% 8% 0% round 16px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 16px)',
            duration: 0.85,
            ease: EASE_CURTAIN,
            clearProps: 'clipPath',
            scrollTrigger: {
              trigger: el,
              start: 'top 86%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  const handleSelectService = (id: string, idx: number) => {
    setHoveredCapability(null);
    activeIndexRef.current = idx;
    setActiveServiceId(id);

    // Sync desktop scroll runway to clicked service so subsequent scrolling stays sequential from this item
    if (isDesktopStickyRef.current && runwayRef.current && stageRef.current) {
      const runwayEl = runwayRef.current;
      const stageEl = stageRef.current;
      const maxTravel = runwayEl.offsetHeight - stageEl.offsetHeight;
      if (maxTravel > 20) {
        const runwayRect = runwayEl.getBoundingClientRect();
        const runwayDocTop = window.scrollY + runwayRect.top - STICKY_TOP_OFFSET;
        const targetProgress = (idx + 0.5) / SERVICES_LIST.length;
        const targetScrollY = runwayDocTop + targetProgress * maxTravel;

        programmaticTargetRef.current = {
          index: idx,
          until: Date.now() + 800,
        };

        if (onScrollToY) {
          onScrollToY(targetScrollY);
        } else {
          window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="bg-white text-[#111111] pt-24 lg:pt-32 pb-24 lg:pb-32 overflow-x-clip"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Editorial Services Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-black/10 mb-14 lg:mb-16">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.16em] text-[#111111]/55 mb-4">
              OUR SERVICES · 12 CORE DISCIPLINES
            </p>
            <SplitHeading
              as="h2"
              className="font-display font-medium tracking-[-0.03em] leading-[1.05] text-[#111111]"
              style={{
                fontSize: 'clamp(2.25rem, 4.6vw, 4.25rem)',
                textWrap: 'balance',
              }}
            >
              Everything Your Brand Needs to Grow. Built to Perform.
            </SplitHeading>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-end">
            <p className="text-base sm:text-[17px] leading-[1.65] text-[#111111]/75">
              From website development and SEO to branding, performance marketing
              and creative content, we bring every digital growth solution
              together under one roof.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Runway Wrapper (Desktop sticky scroll progression across all 12 services) */}
      <div
        ref={runwayRef}
        className={`relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 ${
          isDesktopSticky ? 'lg:min-h-[3480px]' : ''
        }`}
      >
        {/* Sticky Desktop Stage / Natural Responsive Container on Mobile & Tablet */}
        <div
          ref={stageRef}
          className={isDesktopSticky ? 'lg:sticky lg:top-[84px]' : ''}
        >
          {/* Interactive Master-Detail Showcase */}
          <div
            ref={detailStageRef}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
          >
            {/* Left: Clickable + Scroll-Synced 12-Service Index */}
            <aside className="hidden lg:block lg:col-span-3">
              <p className="text-xs uppercase tracking-[0.14em] text-[#111111]/50 mb-4">
                Service Index
              </p>
              <nav aria-label="Services index" className="space-y-1">
                {SERVICES_LIST.map((service, idx) => {
                  const isActive = activeService.id === service.id;
                  return (
                    <button
                      key={service.id}
                      id={`service-${service.id}`}
                      type="button"
                      aria-current={isActive ? 'true' : undefined}
                      onClick={() => handleSelectService(service.id, idx)}
                      className={`group/nav relative w-full text-left py-2.5 px-3 rounded-lg flex items-baseline gap-3 text-sm transition-colors duration-200 cursor-pointer scroll-mt-24 ${
                        isActive
                          ? 'text-white font-medium'
                          : 'text-[#111111]/65 hover:text-[#111111] hover:bg-black/[0.04]'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="active-service-pill"
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 36,
                          }}
                          className="absolute inset-0 rounded-lg bg-[#111111] -z-0"
                        />
                      )}
                      <span
                        className={`relative z-10 font-mono-num text-xs transition-colors duration-200 ${
                          isActive
                            ? 'text-[#A6FF35]'
                            : 'text-[#111111]/40 group-hover/nav:text-[#111111]'
                        }`}
                      >
                        {service.number}
                      </span>
                      <span className="relative z-10 truncate flex-1">
                        {service.title}
                      </span>
                      {!isActive && (
                        <span
                          aria-hidden="true"
                          className="relative z-10 w-1.5 h-1.5 rounded-full bg-[#A6FF35] opacity-0 transition-opacity duration-200 group-hover/nav:opacity-100 shrink-0 self-center"
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Mobile / Tablet Horizontal Selector */}
            <div
              role="tablist"
              aria-label="Select service discipline"
              className="lg:hidden -mx-5 px-5 overflow-x-auto pb-2 flex items-center gap-2"
            >
              {SERVICES_LIST.map((service, idx) => {
                const isActive = activeService.id === service.id;
                return (
                  <button
                    key={service.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleSelectService(service.id, idx)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#111111] text-white'
                        : 'bg-[#EBEBEB] text-[#111111]/75 hover:bg-[#E0E0E0]'
                    }`}
                  >
                    <span
                      className={`font-mono-num mr-1.5 ${
                        isActive ? 'text-[#A6FF35]' : 'text-[#111111]/45'
                      }`}
                    >
                      {service.number}
                    </span>
                    {service.title}
                  </button>
                );
              })}
            </div>

            {/* Center Content + Right Showcase Card */}
            <div className="lg:col-span-9">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Center: Dynamic Selected Service Details */}
                <div className="xl:col-span-6 lg:min-h-[470px]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={activeService.id}
                      initial={reduced ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col justify-between gap-7"
                    >
                      <div>
                        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-[#111111]/55 mb-3">
                          <span className="font-mono-num font-semibold text-[#111111]">
                            {activeService.number}
                          </span>
                          <span aria-hidden="true">/</span>
                          <span>{activeService.categoryLabel}</span>
                        </div>

                        <h3
                          className="font-display font-medium tracking-[-0.025em] leading-[1.1] text-[#111111] mb-4"
                          style={{
                            fontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
                            textWrap: 'balance',
                          }}
                        >
                          {activeService.title}
                        </h3>

                        <p className="text-base sm:text-[17px] leading-[1.65] text-[#111111]/75">
                          {activeService.description}
                        </p>
                      </div>

                      {/* Interactive Capabilities List */}
                      <div>
                        <p className="text-xs uppercase tracking-[0.14em] text-[#111111]/50 mb-3">
                          Capabilities
                        </p>
                        <ul className="divide-y divide-black/10 border-y border-black/10">
                          {activeService.capabilities.map((cap, capIdx) => {
                            const isRowHovered = hoveredCapability === cap;
                            return (
                              <li
                                key={cap}
                                onMouseEnter={() => setHoveredCapability(cap)}
                                onMouseLeave={() => setHoveredCapability(null)}
                                className={`py-3.5 px-2.5 -mx-2.5 rounded-lg flex items-center justify-between text-sm font-medium transition-all duration-200 cursor-default ${
                                  isRowHovered
                                    ? 'bg-[#111111] text-white translate-x-1'
                                    : 'text-[#111111] hover:bg-black/[0.03]'
                                }`}
                              >
                                <span>{cap}</span>
                                <span
                                  className={`font-mono-num text-xs transition-colors duration-200 ${
                                    isRowHovered
                                      ? 'text-[#A6FF35]'
                                      : 'text-[#111111]/40'
                                  }`}
                                >
                                  0{capIdx + 1}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <div className="pt-1">
                        <MagneticButton
                          onClick={() =>
                            onSeeProjects(
                              activeService.relatedFilter,
                              activeService.relatedProjectId
                            )
                          }
                          className="px-6 py-3 rounded-full bg-[#111111] text-white hover:bg-[#A6FF35] hover:text-[#111111] text-sm font-semibold transition-colors gap-2"
                        >
                          <span>See Projects</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </MagneticButton>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Right: Dynamic Black Showcase Card */}
                <div className="xl:col-span-6">
                  <div className="service-visual-mask will-change-transform">
                    <ServiceVisualShowcase
                      service={activeService}
                      hoveredCapability={hoveredCapability}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import { gsap, EASE_CURTAIN, prefersReducedMotion } from '../lib/motion';
import { CASE_STUDY_BLOCKS } from '../data/agencyData';
import { EditorialMedia } from './EditorialMedia';
import { MagneticButton } from './MagneticButton';
import { SplitHeading } from './motion/SplitTypography';

interface CaseStudySectionProps {
  onStartProject: () => void;
}

function CaseStudyHighlightRow({
  item,
  index,
}: {
  item: string;
  index: number;
}) {
  const parts = item.split(' | ');
  const isStructuredMetric = parts.length === 2;

  return (
    <li className="py-3.5 flex items-start sm:items-center justify-between gap-4 text-sm text-[#111111]">
      <div className="min-w-0">
        {isStructuredMetric ? (
          <>
            <span className="font-medium text-[#111111] block">
              {parts[0]}
            </span>
            <span className="text-xs text-[#111111]/55 block mt-0.5">
              {parts[1]}
            </span>
          </>
        ) : (
          <span className="font-medium leading-relaxed break-words">
            {item}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0 pt-0.5 sm:pt-0">
        {isStructuredMetric && (
          <span className="text-[11px] uppercase tracking-[0.1em] text-[#111111]/45 whitespace-nowrap">
            Editable Placeholder
          </span>
        )}
        <span className="font-mono-num text-xs text-[#111111]/40">
          0{index + 1}
        </span>
      </div>
    </li>
  );
}

export function CaseStudySection({ onStartProject }: CaseStudySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const visualMaskRef = useRef<HTMLDivElement>(null);
  const visualInnerRef = useRef<HTMLDivElement>(null);
  const [activeKey, setActiveKey] = useState<string>(CASE_STUDY_BLOCKS[0].key);
  const [isFullCaseStudyOpen, setIsFullCaseStudyOpen] = useState(false);

  const activeBlock =
    CASE_STUDY_BLOCKS.find((b) => b.key === activeKey) ?? CASE_STUDY_BLOCKS[0];

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (visualMaskRef.current && visualInnerRef.current) {
        gsap.fromTo(
          visualMaskRef.current,
          { clipPath: 'inset(10% 4% 10% 4% round 16px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 16px)',
            duration: 1.0,
            ease: EASE_CURTAIN,
            scrollTrigger: {
              trigger: visualMaskRef.current,
              start: 'top 84%',
              once: true,
            },
          }
        );

        gsap.fromTo(
          visualInnerRef.current,
          { scale: 1.1, yPercent: -4 },
          {
            scale: 1,
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: visualMaskRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullCaseStudyOpen(false);
      }
    };
    if (isFullCaseStudyOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullCaseStudyOpen]);

  return (
    <section
      ref={sectionRef}
      className="bg-[#F3F3F3] text-[#111111] py-24 lg:py-36 overflow-x-clip"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-black/10 mb-12 lg:mb-16">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#111111]/55 mb-4">
              Digital Campaign Showcase
            </p>
            <SplitHeading
              as="h2"
              className="font-display font-medium tracking-[-0.03em] leading-[1.06] text-[#111111] max-w-3xl"
              style={{
                fontSize: 'clamp(2.1rem, 4.3vw, 3.85rem)',
                textWrap: 'balance',
              }}
            >
              From Creative Concepts to Measurable Growth.
            </SplitHeading>
          </div>

          <p className="text-sm text-[#111111]/60 max-w-[40ch]">
            Explore how strategic thinking, creative execution, and performance-driven
            campaigns transform business challenges into measurable digital outcomes.
          </p>
        </div>

        {/* Full-Width Clip-Masked & Parallax Cinematic Visual */}
        <div
          ref={visualMaskRef}
          className="relative rounded-2xl overflow-hidden bg-[#111111] aspect-[16/9] lg:aspect-[21/9] mb-12 lg:mb-16"
        >
          <div ref={visualInnerRef} className="w-full h-full will-change-transform">
            <EditorialMedia
              src="/src/assets/images/campaign_showcase_hero_1795079747082.jpg"
              alt="Dark studio digital marketing campaign presentation featuring flagship product photography, desktop landing page, mobile paid social ads, and neon lime marketing analytics dashboard"
              className="w-full h-full"
              fallbackTitle="Building a Digital-First Brand Experience"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#101010]/90 via-[#101010]/25 to-transparent"
          />
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col lg:flex-row lg:items-end justify-between gap-4 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[#B4FF35] mb-1.5">
                DIGITAL CAMPAIGN CASE STUDY
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-medium">
                Building a Digital-First Brand Experience
              </h3>
            </div>
            <span className="text-xs text-white/75">
              Brand Strategy · Creative Direction · Digital Advertising · Conversion Optimization
            </span>
          </div>
        </div>

        {/* Interactive 5-Part Case Study Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div
            role="tablist"
            aria-label="Case study sections"
            className="lg:col-span-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0"
          >
            {CASE_STUDY_BLOCKS.map((block) => {
              const isActive = block.key === activeKey;
              return (
                <button
                  key={block.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveKey(block.key)}
                  className={`px-5 py-4 rounded-xl text-left transition-colors duration-200 whitespace-nowrap lg:whitespace-normal shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#111111] text-white'
                      : 'bg-white text-[#111111]/70 hover:text-[#111111] border border-black/8'
                  }`}
                >
                  <span
                    className={`block text-xs font-mono-num mb-1 ${
                      isActive ? 'text-[#B6FF4A]' : 'text-[#111111]/45'
                    }`}
                  >
                    {block.label}
                  </span>
                  <span className="font-display text-base font-medium block">
                    {block.key === 'overview'
                      ? 'Project Overview'
                      : block.key === 'challenge'
                      ? 'Challenge'
                      : block.key === 'solution'
                      ? 'Creative Solution'
                      : block.key === 'execution'
                      ? 'Execution'
                      : 'Results'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8 min-w-0">
            <div className="bg-white rounded-2xl border border-black/8 p-6 sm:p-10 lg:p-12 min-h-[380px] flex flex-col justify-between">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeBlock.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <p className="text-xs uppercase tracking-[0.14em] text-[#111111]/50">
                        {activeBlock.label}
                      </p>
                      {activeBlock.key === 'overview' && (
                        <span className="text-[11px] uppercase tracking-[0.14em] text-[#111111]/45 font-medium">
                          CONCEPTUAL CASE STUDY
                        </span>
                      )}
                    </div>
                    <h4 className="font-display text-2xl sm:text-3xl font-medium text-[#111111] leading-[1.18]">
                      {activeBlock.title}
                    </h4>
                  </div>

                  <p className="text-base sm:text-[17px] leading-[1.7] text-[#111111]/75 max-w-[62ch]">
                    {activeBlock.body}
                  </p>

                  <ul className="divide-y divide-black/10 border-y border-black/10">
                    {activeBlock.highlights.map((item, idx) => (
                      <CaseStudyHighlightRow key={item} item={item} index={idx} />
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>

              <div className="pt-8 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs leading-relaxed text-[#111111]/50 max-w-lg">
                  Conceptual Case Study — Demonstration Project. Metrics and brand
                  details are illustrative placeholders, not verified client results.
                </p>
                <MagneticButton
                  onClick={() => setIsFullCaseStudyOpen(true)}
                  className="px-6 py-3 rounded-full bg-[#111111] text-white hover:bg-[#B6FF4A] hover:text-[#111111] text-sm font-semibold transition-colors gap-2 shrink-0 self-start sm:self-auto"
                >
                  <span>View Full Case Study</span>
                  <ArrowUpRight className="w-4 h-4" />
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Case Study Editorial Modal */}
      <AnimatePresence>
        {isFullCaseStudyOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[#111111]/88 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto"
            onClick={() => setIsFullCaseStudyOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="full-case-study-title"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl bg-white text-[#111111] rounded-2xl overflow-hidden my-auto max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-black/10 px-6 sm:px-8 py-4 flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.14em] text-[#111111]/60">
                  Conceptual Case Study · Digital Campaign
                </span>
                <button
                  type="button"
                  onClick={() => setIsFullCaseStudyOpen(false)}
                  aria-label="Close full case study"
                  className="w-10 h-10 rounded-full bg-[#F3F3F3] hover:bg-[#111111] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 sm:p-8 lg:p-10 space-y-8">
                <div>
                  <h3
                    id="full-case-study-title"
                    className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#111111]"
                  >
                    Building a Digital-First Brand Experience
                  </h3>
                  <p className="text-sm text-[#111111]/60 mt-2">
                    Brand Strategy · Creative Direction · Digital Advertising · Conversion Optimization
                  </p>
                </div>

                <div className="rounded-xl overflow-hidden aspect-[16/9] bg-[#111111]">
                  <EditorialMedia
                    src="/src/assets/images/campaign_showcase_hero_1795079747082.jpg"
                    alt="Dark studio digital marketing campaign presentation featuring flagship product photography, desktop landing page, mobile paid social ads, and neon lime marketing analytics dashboard"
                    className="w-full h-full"
                    priority
                    fallbackTitle="Building a Digital-First Brand Experience"
                  />
                </div>

                <div className="space-y-8 pt-2">
                  {CASE_STUDY_BLOCKS.map((block) => (
                    <div
                      key={block.key}
                      className="rounded-xl border border-black/8 bg-[#F8F8F8] p-6 sm:p-8 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs uppercase tracking-[0.14em] text-[#111111]/55 font-mono-num">
                          {block.label}
                        </p>
                        {block.key === 'overview' && (
                          <span className="text-[11px] uppercase tracking-[0.14em] text-[#111111]/45 font-medium">
                            CONCEPTUAL CASE STUDY
                          </span>
                        )}
                      </div>
                      <h4 className="font-display text-xl sm:text-2xl font-medium text-[#111111]">
                        {block.title}
                      </h4>
                      <p className="text-sm sm:text-base leading-[1.7] text-[#111111]/75 max-w-[66ch]">
                        {block.body}
                      </p>
                      <ul className="divide-y divide-black/10 border-y border-black/10 pt-1">
                        {block.highlights.map((item, idx) => (
                          <CaseStudyHighlightRow key={item} item={item} index={idx} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-black/8">
                  <p className="text-xs text-[#111111]/50 max-w-lg">
                    Conceptual Case Study — Demonstration Project. Metrics and brand
                    details are illustrative placeholders, not verified client results.
                  </p>
                  <MagneticButton
                    onClick={() => {
                      setIsFullCaseStudyOpen(false);
                      onStartProject();
                    }}
                    className="px-6 py-3 rounded-full bg-[#111111] text-white hover:bg-[#B6FF4A] hover:text-[#111111] text-sm font-semibold transition-colors gap-2 shrink-0 self-start sm:self-auto"
                  >
                    <span>Start a Similar Project</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </MagneticButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

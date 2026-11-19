import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  gsap,
  SplitText,
  EASE_CURTAIN,
  EASE_EDITORIAL,
  EASE_EXPO,
  prefersReducedMotion,
} from '../lib/motion';
import { EditorialMedia } from './EditorialMedia';
import { MagneticButton } from './MagneticButton';
import { SplitHeading } from './motion/SplitTypography';

interface AboutSectionProps {
  onNavigateServices: () => void;
}

interface ExpertisePillar {
  number: string;
  title: string;
  description: string;
}

const EXPERTISE_PILLARS: ExpertisePillar[] = [
  {
    number: '01',
    title: 'Digital Strategy',
    description:
      'We build data-driven strategies, market positioning and growth roadmaps that turn business goals into measurable digital success.',
  },
  {
    number: '02',
    title: 'Creative Excellence',
    description:
      'From distinctive brand identities to engaging campaigns and content, we create digital experiences that make brands unforgettable.',
  },
  {
    number: '03',
    title: 'Technology & Performance',
    description:
      'We combine SEO, web development, paid advertising and conversion optimization to build scalable digital growth engines.',
  },
];

export function AboutSection({ onNavigateServices }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const mediaMaskRef = useRef<HTMLDivElement>(null);
  const mediaInnerRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    let statementSplit: SplitText | null = null;
    const ctx = gsap.context(() => {
      // Animated hairline dividers across the section
      const dividers = gsap.utils.toArray<HTMLElement>('.about-divider-line');
      dividers.forEach((line, index) => {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.95,
            delay: index * 0.06,
            ease: EASE_CURTAIN,
            transformOrigin: 'left center',
            scrollTrigger: {
              trigger: line,
              start: 'top 88%',
              once: true,
            },
          }
        );
      });

      // Clean line-by-line masked reveal for the manifesto paragraph (preserves crisp contrast & #B5FF3D highlights)
      if (statementRef.current) {
        statementSplit = SplitText.create(statementRef.current, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 108,
              opacity: 0,
              duration: 0.85,
              stagger: 0.09,
              ease: EASE_EXPO,
              scrollTrigger: {
                trigger: statementRef.current,
                start: 'top 85%',
                once: true,
              },
            });
          },
        });
      }

      // Left studio visual clip-path reveal + subtle scrubbed parallax
      if (mediaMaskRef.current && mediaInnerRef.current) {
        gsap.fromTo(
          mediaMaskRef.current,
          { clipPath: 'inset(12% 0% 12% 0% round 16px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 16px)',
            duration: 1.05,
            ease: EASE_CURTAIN,
            scrollTrigger: {
              trigger: mediaMaskRef.current,
              start: 'top 82%',
              once: true,
            },
          }
        );

        gsap.fromTo(
          mediaInnerRef.current,
          { scale: 1.12, yPercent: -4 },
          {
            scale: 1,
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }

      // Right column staggered editorial entrance
      if (rightColRef.current) {
        gsap.fromTo(
          rightColRef.current.children,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: EASE_EDITORIAL,
            scrollTrigger: {
              trigger: rightColRef.current,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }

      // Three expertise pillars staggered upward text reveal
      if (pillarsRef.current) {
        const items = pillarsRef.current.querySelectorAll<HTMLElement>('.about-pillar-item');
        const texts = pillarsRef.current.querySelectorAll<HTMLElement>('.about-pillar-reveal');

        if (items.length > 0) {
          gsap.fromTo(
            items,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.12,
              ease: EASE_EXPO,
              scrollTrigger: {
                trigger: pillarsRef.current,
                start: 'top 84%',
                once: true,
              },
            }
          );
        }

        if (texts.length > 0) {
          gsap.fromTo(
            texts,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.72,
              stagger: 0.06,
              ease: EASE_EDITORIAL,
              scrollTrigger: {
                trigger: pillarsRef.current,
                start: 'top 82%',
                once: true,
              },
            }
          );
        }
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      statementSplit?.revert();
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-[#111111] text-white py-24 lg:py-36 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Top Minimal Eyebrow Bar */}
        <div className="mb-12 lg:mb-14">
          <div className="flex items-center justify-between pb-6">
            <span className="text-xs uppercase tracking-[0.16em] text-[#C8CBD0]">
              About D2C Marketing Hub
            </span>
            <span className="text-xs text-[#9EA3AE] hidden sm:inline">
              Creative Intelligence · Measurable Growth
            </span>
          </div>
          <div
            aria-hidden="true"
            className="about-divider-line h-[1px] w-full bg-white/15"
          />
        </div>

        {/* Oversized SplitText Editorial Headline */}
        <SplitHeading
          as="h2"
          className="font-display font-medium tracking-[-0.03em] leading-[1.04] text-white max-w-5xl mb-10 lg:mb-14"
          style={{
            fontSize: 'clamp(2.25rem, 5vw, 4.75rem)',
            textWrap: 'balance',
          }}
        >
          In a world full of digital noise, we create experiences that make
          brands stand out.
        </SplitHeading>

        {/* High-Contrast Manifesto Statement with Lime Highlights */}
        <div className="mb-16 lg:mb-24">
          <p
            ref={statementRef}
            className="font-display text-xl sm:text-2xl lg:text-[30px] leading-[1.42] text-[#D8DBE0] max-w-4xl pb-12"
          >
            Most digital work happens in disconnected pieces. We bring{' '}
            <span className="text-[#B5FF3D] font-medium">strategy</span>,{' '}
            <span className="text-[#B5FF3D] font-medium">creativity</span>,{' '}
            <span className="text-[#B5FF3D] font-medium">technology</span>, and{' '}
            <span className="text-[#B5FF3D] font-medium">performance</span>{' '}
            together to build digital experiences that move{' '}
            <span className="text-white font-medium">businesses forward</span>.
          </p>
          <div
            aria-hidden="true"
            className="about-divider-line h-[1px] w-full bg-white/12"
          />
        </div>

        {/* Asymmetrical Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7">
            <div
              ref={mediaMaskRef}
              className="group rounded-2xl overflow-hidden border border-white/10"
            >
              <div ref={mediaInnerRef} className="will-change-transform">
                <EditorialMedia
                  src="/src/assets/images/about_agency_workspace_1795077023230.jpg"
                  alt="Dark charcoal digital marketing agency workstation displaying SEO analytics dashboards, keyword performance graphs, advertising metrics, website preview, and creative branding elements with electric lime accents"
                  className="aspect-[4/3] w-full"
                  imgClassName="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
                  fallbackTitle="D2C Marketing Hub Digital Workspace"
                />
              </div>
            </div>
          </div>

          <div
            ref={rightColRef}
            className="lg:col-span-5 flex flex-col gap-7 lg:pl-4"
          >
            <h3 className="font-display text-2xl sm:text-[28px] leading-[1.28] font-medium tracking-[-0.02em] text-white">
              Your Brand Deserves More Than Just Digital Presence.
            </h3>

            <p className="text-base leading-[1.7] text-[#C8CBD0]">
              We combine creative thinking, digital strategy and advanced
              technology to build powerful brand experiences. From website
              development and SEO to performance marketing and logistics
              solutions, we turn business ambitions into measurable growth.
            </p>

            <div className="pt-5 border-t border-white/12 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="group relative pt-3 border-t border-white/15 transition-colors duration-300 hover:border-[#B5FF3D]/70">
                <span
                  aria-hidden="true"
                  className="absolute -top-[1px] left-0 h-[1px] w-0 bg-[#B5FF3D] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"
                />
                <p className="text-sm font-semibold text-white mb-1.5 transition-colors duration-300 group-hover:text-[#B5FF3D]">
                  Creative Excellence
                </p>
                <p className="text-sm text-[#A6AAB3] leading-relaxed transition-colors duration-300 group-hover:text-[#D0D4DC]">
                  Building distinctive brand identities and digital experiences.
                </p>
              </div>
              <div className="group relative pt-3 border-t border-white/15 transition-colors duration-300 hover:border-[#B5FF3D]/70">
                <span
                  aria-hidden="true"
                  className="absolute -top-[1px] left-0 h-[1px] w-0 bg-[#B5FF3D] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"
                />
                <p className="text-sm font-semibold text-white mb-1.5 transition-colors duration-300 group-hover:text-[#B5FF3D]">
                  Performance Driven
                </p>
                <p className="text-sm text-[#A6AAB3] leading-relaxed transition-colors duration-300 group-hover:text-[#D0D4DC]">
                  Data-led strategies focused on visibility, engagement and conversions.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <MagneticButton
                onClick={onNavigateServices}
                className="px-6 py-3.5 rounded-full bg-white text-[#111111] hover:bg-[#B5FF3D] font-semibold text-sm transition-colors gap-2"
              >
                <span>Explore Our Capabilities</span>
                <ArrowUpRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Three Minimal Editorial Expertise Pillars */}
        <div ref={pillarsRef} className="mt-20 lg:mt-28">
          <div className="mb-10 flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.16em] text-[#9EA3AE]">
              Core Disciplines
            </span>
            <span className="text-xs text-[#9EA3AE] font-mono-num">
              01 — 03
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 items-stretch">
            {EXPERTISE_PILLARS.map((pillar) => (
              <button
                key={pillar.number}
                type="button"
                onClick={onNavigateServices}
                className="about-pillar-item group flex flex-col justify-between text-left pt-7 pb-6 relative cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B5FF3D]"
              >
                {/* Animated Top Hairline Border + Lime Hover Accent Sweep */}
                <span
                  aria-hidden="true"
                  className="about-divider-line absolute top-0 left-0 right-0 h-[1px] bg-white/15"
                />
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 h-[1px] w-0 bg-[#B5FF3D] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"
                />

                <div className="w-full">
                  <div className="about-pillar-reveal flex items-center justify-between mb-5">
                    <span className="font-mono-num text-xs tracking-[0.14em] text-[#9EA3AE] transition-colors duration-300 group-hover:text-[#B5FF3D]">
                      {pillar.number}
                    </span>

                    {/* Subtle Dual-Arrow Hover Motion */}
                    <span
                      aria-hidden="true"
                      className="relative inline-flex w-4 h-4 overflow-hidden text-white/60 transition-colors duration-300 group-hover:text-[#B5FF3D]"
                    >
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[120%] group-hover:-translate-y-[120%]" />
                      <ArrowUpRight className="w-4 h-4 absolute inset-0 -translate-x-[120%] translate-y-[120%] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
                    </span>
                  </div>

                  <h3 className="about-pillar-reveal font-display text-2xl sm:text-[26px] font-medium tracking-[-0.02em] text-white mb-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-[#B5FF3D]">
                    {pillar.title}
                  </h3>

                  <p className="about-pillar-reveal text-sm sm:text-[15px] leading-[1.68] text-[#B5B9C2] transition-colors duration-300 group-hover:text-[#E2E5EB]">
                    {pillar.description}
                  </p>
                </div>

                {/* Subtle Bottom Hairline & Lime Hover Accent Line */}
                <span
                  aria-hidden="true"
                  className="relative block w-full h-[1px] bg-white/10 mt-7 overflow-hidden"
                >
                  <span className="block h-full w-0 bg-[#B5FF3D]/70 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

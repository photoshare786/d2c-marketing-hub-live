import { useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  gsap,
  SplitText,
  Observer,
  EASE_EXPO,
  EASE_CURTAIN,
  EASE_EDITORIAL,
  prefersReducedMotion,
} from '../lib/motion';
import { MagneticButton } from './MagneticButton';
import { EditorialMedia } from './EditorialMedia';

interface HeroProps {
  onStartProject: () => void;
  onExploreWork: () => void;
  introComplete: boolean;
}

export function Hero({ onStartProject, onExploreWork, introComplete }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const heroTextParallaxRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const visualMaskRef = useRef<HTMLDivElement>(null);
  const visualParallaxRef = useRef<HTMLDivElement>(null);
  const visualImgInnerRef = useRef<HTMLDivElement>(null);
  const visualMouseImgRef = useRef<HTMLDivElement>(null);
  const slowMotionCamRef = useRef<HTMLDivElement>(null);
  const floatPlaneLeftRef = useRef<HTMLDivElement>(null);
  const floatPlaneRightRef = useRef<HTMLDivElement>(null);
  const dataConnectionsRef = useRef<SVGSVGElement>(null);
  const floatingCaptionRef = useRef<HTMLDivElement>(null);
  const floatingCaptionMouseRef = useRef<HTMLDivElement>(null);
  const propositionRef = useRef<HTMLDivElement>(null);

  // Coordinated GSAP SplitText + Clip-Path Entrance + Scroll Experience
  useEffect(() => {
    if (!introComplete || prefersReducedMotion() || !sectionRef.current) return;

    let headlineSplit: SplitText | null = null;
    let descSplit: SplitText | null = null;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.05 });

      // 1. Small label fades and slides into position
      if (labelRef.current) {
        tl.fromTo(
          labelRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.65, ease: EASE_EXPO },
          0
        );
      }

      // 2 & 3. SplitText line-by-line clipped mask reveal:
      // White lines glide smoothly; final lime green line has a slightly more dramatic entrance.
      if (headlineRef.current) {
        headlineSplit = SplitText.create(headlineRef.current, {
          type: 'lines,words',
          mask: 'lines',
        });

        const whiteLines: Element[] = [];
        const limeLines: Element[] = [];

        headlineSplit.lines.forEach((line) => {
          if (line.querySelector('.hero-lime-accent') || line.closest('.hero-lime-accent')) {
            limeLines.push(line);
          } else {
            whiteLines.push(line);
          }
        });

        if (whiteLines.length > 0) {
          tl.from(
            whiteLines,
            {
              yPercent: 112,
              opacity: 0,
              duration: 0.92,
              stagger: 0.095,
              ease: EASE_EXPO,
            },
            0.08
          );
        }

        if (limeLines.length > 0) {
          const limeWords = limeLines.flatMap((line) =>
            Array.from(line.querySelectorAll('div, span')).filter(
              (el) => el.textContent && el.children.length === 0
            )
          );

          tl.from(
            limeLines,
            {
              yPercent: 132,
              skewY: 2.2,
              scale: 1.04,
              opacity: 0,
              duration: 1.15,
              stagger: 0.08,
              ease: EASE_EXPO,
              transformOrigin: 'left bottom',
            },
            0.28
          );

          if (limeWords.length > 0) {
            tl.from(
              limeWords,
              {
                y: 16,
                duration: 0.85,
                stagger: 0.045,
                ease: EASE_EXPO,
              },
              0.32
            );
          }
        } else {
          tl.from(
            headlineSplit.lines,
            {
              yPercent: 112,
              opacity: 0,
              duration: 0.95,
              stagger: 0.1,
              ease: EASE_EXPO,
            },
            0.08
          );
        }
      }

      // 4. Supporting description enters through line mask
      if (descRef.current) {
        descSplit = SplitText.create(descRef.current, {
          type: 'lines',
          mask: 'lines',
        });
        tl.from(
          descSplit.lines,
          {
            yPercent: 108,
            opacity: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: EASE_EDITORIAL,
          },
          0.3
        );
      }

      // 5. CTA buttons reveal with slight upward movement
      if (ctasRef.current) {
        const buttons = ctasRef.current.children;
        tl.fromTo(
          buttons,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.09,
            ease: EASE_EXPO,
          },
          0.42
        );
      }

      // 6. Main studio visual reveals via smooth clip-path + scale settle
      if (visualMaskRef.current && visualImgInnerRef.current) {
        tl.fromTo(
          visualMaskRef.current,
          {
            clipPath: 'inset(12% 6% 12% 6% round 20px)',
            opacity: 0,
          },
          {
            clipPath: 'inset(0% 0% 0% 0% round 16px)',
            opacity: 1,
            duration: 1.1,
            ease: EASE_CURTAIN,
          },
          0.2
        ).fromTo(
          visualImgInnerRef.current,
          { scale: 1.12 },
          { scale: 1.0, duration: 1.3, ease: EASE_EXPO },
          0.2
        );
      }

      // Subtle slow-motion parallax camera movement on 3D digital ecosystem
      if (slowMotionCamRef.current) {
        gsap.fromTo(
          slowMotionCamRef.current,
          { scale: 1.01, xPercent: -0.6, yPercent: -0.35 },
          {
            scale: 1.065,
            xPercent: 0.6,
            yPercent: 0.45,
            duration: 18,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }
        );
      }

      // Subtle floating 3D planes & gentle rotation
      if (floatPlaneLeftRef.current) {
        gsap.set(floatPlaneLeftRef.current, { transformPerspective: 900 });
        gsap.to(floatPlaneLeftRef.current, {
          y: -8,
          rotationY: 4,
          rotationX: -2,
          duration: 5.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      if (floatPlaneRightRef.current) {
        gsap.set(floatPlaneRightRef.current, { transformPerspective: 900 });
        gsap.to(floatPlaneRightRef.current, {
          y: 7,
          rotationY: -4,
          rotationX: 2,
          duration: 6.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.6,
        });
      }

      // Subtle glowing data connection flow along ecosystem curves
      if (dataConnectionsRef.current) {
        const paths = dataConnectionsRef.current.querySelectorAll<SVGPathElement>(
          '.hero-data-pulse'
        );
        paths.forEach((path, idx) => {
          gsap.fromTo(
            path,
            { strokeDashoffset: 180 },
            {
              strokeDashoffset: -180,
              duration: 5.2 + idx * 1.1,
              repeat: -1,
              ease: 'none',
            }
          );
        });
      }

      // 7. Floating editorial caption begins subtle ambient float
      if (floatingCaptionRef.current) {
        tl.fromTo(
          floatingCaptionRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, ease: EASE_EDITORIAL },
          0.56
        );

        gsap.to(floatingCaptionRef.current, {
          y: -6,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1.2,
        });
      }

      // Bottom proposition items stagger
      if (propositionRef.current) {
        tl.fromTo(
          propositionRef.current.children,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: EASE_EDITORIAL },
          0.54
        );
      }

      // Responsive Scroll Experience: Differential parallax between text and image + smooth exit into next section
      mm.add('(min-width: 1024px)', () => {
        if (heroTextParallaxRef.current) {
          gsap.to(heroTextParallaxRef.current, {
            y: -32,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }

        if (visualImgInnerRef.current) {
          gsap.to(visualImgInnerRef.current, {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }

        if (visualMaskRef.current) {
          gsap.to(visualMaskRef.current, {
            scale: 0.985,
            opacity: 0.72,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: '62% top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }

        if (propositionRef.current) {
          gsap.to(propositionRef.current, {
            y: -16,
            opacity: 0.45,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: '65% top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      });

      mm.add('(max-width: 1023px)', () => {
        if (heroTextParallaxRef.current) {
          gsap.to(heroTextParallaxRef.current, {
            y: -12,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }

        if (visualImgInnerRef.current) {
          gsap.to(visualImgInnerRef.current, {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      });
    }, sectionRef);

    return () => {
      mm.revert();
      ctx.revert();
      headlineSplit?.revert();
      descSplit?.revert();
    };
  }, [introComplete]);

  // Constrained multi-plane mouse parallax & GSAP Observer perspective depth (desktop only)
  useEffect(() => {
    if (
      prefersReducedMotion() ||
      !visualParallaxRef.current ||
      !visualMouseImgRef.current ||
      !sectionRef.current
    ) {
      return;
    }

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px) and (pointer: fine)', () => {
      const frame = visualParallaxRef.current;
      const imgLayer = visualMouseImgRef.current;
      const captionLayer = floatingCaptionMouseRef.current;
      if (!frame || !imgLayer) return;

      gsap.set(frame, { transformPerspective: 1400, transformStyle: 'preserve-3d' });
      gsap.set(imgLayer, { scale: 1.045 });

      const frameX = gsap.quickTo(frame, 'x', { duration: 0.85, ease: 'power3.out' });
      const frameY = gsap.quickTo(frame, 'y', { duration: 0.85, ease: 'power3.out' });
      const rxTo = gsap.quickTo(frame, 'rotationX', { duration: 0.9, ease: 'power3.out' });
      const ryTo = gsap.quickTo(frame, 'rotationY', { duration: 0.9, ease: 'power3.out' });

      const imgX = gsap.quickTo(imgLayer, 'x', { duration: 0.72, ease: 'power3.out' });
      const imgY = gsap.quickTo(imgLayer, 'y', { duration: 0.72, ease: 'power3.out' });

      const capX = captionLayer
        ? gsap.quickTo(captionLayer, 'x', { duration: 0.78, ease: 'power3.out' })
        : null;
      const capY = captionLayer
        ? gsap.quickTo(captionLayer, 'y', { duration: 0.78, ease: 'power3.out' })
        : null;

      const clamp = gsap.utils.clamp(-0.5, 0.5);

      const observer = Observer.create({
        target: sectionRef.current,
        type: 'pointer',
        onMove: (self) => {
          const rect = sectionRef.current?.getBoundingClientRect();
          if (!rect || self.x === undefined || self.y === undefined) return;
          const normX = clamp((self.x - rect.left) / rect.width - 0.5);
          const normY = clamp((self.y - rect.top) / rect.height - 0.5);

          frameX(normX * -9);
          frameY(normY * -7);
          ryTo(normX * 2.0);
          rxTo(normY * -1.5);

          imgX(normX * -18);
          imgY(normY * -12);

          capX?.(normX * 9);
          capY?.(normY * 5);
        },
      });

      const handleMouseLeave = () => {
        frameX(0);
        frameY(0);
        rxTo(0);
        ryTo(0);
        imgX(0);
        imgY(0);
        capX?.(0);
        capY?.(0);
      };

      const el = sectionRef.current;
      el?.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        observer.kill();
        el?.removeEventListener('mouseleave', handleMouseLeave);
        gsap.set(imgLayer, { clearProps: 'transform' });
        gsap.set(frame, { clearProps: 'transform' });
        if (captionLayer) gsap.set(captionLayer, { clearProps: 'transform' });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative bg-[#111111] text-white pt-28 sm:pt-32 lg:pt-40 pb-16 lg:pb-24 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Editorial Text Block with subtle differential scroll parallax */}
        <div ref={heroTextParallaxRef} className="will-change-transform">
          {/* Editorial Kicker */}
          <div
            ref={labelRef}
            className="mb-8 lg:mb-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-[13px] tracking-[0.16em] uppercase text-white/65"
          >
            <span>Digital Strategy</span>
            <span aria-hidden="true" className="text-[#B6FF4A]">/</span>
            <span>Creative</span>
            <span aria-hidden="true" className="text-[#B6FF4A]">/</span>
            <span>Technology</span>
          </div>

          {/* Oversized Editorial Headline + Description + CTAs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-12 lg:mb-16">
            <div className="lg:col-span-8">
              <h1
                ref={headlineRef}
                className="font-display font-medium tracking-[-0.03em] leading-[1.02] text-white"
                style={{
                  fontSize: 'clamp(2.5rem, 5.8vw, 5.25rem)',
                  textWrap: 'balance',
                }}
              >
                We create digital experiences that make brands{' '}
                <span className="hero-lime-accent text-[#B6FF4A]">
                  impossible to ignore.
                </span>
              </h1>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-7">
              <p
                ref={descRef}
                className="text-base sm:text-[17px] leading-[1.65] text-white/75 max-w-[46ch]"
              >
                We combine strategic thinking, creative design and digital technology
                to transform businesses into memorable brands and accelerate their
                growth.
              </p>

              <div ref={ctasRef} className="flex flex-wrap items-center gap-4">
                <MagneticButton
                  onClick={onStartProject}
                  strength={0.3}
                  className="group px-6 py-3.5 rounded-full bg-[#B6FF4A] text-[#111111] font-semibold text-sm hover:bg-[#c8ff75] transition-colors gap-2"
                >
                  <span>Start a Project</span>
                  <span
                    aria-hidden="true"
                    className="relative inline-flex items-center justify-center w-4 h-4 overflow-hidden"
                  >
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4 group-hover:-translate-y-4" />
                    <ArrowUpRight className="w-4 h-4 absolute -translate-x-4 translate-y-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
                  </span>
                </MagneticButton>

                <MagneticButton
                  onClick={onExploreWork}
                  strength={0.28}
                  className="group px-6 py-3.5 rounded-full border border-white/25 text-white text-sm font-medium hover:border-white hover:bg-white/5 transition-colors gap-2"
                >
                  <span>Explore Our Work</span>
                  <span
                    aria-hidden="true"
                    className="relative inline-flex items-center justify-center w-4 h-4 overflow-hidden text-[#B6FF4A]"
                  >
                    <ArrowDownRight className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4 group-hover:translate-y-4" />
                    <ArrowDownRight className="w-4 h-4 absolute -translate-x-4 -translate-y-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
                  </span>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Clip-Masked + Slow-Motion Cinema + Parallax Studio Visual */}
        <div ref={visualParallaxRef} className="will-change-transform">
          <div
            ref={visualMaskRef}
            className="relative rounded-2xl overflow-hidden border border-white/10"
          >
            <div
              ref={visualImgInnerRef}
              className="w-full aspect-[16/9] lg:aspect-[21/9] will-change-transform"
            >
              <div ref={visualMouseImgRef} className="w-full h-full will-change-transform">
                <div ref={slowMotionCamRef} className="w-full h-full will-change-transform">
                  <EditorialMedia
                    src="/src/assets/images/hero_seo_marketing_3d_1795074702815.jpg"
                    alt="D2C Marketing Hub 3D digital marketing and SEO growth ecosystem featuring glassmorphism analytics dashboard, floating web browser windows, and mobile campaign showcase"
                    className="w-full h-full"
                    priority
                    fallbackTitle="D2C Marketing Hub Digital Growth Ecosystem"
                  />
                </div>
              </div>
            </div>

            {/* Subtle Glowing Data Connection Curves */}
            <svg
              ref={dataConnectionsRef}
              aria-hidden="true"
              viewBox="0 0 1200 520"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 w-full h-full opacity-55 mix-blend-screen"
            >
              <path
                d="M 210 215 C 310 215, 330 250, 410 250"
                fill="none"
                stroke="#B6FF4A"
                strokeWidth="1.5"
                strokeDasharray="44 136"
                strokeLinecap="round"
                className="hero-data-pulse"
              />
              <path
                d="M 225 325 C 315 325, 340 270, 415 265"
                fill="none"
                stroke="rgba(255,255,255,0.65)"
                strokeWidth="1.2"
                strokeDasharray="36 144"
                strokeLinecap="round"
                className="hero-data-pulse"
              />
              <path
                d="M 790 255 C 865 255, 895 230, 965 230"
                fill="none"
                stroke="#B6FF4A"
                strokeWidth="1.5"
                strokeDasharray="48 132"
                strokeLinecap="round"
                className="hero-data-pulse"
              />
              <path
                d="M 785 280 C 860 285, 895 340, 965 340"
                fill="none"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1.2"
                strokeDasharray="40 140"
                strokeLinecap="round"
                className="hero-data-pulse"
              />
            </svg>

            {/* Subtle Floating Foreground Glass Depth Planes */}
            <div
              ref={floatPlaneLeftRef}
              aria-hidden="true"
              className="pointer-events-none hidden md:block absolute top-7 left-7 w-40 h-20 rounded-xl border border-white/15 bg-white/[0.03] backdrop-blur-[2px] shadow-[0_12px_40px_rgba(0,0,0,0.4)] will-change-transform"
            >
              <div className="p-3 h-full flex flex-col justify-between">
                <div className="h-[1px] w-10 bg-[#B6FF4A]/70" />
                <div className="space-y-1.5">
                  <div className="h-1 w-24 rounded-full bg-white/20" />
                  <div className="h-1 w-16 rounded-full bg-white/12" />
                </div>
              </div>
            </div>

            <div
              ref={floatPlaneRightRef}
              aria-hidden="true"
              className="pointer-events-none hidden md:block absolute top-8 right-8 w-44 h-24 rounded-xl border border-white/12 bg-white/[0.025] backdrop-blur-[2px] shadow-[0_12px_40px_rgba(0,0,0,0.4)] will-change-transform"
            >
              <div className="p-3.5 h-full flex flex-col justify-between">
                <div className="flex items-end gap-1.5 h-8">
                  <span className="w-1.5 h-3 rounded-sm bg-white/15" />
                  <span className="w-1.5 h-4 rounded-sm bg-white/25" />
                  <span className="w-1.5 h-6 rounded-sm bg-white/35" />
                  <span className="w-1.5 h-7 rounded-sm bg-[#B6FF4A]/75" />
                  <span className="w-1.5 h-8 rounded-sm bg-[#B6FF4A]" />
                </div>
                <div className="h-[1px] w-full bg-white/15" />
              </div>
            </div>

            {/* Measured contrast scrim */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111111]/85 via-[#111111]/20 to-transparent"
            />

            <div
              ref={floatingCaptionRef}
              className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10"
            >
              <div
                ref={floatingCaptionMouseRef}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 will-change-transform"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/65 mb-1.5">
                    D2C Marketing Hub
                  </p>
                  <p className="font-display text-lg sm:text-xl lg:text-2xl font-medium text-white">
                    Your Digital Growth. Our Creative Intelligence.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onExploreWork}
                  className="group self-start sm:self-auto inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-white/85 hover:text-[#B6FF4A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Scroll to Selected Work</span>
                  <span
                    aria-hidden="true"
                    className="relative inline-flex items-center justify-center w-4 h-4 overflow-hidden"
                  >
                    <ArrowDownRight className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4 group-hover:translate-y-4" />
                    <ArrowDownRight className="w-4 h-4 absolute -translate-x-4 -translate-y-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Proposition Strip */}
        <div
          ref={propositionRef}
          className="mt-10 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm"
        >
          <div>
            <p className="text-white/45 text-xs uppercase tracking-[0.12em] mb-1">
              Discipline 01
            </p>
            <p className="text-white/90 font-medium">
              Brand Systems & Creative Direction
            </p>
          </div>
          <div>
            <p className="text-white/45 text-xs uppercase tracking-[0.12em] mb-1">
              Discipline 02
            </p>
            <p className="text-white/90 font-medium">
              High-Performing Websites & E-Commerce
            </p>
          </div>
          <div>
            <p className="text-white/45 text-xs uppercase tracking-[0.12em] mb-1">
              Discipline 03
            </p>
            <p className="text-white/90 font-medium">
              Acquisition Funnels & Conversion Optimization
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

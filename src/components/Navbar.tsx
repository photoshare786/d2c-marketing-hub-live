import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { gsap, EASE_EXPO, prefersReducedMotion } from '../lib/motion';
import { MagneticButton } from './MagneticButton';

interface NavbarProps {
  onNavigateSection: (sectionId: string, label?: string) => void;
  onStartProject: () => void;
  introComplete: boolean;
}

const NAV_LINKS = [
  { label: 'Work', target: 'work' },
  { label: 'Services', target: 'services' },
  { label: 'About', target: 'about' },
  { label: 'Process', target: 'process' },
  { label: 'Contact', target: 'contact' },
];

export function Navbar({
  onNavigateSection,
  onStartProject,
  introComplete,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!introComplete || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.05 });

      if (logoRef.current) {
        tl.fromTo(
          logoRef.current,
          { y: -14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, ease: EASE_EXPO },
          0
        );
      }

      if (linksRef.current) {
        const items = linksRef.current.querySelectorAll('a');
        tl.fromTo(
          items,
          { y: -12, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            stagger: 0.055,
            ease: EASE_EXPO,
          },
          0.08
        );
      }

      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { y: -12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: EASE_EXPO },
          0.2
        );
      }
    }, headerRef);

    return () => ctx.revert();
  }, [introComplete]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleNavClick = (target: string, label?: string) => {
    setMobileOpen(false);
    onNavigateSection(target, label);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          scrolled
            ? 'bg-[#111111]/92 backdrop-blur-md border-b border-white/10'
            : 'bg-[#111111]/75 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-16 lg:h-[72px] flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            ref={logoRef}
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('hero', 'D2C Marketing Hub');
            }}
            className="font-display text-base sm:text-lg font-semibold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B6FF4A]"
          >
            D2C Marketing Hub
          </a>

          {/* Zone 2: Clean Single-Line Navigation Links */}
          <nav
            ref={linksRef}
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 lg:gap-9"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.target}
                href={`#${link.target}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.target, link.label);
                }}
                className="group relative py-1 text-sm font-medium text-white/80 hover:text-white transition-colors duration-200 whitespace-nowrap shrink-0"
              >
                <span>{link.label}</span>
                <span
                  aria-hidden="true"
                  className="absolute left-0 bottom-0 w-full h-[1.5px] bg-[#B6FF4A] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-200 ease-out"
                />
              </a>
            ))}
          </nav>

          {/* Zone 3: Single Primary Action + Mobile Trigger */}
          <div ref={ctaRef} className="flex items-center gap-3 shrink-0">
            <MagneticButton
              onClick={onStartProject}
              className="hidden sm:inline-flex px-5 py-2.5 text-xs font-semibold tracking-wide text-[#111111] bg-[#B6FF4A] hover:bg-[#c8ff75] rounded-full transition-colors duration-200"
            >
              Start a Project
            </MagneticButton>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/15 text-white hover:border-[#B6FF4A] transition-colors cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Custom Animated Fullscreen Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0.96 }}
            animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
            exit={{ clipPath: 'inset(0 0 100% 0)', opacity: 0.9 }}
            transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-[#111111] pt-24 pb-10 px-6 flex flex-col justify-between md:hidden overflow-y-auto"
          >
            <div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.3 }}
                className="text-xs tracking-widest uppercase text-white/45 mb-6"
              >
                Navigation
              </motion.p>
              <nav className="flex flex-col divide-y divide-white/10 border-y border-white/10">
                {NAV_LINKS.map((link, idx) => (
                  <motion.button
                    key={link.target}
                    type="button"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.14 + idx * 0.05,
                      duration: 0.38,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onClick={() => handleNavClick(link.target, link.label)}
                    className="py-5 flex items-center justify-between text-left group cursor-pointer"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono-num text-xs text-white/40">
                        0{idx + 1}
                      </span>
                      <span className="font-display text-3xl font-medium text-white group-hover:text-[#B6FF4A] transition-colors">
                        {link.label}
                      </span>
                    </span>
                    <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-[#B6FF4A] transition-colors" />
                  </motion.button>
                ))}
              </nav>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="pt-8 space-y-6"
            >
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onStartProject();
                }}
                className="w-full py-4 px-6 rounded-full bg-[#B6FF4A] text-[#111111] font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <div className="flex flex-col gap-1 text-sm text-white/60">
                <span>Your Digital Growth. Our Creative Intelligence.</span>
                <span>hello@d2cmarketinghub.com</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

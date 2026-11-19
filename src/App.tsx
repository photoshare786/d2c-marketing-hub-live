import { useEffect, useState, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from './lib/motion';
import { IntroCurtain } from './components/IntroCurtain';
import { SectionTransitionCurtain } from './components/SectionTransitionCurtain';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PortfolioSection, type PortfolioFilter } from './components/PortfolioSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ProcessSection } from './components/ProcessSection';
import { CaseStudySection } from './components/CaseStudySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CollaborateSection } from './components/CollaborateSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export default function App() {
  const [introComplete, setIntroComplete] = useState<boolean>(() => {
    if (prefersReducedMotion()) return true;
    try {
      return sessionStorage.getItem('d2c_intro_seen') === '1';
    } catch {
      return false;
    }
  });

  const [portfolioFilter, setPortfolioFilter] = useState<PortfolioFilter>('all');
  const [preselectedService, setPreselectedService] = useState<string | undefined>(
    undefined
  );
  const [transitionState, setTransitionState] = useState<{
    active: boolean;
    label: string;
    onMidpoint: () => void;
    onDone: () => void;
  } | null>(null);

  const lenisRef = useRef<Lenis | null>(null);

  // Single Lenis instance synced cleanly with GSAP ScrollTrigger
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Lock Lenis during opening intro curtain and refresh ScrollTriggers once open & fonts settled
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!introComplete) {
      lenis?.stop();
    } else {
      lenis?.start();
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
      let cancelled = false;
      if (typeof document !== 'undefined' && document.fonts?.ready) {
        document.fonts.ready.then(() => {
          if (!cancelled) {
            ScrollTrigger.refresh();
          }
        });
      }
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }
  }, [introComplete]);

  const jumpToElement = useCallback((elementId: string, immediate = false) => {
    const target = document.getElementById(elementId);
    if (!target) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: -68,
        immediate,
      });
    } else {
      target.scrollIntoView({
        behavior: immediate ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  }, []);

  // Navigation with editorial Section Transition Curtain
  const handleNavigateWithCurtain = useCallback(
    (elementId: string, label?: string) => {
      if (prefersReducedMotion() || !label) {
        jumpToElement(elementId, false);
        return;
      }

      setTransitionState({
        active: true,
        label,
        onMidpoint: () => {
          jumpToElement(elementId, true);
          ScrollTrigger.refresh();
        },
        onDone: () => {
          setTransitionState(null);
        },
      });
    },
    [jumpToElement]
  );

  const handleStartProject = useCallback(
    (serviceContext?: string) => {
      if (serviceContext) {
        setPreselectedService(serviceContext);
      }
      jumpToElement('contact');
    },
    [jumpToElement]
  );

  const handleSeeProjects = useCallback(
    (filter: PortfolioFilter, _projectId?: string) => {
      setPortfolioFilter(filter);
      setTimeout(() => {
        ScrollTrigger.refresh();
        jumpToElement('work');
      }, 90);
    },
    [jumpToElement]
  );

  const handleScrollToY = useCallback((top: number) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(top, { duration: 0.65 });
    } else {
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const handleSelectFooterService = useCallback(
    (serviceId: string) => {
      jumpToElement(`service-${serviceId}`);
    },
    [jumpToElement]
  );

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      {!introComplete && (
        <IntroCurtain onComplete={() => setIntroComplete(true)} />
      )}

      <SectionTransitionCurtain transitionState={transitionState} />

      <Navbar
        onNavigateSection={handleNavigateWithCurtain}
        onStartProject={() => handleStartProject()}
        introComplete={introComplete}
      />

      <main>
        <Hero
          onStartProject={() => handleStartProject()}
          onExploreWork={() => jumpToElement('work')}
          introComplete={introComplete}
        />

        <PortfolioSection
          activeFilter={portfolioFilter}
          onChangeFilter={(f) => {
            setPortfolioFilter(f);
            setTimeout(() => ScrollTrigger.refresh(), 80);
          }}
          onStartProjectWithContext={(ctx) => handleStartProject(ctx)}
        />

        <AboutSection onNavigateServices={() => jumpToElement('services')} />

        <ServicesSection
          onSeeProjects={handleSeeProjects}
          onScrollToY={handleScrollToY}
        />

        <ProcessSection />

        <CaseStudySection onStartProject={() => handleStartProject()} />

        <TestimonialsSection />

        <CollaborateSection onStartProject={() => handleStartProject()} />

        <ContactSection preselectedService={preselectedService} />
      </main>

      <Footer
        onNavigateSection={(id) => jumpToElement(id)}
        onSelectService={handleSelectFooterService}
      />
    </div>
  );
}

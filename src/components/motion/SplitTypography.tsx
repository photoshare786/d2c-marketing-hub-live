import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react';
import {
  gsap,
  SplitText,
  ScrollTrigger,
  prefersReducedMotion,
  EASE_EDITORIAL,
  EASE_EXPO,
} from '../../lib/motion';

interface BaseTextProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  delay?: number;
  triggerOnScroll?: boolean;
  ready?: boolean;
}

export function CharacterReveal({
  children,
  className = '',
  as: Tag = 'div',
  delay = 0,
  triggerOnScroll = true,
  ready = true,
}: BaseTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !ready || prefersReducedMotion()) return;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: 'chars,words',
        mask: 'chars',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.chars, {
            yPercent: 110,
            opacity: 0,
            duration: 0.65,
            stagger: 0.02,
            delay,
            ease: EASE_EXPO,
            scrollTrigger: triggerOnScroll
              ? {
                  trigger: el,
                  start: 'top 88%',
                  once: true,
                }
              : undefined,
          });
        },
      });
    }, ref);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [delay, triggerOnScroll, ready]);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}

export function WordReveal({
  children,
  className = '',
  as: Tag = 'div',
  delay = 0,
  triggerOnScroll = true,
  ready = true,
}: BaseTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !ready || prefersReducedMotion()) return;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: 'words',
        mask: 'words',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.words, {
            yPercent: 105,
            opacity: 0,
            duration: 0.72,
            stagger: 0.045,
            delay,
            ease: EASE_EDITORIAL,
            scrollTrigger: triggerOnScroll
              ? {
                  trigger: el,
                  start: 'top 88%',
                  once: true,
                }
              : undefined,
          });
        },
      });
    }, ref);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [delay, triggerOnScroll, ready]);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}

export function LineMaskReveal({
  children,
  className = '',
  as: Tag = 'div',
  delay = 0,
  triggerOnScroll = true,
  ready = true,
}: BaseTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !ready || prefersReducedMotion()) return;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 112,
            opacity: 0,
            duration: 0.82,
            stagger: 0.09,
            delay,
            ease: EASE_EXPO,
            scrollTrigger: triggerOnScroll
              ? {
                  trigger: el,
                  start: 'top 88%',
                  once: true,
                }
              : undefined,
          });
        },
      });
    }, ref);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [delay, triggerOnScroll, ready]);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}

export function SplitHeading({
  children,
  className = '',
  as: Tag = 'h2',
  delay = 0,
  triggerOnScroll = true,
  ready = true,
  style,
}: BaseTextProps & { style?: CSSProperties }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !ready || prefersReducedMotion()) return;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: 'lines,words',
        mask: 'lines',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 108,
            opacity: 0,
            duration: 0.88,
            stagger: 0.09,
            delay,
            ease: EASE_EXPO,
            scrollTrigger: triggerOnScroll
              ? {
                  trigger: el,
                  start: 'top 86%',
                  once: true,
                }
              : undefined,
          });
        },
      });
    }, ref);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [delay, triggerOnScroll, ready]);

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}

interface ScrollScrubbedTextProps {
  children: string;
  className?: string;
}

export function ScrollScrubbedText({
  children,
  className = '',
}: ScrollScrubbedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion()) return;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: 'words',
        autoSplit: true,
        onSplit(self) {
          gsap.set(self.words, { opacity: 0.22 });
          return gsap.to(self.words, {
            opacity: 1,
            color: '#FFFFFF',
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
              end: 'bottom 45%',
              scrub: 0.6,
            },
          });
        },
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [children]);

  return (
    <p ref={containerRef} className={className}>
      {children}
    </p>
  );
}

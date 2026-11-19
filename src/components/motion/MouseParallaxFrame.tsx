import {
  useEffect,
  useRef,
  type ReactNode,
  type KeyboardEventHandler,
} from 'react';
import { gsap, Observer, prefersReducedMotion } from '../../lib/motion';

interface MouseParallaxFrameProps {
  children: ReactNode;
  overlay?: ReactNode;
  className?: string;
  maxTranslateX?: number;
  maxTranslateY?: number;
  maxRotateX?: number;
  maxRotateY?: number;
  imageScale?: number;
  enableTilt?: boolean;
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  ariaLabel?: string;
}

/**
 * Constrained GSAP-driven mouse parallax frame for editorial photography.
 * Tilts the outer card frame gently in 3D perspective while shifting the
 * inner image layer in counter-depth with scale bleed protection.
 */
export function MouseParallaxFrame({
  children,
  overlay,
  className = '',
  maxTranslateX = 12,
  maxTranslateY = 9,
  maxRotateX = 1.0,
  maxRotateY = 1.3,
  imageScale = 1.05,
  enableTilt = true,
  onClick,
  role,
  tabIndex,
  onKeyDown,
  ariaLabel,
}: MouseParallaxFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const inner = innerRef.current;
    if (!frame || !inner || prefersReducedMotion()) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px) and (pointer: fine)', () => {
      if (enableTilt) {
        gsap.set(frame, {
          transformPerspective: 1400,
          transformStyle: 'preserve-3d',
        });
      }
      gsap.set(inner, { scale: imageScale });

      const xTo = gsap.quickTo(inner, 'x', {
        duration: 0.72,
        ease: 'power3.out',
      });
      const yTo = gsap.quickTo(inner, 'y', {
        duration: 0.72,
        ease: 'power3.out',
      });

      const rxTo = enableTilt
        ? gsap.quickTo(frame, 'rotationX', {
            duration: 0.85,
            ease: 'power3.out',
          })
        : null;
      const ryTo = enableTilt
        ? gsap.quickTo(frame, 'rotationY', {
            duration: 0.85,
            ease: 'power3.out',
          })
        : null;

      const clamp = gsap.utils.clamp(-0.5, 0.5);

      const observer = Observer.create({
        target: frame,
        type: 'pointer',
        onMove: (self) => {
          if (self.x === undefined || self.y === undefined) return;
          const rect = frame.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;

          const normX = clamp((self.x - rect.left) / rect.width - 0.5);
          const normY = clamp((self.y - rect.top) / rect.height - 0.5);

          // Inner image shifts gently opposite to pointer for true window depth
          xTo(normX * -2 * maxTranslateX);
          yTo(normY * -2 * maxTranslateY);

          if (ryTo && rxTo) {
            ryTo(normX * 2 * maxRotateY);
            rxTo(normY * -2 * maxRotateX);
          }
        },
      });

      const handleLeave = () => {
        xTo(0);
        yTo(0);
        rxTo?.(0);
        ryTo?.(0);
      };

      frame.addEventListener('mouseleave', handleLeave);

      return () => {
        observer.kill();
        frame.removeEventListener('mouseleave', handleLeave);
        gsap.set(inner, { clearProps: 'transform' });
        gsap.set(frame, { clearProps: 'transform' });
      };
    });

    return () => mm.revert();
  }, [maxTranslateX, maxTranslateY, maxRotateX, maxRotateY, imageScale, enableTilt]);

  return (
    <div
      ref={frameRef}
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      aria-label={ariaLabel}
      className={`relative will-change-transform ${className}`}
    >
      <div ref={innerRef} className="w-full h-full will-change-transform">
        {children}
      </div>
      {overlay}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/motion';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [role="radio"], [role="tab"], input:not([type="hidden"]), select, textarea, label[for], summary, [data-cursor="interactive"]';

const DESKTOP_MEDIA_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 1024px)';

export function NeonCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [pressed, setPressed] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const targetPos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const hasInitializedPos = useRef(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const evaluate = () => {
      setEnabled(desktopQuery.matches && !prefersReducedMotion());
    };

    evaluate();
    desktopQuery.addEventListener('change', evaluate);
    motionQuery.addEventListener('change', evaluate);

    return () => {
      desktopQuery.removeEventListener('change', evaluate);
      motionQuery.removeEventListener('change', evaluate);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('has-neon-cursor');
      return;
    }

    document.documentElement.classList.add('has-neon-cursor');

    const updateHoverState = (target: EventTarget | null) => {
      if (!(target instanceof Element)) {
        setIsHoveringInteractive(false);
        return;
      }
      setIsHoveringInteractive(Boolean(target.closest(INTERACTIVE_SELECTOR)));
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') {
        return;
      }

      const x = e.clientX;
      const y = e.clientY;
      targetPos.current.x = x;
      targetPos.current.y = y;

      if (!hasInitializedPos.current) {
        dotPos.current = { x, y };
        ringPos.current = { x, y };
        hasInitializedPos.current = true;
      }

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }

      updateHoverState(e.target);
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (e.pointerType && e.pointerType !== 'mouse') return;
      setPressed(true);
    };

    const handlePointerUp = () => {
      setPressed(false);
    };

    const handleMouseLeaveViewport = () => {
      visibleRef.current = false;
      setVisible(false);
      setPressed(false);
      setIsHoveringInteractive(false);
    };

    let rafId = 0;
    let prevTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - prevTime) / 1000, 0.05);
      prevTime = now;

      // Smooth, frame-rate-independent mouse follow
      const dotFactor = 1 - Math.exp(-46 * dt);
      const ringFactor = 1 - Math.exp(-13 * dt);

      dotPos.current.x += (targetPos.current.x - dotPos.current.x) * dotFactor;
      dotPos.current.y += (targetPos.current.y - dotPos.current.y) * dotFactor;

      ringPos.current.x += (targetPos.current.x - ringPos.current.x) * ringFactor;
      ringPos.current.y += (targetPos.current.y - ringPos.current.y) * ringFactor;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('blur', handleMouseLeaveViewport);
    document.documentElement.addEventListener(
      'mouseleave',
      handleMouseLeaveViewport
    );

    return () => {
      window.cancelAnimationFrame(rafId);
      document.documentElement.classList.remove('has-neon-cursor');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('blur', handleMouseLeaveViewport);
      document.documentElement.removeEventListener(
        'mouseleave',
        handleMouseLeaveViewport
      );
    };
  }, [enabled]);

  if (!enabled) return null;

  const ringTransformClass = pressed
    ? 'scale-[0.9] bg-[#B6FF3B]/[0.08]'
    : isHoveringInteractive
      ? 'scale-[1.28] bg-[#B6FF3B]/[0.05]'
      : 'scale-100';

  const dotTransformClass = pressed
    ? 'scale-110'
    : isHoveringInteractive
      ? 'scale-[1.15]'
      : 'scale-100';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* 40px Neon Lime Green (#B6FF3B) outer circular ring */}
      <div ref={ringRef} className="fixed left-0 top-0 will-change-transform">
        <span
          className={`neon-cursor-ring block h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#B6FF3B]/85 transition-[transform,background-color,box-shadow] duration-200 ease-out ${ringTransformClass}`}
        />
      </div>

      {/* 6px white inner dot */}
      <div ref={dotRef} className="fixed left-0 top-0 will-change-transform">
        <span
          className={`neon-cursor-dot block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-transform duration-150 ease-out ${dotTransformClass}`}
        />
      </div>
    </div>
  );
}

import { useRef, useState, type ReactNode, type MouseEvent } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  strength?: number;
}

export function MagneticButton({
  children,
  onClick,
  href,
  type = 'button',
  disabled = false,
  className = '',
  ariaLabel,
  strength = 0.24,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (disabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setOffset({
      x: (e.clientX - centerX) * strength,
      y: (e.clientY - centerY) * strength,
    });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const style = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    transition: offset.x === 0 && offset.y === 0 ? 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 100ms ease-out',
  };

  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style}
        aria-label={ariaLabel}
        className={`inline-flex items-center justify-center whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6FF4A] ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6FF4A] ${className}`}
    >
      {children}
    </button>
  );
}

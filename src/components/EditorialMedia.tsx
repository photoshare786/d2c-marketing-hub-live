import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface EditorialMediaProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  fallbackTitle?: string;
}

export function EditorialMedia({
  src,
  alt,
  className = '',
  imgClassName = '',
  priority = false,
  fallbackTitle,
}: EditorialMediaProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1A1A] via-[#222222] to-[#111111] border border-white/10 text-white/70 p-8 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <ImageIcon className="w-7 h-7 mb-3 text-[#B6FF4A]" strokeWidth={1.5} />
        <p className="text-sm font-medium text-white/90">{fallbackTitle || alt}</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#1B1B1B] ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover ${imgClassName}`}
      />
    </div>
  );
}

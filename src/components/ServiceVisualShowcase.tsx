import { motion, AnimatePresence } from 'motion/react';
import type { ServiceItem } from '../data/agencyData';
import { EditorialMedia } from './EditorialMedia';
import { prefersReducedMotion } from '../lib/motion';

interface ServiceVisualShowcaseProps {
  service: ServiceItem;
  hoveredCapability: string | null;
}

export function ServiceVisualShowcase({
  service,
  hoveredCapability,
}: ServiceVisualShowcaseProps) {
  const reduced = prefersReducedMotion();
  const activeCaption = hoveredCapability
    ? `Active Focus: ${hoveredCapability}`
    : service.visualCaption;

  return (
    <div className="group/card relative w-full rounded-2xl overflow-hidden bg-[#111111] text-white p-6 sm:p-8 flex flex-col justify-between min-h-[360px] lg:min-h-[430px] border border-black/5">
      {/* Top Card Metadata Bar */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`top-${service.id}`}
          initial={reduced ? false : { opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -5 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 text-xs text-white/60"
        >
          <span className="font-mono-num text-white/85">
            <span className="text-[#A6FF35]">{service.number}</span> ·{' '}
            {service.cardTopLabel}
          </span>
          <span className="truncate text-right">{service.cardTopMeta}</span>
        </motion.div>
      </AnimatePresence>

      {/* Center 16:9 Service Visual with Smooth Switch Transition */}
      <div className="my-6 relative rounded-xl overflow-hidden aspect-[16/9] border border-white/15 bg-[#181818]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={service.id}
            initial={
              reduced
                ? false
                : {
                    opacity: 0,
                    scale: 1.04,
                  }
            }
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={
              reduced
                ? undefined
                : {
                    opacity: 0,
                    scale: 0.99,
                  }
            }
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            <EditorialMedia
              src={service.image}
              alt={service.imageAlt}
              className="w-full h-full"
              imgClassName={`transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                hoveredCapability
                  ? 'scale-105'
                  : 'scale-100 group-hover/card:scale-[1.03]'
              }`}
              priority
              fallbackTitle={service.title}
            />
          </motion.div>
        </AnimatePresence>

        {/* Subtle Dark Edge Gradient for Editorial Polish */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111111]/45 via-transparent to-transparent"
        />

        {/* Floating Active Capability Focus Indicator */}
        <AnimatePresence>
          {hoveredCapability && (
            <motion.div
              key={hoveredCapability}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute top-3.5 right-3.5 z-10 px-3 py-1.5 rounded-full bg-[#A6FF35] text-[#111111] text-[11px] font-semibold tracking-wide"
            >
              {hoveredCapability}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Card Metadata Bar */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`bottom-${service.id}-${hoveredCapability ?? 'idle'}`}
          initial={reduced ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-xs text-white/65"
        >
          <span className="truncate">{activeCaption}</span>
          <span className="text-[#A6FF35] font-medium whitespace-nowrap shrink-0">
            {service.cardBottomBadge}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

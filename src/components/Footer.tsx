import { ArrowUpRight } from 'lucide-react';
import { SERVICES_LIST } from '../data/agencyData';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onSelectService: (serviceId: string) => void;
}

const FOOTER_NAV = [
  { label: 'About Us', target: 'about' },
  { label: 'Our Work', target: 'work' },
  { label: 'Services', target: 'services' },
  { label: 'Process', target: 'process' },
  { label: 'Contact', target: 'contact' },
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Behance', href: 'https://behance.net' },
];

export function Footer({ onNavigateSection, onSelectService }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#111111] text-white pt-20 pb-12 border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Top Footer Brand & Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-5">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                onNavigateSection('hero');
              }}
              className="font-display text-2xl font-semibold tracking-tight text-white inline-block"
            >
              D2C Marketing Hub
            </a>
            <p className="text-sm leading-[1.7] text-white/65 max-w-[36ch]">
              Your Digital Growth. Our Creative Intelligence. Strategy, design,
              and performance engineering for ambitious modern brands.
            </p>
            <div className="pt-2 space-y-1.5 text-sm text-white/80">
              <p>
                <a
                  href="mailto:hello@d2cmarketinghub.com"
                  className="hover:text-[#B6FF4A] transition-colors"
                >
                  hello@d2cmarketinghub.com
                </a>
              </p>
              <p className="font-mono-num text-white/60">
                WhatsApp: +00 000 000 0000
              </p>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.14em] text-white/45 mb-5">
              Navigation
            </p>
            <ul className="space-y-3">
              {FOOTER_NAV.map((item) => (
                <li key={item.target}>
                  <a
                    href={`#${item.target}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateSection(item.target);
                    }}
                    className="text-sm text-white/75 hover:text-[#B6FF4A] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* All 12 Services Column */}
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.14em] text-white/45 mb-5">
              Services (01–12)
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {SERVICES_LIST.map((service) => (
                <li key={service.id}>
                  <button
                    type="button"
                    onClick={() => onSelectService(service.id)}
                    className="text-left text-xs sm:text-sm text-white/70 hover:text-[#B6FF4A] transition-colors cursor-pointer"
                  >
                    <span className="font-mono-num text-white/40 mr-1.5">
                      {service.number}.
                    </span>
                    <span>{service.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links Column */}
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.14em] text-white/45 mb-5">
              Connect
            </p>
            <ul className="space-y-3">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 text-sm text-white/75 hover:text-[#B6FF4A] transition-colors"
                  >
                    <span>{social.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quiet Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/45">
          <p>© {currentYear} D2C Marketing Hub. All rights reserved.</p>
          <p>Digital Strategy · Creative · Technology</p>
        </div>
      </div>
    </footer>
  );
}

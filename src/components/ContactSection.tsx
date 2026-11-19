import { useState, useEffect, useRef, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { gsap, EASE_EDITORIAL, prefersReducedMotion } from '../lib/motion';
import { SERVICES_LIST } from '../data/agencyData';
import { MagneticButton } from './MagneticButton';
import { SplitHeading } from './motion/SplitTypography';

interface ContactSectionProps {
  preselectedService?: string;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  service: string;
  budget: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  service?: string;
  budget?: string;
  message?: string;
}

interface SubmittedReceipt {
  inquiryId: string;
  name: string;
  email: string;
  service: string;
  customerConfirmationSent: boolean;
}

const CONTACT_DETAILS = {
  directEmail: 'hello@d2cmarketinghub.com',
  responseTime: 'We typically respond within 24 business hours.',
};

// Editable estimated investment options
const INVESTMENT_OPTIONS = [
  'Under ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  '₹1,00,000 – ₹3,00,000',
  '₹3,00,000+',
  'Ongoing Retainer',
];

const CONTACT_MARQUEE = [
  "LET'S BUILD YOUR NEXT BIG MOVE.",
  'D2C MARKETING HUB',
  'STRATEGY · CREATIVITY · PERFORMANCE',
];

function resolveServiceTitle(input?: string): string {
  if (!input) return '';
  const needle = input.toLowerCase();
  const exact = SERVICES_LIST.find((s) => s.title.toLowerCase() === needle);
  if (exact) return exact.title;

  const partial = SERVICES_LIST.find(
    (s) =>
      s.title.toLowerCase().includes(needle) ||
      needle.includes(s.title.toLowerCase())
  );
  if (partial) return partial.title;

  if (needle.includes('e-commerce') || needle.includes('ecommerce') || needle.includes('courier')) {
    return 'E-commerce Solutions';
  }
  if (needle.includes('seo')) return 'Search Engine Optimization';
  if (needle.includes('social')) return 'Social Media Marketing';
  if (needle.includes('brand')) return 'Branding & Identity';
  if (needle.includes('advert') || needle.includes('media')) return 'Google & Meta Advertising';
  if (needle.includes('mobile')) return 'Mobile App Development';

  return SERVICES_LIST[0].title;
}

export function ContactSection({ preselectedService }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgVisualRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const lastSubmittedSignatureRef = useRef<string | null>(null);

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    service: '',
    budget: INVESTMENT_OPTIONS[1],
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedReceipt, setSubmittedReceipt] = useState<SubmittedReceipt | null>(
    null
  );

  useEffect(() => {
    if (preselectedService) {
      const resolved = resolveServiceTitle(preselectedService);
      if (resolved) {
        setForm((prev) => ({
          ...prev,
          service: resolved,
        }));
        setErrors((prev) => ({ ...prev, service: undefined }));
        setSubmittedReceipt(null);
        setSubmitError(null);
      }
    }
  }, [preselectedService]);

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (bgVisualRef.current) {
        gsap.fromTo(
          bgVisualRef.current,
          { yPercent: -8, scale: 1.06 },
          {
            yPercent: 8,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }

      if (formCardRef.current) {
        gsap.fromTo(
          formCardRef.current,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: EASE_EDITORIAL,
            clearProps: 'transform',
            scrollTrigger: {
              trigger: formCardRef.current,
              start: 'top 84%',
              once: true,
            },
          }
        );
      }

      if (marqueeTrackRef.current) {
        gsap.to(marqueeTrackRef.current, {
          xPercent: -50,
          duration: 30,
          repeat: -1,
          ease: 'none',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = 'Please enter your full name (at least 2 characters).';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid work email address.';
    }

    const phoneVal = form.phone.trim();
    const phoneDigits = phoneVal.replace(/\D/g, '');
    if (
      !phoneVal ||
      !/^[+\d\s().-]+$/.test(phoneVal) ||
      phoneDigits.length < 7 ||
      phoneDigits.length > 15
    ) {
      nextErrors.phone = 'Please enter a valid phone or WhatsApp number.';
    }

    if (!form.company.trim() || form.company.trim().length < 2) {
      nextErrors.company = 'Please enter your brand or company name.';
    }

    const websiteVal = form.website.trim();
    if (websiteVal) {
      try {
        const normalized = /^https?:\/\//i.test(websiteVal)
          ? websiteVal
          : `https://${websiteVal}`;
        const parsed = new URL(normalized);
        if (!parsed.hostname.includes('.')) {
          nextErrors.website =
            'Please enter a valid website URL (e.g. https://yourbrand.com).';
        }
      } catch {
        nextErrors.website =
          'Please enter a valid website URL (e.g. https://yourbrand.com).';
      }
    }

    if (!form.service) {
      nextErrors.service = 'Please select a primary service interest.';
    }

    if (!form.budget) {
      nextErrors.budget = 'Please select an estimated investment scope.';
    }

    if (!form.message.trim() || form.message.trim().length < 15) {
      nextErrors.message =
        'Please share a short project overview (at least 15 characters).';
    }

    return nextErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitError(null);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const signature = `${form.email.trim().toLowerCase()}|${form.service}|${form.message
      .trim()
      .slice(0, 120)}`;
    if (lastSubmittedSignatureRef.current === signature) {
      setSubmitError(
        'This inquiry has already been submitted. Please modify your brief if you wish to send a new request.'
      );
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company.trim(),
          website: form.website.trim(),
          service: form.service,
          budget: form.budget,
          message: form.message.trim(),
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        saved?: boolean;
        emailDelivered?: boolean;
        emailStatus?: {
          adminNotificationSent?: boolean;
          customerConfirmationSent?: boolean;
        };
        inquiryId?: string;
        error?: string;
        fieldErrors?: FormErrors;
      } | null;

      if (!response.ok || !data?.ok || !data.saved || !data.inquiryId) {
        if (data?.fieldErrors) {
          setErrors(data.fieldErrors);
        }
        setSubmitError(
          data?.error ??
            'We could not send your inquiry right now. Please try again in a moment or email hello@d2cmarketinghub.com directly.'
        );
        return;
      }

      lastSubmittedSignatureRef.current = signature;
      setSubmittedReceipt({
        inquiryId: data.inquiryId,
        name: form.name.trim(),
        email: form.email.trim(),
        service: form.service,
        customerConfirmationSent: Boolean(
          data.emailStatus?.customerConfirmationSent
        ),
      });
    } catch {
      setSubmitError(
        'Network error while sending your inquiry. Please try again or email hello@d2cmarketinghub.com.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      website: '',
      service: '',
      budget: INVESTMENT_OPTIONS[1],
      message: '',
    });
    setErrors({});
    setSubmitError(null);
    setSubmittedReceipt(null);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative bg-white text-[#111111] pt-24 lg:pt-36 pb-0 overflow-x-clip"
    >
      {/* Subtle Moving Architectural Background Texture */}
      <div
        ref={bgVisualRef}
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-12 w-full lg:w-[55%] h-[520px] opacity-[0.045] overflow-hidden will-change-transform"
      >
        <img
          src="/src/assets/images/case_study_cinematic_1795031680262.jpg"
          alt=""
          className="w-full h-full object-cover grayscale"
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10 pb-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Editorial Introduction & Direct Contact */}
          <div className="lg:col-span-5 space-y-10 min-w-0">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#111111]/55 mb-4">
                Start a Project
              </p>
              <SplitHeading
                as="h2"
                className="font-display font-medium tracking-[-0.03em] leading-[1.04] text-[#111111] uppercase mb-5"
                style={{
                  fontSize: 'clamp(2.1rem, 4.1vw, 3.65rem)',
                  textWrap: 'balance',
                }}
              >
                LET&apos;S BUILD YOUR NEXT BIG MOVE.
              </SplitHeading>
              <p className="text-base leading-[1.7] text-[#111111]/75 max-w-[46ch]">
                Have an ambitious idea or a business ready to scale? Tell us what
                you&apos;re building. Our strategy, creative, and performance teams
                will help turn your vision into measurable growth.
              </p>
            </div>

            <div className="divide-y divide-black/10 border-y border-black/10">
              <div className="py-5">
                <p className="text-xs uppercase tracking-[0.14em] text-[#111111]/50 mb-1.5">
                  Direct Email
                </p>
                <a
                  href={`mailto:${CONTACT_DETAILS.directEmail}`}
                  className="font-display text-lg sm:text-xl font-medium text-[#111111] hover:underline break-all"
                >
                  {CONTACT_DETAILS.directEmail}
                </a>
              </div>

              <div className="py-5">
                <p className="text-xs uppercase tracking-[0.14em] text-[#111111]/50 mb-1.5">
                  Response Time
                </p>
                <p className="text-base font-medium text-[#111111]/85">
                  {CONTACT_DETAILS.responseTime}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Project Inquiry Form */}
          <div className="lg:col-span-7 min-w-0" ref={formCardRef}>
            <div className="rounded-2xl bg-[#F3F3F3] p-6 sm:p-10 lg:p-12">
              {submittedReceipt ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="py-10 space-y-6"
                >
                  <div className="w-12 h-12 rounded-full bg-[#B6FF4A] text-[#111111] flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-3">
                    <p className="font-mono-num text-xs uppercase tracking-[0.14em] text-[#111111]/55">
                      Inquiry Reference · {submittedReceipt.inquiryId}
                    </p>
                    <h3 className="font-display text-2xl sm:text-3xl font-medium text-[#111111]">
                      Project inquiry received.
                    </h3>
                    <p className="text-base leading-[1.65] text-[#111111]/75 max-w-[50ch]">
                      Thank you, {submittedReceipt.name}. Your inquiry for{' '}
                      <span className="font-semibold text-[#111111]">
                        {submittedReceipt.service}
                      </span>{' '}
                      has been recorded
                      {submittedReceipt.customerConfirmationSent
                        ? ' and a confirmation email has been sent'
                        : ''}
                      . Our strategy team will reach out to{' '}
                      <span className="font-semibold text-[#111111]">
                        {submittedReceipt.email}
                      </span>{' '}
                      within 24 business hours.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 rounded-full bg-[#111111] text-white text-sm font-semibold hover:bg-[#292929] transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Row 1: Full Name + Work Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs uppercase tracking-[0.12em] font-semibold text-[#111111]/75 mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        disabled={submitting}
                        value={form.name}
                        onChange={(e) => {
                          setForm({ ...form, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        placeholder="Alex Morgan"
                        aria-invalid={Boolean(errors.name)}
                        className={`w-full px-4 py-3.5 rounded-xl bg-white border text-sm text-[#111111] placeholder:text-[#111111]/35 transition-colors focus:outline-none focus:ring-2 focus:ring-[#111111] disabled:opacity-60 ${
                          errors.name ? 'border-red-600' : 'border-black/12'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-700">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs uppercase tracking-[0.12em] font-semibold text-[#111111]/75 mb-2"
                      >
                        Work Email *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        disabled={submitting}
                        value={form.email}
                        onChange={(e) => {
                          setForm({ ...form, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        placeholder="alex@company.com"
                        aria-invalid={Boolean(errors.email)}
                        className={`w-full px-4 py-3.5 rounded-xl bg-white border text-sm text-[#111111] placeholder:text-[#111111]/35 transition-colors focus:outline-none focus:ring-2 focus:ring-[#111111] disabled:opacity-60 ${
                          errors.email ? 'border-red-600' : 'border-black/12'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-700">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Phone / WhatsApp Number + Brand / Company Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-xs uppercase tracking-[0.12em] font-semibold text-[#111111]/75 mb-2"
                      >
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        disabled={submitting}
                        value={form.phone}
                        onChange={(e) => {
                          setForm({ ...form, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: undefined });
                        }}
                        placeholder="+91 98765 43210"
                        aria-invalid={Boolean(errors.phone)}
                        className={`w-full px-4 py-3.5 rounded-xl bg-white border text-sm text-[#111111] placeholder:text-[#111111]/35 transition-colors focus:outline-none focus:ring-2 focus:ring-[#111111] disabled:opacity-60 ${
                          errors.phone ? 'border-red-600' : 'border-black/12'
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-700">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-company"
                        className="block text-xs uppercase tracking-[0.12em] font-semibold text-[#111111]/75 mb-2"
                      >
                        Brand / Company Name *
                      </label>
                      <input
                        id="contact-company"
                        type="text"
                        required
                        disabled={submitting}
                        value={form.company}
                        onChange={(e) => {
                          setForm({ ...form, company: e.target.value });
                          if (errors.company)
                            setErrors({ ...errors, company: undefined });
                        }}
                        placeholder="Your brand or company"
                        aria-invalid={Boolean(errors.company)}
                        className={`w-full px-4 py-3.5 rounded-xl bg-white border text-sm text-[#111111] placeholder:text-[#111111]/35 transition-colors focus:outline-none focus:ring-2 focus:ring-[#111111] disabled:opacity-60 ${
                          errors.company ? 'border-red-600' : 'border-black/12'
                        }`}
                      />
                      {errors.company && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-700">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.company}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Website URL (Optional) + Primary Service Interest (Required) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="contact-website"
                        className="block text-xs uppercase tracking-[0.12em] font-semibold text-[#111111]/75 mb-2"
                      >
                        Website URL (Optional)
                      </label>
                      <input
                        id="contact-website"
                        type="url"
                        disabled={submitting}
                        value={form.website}
                        onChange={(e) => {
                          setForm({ ...form, website: e.target.value });
                          if (errors.website)
                            setErrors({ ...errors, website: undefined });
                        }}
                        placeholder="https://yourbrand.com"
                        aria-invalid={Boolean(errors.website)}
                        className={`w-full px-4 py-3.5 rounded-xl bg-white border text-sm text-[#111111] placeholder:text-[#111111]/35 transition-colors focus:outline-none focus:ring-2 focus:ring-[#111111] disabled:opacity-60 ${
                          errors.website ? 'border-red-600' : 'border-black/12'
                        }`}
                      />
                      {errors.website && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-700">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.website}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-service"
                        className="block text-xs uppercase tracking-[0.12em] font-semibold text-[#111111]/75 mb-2"
                      >
                        Primary Service Interest *
                      </label>
                      <select
                        id="contact-service"
                        required
                        disabled={submitting}
                        value={form.service}
                        onChange={(e) => {
                          setForm({ ...form, service: e.target.value });
                          if (errors.service)
                            setErrors({ ...errors, service: undefined });
                        }}
                        aria-invalid={Boolean(errors.service)}
                        className={`w-full px-4 py-3.5 rounded-xl bg-white border text-sm text-[#111111] transition-colors focus:outline-none focus:ring-2 focus:ring-[#111111] disabled:opacity-60 ${
                          errors.service ? 'border-red-600' : 'border-black/12'
                        }`}
                      >
                        <option value="">Select primary service...</option>
                        {SERVICES_LIST.map((service) => (
                          <option key={service.id} value={service.title}>
                            {service.number}. {service.title}
                          </option>
                        ))}
                      </select>
                      {errors.service && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-700">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.service}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Estimated Investment Scope */}
                  <div>
                    <span className="block text-xs uppercase tracking-[0.12em] font-semibold text-[#111111]/75 mb-2.5">
                      Estimated Investment Scope
                    </span>
                    <div
                      role="radiogroup"
                      aria-label="Estimated Investment Scope"
                      className="flex flex-wrap gap-2"
                    >
                      {INVESTMENT_OPTIONS.map((option) => {
                        const isSelected = form.budget === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            disabled={submitting}
                            onClick={() => {
                              setForm({ ...form, budget: option });
                              if (errors.budget)
                                setErrors({ ...errors, budget: undefined });
                            }}
                            className={`px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60 ${
                              isSelected
                                ? 'bg-[#111111] text-white'
                                : 'bg-white text-[#111111]/75 border border-black/12 hover:border-black/35 hover:text-[#111111]'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    {errors.budget && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-700">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.budget}</span>
                      </p>
                    )}
                  </div>

                  {/* Project Overview & Goals */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs uppercase tracking-[0.12em] font-semibold text-[#111111]/75 mb-2"
                    >
                      Project Overview &amp; Goals *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      disabled={submitting}
                      value={form.message}
                      onChange={(e) => {
                        setForm({ ...form, message: e.target.value });
                        if (errors.message)
                          setErrors({ ...errors, message: undefined });
                      }}
                      placeholder="Tell us about your business, project objectives, challenges, and expected timeline..."
                      aria-invalid={Boolean(errors.message)}
                      className={`w-full px-4 py-3.5 rounded-xl bg-white border text-sm text-[#111111] placeholder:text-[#111111]/35 transition-colors focus:outline-none focus:ring-2 focus:ring-[#111111] disabled:opacity-60 ${
                        errors.message ? 'border-red-600' : 'border-black/12'
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-700">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <div
                      role="alert"
                      className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs sm:text-sm font-medium text-red-800"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-xs text-[#111111]/55">
                      Required fields are marked with *.
                    </p>
                    <MagneticButton
                      type="submit"
                      disabled={submitting}
                      className="px-7 py-3.5 rounded-full bg-[#111111] text-white hover:bg-[#B6FF4A] hover:text-[#111111] text-sm font-semibold uppercase tracking-[0.06em] transition-colors gap-2 disabled:opacity-60 disabled:pointer-events-none"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>SEND PROJECT INQUIRY</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </>
                      )}
                    </MagneticButton>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Smooth Transition Band into Dark Footer */}
      <div className="bg-[#111111] text-white border-t border-white/10 py-5 overflow-hidden select-none">
        <div
          ref={marqueeTrackRef}
          className="flex items-center gap-12 w-max will-change-transform"
        >
          {[
            ...CONTACT_MARQUEE,
            ...CONTACT_MARQUEE,
            ...CONTACT_MARQUEE,
            ...CONTACT_MARQUEE,
          ].map((text, idx) => (
            <span
              key={`cm-${idx}`}
              className={`text-xs uppercase tracking-[0.2em] whitespace-nowrap ${
                idx % 3 === 0 ? 'text-[#B6FF4A]' : 'text-white/45'
              }`}
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

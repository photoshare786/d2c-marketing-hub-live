import express, { type Request, type Response } from 'express';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const OFFICIAL_SENDER_EMAIL = 'hello@d2cmarketinghub.com';
const OFFICIAL_SENDER_DOMAIN = 'd2cmarketinghub.com';
const OFFICIAL_FROM_HEADER = `D2C Marketing Hub <${OFFICIAL_SENDER_EMAIL}>`;
const ADMIN_RECIPIENT_EMAIL = 'd2cmarketinghub@gmail.com';
const ADMIN_EMAIL_SUBJECT = 'New Project Inquiry – D2C Marketing Hub';
const CUSTOMER_EMAIL_SUBJECT =
  'Your Project Inquiry Has Been Received – D2C Marketing Hub';

interface InquiryPayload {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  service?: string;
  budget?: string;
  message?: string;
}

interface StoredInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  service: string;
  budget: string;
  message: string;
  createdAt: string;
}

interface ResendConfig {
  apiKey: string;
  fromHeader: string;
  fromEmail: string;
  fromDomain: string;
  adminRecipient: string;
  senderPolicyValid: boolean;
  senderPolicyError?: string;
}

interface EmailDeliveryStatus {
  adminNotificationSent: boolean;
  customerConfirmationSent: boolean;
}

const VALID_BUDGETS = new Set([
  'Under ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  '₹1,00,000 – ₹3,00,000',
  '₹3,00,000+',
  'Ongoing Retainer',
]);

const INQUIRY_STORE_PATH = path.join(os.tmpdir(), 'd2c_marketing_hub_inquiries.json');
const recentSubmissions = new Map<string, number>();
const DEDUPE_WINDOW_MS = 60_000;

function extractEmailAddress(fromHeader: string): string {
  const angleMatch = fromHeader.match(/<([^>]+)>/);
  const raw = (angleMatch ? angleMatch[1] : fromHeader).trim().toLowerCase();
  return raw;
}

function getResendConfig(): ResendConfig {
  const apiKey = process.env.RESEND_API_KEY?.trim() || '';
  const configuredFrom = process.env.RESEND_FROM?.trim();
  const fromHeader = configuredFrom || OFFICIAL_FROM_HEADER;
  const fromEmail = extractEmailAddress(fromHeader);
  const fromDomain = fromEmail.split('@')[1] || '';
  const adminRecipient =
    process.env.INQUIRY_RECIPIENT_EMAIL?.trim() || ADMIN_RECIPIENT_EMAIL;

  let senderPolicyValid = true;
  let senderPolicyError: string | undefined;

  if (!fromEmail || !fromEmail.includes('@')) {
    senderPolicyValid = false;
    senderPolicyError =
      'RESEND_FROM must be formatted as "D2C Marketing Hub <hello@d2cmarketinghub.com>".';
  } else if (
    fromEmail === 'onboarding@resend.dev' ||
    fromDomain === 'resend.dev'
  ) {
    senderPolicyValid = false;
    senderPolicyError =
      'Sender onboarding@resend.dev is not permitted. Use D2C Marketing Hub <hello@d2cmarketinghub.com>.';
  } else if (fromDomain === 'gmail.com' || fromDomain === 'googlemail.com') {
    senderPolicyValid = false;
    senderPolicyError =
      'Gmail addresses cannot be used as the outgoing sender. Use D2C Marketing Hub <hello@d2cmarketinghub.com>.';
  } else if (fromEmail !== OFFICIAL_SENDER_EMAIL) {
    senderPolicyValid = false;
    senderPolicyError = `Outgoing sender must be ${OFFICIAL_SENDER_EMAIL} on verified domain ${OFFICIAL_SENDER_DOMAIN}.`;
  }

  return {
    apiKey,
    fromHeader,
    fromEmail,
    fromDomain,
    adminRecipient,
    senderPolicyValid,
    senderPolicyError,
  };
}

function persistInquiry(record: StoredInquiry): boolean {
  try {
    let existing: StoredInquiry[] = [];
    if (fs.existsSync(INQUIRY_STORE_PATH)) {
      const raw = fs.readFileSync(INQUIRY_STORE_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        existing = parsed as StoredInquiry[];
      }
    }
    existing.push(record);
    fs.writeFileSync(INQUIRY_STORE_PATH, JSON.stringify(existing, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to persist inquiry record:', err);
    return false;
  }
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string): boolean {
  if (!/^[+\d\s().-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

function isValidOptionalUrl(value: string): boolean {
  if (!value) return true;
  try {
    const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const url = new URL(normalized);
    return url.hostname.includes('.');
  } catch {
    return false;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatSubmissionTimestamp(isoDate: string): string {
  const date = new Date(isoDate);
  const formattedIst = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(date);
  return `${formattedIst} IST (${isoDate})`;
}

function buildAdminNotificationEmail(record: StoredInquiry): {
  subject: string;
  text: string;
  html: string;
} {
  const submittedAt = formatSubmissionTimestamp(record.createdAt);
  const websiteDisplay = record.website || 'Not provided';

  const text = [
    'NEW PROJECT INQUIRY RECEIVED',
    '',
    'Client Information:',
    `- Name: ${record.name}`,
    `- Email: ${record.email}`,
    `- Phone / WhatsApp: ${record.phone}`,
    `- Company: ${record.company}`,
    `- Website: ${websiteDisplay}`,
    '',
    'Project Details:',
    `- Service: ${record.service}`,
    `- Investment: ${record.budget}`,
    `- Project Goals: ${record.message}`,
    '',
    `Submission Date & Time: ${submittedAt}`,
    `Inquiry Reference: ${record.id}`,
  ].join('\n');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(ADMIN_EMAIL_SUBJECT)}</title>
      </head>
      <body style="margin: 0; padding: 24px 12px; background-color: #f3f3f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #111111;">
        <div style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 16px; overflow: hidden;">
          <div style="background-color: #111111; color: #ffffff; padding: 26px 28px;">
            <div style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #b4ff35; font-weight: 700; margin-bottom: 8px;">
              D2C Marketing Hub
            </div>
            <h1 style="margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.01em;">
              NEW PROJECT INQUIRY RECEIVED
            </h1>
          </div>

          <div style="padding: 28px;">
            <h2 style="margin: 0 0 12px; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #666666;">
              Client Information
            </h2>
            <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
              <tr>
                <td style="padding: 9px 0; border-bottom: 1px solid #eeeeee; color: #666666; width: 160px;">Full Name</td>
                <td style="padding: 9px 0; border-bottom: 1px solid #eeeeee; font-weight: 600;">${escapeHtml(record.name)}</td>
              </tr>
              <tr>
                <td style="padding: 9px 0; border-bottom: 1px solid #eeeeee; color: #666666;">Work Email</td>
                <td style="padding: 9px 0; border-bottom: 1px solid #eeeeee;"><a href="mailto:${escapeHtml(record.email)}" style="color: #111111; font-weight: 600;">${escapeHtml(record.email)}</a></td>
              </tr>
              <tr>
                <td style="padding: 9px 0; border-bottom: 1px solid #eeeeee; color: #666666;">Phone / WhatsApp</td>
                <td style="padding: 9px 0; border-bottom: 1px solid #eeeeee;">${escapeHtml(record.phone)}</td>
              </tr>
              <tr>
                <td style="padding: 9px 0; border-bottom: 1px solid #eeeeee; color: #666666;">Brand / Company</td>
                <td style="padding: 9px 0; border-bottom: 1px solid #eeeeee; font-weight: 600;">${escapeHtml(record.company)}</td>
              </tr>
              <tr>
                <td style="padding: 9px 0; border-bottom: 1px solid #eeeeee; color: #666666;">Website</td>
                <td style="padding: 9px 0; border-bottom: 1px solid #eeeeee;">${escapeHtml(websiteDisplay)}</td>
              </tr>
            </table>

            <h2 style="margin: 0 0 12px; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #666666;">
              Project Details
            </h2>
            <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
              <tr>
                <td style="padding: 9px 0; border-bottom: 1px solid #eeeeee; color: #666666; width: 160px;">Primary Service</td>
                <td style="padding: 9px 0; border-bottom: 1px solid #eeeeee; font-weight: 600;">${escapeHtml(record.service)}</td>
              </tr>
              <tr>
                <td style="padding: 9px 0; border-bottom: 1px solid #eeeeee; color: #666666;">Investment Scope</td>
                <td style="padding: 9px 0; border-bottom: 1px solid #eeeeee; font-weight: 600;">${escapeHtml(record.budget)}</td>
              </tr>
            </table>

            <div style="background-color: #f6f6f6; border-radius: 10px; padding: 16px 18px; margin-bottom: 24px;">
              <div style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #666666; margin-bottom: 8px; font-weight: 700;">
                Project Overview &amp; Goals
              </div>
              <div style="font-size: 14px; line-height: 1.65; white-space: pre-wrap; color: #111111;">${escapeHtml(record.message)}</div>
            </div>

            <div style="border-top: 1px solid #eeeeee; padding-top: 16px; font-size: 12px; color: #666666;">
              <div><strong>Submission Date &amp; Time:</strong> ${escapeHtml(submittedAt)}</div>
              <div style="margin-top: 4px;"><strong>Inquiry Reference ID:</strong> <span style="font-family: monospace; color: #111111; font-weight: 600;">${escapeHtml(record.id)}</span></div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return {
    subject: ADMIN_EMAIL_SUBJECT,
    text,
    html,
  };
}

function buildCustomerConfirmationEmail(record: StoredInquiry): {
  subject: string;
  text: string;
  html: string;
} {
  const submittedAt = formatSubmissionTimestamp(record.createdAt);

  const text = [
    `Hi ${record.name},`,
    '',
    'Thank you for reaching out to D2C Marketing Hub. Your project inquiry has been received and our strategy team is reviewing your brief.',
    '',
    'Inquiry Summary:',
    `- Inquiry Reference ID: ${record.id}`,
    `- Brand / Company: ${record.company}`,
    `- Selected Service: ${record.service}`,
    `- Estimated Investment Scope: ${record.budget}`,
    `- Submitted On: ${submittedAt}`,
    '',
    'What Happens Next:',
    'Our team will review your project goals and respond within 24 business hours.',
    '',
    'If you have additional context or campaign materials to share, simply reply to hello@d2cmarketinghub.com.',
    '',
    'Best regards,',
    'D2C Marketing Hub',
    'hello@d2cmarketinghub.com',
  ].join('\n');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(CUSTOMER_EMAIL_SUBJECT)}</title>
      </head>
      <body style="margin: 0; padding: 24px 12px; background-color: #f3f3f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #111111;">
        <div style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 16px; overflow: hidden;">
          <div style="background-color: #101010; color: #ffffff; padding: 30px 28px;">
            <div style="display: inline-block; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #b4ff35; font-weight: 700; margin-bottom: 10px;">
              D2C Marketing Hub
            </div>
            <h1 style="margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.2;">
              Project Inquiry Received.
            </h1>
            <p style="margin: 10px 0 0; font-size: 13px; color: rgba(255, 255, 255, 0.72); line-height: 1.5;">
              Strategy · Creativity · Performance
            </p>
          </div>

          <div style="padding: 30px 28px;">
            <p style="margin: 0 0 14px; font-size: 16px; font-weight: 600; color: #111111;">
              Hi ${escapeHtml(record.name)},
            </p>
            <p style="margin: 0 0 22px; font-size: 14px; line-height: 1.7; color: #333333;">
              Thank you for getting in touch with <strong>D2C Marketing Hub</strong>. We have received your inquiry for <strong>${escapeHtml(record.company)}</strong>, and our strategy team will respond within <strong>24 business hours</strong>.
            </p>

            <div style="background-color: #f6f6f6; border: 1px solid #ebebeb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <div style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #666666; font-weight: 700; margin-bottom: 14px;">
                Inquiry Reference &amp; Summary
              </div>
              <table role="presentation" style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                  <td style="padding: 7px 0; border-bottom: 1px solid #e5e5e5; color: #666666; width: 170px;">Inquiry Reference ID</td>
                  <td style="padding: 7px 0; border-bottom: 1px solid #e5e5e5; font-weight: 700; font-family: monospace; color: #111111;">${escapeHtml(record.id)}</td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; border-bottom: 1px solid #e5e5e5; color: #666666;">Selected Service</td>
                  <td style="padding: 7px 0; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #111111;">${escapeHtml(record.service)}</td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; border-bottom: 1px solid #e5e5e5; color: #666666;">Investment Scope</td>
                  <td style="padding: 7px 0; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #111111;">${escapeHtml(record.budget)}</td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; color: #666666;">Submitted On</td>
                  <td style="padding: 7px 0; color: #111111;">${escapeHtml(submittedAt)}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #111111; color: #ffffff; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px;">
              <div style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #b4ff35; font-weight: 700; margin-bottom: 6px;">
                Response Guarantee
              </div>
              <div style="font-size: 13px; line-height: 1.6; color: rgba(255, 255, 255, 0.88);">
                Our team typically reviews briefs and replies with tailored recommendations within <strong>24 business hours</strong>.
              </div>
            </div>

            <p style="margin: 0 0 22px; font-size: 13px; line-height: 1.65; color: #555555;">
              Want to add a pitch deck, storefront link, or campaign goals before we connect? Reply directly to this email or write to <a href="mailto:hello@d2cmarketinghub.com" style="color: #111111; font-weight: 600;">hello@d2cmarketinghub.com</a>.
            </p>

            <div style="border-top: 1px solid #eeeeee; padding-top: 18px; font-size: 12px; color: #666666; line-height: 1.6;">
              <strong style="color: #111111;">D2C Marketing Hub</strong><br />
              hello@d2cmarketinghub.com
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return {
    subject: CUSTOMER_EMAIL_SUBJECT,
    text,
    html,
  };
}

async function sendViaResend(params: {
  apiKey: string;
  from: string;
  to: string[];
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}): Promise<{ ok: true; id: string } | { ok: false; status: number; error: string }> {
  const sendOnce = async () => {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: params.from,
        to: params.to,
        reply_to: params.replyTo,
        subject: params.subject,
        text: params.text,
        html: params.html,
      }),
    });

    const body = (await res.json().catch(() => null)) as {
      id?: string;
      message?: string;
      name?: string;
    } | null;

    return { res, body };
  };

  let attempt = await sendOnce();
  // Resend enforces a 2 req/sec default rate limit; retry once smoothly on 429
  if (attempt.res.status === 429) {
    await new Promise((resolve) => setTimeout(resolve, 650));
    attempt = await sendOnce();
  }

  if (!attempt.res.ok || !attempt.body?.id) {
    const rawMsg =
      attempt.body?.message ||
      `Resend API returned status ${attempt.res.status}`;

    return {
      ok: false,
      status: attempt.res.status,
      error: rawMsg,
    };
  }

  return {
    ok: true,
    id: attempt.body.id,
  };
}

async function checkResendDomainStatus(apiKey: string): Promise<{
  checked: boolean;
  domainVerified: boolean | null;
  status: string;
}> {
  if (!apiKey) {
    return { checked: false, domainVerified: null, status: 'missing_api_key' };
  }
  try {
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) {
      return {
        checked: false,
        domainVerified: null,
        status:
          res.status === 401 || res.status === 403
            ? 'restricted_sending_key'
            : `http_${res.status}`,
      };
    }
    const payload = (await res.json().catch(() => null)) as {
      data?: Array<{ name?: string; status?: string }>;
    } | null;
    const match = payload?.data?.find(
      (d) => d.name?.toLowerCase() === OFFICIAL_SENDER_DOMAIN
    );
    if (!match) {
      return {
        checked: true,
        domainVerified: false,
        status: 'domain_not_registered',
      };
    }
    return {
      checked: true,
      domainVerified: match.status === 'verified',
      status: match.status || 'unknown',
    };
  } catch {
    return { checked: false, domainVerified: null, status: 'lookup_failed' };
  }
}

async function deliverInquiryEmails(
  record: StoredInquiry
): Promise<EmailDeliveryStatus> {
  const config = getResendConfig();

  if (!config.apiKey) {
    console.warn('Resend email delivery skipped: RESEND_API_KEY is not configured.');
    return {
      adminNotificationSent: false,
      customerConfirmationSent: false,
    };
  }

  if (!config.senderPolicyValid) {
    console.warn('Resend sender policy rejected:', config.senderPolicyError);
    return {
      adminNotificationSent: false,
      customerConfirmationSent: false,
    };
  }

  const adminContent = buildAdminNotificationEmail(record);
  const adminSend = await sendViaResend({
    apiKey: config.apiKey,
    from: config.fromHeader,
    to: [config.adminRecipient],
    replyTo: record.email,
    subject: adminContent.subject,
    text: adminContent.text,
    html: adminContent.html,
  });

  if (!adminSend.ok) {
    console.warn(
      `Resend admin notification failed (${adminSend.status}) for ${record.id}:`,
      adminSend.error
    );
  }

  const customerContent = buildCustomerConfirmationEmail(record);
  const customerSend = await sendViaResend({
    apiKey: config.apiKey,
    from: config.fromHeader,
    to: [record.email],
    replyTo: OFFICIAL_SENDER_EMAIL,
    subject: customerContent.subject,
    text: customerContent.text,
    html: customerContent.html,
  });

  if (!customerSend.ok) {
    console.warn(
      `Resend customer confirmation failed (${customerSend.status}) for ${record.id}:`,
      customerSend.error
    );
  }

  return {
    adminNotificationSent: adminSend.ok,
    customerConfirmationSent: customerSend.ok,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/health', async (_req: Request, res: Response) => {
    const config = getResendConfig();
    const domainCheck = await checkResendDomainStatus(config.apiKey);
    res.json({
      ok: true,
      provider: 'resend',
      emailConfigured: Boolean(config.apiKey) && config.senderPolicyValid,
      sender: config.fromHeader,
      senderPolicyValid: config.senderPolicyValid,
      senderPolicyError: config.senderPolicyError ?? null,
      domainCheck,
      recipient: config.adminRecipient,
    });
  });

  app.post('/api/inquiries', async (req: Request, res: Response) => {
    const body = (req.body ?? {}) as InquiryPayload;

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const company = typeof body.company === 'string' ? body.company.trim() : '';
    const website = typeof body.website === 'string' ? body.website.trim() : '';
    const service = typeof body.service === 'string' ? body.service.trim() : '';
    const budget = typeof body.budget === 'string' ? body.budget.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    const fieldErrors: Record<string, string> = {};

    if (name.length < 2) {
      fieldErrors.name = 'Please enter your full name (at least 2 characters).';
    }
    if (!email || !isValidEmail(email)) {
      fieldErrors.email = 'Please enter a valid work email address.';
    }
    if (!phone || !isValidPhone(phone)) {
      fieldErrors.phone = 'Please enter a valid phone or WhatsApp number.';
    }
    if (company.length < 2) {
      fieldErrors.company = 'Please enter your brand or company name.';
    }
    if (website && !isValidOptionalUrl(website)) {
      fieldErrors.website = 'Please enter a valid website URL (e.g. https://yourbrand.com).';
    }
    if (!service) {
      fieldErrors.service = 'Please select a primary service interest.';
    }
    if (!VALID_BUDGETS.has(budget)) {
      fieldErrors.budget = 'Please select an estimated investment scope.';
    }
    if (message.length < 15) {
      fieldErrors.message =
        'Please share a short project overview (at least 15 characters).';
    }

    if (Object.keys(fieldErrors).length > 0) {
      res.status(400).json({
        ok: false,
        saved: false,
        error: 'Please review the highlighted fields and try again.',
        fieldErrors,
      });
      return;
    }

    const signature = `${email.toLowerCase()}|${service}|${message.slice(0, 120)}`;
    const now = Date.now();
    const lastSeen = recentSubmissions.get(signature);
    if (lastSeen && now - lastSeen < DEDUPE_WINDOW_MS) {
      res.status(409).json({
        ok: false,
        saved: false,
        error:
          'We already received this project inquiry a moment ago. Our team will respond within 24 business hours.',
      });
      return;
    }

    const inquiryRecord: StoredInquiry = {
      id: `INQ-${now.toString(36).toUpperCase()}`,
      name,
      email,
      phone,
      company,
      website,
      service,
      budget,
      message,
      createdAt: new Date(now).toISOString(),
    };

    // Save the inquiry first; fail loudly if saving itself fails
    const saved = persistInquiry(inquiryRecord);
    if (!saved) {
      res.status(500).json({
        ok: false,
        saved: false,
        error:
          'We could not record your inquiry right now. Please try again or email hello@d2cmarketinghub.com.',
      });
      return;
    }

    recentSubmissions.set(signature, now);

    // Trigger both admin notification and customer confirmation independently
    const emailStatus = await deliverInquiryEmails(inquiryRecord);
    const emailDelivered =
      emailStatus.adminNotificationSent && emailStatus.customerConfirmationSent;

    res.status(201).json({
      ok: true,
      saved: true,
      inquiryId: inquiryRecord.id,
      receivedAt: inquiryRecord.createdAt,
      emailDelivered,
      emailStatus,
    });
  });

  if (!IS_PRODUCTION) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

import { Resend } from 'resend';
import { config } from '../../config/env';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const resend = config.RESEND_API_KEY ? new Resend(config.RESEND_API_KEY) : null;

export async function sendEmail({ to, subject, html, text }: EmailPayload) {
  if (!resend) {
    console.log(`[email:dev] to=${to} subject=${subject}\n${text ?? html}`);
    return;
  }
  const { error } = await resend.emails.send({
    from: config.EMAIL_FROM,
    to,
    subject,
    html,
    text,
  });
  if (error) {
    console.error('Resend send failed:', error);
    throw new Error(`Email send failed: ${error.message}`);
  }
}

import nodemailer from 'nodemailer';

/**
 * Server-side utility to send emails via Resend SMTP.
 * Rebranded to QuantisAI Labs.
 */
export async function sendVerificationEmail(to: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error('[MAIL] Missing RESEND_API_KEY. Email will not be sent.');
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 465,
    secure: true,
    auth: {
      user: 'resend',
      pass: apiKey,
    },
  });

  const fromAddress = process.env.EMAIL_FROM || 'QuantisAI Labs <onboarding@resend.dev>';

  const mailOptions = {
    from: fromAddress,
    to,
    subject: 'Verify your QuantisAI Labs account',
    html: `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="margin: 0; color: #FF6600; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">QuantisAI Labs</h1>
          <p style="margin-top: 8px; color: #64748b; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em;">🎉 Congratulations! Your account is almost ready</p>
        </div>
        
        <div style="margin-bottom: 32px; color: #1e293b;">
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Welcome to QuantisAI Labs. To activate your account and start generating studio-quality voices, please verify your email address using the code below:</p>
          
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 900; letter-spacing: 0.2em; color: #1e293b;">${code}</span>
          </div>
          
          <p style="font-size: 14px; color: #64748b; font-style: italic; text-align: center;">This code will expire in 10 minutes for your security.</p>
        </div>
        
        <div style="border-top: 1px solid #f1f5f9; pt-24; margin-top: 32px; padding-top: 24px; color: #94a3b8; font-size: 12px; text-align: center; line-height: 1.5;">
          <p style="margin: 0;">If you didn't create an account with QuantisAI Labs, you can safely ignore this email.</p>
          <p style="margin-top: 8px;">&copy; ${new Date().getFullYear()} QuantisAI Labs Systems. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAIL] Verification email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[MAIL] Failed to send email to ${to}:`, error);
    throw error;
  }
}

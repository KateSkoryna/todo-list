import nodemailer from 'nodemailer';

const isProduction = process.env.EMAIL_PROVIDER === 'resend';

const smtpConfig = isProduction
  ? {
      host: process.env.RESEND_HOST,
      port: Number(process.env.RESEND_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.RESEND_USER,
        pass: process.env.RESEND_PASS,
      },
    }
  : {
      host: process.env.MAILTRAP_HOST,
      port: Number(process.env.MAILTRAP_PORT) || 2525,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    };

const transporter = nodemailer.createTransport(smtpConfig);

const fromAddress = isProduction
  ? process.env.RESEND_FROM
  : process.env.MAILTRAP_FROM;

export const sendPasswordResetEmail = async (
  to: string,
  resetToken: string
): Promise<void> => {
  const appUrl = process.env.APP_URL || 'http://localhost:4200';
  const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: fromAddress,
    to,
    subject: 'Reset your password',
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to set a new password. The link expires in 1 hour.</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });
};

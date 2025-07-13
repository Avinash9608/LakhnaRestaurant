import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(email: string, otp: string) {
  try {
    await transporter.sendMail({
      from: `"Gastronomic Gateway" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Account - Gastronomic Gateway',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Welcome to Gastronomic Gateway!</h2>
          <p>Thank you for registering. Please use the following One-Time Password (OTP) to verify your account:</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${otp}</p>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });
    return { success: true, message: 'Verification email sent.' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send verification email.' };
  }
}

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    await transporter.sendMail({
      from: `"Lakhna Restaurant" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return { success: true, message: 'Email sent successfully.' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email.' };
  }
}

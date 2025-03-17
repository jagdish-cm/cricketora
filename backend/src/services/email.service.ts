
import nodemailer from 'nodemailer';
import { config } from '../config/config';

// Create reusable transporter
const createTransporter = () => {
  // For production, you would use actual SMTP credentials
  // For development/testing, we can use a test account
  
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });
  } else {
    // For development, you might want to use services like Ethereal or Mailtrap
    // or console.log the email content for testing
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: config.email.testUser || '',
        pass: config.email.testPassword || '',
      },
    });
  }
};

/**
 * Send OTP verification email
 * @param to Recipient email
 * @param otp One-time password
 * @param matchId Match identifier
 * @param accessCode Access code for the match
 */
export const sendOtpEmail = async (
  to: string,
  otp: string,
  matchId: string,
  accessCode: string
): Promise<void> => {
  const transporter = createTransporter();
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #2e7d32; text-align: center;">CricketOra Verification Code</h2>
      <p>Hello,</p>
      <p>Thank you for using CricketOra! Please use the verification code below to complete your match setup:</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px;">${otp}</span>
      </div>
      <p><strong>Match ID:</strong> ${matchId}</p>
      <p><strong>Access Code:</strong> ${accessCode}</p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center;">
        &copy; ${new Date().getFullYear()} CricketOra. All rights reserved.
      </p>
    </div>
  `;
  
  const mailOptions = {
    from: `"CricketOra" <${config.email.from || 'noreply@cricketora.com'}>`,
    to,
    subject: 'Your CricketOra Verification Code',
    text: `Your verification code is: ${otp}\nMatch ID: ${matchId}\nAccess Code: ${accessCode}`,
    html: htmlContent,
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV !== 'production') {
      // Log email preview URL in development mode
      console.log(`Email sent: ${info.messageId}`);
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
};

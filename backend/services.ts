// src/services/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email sending failed:', error.message);
    throw error;
  }
};

// src/services/notification.ts
import { User } from '../models/User';
import { sendEmail } from './email';
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendAppointmentNotification = async (
  userId: string,
  appointmentDate: Date,
  type: 'confirmation' | 'reminder' | 'cancellation'
) => {
  const user = await User.findById(userId).exec();
  if (!user) {
    console.error('User not found for ID:', userId);
    throw new Error('User not found');
  }

  const templates = {
    confirmation: {
      subject: 'Appointment Confirmation',
      message: `Your appointment has been confirmed for ${appointmentDate.toLocaleDateString()}`,
    },
    reminder: {
      subject: 'Appointment Reminder',
      message: `Reminder: You have an appointment scheduled for ${appointmentDate.toLocaleDateString()}`,
    },
    cancellation: {
      subject: 'Appointment Cancelled',
      message: `Your appointment for ${appointmentDate.toLocaleDateString()} has been cancelled`,
    },
  };

  const template = templates[type];

  // Send email
  await sendEmail(user.email, template.subject, template.message);

  // Send SMS
  if (user.profile.phone && /^[0-9]{10}$/.test(user.profile.phone)) {
    try {
      await client.messages.create({
        body: template.message,
        to: user.profile.phone,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
    } catch (error) {
      console.error('SMS sending failed:', error.message);
      throw error;
    }
  }
};

// src/services/encryption.ts
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');

export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(12); // Initialization vector
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
};

export const decrypt = (
  encrypted: string,
  iv: string,
  authTag: string
): string => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

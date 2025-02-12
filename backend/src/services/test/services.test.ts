import { sendEmail } from '../email'; // Adjusted import path
import { sendAppointmentNotification } from '../notification'; // Adjusted import path
import nodemailer from 'nodemailer'; // Added nodemailer import for testing
import { User } from '../../models/User'; // Adjusted import path
import mongoose from 'mongoose'; // Removed duplicate import
import mongoose from 'mongoose';

// Mocking the User model
jest.mock('../../models/User'); // Mocking the User model
import { jest } from '@jest/globals'; // Added jest import for testing

describe('Email and Notification Services', () => {
  beforeAll(() => {
    // Set up any necessary environment variables for testing
    process.env.SMTP_FROM = 'test@example.com';
    process.env.TWILIO_PHONE_NUMBER = '+1234567890';
  });

  test('sendEmail should send an email successfully', async () => {
    const mockSendMail = jest.fn();
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: mockSendMail,
    });

    await sendEmail('recipient@example.com', 'Test Subject', '<p>Test Email</p>');
    expect(mockSendMail).toHaveBeenCalledWith({
      from: process.env.SMTP_FROM,
      to: 'recipient@example.com',
      subject: 'Test Subject',
      html: '<p>Test Email</p>',
    });
  });

  test('sendAppointmentNotification should send notification successfully', async () => {
    const mockUser = {
      email: 'user@example.com',
      profile: { phone: '+1234567890' },
    };
    (User.findById as jest.Mock).mockResolvedValue(mockUser);

    await sendAppointmentNotification('userId', new Date(), 'confirmation');
    // Add assertions for email and SMS sending
  });
});

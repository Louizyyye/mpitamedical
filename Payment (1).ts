// src/services/payments/mpesa.ts
import axios from 'axios';
import { generateToken } from './auth';
// import { logger } from './logger'; // Uncomment if logger module is available

interface STKPushParams {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
}

export class MpesaService {
  private baseUrl = 'https://sandbox.safaricom.co.ke';
  private shortcode = process.env.MPESA_SHORTCODE;
  private passkey = process.env.MPESA_PASSKEY;
  private callbackUrl = `${process.env.BASE_URL}/api/payments/mpesa/callback`;

  async initiateSTKPush({
    amount,
    phoneNumber,
    accountReference,
    transactionDesc
  }: STKPushParams) {
    if (!this.shortcode || !this.passkey) {
      throw new Error('MPESA_SHORTCODE and MPESA_PASSKEY must be defined');
    }

    try {
      const token = await generateToken();
      const timestamp = this.getTimestamp();
      const password = this.generatePassword(timestamp);

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: this.shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: phoneNumber,
          PartyB: this.shortcode,
          PhoneNumber: phoneNumber,
          CallBackURL: this.callbackUrl,
          AccountReference: accountReference,
          TransactionDesc: transactionDesc
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // logger.info('M-Pesa STK Push Response:', response.data); // Log response
      return response.data;
    } catch (error) {
      // logger.error('Error initiating M-Pesa STK Push:', error); // Log error
      throw error; // Rethrow the error after logging
    }
  }

  private getTimestamp() {
    return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  }

  private generatePassword(timestamp: string) {
    return Buffer.from(
      `${this.shortcode}${this.passkey}${timestamp}`
    ).toString('base64');
  }
}

interface AirtelMoneyParams {
  amount: number;
  phoneNumber: string;
  reference: string;
}

export class AirtelMoneyService {
  private clientId = process.env.AIRTEL_CLIENT_ID;
  private clientSecret = process.env.AIRTEL_CLIENT_SECRET;
  private baseUrl = 'https://openapiuat.airtel.africa';

  async requestPayment({
    amount,
    phoneNumber,
    reference
  }: AirtelMoneyParams) {
    if (!this.clientId || !this.clientSecret) {
      throw new Error('AIRTEL_CLIENT_ID and AIRTEL_CLIENT_SECRET must be defined');
    }

    try {
      const token = await this.getToken();

      const response = await axios.post(
        `${this.baseUrl}/merchant/v1/payments/`,
        {
          reference: reference,
          subscriber: {
            country: "KE",
            currency: "KES",
            msisdn: phoneNumber
          },
          transaction: {
            amount: amount,
            country: "KE",
            currency: "KES",
            id: reference
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Country': 'KE',
            'X-Currency': 'KES',
            Authorization: `Bearer ${token}`
          }
        }
      );

      // logger.info('Airtel Money Payment Response:', response.data); // Log response
      return response.data;
    } catch (error) {
      // logger.error('Error requesting Airtel Money Payment:', error); // Log error
      throw error; // Rethrow the error after logging
    }
  }

  private async getToken() {
    const auth = Buffer.from(
      `${this.clientId}:${this.clientSecret}`
    ).toString('base64');

    const response = await axios.post(
      `${this.baseUrl}/auth/oauth2/token`,
      {
        grant_type: 'client_credentials'
      },
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    );

    return response.data.access_token;
  }
}

// src/models/Subscription.ts
import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Basic', 'Community', 'Premium', 'Enterprise']
  },
  features: [{
    type: String,
    required: true
  }],
  pricing: {
    monthly: {
      amount: Number,
      currency: String
    },
    yearly: {
      amount: Number,
      currency: String
    },
    payAsYouGo: {
      baseAmount: Number,
      perVisit: Number,
      currency: String
    }
  },
  limitations: {
    monthlyAppointments: Number,
    storageGB: Number,
    maxDoctors: Number,
    maxPatients: Number
  }
});

export const subscriptionPlans = [
  {
    name: 'Basic',
    features: [
      'Appointment Management',
      'Basic Health Records',
      'SMS Notifications',
      'Offline Access'
    ],
    pricing: {
      monthly: { amount: 5, currency: 'USD' },
      yearly: { amount: 50, currency: 'USD' },
      payAsYouGo: { baseAmount: 2, perVisit: 0.5, currency: 'USD' }
    },
    limitations: {
      monthlyAppointments: 50,
      storageGB: 1,
      maxDoctors: 2,
      maxPatients: 100
    }
  },
  {
    name: 'Community',
    features: [
      'Basic Features',
      'Community Health Worker Portal',
      'Group Appointments',
      'Health Education Materials',
      'Multi-language Support'
    ],
    pricing: {
      monthly: { amount: 15, currency: 'USD' },
      yearly: { amount: 150, currency: 'USD' },
      payAsYouGo: { baseAmount: 5, perVisit: 0.3, currency: 'USD' }
    },
    limitations: {
      monthlyAppointments: 200,
      storageGB: 5,
      maxDoctors: 5,
      maxPatients: 500
    }
  },
  {
    name: 'Premium',
    features: [
      'Community Features',
      'Telemedicine',
      'Advanced Analytics',
      'Custom Forms',
      'API Access'
    ],
    pricing: {
      monthly: { amount: 50, currency: 'USD' },
      yearly: { amount: 500, currency: 'USD' },
      payAsYouGo: { baseAmount: 20, perVisit: 0.2, currency: 'USD' }
    },
    limitations: {
      monthlyAppointments: 1000,
      storageGB: 20,
      maxDoctors: 20,
      maxPatients: 2000
    }
  }
];

// src/services/billing.ts
export class BillingService {
  async calculateUsage(organizationId: string, period: 'monthly' | 'yearly'): Promise<{ baseAmount: number; additionalCharges: number; total: number }> {
    const usage = await this.getUsageMetrics(organizationId);
    const plan = await this.getCurrentPlan(organizationId) || { pricing: { [period]: { amount: 0 } }, limitations: { monthlyAppointments: 0 } };
    
    let billing = {
      baseAmount: plan.pricing[period].amount,
      additionalCharges: 0,
      total: 0
    };

    if (usage.appointments > (plan.limitations?.monthlyAppointments || 0)) {
      const extraAppointments = usage.appointments - plan.limitations.monthlyAppointments;
      billing.additionalCharges += extraAppointments * plan.pricing.payAsYouGo.perVisit;
    }

    billing.total = billing.baseAmount + billing.additionalCharges;
    return billing;
  }

  private async getUsageMetrics(organizationId: string) {
    // Implementation for usage tracking
    return {
      appointments: 0,
      storageUsed: 0,
      activePatients: 0,
      activeDoctors: 0
    };
  }
}

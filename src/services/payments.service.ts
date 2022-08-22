import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import Stripe from 'stripe';
import { Model } from 'mongoose';
import { User } from '../interfaces/user.interface';

@Injectable()
export class PaymentService {
  private stripe;
  constructor(@InjectModel('User') private readonly Users: Model<User>) {
    this.stripe = new Stripe(process.env.STRIPE_API, {
      apiVersion: '2022-08-01',
    });
  }

  // Payment for feed
  async chargePayment(userId: string, email: string): Promise<any> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 8,
          exp_year: 2023,
          cvc: '314',
        },
      });

      const customer = await this.stripe.customers.create({
        email: email,
        id: userId,
        payment_method: paymentMethod.id,
      });

      const charge = await this.stripe.charges.create({
        amount: '10',
        description: 'Social Feed Payment',
        currency: 'USD',
        customer: customer.id,
      });

      const updatedUser = await this.Users.findOneAndUpdate(
        { _id: userId },
        { $set: { type: 'paid' } },
      );
      return {
        success: true,
        message: 'Payment successful',
        user: updatedUser,
        charge: charge,
      };
    } catch (error) {
      return {
        success: false,
        msg: 'Something went wrong',
        error: error,
      };
    }
  }
}

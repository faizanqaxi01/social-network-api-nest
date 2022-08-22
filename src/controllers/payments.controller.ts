import { Controller, Post, Body } from '@nestjs/common';

import { PaymentService } from '../services/payments.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/')
  async chargePayment(
    @Body('userId') userId: string,
    @Body('email') email: string,
  ) {
    return await this.paymentService.chargePayment(userId, email);
  }
}

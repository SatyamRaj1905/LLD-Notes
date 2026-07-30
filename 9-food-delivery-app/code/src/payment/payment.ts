import { PaymentStatus } from "../enum";

// ! Following STRATEGY PATTERN (strategies are CreditCard, DebitCard and UPI)
export interface IPayment {
  pay(amount: number): PaymentStatus;
  refund(amount: number): PaymentStatus;
}

export class CreditCard implements IPayment {
  pay(amount: number): PaymentStatus {
    console.log("Credit card payment for amount - ", amount);
    return PaymentStatus.COMPLETED;
  }
  refund(amount: number): PaymentStatus {
    console.log("Credit refund for amount - ", amount);
    return PaymentStatus.COMPLETED;
  }
}
export class DebitCard implements IPayment {
  pay(amount: number): PaymentStatus {
    console.log("Debit card payment for amount - ", amount);
    return PaymentStatus.COMPLETED;
  }
  refund(amount: number): PaymentStatus {
    console.log("Debit refund for amount - ", amount);
    return PaymentStatus.COMPLETED;
  }
}
export class UPI implements IPayment {
  pay(amount: number): PaymentStatus {
    console.log("UPI card payment for amount - ", amount);
    return PaymentStatus.COMPLETED;
  }
  refund(amount: number): PaymentStatus {
    console.log("UPI refund for amount - ", amount);
    return PaymentStatus.COMPLETED;
  }
}

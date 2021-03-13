import { Publisher, Subjects, PaymentCreatedEvent } from '@akdelivery/custom';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
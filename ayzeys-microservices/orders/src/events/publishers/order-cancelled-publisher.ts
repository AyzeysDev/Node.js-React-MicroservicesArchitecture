import { Publisher, OrderCancelledEvent, Subjects } from '@akdelivery/custom';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

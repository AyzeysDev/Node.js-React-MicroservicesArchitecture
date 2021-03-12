import { Publisher, OrderCreatedEvent, Subjects } from '@akdelivery/custom';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

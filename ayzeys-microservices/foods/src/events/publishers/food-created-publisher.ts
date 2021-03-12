import { Publisher, Subjects, FoodCreatedEvent } from '@akdelivery/custom';

export class FoodCreatedPublisher extends Publisher<FoodCreatedEvent> {
  subject: Subjects.FoodCreated = Subjects.FoodCreated;
}
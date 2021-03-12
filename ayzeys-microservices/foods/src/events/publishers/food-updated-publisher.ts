import { Publisher, Subjects, FoodUpdatedEvent } from '@akdelivery/custom';

export class FoodUpdatedPublisher extends Publisher<FoodUpdatedEvent> {
  subject: Subjects.FoodUpdated = Subjects.FoodUpdated;
}
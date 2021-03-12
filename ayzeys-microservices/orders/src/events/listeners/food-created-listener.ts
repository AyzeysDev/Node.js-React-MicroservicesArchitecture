import { Message } from 'node-nats-streaming';
import { Subjects, Listener, FoodCreatedEvent } from '@akdelivery/custom';
import { Food } from '../../models/food';
import { queueGroupName } from './queue-group-name';

export class FoodCreatedListener extends Listener<FoodCreatedEvent> {
  subject: Subjects.FoodCreated = Subjects.FoodCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: FoodCreatedEvent['data'], msg: Message) {
    const { id, name, price } = data;
    const food = Food.build({
      id, name, price,
    });
    
    await food.save();

    msg.ack();
  }
}
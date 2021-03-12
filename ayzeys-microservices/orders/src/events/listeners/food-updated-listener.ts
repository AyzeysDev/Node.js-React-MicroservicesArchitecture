import { Message } from 'node-nats-streaming';
import { Subjects, Listener, FoodUpdatedEvent } from '@akdelivery/custom';
import { Food } from '../../models/food';
import { queueGroupName } from './queue-group-name';

export class FoodUpdatedListener extends Listener<FoodUpdatedEvent> {
  subject: Subjects.FoodUpdated = Subjects.FoodUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: FoodUpdatedEvent['data'], msg: Message) {
    const food = await Food.findByEvent(data);

    if(!food) {
      throw new Error('Food not found');
    }
    
    const { name, price } = data;
    
    food.set({ name, price });
 
    await food.save();

    msg.ack();
  }
}
import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@akdelivery/custom';
import { queueGroupName } from './queue-group-name';
import { Food } from '../../models/foods';
import { FoodUpdatedPublisher } from '../publishers/food-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const food = await Food.findById(data.food.id);
    
    if(!food) {
      throw new Error('Food not found');
    }

    food.set({ orderId: data.id });

    await food.save();
    new FoodUpdatedPublisher(this.client).publish({
      id: food.id,
      price: food.price,
      name: food.name,
      userId: food.userId,
      orderId: food.orderId,
      version: food.version
    });

    msg.ack();
  }
}
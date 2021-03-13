import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@akdelivery/custom';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
//import { FoodUpdatedPublisher } from '../publishers/food-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = await Order.build({
      id: data.id,
      price: data.food.price,
      status: data.status,
      userId: data.userId,
      version: data.version
    });

    await order.save();

    msg.ack();

  }
}
 
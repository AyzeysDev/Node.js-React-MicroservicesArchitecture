import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ExpirationCompleteEvent, OrderStatus } from '@akdelivery/custom';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('food');

    if(!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.Completed) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();
    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      food: {
        id: order.food.id
      }
    });

    msg.ack();
  }
}
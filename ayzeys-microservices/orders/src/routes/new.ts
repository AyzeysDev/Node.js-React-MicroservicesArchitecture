import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@akdelivery/custom';
import { body } from 'express-validator';
import { Food } from '../models/food';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_SECONDS = 15 * 60;

router.post('/api/orders', requireAuth, [
  body('foodId').not().isEmpty()
  .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
  .withMessage('Food ID must be provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { foodId } = req.body;

    const food = await Food.findById(foodId);

    if(!food) {
      throw new NotFoundError();
    }

    const isReserved = await food.isReserved();
    if(isReserved) {
      throw new BadRequestError('Food is already Reserved');
    }


    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      food,
    });
    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      food: {
        id: food.id,
        price: food.price,
      },
    });

    res.status(201).send(order);
});

export { router as newOrderRouter };
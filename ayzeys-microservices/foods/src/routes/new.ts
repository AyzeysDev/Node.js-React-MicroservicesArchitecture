import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@akdelivery/custom';
import { Food } from '../models/foods';
import { FoodCreatedPublisher } from '../events/publishers/food-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/foods', requireAuth, [
  body('name').not().isEmpty().withMessage('Name of the Food is Required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
], validateRequest, 
   async (req: Request, res: Response) => {
    const { name, price } = req.body;

    const food = Food.build({ name, price, userId: req.currentUser!.id});

    await food.save();

    new FoodCreatedPublisher(natsWrapper.client).publish({
      id: food.id,
      name: food.name,
      price: food.price,
      userId: food.userId,
      version: food.version,
    });

    res.status(201).send(food);
});

export { router as newFoodRouter };
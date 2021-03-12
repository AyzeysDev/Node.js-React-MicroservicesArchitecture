import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError, BadRequestError } from '@akdelivery/custom';
import { Food } from '../models/foods';
import { FoodUpdatedPublisher } from '../events/publishers/food-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put('/api/foods/:id', requireAuth, 
  [
    body('name').not().isEmpty().withMessage('Name of the Food is Required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
  ], validateRequest, 
  async (req: Request, res: Response) => {
  const food = await Food.findById(req.params.id);

  if(!food) {
    throw new NotFoundError();
  }

  if(food.orderId) {
    throw new BadRequestError('This food is being ordered by someone else, try again');
  }

  if (food.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  food.set({
    name: req.body.name,
    price: req.body.price
  });
  await food.save();
  new FoodUpdatedPublisher(natsWrapper.client).publish({
    id: food.id,
    name: food.name,
    price: food.price,
    userId: food.userId,
    version: food.version,
  });

  res.send(food);
});


export { router as updateFoodRouter };
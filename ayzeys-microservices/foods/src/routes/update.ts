import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError } from '@akdelivery/custom';
import { Food } from '../models/foods';

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

  if (food.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  food.set({
    name: req.body.name,
    price: req.body.price
  });
  await food.save();

  res.send(food);
});


export { router as updateFoodRouter };
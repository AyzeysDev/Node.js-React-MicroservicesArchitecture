import express, { Request, Response } from 'express';
import { NotFoundError } from '@akdelivery/custom';
import { Food } from '../models/foods';

const router = express.Router();

router.get('/api/foods/:id', async (req: Request, res: Response) => {
  const food = await Food.findById(req.params.id);

  if(!food) {
    throw new NotFoundError();
  }

  res.send(food);
});

export { router as showFoodRouter };
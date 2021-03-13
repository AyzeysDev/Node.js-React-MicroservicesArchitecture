import express, { Request, Response } from 'express';
import { Food } from '../models/foods';

const router = express.Router();

router.get('/api/foods', async (req: Request, res: Response) => {
  const foods = await Food.find({
    orderId: undefined,
  });

  // if(!foods) {
  //   throw new NotFoundError();
  // }

  res.send(foods);
});

export { router as indexFoodRouter };
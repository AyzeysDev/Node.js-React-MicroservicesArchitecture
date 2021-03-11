import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@akdelivery/custom';
import { Password } from '../services/password-hash';
import { User } from '../models/user'; 

const router = express.Router();

router.post('/api/users/signin', [
  body('email').isEmail().withMessage('Please provide a valid Email'),
  body('password').trim().notEmpty().withMessage('Please provide a Password') 
 ], 
 validateRequest,
 async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    
    if(!existingUser) {
      throw new BadRequestError('Email not found');
    }

    const passwordMatch = await Password.compare(existingUser.password, password);
    if(!passwordMatch) {
      throw new BadRequestError('Password does not match');
    }

    const userJwt = jwt.sign(
      {
      id: existingUser.id,
      email: existingUser.email
      }, 
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt
    };

    res.status(200).send(existingUser);
 });

export { router as signinRouter };
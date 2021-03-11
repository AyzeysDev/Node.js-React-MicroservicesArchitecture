import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@akdelivery/custom';
import { newFoodRouter } from './routes/new';
import { showFoodRouter } from './routes/show';
import { indexFoodRouter } from './routes/index';
import { updateFoodRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true
  })
);
app.use(currentUser);

app.use(newFoodRouter);
app.use(showFoodRouter);
app.use(indexFoodRouter);
app.use(updateFoodRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
import express from 'express';
import cors from 'cors';
import { errors as celebrateErrors } from 'celebrate';
import mongoose from 'mongoose';
import path from 'path';
import { requestLogger, errorLogger } from './middlewares/logger';
import NotFoundError from './errors/not-found-error';
import errorHandler from './middlewares/error-handler';
import rootRouter from './routes';

import { PORT, DB_ADDRESS } from './config';

const app = express();

if (!DB_ADDRESS) {
  throw new Error('DB_ADDRESS не задан в окружении');
}
mongoose.connect(DB_ADDRESS);
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(requestLogger);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', rootRouter);

app.use((req, _res, next) => {
  const error = new NotFoundError(`Маршрут не найден: ${req.originalUrl}`);
  next(error);
});
app.use(errorLogger);
app.use(celebrateErrors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App on port ${PORT}`);
});

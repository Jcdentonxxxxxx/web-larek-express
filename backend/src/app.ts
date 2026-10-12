import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import errorHandler from './middlewares/error-handler';
import productsRouter from './routes/products';
import orderRouter from './routes/order';


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
app.use(express.static(path.join(__dirname, 'public')));
app.use('/product', productsRouter);
app.use('/order', orderRouter);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App on port ${PORT}`);
});

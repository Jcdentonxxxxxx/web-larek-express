import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import productsRouter from './routes/products';

import { PORT, DB_ADDRESS } from './config';

const app = express();

if (!DB_ADDRESS) {
  throw new Error('DB_ADDRESS не задан в окружении');
}
mongoose.connect(DB_ADDRESS);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use('/product', productsRouter);

app.listen(PORT, () => {
  console.log(`App on port ${PORT}`);
});

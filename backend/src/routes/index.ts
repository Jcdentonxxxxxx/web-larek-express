import { Router } from 'express';
import productsRouter from './products';
import orderRouter from './order';

const router = Router();

router.use('/product', productsRouter);
router.use('/order', orderRouter);

export default router;

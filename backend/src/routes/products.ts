import { Router } from 'express';
import { validateCreateProduct } from '../middlewares/validatons';

import { getProducts, createProduct } from '../controllers/products';

const router = Router();

router.get('/', getProducts);
router.post('/', validateCreateProduct, createProduct);

export default router;

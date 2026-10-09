import { Request, Response } from 'express';
import Product from '../models/product';

export const getProducts = (_req: Request, res: Response) => Product.find({})
  .then((product) => res.send({ product }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const createProduct = (req: Request, res: Response) => {
  const {
    title, image, category, description, price,
  } = req.body;
  return Product.create({
    title, image, category, description, price,
  })
    .then((product) => res.send({ data: product }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

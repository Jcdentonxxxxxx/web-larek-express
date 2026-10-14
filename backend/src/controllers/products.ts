import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import ConflictError from '../errors/conflict-error';
import BadRequestError from '../errors/bad-request-error';
import Product from '../models/product';

export const getProducts = (_req: Request, res: Response, next: NextFunction) => Product.find({})
  .then((product) => res.send({ items: product, total: product.length }))
  .catch((error) => next(error));

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  const {
    title, image, category, description, price,
  } = req.body;
  return Product.create({
    title, image, category, description, price,
  })
    .then((product) => res.status(201).send({ data: product }))
    .catch((error) => {
      if (error instanceof MongooseError) {
        return next(new BadRequestError('Некорректные данные в запросе'));
      }
      if (error instanceof Error && error.message.includes('E11000')) {
        return next(new ConflictError('Товар с таким заголовком уже существует'));
      }
      return next(error);
    });
};

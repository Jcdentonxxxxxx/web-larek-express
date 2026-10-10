import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { isEmail } from 'validator';
import Product from '../models/product';

export default async (req: Request, res: Response) => {
  const {
    items, total, payment, email, phone, address,
  } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).send({ message: 'Ошибка валидации данных при создании товара' });
  }
  const itemIds = items.map((item: string) => new Types.ObjectId(item));
  const products = await Product.find({ _id: { $in: itemIds }, price: { $ne: null } });
  if(products.length !== items.length) {

  }
  return res.status(400).send(products);
};

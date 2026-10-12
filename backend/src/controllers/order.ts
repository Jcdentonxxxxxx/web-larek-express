import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { isEmail } from 'validator';
import { faker } from '@faker-js/faker';
import Product from '../models/product';

export default async (req: Request, res: Response) => {
  const {
    items, total, payment, email, phone, address,
  } = req.body;

  // проверка payment
  const validPayments = ['card', 'online'];
  if (!payment) {
    return res.status(400).json({ message: 'Ошибка валидации данных при создании заказа: поле payment обязательно' });
  }
  if (!validPayments.includes(payment)) {
    return res.status(400).send({ message: 'Ошибка валидации данных при создании заказа: недопустимая платежная система' });
  }
  // проверка email
  if (!isEmail(email)) {
    return res.status(400).send({ message: 'Ошибка валидации данных при создании заказа: некорректный email' });
  }
  // проверка phone
  if (typeof phone !== 'string' || phone.trim() === '') {
    return res.status(400).send({ message: 'Ошибка валидации данных при создании заказа: некорректный телефон' });
  }
  // проверка address
  if (typeof address !== 'string' || address.trim() === '') {
    return res.status(400).send({ message: 'Ошибка валидации данных при создании заказа: некорректный адрес' });
  }
  // проверка items
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).send({ message: 'Ошибка валидации данных при создании заказа: поле items должно быть непустым массивом' });
  }

  const invalidItem = items.find(
    (item): item is unknown => typeof item !== 'string' || !Types.ObjectId.isValid(String(item)),
  );
  if (invalidItem) {
    return res.status(400).json({
      message: `Ошибка валидации данных при создании заказа: некорректный ID товара ${invalidItem}`,
    });
  }

  const itemIds: Types.ObjectId[] = items.map(
    (item) => new Types.ObjectId(item as string),
  );
  const products = await Product.find({ _id: { $in: itemIds } });

  if (products.length !== items.length) {
    return res.status(400).send({ message: 'Ошибка валидации данных при создании заказа: некоторые товары не найдены' });
  }
  const emptyPriceProduct = products.find((product) => product.price === null);

  if (emptyPriceProduct) {
    return res.status(400).send({ message: `Ошибка валидации данных при создании заказа: у товара ${emptyPriceProduct.id} отсуствует цена` });
  }

  // проверка total
  if (typeof total !== 'number' || Number.isNaN(total) || total <= 0) {
    return res.status(400).send({ message: 'Ошибка валидации данных при создании заказа: total должно быть положительным числом' });
  }
  const calculatedTotal = products.reduce(
    (acc, p) => acc + (p.price ?? 0),
    0,
  );
  if (calculatedTotal !== total) {
    return res.status(400).send({ message: 'Ошибка валидации данных при создании заказа: переданная сумма товаров не верна' });
  }

  return res.status(200).send({
    id: faker.string.uuid(),
    total: calculatedTotal,
  });
};

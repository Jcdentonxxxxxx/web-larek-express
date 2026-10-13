import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { isEmail } from 'validator';
import { faker } from '@faker-js/faker';
import BadRequestError from '../errors/bad-request-error';
import Product from '../models/product';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    items, total, payment, email, phone, address,
  } = req.body;

  // проверка payment
  const validPayments = ['card', 'online'];
  if (!payment) {
    return next(new BadRequestError('Ошибка валидации данных при создании заказа: поле payment обязательно'));
  }
  if (!validPayments.includes(payment)) {
    return next(new BadRequestError('Ошибка валидации данных при создании заказа: недопустимая платежная система'));
  }
  // проверка email
  if (!email || !isEmail(email)) {
    return next(new BadRequestError('Ошибка валидации данных при создании заказа: некорректный email'));
  }
  // проверка phone
  if (typeof phone !== 'string' || phone.trim() === '') {
    return next(new BadRequestError('Ошибка валидации данных при создании заказа: некорректный телефон'));
  }
  // проверка address
  if (typeof address !== 'string' || address.trim() === '') {
    return next(new BadRequestError('Ошибка валидации данных при создании заказа: некорректный адрес'));
  }
  // проверка items
  if (!Array.isArray(items) || items.length === 0) {
    return next(new BadRequestError('Ошибка валидации данных при создании заказа: поле items должно быть непустым массивом'));
  }

  const invalidItem = items.find(
    (item) => typeof item !== 'string' || !Types.ObjectId.isValid(item),
  );
  if (invalidItem) {
    return next(new BadRequestError(`Ошибка валидации данных при создании заказа: некорректный ID товара ${invalidItem}`));
  }

  const itemIds: Types.ObjectId[] = items.map(
    (item) => new Types.ObjectId(item as string),
  );

  try {
    const products = await Product.find({ _id: { $in: itemIds } });

    if (products.length !== items.length) {
      return next(new BadRequestError('Ошибка валидации данных при создании заказа: некоторые товары не найдены'));
    }
    const emptyPriceProduct = products.find((product) => product.price === null);

    if (emptyPriceProduct) {
      return next(new BadRequestError(`Ошибка валидации данных при создании заказа: у товара ${emptyPriceProduct.id} отсуствует цена`));
    }

    // проверка total
    if (typeof total !== 'number' || Number.isNaN(total) || total <= 0) {
      return next(new BadRequestError('Ошибка валидации данных при создании заказа: total должно быть положительным числом'));
    }
    const calculatedTotal = products.reduce(
      (acc, p) => acc + (p.price ?? 0),
      0,
    );
    if (calculatedTotal !== total) {
      return next(new BadRequestError('Ошибка валидации данных при создании заказа: переданная сумма товаров не верна'));
    }

    return res.status(201).send({
      id: faker.string.uuid(),
      total: calculatedTotal,
    });
  } catch (error) {
    return next(error);
  }
};

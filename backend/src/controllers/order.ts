import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import BadRequestError from '../errors/bad-request-error';
import Product from '../models/product';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    items, total,
  } = req.body;

  const invalidItem = items.find(
    (item:string) => typeof item !== 'string' || !Types.ObjectId.isValid(item),
  );
  if (invalidItem) {
    return next(new BadRequestError(`Ошибка валидации данных при создании заказа: некорректный ID товара ${invalidItem}`));
  }

  const itemIds: Types.ObjectId[] = items.map(
    (item: string) => new Types.ObjectId(item as string),
  );

  try {
    const productsFromDb = await Product.find({ _id: { $in: itemIds } });

    const productsMap = new Map(productsFromDb.map((product) => [product._id.toString(), product]));

    const productsAll = itemIds
      .map((id) => productsMap.get(id.toString()))
      .filter((product) => product !== undefined);

    if (productsAll.length !== itemIds.length) {
      return next(new BadRequestError('Ошибка валидации данных при создании заказа: некоторые товары не найдены'));
    }
    const emptyPriceProduct = productsAll.find((product) => product && product.price === null);

    if (emptyPriceProduct) {
      return next(new BadRequestError(`Ошибка валидации данных при создании заказа: у товара ${emptyPriceProduct.id} отсуствует цена`));
    }

    // проверка total
    if (typeof total !== 'number' || Number.isNaN(total) || total <= 0) {
      return next(new BadRequestError('Ошибка валидации данных при создании заказа: total должно быть положительным числом'));
    }
    const calculatedTotal = productsAll.reduce(
      (acc, p) => {
        if (p) {
          return acc + (p.price ?? 0);
        }
        return acc + 0;
      },
      0,
    );
    if (calculatedTotal !== total) {
      return next(new BadRequestError('Ошибка валидации данных при создании заказа: переданная сумма товаров не верна'));
    }

    return res.status(200).send({
      id: faker.string.uuid(),
      total: calculatedTotal,
    });
  } catch (error) {
    return next(error);
  }
};

import { Request, Response, NextFunction } from 'express';

const errorHand = (err: Error | undefined, _req: Request, res: Response, _next: NextFunction) => {
  if (!err) {
    return res.status(404).json({ message: 'Маршрут не найден' });
  }
  const statusCode = (err as any).statusCode ?? 500;

  return res.status(statusCode).json({
    message: err.message || 'Произошла внутренняя ошибка сервера',
  });
};

export default errorHand;

import { Request, Response, NextFunction } from 'express';

const errorHandl = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode ?? 500;
  return res.status(statusCode).json({
    message: err.message || 'Произошла внутренняя ошибка сервера',
  });
};

export default errorHandl;

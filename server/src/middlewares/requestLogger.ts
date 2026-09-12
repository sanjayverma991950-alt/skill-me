import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const statusIcon = statusCode >= 500 ? '🔥' : statusCode >= 400 ? '⚠️' : '✅';
    console.log(`[HTTP] ${statusIcon} ${method} ${originalUrl} ${statusCode} - ${duration}ms`);
  });

  next();
};

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';
import { createErrorResponse } from '../types/apiResponse.js';
import { env } from '../config/env.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Handle Known Operational AppErrors
  if (err instanceof AppError) {
    res.status(err.statusCode).json(
      createErrorResponse(err.code, err.message, err.details)
    );
    return;
  }

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const issues = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }));

    res.status(400).json(
      createErrorResponse('VALIDATION_ERROR', 'Request validation failed', issues)
    );
    return;
  }

  // Handle Bad JSON syntax in request body
  if ('type' in err && (err as any).type === 'entity.parse.failed') {
    res.status(400).json(
      createErrorResponse('INVALID_JSON', 'Malformed JSON payload provided in request body')
    );
    return;
  }

  // Handle Unhandled/Unexpected Internal Server Errors
  const isDev = env.NODE_ENV === 'development';
  console.error('💥 [Unhandled Exception]:', err);

  res.status(500).json(
    createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      'An unexpected internal server error occurred',
      isDev ? { stack: err.stack, originalMessage: err.message } : undefined
    )
  );
};

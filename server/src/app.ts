import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { apiRoutes } from './routes.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { createSuccessResponse } from './types/apiResponse.js';

export const createApp = (): Express => {
  const app = express();

  // Security Middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body Parsing Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // HTTP Request Logger
  if (env.NODE_ENV !== 'test') {
    app.use(requestLogger);
  }

  // Root Welcome & Meta Info Endpoint
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json(
      createSuccessResponse(
        {
          name: env.APP_NAME,
          version: '1.0.0',
          documentation: `${env.API_PREFIX}/health`,
          endpoints: [
            `${env.API_PREFIX}/health`,
            `${env.API_PREFIX}/skills`,
            `${env.API_PREFIX}/users`,
          ],
        },
        'Welcome to SkillMe Architecture & Foundation API'
      )
    );
  });

  // Mount API Module Routes
  app.use(env.API_PREFIX, apiRoutes);

  // 404 Unhandled Route Handler
  app.use(notFoundHandler);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};

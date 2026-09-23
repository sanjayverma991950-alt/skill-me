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
  // Resilient CORS configuration
  const configuredOrigins = env.CORS_ORIGIN
    ? env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter((o) => o.startsWith('http://') || o.startsWith('https://'))
    : [];

  const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ];

  const allowedOrigins = Array.from(new Set([...defaultOrigins, ...configuredOrigins]));

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, server-to-server, test suites)
        if (!origin) return callback(null, true);

        // Always allow if configured as wildcard
        if (env.CORS_ORIGIN === '*') return callback(null, true);

        // In development/test mode, accept localhost and common local ports
        const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
        if (isLocalhost) return callback(null, true);

        // Allow explicitly configured origins
        if (allowedOrigins.includes(origin)) return callback(null, true);

        // Allow frontend deployments on cloud platforms
        try {
          const originHost = new URL(origin).hostname;
          if (/\.(onrender\.com|vercel\.app|netlify\.app)$/.test(originHost)) {
            return callback(null, true);
          }
        } catch {
          // ignore url parse error
        }

        if (env.NODE_ENV !== 'production') {
          return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
      },
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

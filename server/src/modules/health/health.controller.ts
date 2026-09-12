import { Request, Response } from 'express';
import { createSuccessResponse } from '../../types/apiResponse.js';
import { env } from '../../config/env.js';

export class HealthController {
  public static getHealth(_req: Request, res: Response): void {
    const memoryUsage = process.memoryUsage();
    const payload = {
      status: 'healthy',
      service: env.APP_NAME,
      environment: env.NODE_ENV,
      version: '1.0.0',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memoryRssMb: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100,
        memoryHeapUsedMb: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
      },
    };

    res.status(200).json(createSuccessResponse(payload, 'Service is operational'));
  }
}

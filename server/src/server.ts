import { createApp } from './app.js';
import { env } from './config/env.js';

const startServer = (): void => {
  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.log(`
🚀 ===============================================
   ${env.APP_NAME} started successfully!
   - Environment: ${env.NODE_ENV}
   - Port:        ${env.PORT}
   - Health URL:  http://localhost:${env.PORT}${env.API_PREFIX}/health
   - Skills API:  http://localhost:${env.PORT}${env.API_PREFIX}/skills
   - Users API:   http://localhost:${env.PORT}${env.API_PREFIX}/users
===============================================
    `);
  });

  // Graceful Shutdown handling
  const shutdown = (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('✅ HTTP server closed. Process terminating.');
      process.exit(0);
    });

    // Force close after 10s if dangling connections exist
    setTimeout(() => {
      console.error('⚠️ Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Catch unhandled rejections
  process.on('unhandledRejection', (reason: any) => {
    console.error('💥 Unhandled Rejection at Promise:', reason);
  });

  // Catch uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    console.error('💥 Uncaught Exception thrown:', error);
    process.exit(1);
  });
};

startServer();

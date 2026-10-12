import { app } from './app';
import { env } from './config/env';
import prisma from './config/db';

const PORT = env.PORT || 4000;

async function bootstrap() {
  try {
    // Verify database connection
    try {
      await prisma.$connect();
      console.log('✅ Connected to Neon PostgreSQL database via Prisma');
    } catch (dbError) {
      console.warn('⚠️ Warning: Could not connect to database with current DATABASE_URL in backend/.env.');
      console.warn('⚠️ Please add your live Neon connection string to backend/.env when ready.');
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 Backend API server is running on http://localhost:${PORT}`);
      console.log(`📡 Health check available at http://localhost:${PORT}/health`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('💤 Closed database connections and server gracefully.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();

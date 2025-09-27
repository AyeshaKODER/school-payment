import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);

  // Apply global JWT guard
  app.useGlobalGuards(new JwtAuthGuard(jwtService, configService, reflector));

  // Prefix all routes with /api
  app.setGlobalPrefix('api');

  // Enable CORS for frontend
  app.enableCors({
    origin: [
      'https://school-payment-nine.vercel.app', // deployed frontend
      'http://localhost:3000', // backend local
      'http://localhost:5173', // vite dev
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Root endpoint
  app.getHttpAdapter().get('/', (req, res) => {
    res.status(200).json({
      message: 'School Payment Management API',
      status: 'OK',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: [
          'POST /api/auth/login',
          'POST /api/auth/register',
          'GET /api/auth/profile',
        ],
        transactions: [
          'GET /api/transactions',
          'GET /api/transactions/:school_id',
          'POST /api/check-status',
        ],
        payments: ['POST /api/payment/create-payment'],
        webhooks: ['POST /api/webhook'],
      },
      demo_credentials: {
        username: 'admin@gmail.com',
        password: 'admin',
      },
    });
  });

  // Health check
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // Use PORT and HOST from env
  const port = configService.get<number>('PORT') || 3000;
  const env = process.env.NODE_ENV || 'development';
  const host =
    configService.get<string>('HOST') ||
    (env === 'development' ? 'localhost' : '0.0.0.0');

  await app.listen(port, host);

  const displayHost = host === '0.0.0.0' ? 'localhost' : host;
  console.log(`🚀 Application running on: http://${displayHost}:${port}`);
  console.log(
    `📡 API endpoints available at: http://${displayHost}:${port}/api`,
  );
  console.log(`💓 Health check: http://${displayHost}:${port}/health`);
}

bootstrap();

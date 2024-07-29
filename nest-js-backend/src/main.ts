import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
const express = require('express');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.use(cookieParser()); // Make sure to use cookie-parser middleware

  app.use('/webhooks/stripe', express.raw({ type: 'application/json' }));
  app.enableCors({ origin: 'http://localhost:4200', credentials: true });
  await app.listen(3000);
}
bootstrap();

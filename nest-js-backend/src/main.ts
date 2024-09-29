import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  app.use(cookieParser()); // Otherwise cookies won't be parsed and therefor not accessible

  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();

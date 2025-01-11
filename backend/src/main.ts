import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  const configService = app.get(ConfigService);

  let corsOptions = {
    origin: [
      `https://${configService.get<string>('FRONTEND_URL')}`,
      `https://www.${configService.get<string>('FRONTEND_URL')}`,
    ],
    credentials: true,
  };

  if (process.env.NODE_ENV !== 'production') {
    // overwrite in development
    corsOptions = {
      origin: ['http://localhost:4200'],
      credentials: true,
    };
  }

  app.enableCors(corsOptions);

  app.use(cookieParser()); // Otherwise cookies won't be parsed and therefor not accessible

  app.setGlobalPrefix('api');

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('API Dokumentation')
      .setDescription('Beschreibung der API')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  await app.listen(3000);
}
bootstrap();

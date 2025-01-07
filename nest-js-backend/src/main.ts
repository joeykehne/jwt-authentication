import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

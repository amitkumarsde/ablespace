import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Let the frontend call the API.
  app.enableCors({ origin: config.get('CLIENT_URL') || '*' });

  // Validate request bodies and drop unknown fields.
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  const port = config.get('PORT') || 4000;
  await app.listen(port);
  console.log(`Server is running at http://localhost:${port}`);
}
bootstrap();

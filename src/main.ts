import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { applyCors } from './config/cors.config';
import { serveStaticFiles } from './config/static-files.config';
import { verifyPostgresConnection } from './utils/verify-db-connection';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  await verifyPostgresConnection({
    host: configService.get('DB_HOST'),
    port: parseInt(configService.get('DB_PORT', '5432')),
    user: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
  });

  applyCors(app);
  serveStaticFiles(app);

  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  console.log(`🚀 App running on ${configService.get('BASE_URL')}`);
}
bootstrap();
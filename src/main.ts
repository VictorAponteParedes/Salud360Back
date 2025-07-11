import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Verificación directa de conexión a PostgreSQL (debug opcional)
  const client = new Client({
    host: configService.get('DB_HOST'),
    port: parseInt(configService.get('DB_PORT', '5432')),
    user: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('✅ Conexión directa a PostgreSQL exitosa');
    await client.end();
  } catch (err) {
    console.error('❌ Falló conexión directa a PostgreSQL:', err.message);
  }


  // CORS
  app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://salud-360-back-office.netlify.app'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS rechazado para: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});

  // Archivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  console.log(`🚀 App running on ${configService.get('BASE_URL') || 'http://localhost'}:${port}`);
}
bootstrap();
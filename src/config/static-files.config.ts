import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

export function serveStaticFiles(app: NestExpressApplication) {
  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
    prefix: '/uploads/',
  });
}

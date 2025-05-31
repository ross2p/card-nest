import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from '../configs/swagger.config';
import * as fs from 'node:fs';
import * as path from 'node:path';

export const swaggerSetup = (app: INestApplication) => {
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  const document = documentFactory()
  fs.writeFileSync(path.join(__dirname, "./swagger.json"), JSON.stringify(document, null, 2));
  SwaggerModule.setup('api-docs', app, documentFactory);
};

import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from '../configs/swagger.config';
import basicAuth from "express-basic-auth";
import { ConfigService } from '@nestjs/config';

export const swaggerSetup = (app: INestApplication, configureService: ConfigService) => {
  const SWAGGER_USER = configureService.get<string>('SWAGGER_USER')!;
  const SWAGGER_PASSWORD = configureService.get<string>('SWAGGER_PASSWORD')!;

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const adapter = app.getHttpAdapter();

  app.use(
    ["/api-docs/json", "/api-docs"],
    basicAuth({
      challenge: true,
      users: { [SWAGGER_USER]: SWAGGER_PASSWORD },
    }),
  );

  // JSON endpoint
  adapter.get('/api-docs/json', (_req, res) => res.json(document));

  // Swagger UI
  SwaggerModule.setup('api-docs', app, document);
};


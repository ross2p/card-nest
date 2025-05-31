import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { GlobalFilter } from './utils/filters/global.filter';
import { ErrorFilter } from './utils/filters/error.filter';
import { swaggerSetup } from './utils/swagger.utils';
import { globalPipe } from './utils/pipes/global.pipe';
import { ExceptionFilter } from './utils/filters/exception.filter';
import { Logger, VersioningType } from '@nestjs/common';
import { ResponseInterceptor } from './utils/interceptors/response.interceptor';
import { ConfigService } from '@nestjs/config';
import { loggerMiddleware } from './utils/middlewares/logging.middleware';

async function bootstrap() {
  const logger = new Logger(NestApplication.name);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  const PORT = configService.get<number>('PORT')!;

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api', {
    exclude: ['/app'],
  });

  // Logger middleware
  app.use(loggerMiddleware);

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Static assets
  app.useStaticAssets('public', {
    prefix: '/public',
  });

  // Global pipes
  app.useGlobalPipes(globalPipe);

  // Global filters
  app.useGlobalFilters(new GlobalFilter(), new ErrorFilter(), new ExceptionFilter());

  // Interceptors
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));

  //Proxy trust
  // app.set('trust proxy', true);
  // Swagger
  swaggerSetup(app, configService);

  await app.listen(PORT);

  logger.log(`Application listening on port ${PORT}`);
}
bootstrap();

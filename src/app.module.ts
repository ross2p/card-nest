import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { envSchema, envValidate } from './utils/schemas/env.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: envValidate,
    }),
    // DatabaseModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

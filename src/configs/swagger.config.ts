import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig =  new DocumentBuilder().setTitle('Card API example').setDescription('The Card API description').setVersion('1.0').addBearerAuth().build();
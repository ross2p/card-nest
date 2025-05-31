import {
  Controller,
  Get,
} from '@nestjs/common';
import { ResponseMessage } from './utils/decorators/response-message.decorator';
import { ConfigService } from '@nestjs/config';
import { version, name } from '../package.json';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService,) {}

  @ApiResponse({
    status: 200,
    description: 'Returns the application status, including name, version, environment, memory usage, uptime, and timestamp.',
    schema: {
      example: {
        name: 'your-app-name',
        version: '1.0.0',
        environment: 'development',
        memoryUsage: '12.34 MB',
        uptime: '123 seconds',
        timestamp: '2023-01-01T00:00:00.000Z',
      },
    },
  })
  @Get()
  @ApiOperation({ summary: 'Get application status' })
  @ResponseMessage("🚀 Server is operational")
  public async applicationRun() {
    return {
      name,
      version,
      environment: this.configService.get<string>('NODE_ENV'),
      memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB',
      uptime: Math.floor(process.uptime()) + ' seconds',
      timestamp: new Date().toISOString(),
    };
  }
}

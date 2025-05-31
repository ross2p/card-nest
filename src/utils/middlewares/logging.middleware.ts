import { NextFunction, Request, Response } from 'express';
import { Logger } from '@nestjs/common';

const logger = new Logger('HTTP', { timestamp: true });

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { method, originalUrl, headers, body } = req;
  const userAgent = req.get('user-agent') || '';
  const ip = req.ip;
  const isDebug = isDebugMode();
  const start = Date.now();
  logger.log(`Request: ${method} ${originalUrl} | IP: ${ip} | User-Agent: ${userAgent}`);

  if (isDebug) {
    logger.debug(`Headers: ${JSON.stringify(headers)}`);
    if (body) {
      const safeBody = sanitizeBody(body);
      logger.debug(`Body: ${JSON.stringify(safeBody)}`);
    }
  }

  const originalSend = res.send.bind(res);
  let responseBody: any;

  res.send = (body: any): Response => {
    responseBody = body;
    return originalSend(body);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.log(`Response: ${method} ${originalUrl} ${res.statusCode} - ${duration}ms`);
    if (isDebug) {
      logger.debug(`Response Headers: ${JSON.stringify(res.getHeaders())}`);
      logger.debug(`Response Body: ${JSON.stringify(responseBody)}`);
    }
  });

  next();
};

const isDebugMode = (): boolean => {
  return process.env.NODE_ENV === 'debug';
};

const sanitizeBody = (body: any): any => {
  const safeBody = { ...body };
  if (safeBody.password) safeBody.password = '[REDACTED]';
  if (safeBody.token) safeBody.token = '[REDACTED]';
  return safeBody;
};

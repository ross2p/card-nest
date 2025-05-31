import { NextFunction, Request, Response, Send } from 'express';
import { Logger } from '@nestjs/common';

const logger = new Logger('HTTP', { timestamp: true });

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { method, originalUrl, headers } = req;
  const body = req.body as unknown;
  const userAgent = req.get('user-agent') || '';
  const ip = req.ip;
  const isDebug = isDebugMode();
  const start = Date.now();

  logger.log(
    `Request: ${method} ${originalUrl} | IP: ${ip} | User-Agent: ${userAgent}`,
  );

  if (isDebug) {
    logger.debug(`Headers: ${JSON.stringify(headers)}`);
    if (body && typeof body === 'object') {
      const safeBody = sanitizeBody(body as SafeBody);
      logger.debug(`Body: ${JSON.stringify(safeBody)}`);
    }
  }

  const originalSend = res.send.bind(res) as Send;
  let responseBody: unknown;

  res.send = (body: unknown): Response => {
    responseBody = body;
    return originalSend(body);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.log(
      `Response: ${method} ${originalUrl} ${res.statusCode} - ${duration}ms`,
    );
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

type SafeBody = Record<string, unknown>;

const sanitizeBody = (body: SafeBody): SafeBody => {
  const safeBody: SafeBody = { ...body };
  if (typeof safeBody.password === 'string') safeBody.password = '[REDACTED]';
  if (typeof safeBody.token === 'string') safeBody.token = '[REDACTED]';
  return safeBody;
};

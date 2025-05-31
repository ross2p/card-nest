import { z } from 'zod';

export const envSchema = z.object({
  // SERVER
  PORT: z.coerce.number().default(8082),
  BASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test', 'debug']).default('development'),

  // SWAGGER
  SWAGGER_USER: z.string(),
  SWAGGER_PASSWORD: z.string(),

  // DATABASE
  // DATABASE_HOST: z.string().min(1, 'DATABASE_HOST is required'),
  // DATABASE_PORT: z.coerce.number(),
  // DATABASE_USERNAME: z.string(),
  // DATABASE_PASSWORD: z.string(),
  // DATABASE_NAME: z.string(),
  // DATABASE_URL: z.string().url(),

  // JWT
  JWT_SECRET_KEY: z.string().min(10, 'JWT_SECRET_KEY must be at least 10 characters'),
  ACCESS_TOKEN_EXPIRE: z.string().regex(/^\d+[smhd]$/, {
    message: 'ACCESS_TOKEN_EXPIRE must be a duration like 15m, 1h, 7d',
  }),
  REFRESH_TOKEN_EXPIRE: z.string().regex(/^\d+[smhd]$/, {
    message: 'REFRESH_TOKEN_EXPIRE must be a duration like 15m, 1h, 90d',
  }),
});


export const envValidate = (env) => (envSchema.parse(env))

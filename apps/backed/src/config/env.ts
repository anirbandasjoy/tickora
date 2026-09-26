import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const schema = z.object({
  PORT: z.string().regex(/^\d+$/).default('8000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SERVER_URI: z.string().url().default('http://localhost:8000'),
  CLIENT_URI: z.string().url().default('http://localhost:3000'),
  CORS_ORIGINS: z.string().min(1).default('http://localhost:3000'),
  MONGO_URI: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.string().url().optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().min(1).default('no-reply@localhost'),
  DB_TRANSACTIONS: z.enum(['true', 'false']).default('true'),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid env:', parsed.error.format());
  process.exit(1);
}
const d = parsed.data;

export const config = {
  PORT: parseInt(d.PORT, 10),
  NODE_ENV: d.NODE_ENV as 'development' | 'production' | 'test',
  SERVER_URI: d.SERVER_URI,
  CLIENT_URI: d.CLIENT_URI,
  CORS_ORIGINS: d.CORS_ORIGINS.split(','),
  MONGO_URI: d.MONGO_URI,
  BETTER_AUTH_SECRET: d.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: d.BETTER_AUTH_URL,
  GOOGLE_CLIENT_ID: d.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: d.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: d.GOOGLE_REDIRECT_URI,
  RESEND_API_KEY: d.RESEND_API_KEY,
  EMAIL_FROM: d.EMAIL_FROM,
  DB_TRANSACTIONS: d.DB_TRANSACTIONS === 'true',
};

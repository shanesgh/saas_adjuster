import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

config(); // Load .env file

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',  // Changed from 'driver: pg' to 'dialect: postgresql'
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL!,  // Changed from 'connectionString' to 'url'
  },
} satisfies Config;
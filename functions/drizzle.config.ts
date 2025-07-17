import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: './.env' }); // Load .env file

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',  // Changed from 'driver: pg' to 'dialect: postgresql'
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL || 'postgresql://neondb_owner:npg_k6IqUTBJMC8S@ep-dawn-moon-ae8oofoc-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',  // Changed from 'connectionString' to 'url'
  },
} satisfies Config;
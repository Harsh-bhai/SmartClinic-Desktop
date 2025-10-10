import { drizzle } from 'drizzle-orm/libsql';
import dotenv from 'dotenv';

dotenv.config();

export const db = drizzle({ connection: {
  url: process.env.DATABASE_URL, 
  authToken: process.env.DATABASE_AUTH_TOKEN 
}});


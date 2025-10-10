import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema.js";
import path from "path";

// Load .env if needed
import dotenv from "dotenv";
dotenv.config();

const dbPath = process.env.DATABASE_URL?.replace("file:", "")
const sqlite = new Database(path.resolve(dbPath));

export const db = drizzle(sqlite, { schema });

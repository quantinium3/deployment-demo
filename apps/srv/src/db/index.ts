import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! });

export const db = drizzle(pool);

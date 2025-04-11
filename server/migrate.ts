import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import ws from "ws";
import * as schema from "@shared/schema";

// This is a separate utility to push the schema to the database
// It can be run with: tsx server/migrate.ts

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

async function main() {
  console.log("Starting database migration...");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log("Creating tables if they don't exist...");
  
  // Push the schema to the database
  await migrate(db, { migrationsFolder: 'migrations' });
  
  console.log("Database migration completed.");
  
  // Close the connection
  await pool.end();
}

main().catch((error) => {
  console.error("Error during migration:", error);
  process.exit(1);
});
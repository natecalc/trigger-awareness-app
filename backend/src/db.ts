import { migrate } from "***REMOVED***-migrations";
import pg from "pg";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: "../.env.local", override: true });

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  dotenv.config({ path: "../.env.production", override: true });
}

export const createDb = async () => {
  const connectionConfig = isProduction
    ? {
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        port: 5432,
        database: process.env.PGDATABASE,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.POSTGRES_HOST,
        port: parseInt(
          process.env.DOCKER_PORT || process.env.POSTGRES_PORT || "5432"
        ),
        database: process.env.POSTGRES_DB,
        ssl: false,
      };

  console.log("Using database config:", {
    host: connectionConfig.host,
    port: connectionConfig.port,
    database: connectionConfig.database,
    environment: isProduction ? "production" : "local",
  });

  const client = new pg.Client(connectionConfig);

  try {
    await client.connect();

    console.log("Running migrations...");
    await migrate({ client }, path.join(process.cwd(), "migrations"));
    console.log("Migrations completed successfully");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.end();
  }

  const pool = new pg.Pool(connectionConfig);

  return pool;
};

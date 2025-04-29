import { migrate } from "***REMOVED***-migrations";
import pg from "pg";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

export const createDb = async () => {
  const isProduction = PGHOST && PGDATABASE && PGUSER && PGPASSWORD;

  const connectionConfig = isProduction
    ? {
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        port: 5432, // Neon typically uses standard PostgreSQL port
        database: process.env.PGDATABASE,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        user: "***REMOVED***",
        password: process.env.POSTGRES_PASSWORD,
        host: "127.0.0.1",
        port: parseInt(process.env.DOCKER_PORT || "5432"),
        database: "trigger_map",
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

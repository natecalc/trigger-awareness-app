import { migrate } from "***REMOVED***-migrations";
import pg from "pg";
import path from "path";

export const createDb = async () => {
  console.log("Creating PostgreSQL connection");

  const isProduction = process.env.NODE_ENV === "production";

  let connectionConfig;

  if (isProduction && process.env.RENDER_POSTGRES_URL) {
    console.log("Using production database configuration");
    const connectionString = process.env.RENDER_POSTGRES_URL;
    connectionConfig = {
      connectionString,
      ssl: { rejectUnauthorized: false },
    };
  } else {
    console.log("Using development database configuration");

    connectionConfig = {
      user: "***REMOVED***",
      password: process.env.POSTGRES_PASSWORD,
      host: "127.0.0.1",
      port: 5432,
      database: "trigger_map",
      ssl: false,
    };
  }

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

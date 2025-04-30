import { migrate } from '***REMOVED***-migrations';
import pg from 'pg';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const isProduction = process.env.NODE_ENV === 'production';

console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);

export const createDb = async () => {
  const connectionConfig = isProduction
    ? {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME,
        ssl: false,
      };

  console.log('Using database config:', {
    host: connectionConfig.host,
    port: connectionConfig.port,
    database: connectionConfig.database,
    environment: isProduction ? 'production' : 'local',
  });

  const client = new pg.Client(connectionConfig);

  try {
    await client.connect();

    console.log('Running migrations...');
    await migrate({ client }, path.join(process.cwd(), 'migrations'));
    console.log('Migrations completed successfully');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await client.end();
  }

  const pool = new pg.Pool(connectionConfig);

  return pool;
};

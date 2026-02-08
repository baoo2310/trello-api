// ...existing code...
import { Pool } from 'pg';
import { env } from './environment.js';

const { DATABASE_URL, DB_PASSWORD } = env;

const hasInlinePassword = /\/\/[^:]+:[^@]+@/.test(DATABASE_URL || '');
if (!DATABASE_URL || (!hasInlinePassword && !DB_PASSWORD)) {
  throw new Error('DATABASE_URL must include a password');
}

const pool = new Pool({ connectionString: DATABASE_URL });

export const CONNECT_DB = async () => {
  await pool.query('SELECT 1');
};

export const CLOSE_DB = async () => {
  await pool.end();
};

export const GET_DB = () => {
  if (!pool) throw new Error('Must connect to Database first');
  return pool;
};

export default pool;
// ...existing code...
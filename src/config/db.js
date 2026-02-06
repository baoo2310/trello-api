import { Pool } from 'pg';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const pool = new Pool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME ?? 'trello_db',
  user: process.env.DB_USER ?? 'trello',
  password: process.env.DB_PASSWORD ?? 'trello'
});

pool.on('error', (err) => {
  console.error('Postgres pool error', err);
});

export default pool;

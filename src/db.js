import { Pool } from 'pg';

const {
  PGUSER,
  PGPASSWORD,
  PGHOST,
  PGDATABASE,
  PGPORT,
} = process.env;

const sql = new Pool({
  user: PGUSER,
  password: PGPASSWORD,
  host: PGHOST,
  database: PGDATABASE,
  port: PGPORT,
});
sql.connect().catch(console.error);

export default sql;

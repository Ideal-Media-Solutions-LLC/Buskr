import { Pool } from 'pg';

const {
  RDS_HOSTNAME,
  RDS_PORT,
  RDS_DB_NAME,
  RDS_USERNAME,
  RDS_PASSWORD,
} = process.env;

const sql = new Pool({
  user: RDS_USERNAME,
  password: RDS_PASSWORD,
  host: RDS_HOSTNAME,
  database: RDS_DB_NAME,
  port: RDS_PORT,
});
sql.connect().catch(console.error);

export default sql;

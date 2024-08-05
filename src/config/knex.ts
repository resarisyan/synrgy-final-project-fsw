import { Knex } from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: 'src/database/migrations'
  },
  seeds: {
    directory: 'src/database/seeds'
  }
};

export default knexConfig;

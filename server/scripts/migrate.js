import DB from '../core/db.js';
import dotenv from 'dotenv';

dotenv.config();

const db = new DB({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT
});

await db.init();

console.log('Running the migration...');

await db.execute(`
  CREATE TABLE IF NOT EXISTS users (
    id int(11) unsigned NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL UNIQUE,
    PRIMARY KEY (id)
  )
`);

await db.execute(`
  ALTER TABLE users
  ADD COLUMN IF NOT EXISTS age int(11) DEFAULT NULL
`);

console.log('Migration done.');

db.close();
process.exit(0);
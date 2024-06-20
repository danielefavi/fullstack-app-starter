import DB from './core/db.js';
import app from './core/app-service-container.js';
import dotenv from 'dotenv';

export default async function bootstrap() {

  dotenv.config();

  try {
    const db = new DB({
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT
    });
    
    await db.init();

    app.set('db', db);
  } catch (error) {
    console.error('Error initializing database', error);
    throw error;
  }

}


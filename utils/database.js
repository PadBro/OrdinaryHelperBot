import { Sequelize } from 'sequelize';
import Logger from './logger.js';

console.log(process.env.DB_NAME)
console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)
console.log(process.env.DB_HOST)
console.log(process.env.DB_PORT)

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ?? 3306,
    dialect: 'mariadb',
    logging: process.env.ENVIRONMENT !== 'prod' ? Logger.debug : false,
  }
);

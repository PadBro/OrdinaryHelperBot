import { Sequelize } from 'sequelize';
import Logger from './logger.js';

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    logging: process.env.ENVIRONMENT !== 'prod' ? Logger.debug : false,
  }
);

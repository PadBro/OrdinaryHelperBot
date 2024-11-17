import { Sequelize } from 'sequelize';
import Logger from './logger.js';

let options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ?? 3306,
  dialect: 'mariadb',
  logging: process.env.ENVIRONMENT !== 'prod' ? Logger.debug : false,
};

if (process.env.ENVIRONMENT === 'test') {
  options = {
    dialect: 'sqlite',
    storage: './database.sqlite',
  };
}

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  options,
);

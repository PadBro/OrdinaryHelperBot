import { Sequelize } from 'sequelize';
import Logger from './logger.js';

console.log(process.env.DB_NAME)
console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)
console.log(process.env.DB_HOST)
console.log(process.env.DB_PORT)

export const sequelize = new Sequelize(
  'ordinary_helper_test_database',
  'user',
  'password',
  {
    host: 'sdfefwryjm',
    port: 3306,
    dialect: 'mariadb',
    dialectOptions: {
        socketPath: "/var/run/mysqld/mysqld.sock",
        allowPublicKeyRetrieval: true
    },
    logging: process.env.ENVIRONMENT !== 'prod' ? Logger.debug : false,
  }
);

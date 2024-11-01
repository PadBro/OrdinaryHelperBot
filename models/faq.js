import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/database.js';

export const faq = sequelize.define('faq', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  question: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: 'question can not be empty',
      },
      len: {
        args: [1, 100],
        msg: 'question must be between 1 and 100 characters',
      },
    },
  },
  answer: {
    type: DataTypes.STRING(4095),
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: 'answer can not be empty',
      },
      len: {
        args: [1, 4095],
        msg: 'answer must be between 1 and 4095 characters',
      },
    },
  },
});

import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/database.js';

export const rule = sequelize.define('rule', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rule: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

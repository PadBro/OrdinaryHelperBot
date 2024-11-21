import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/database.js';

export const reactionRole = sequelize.define('reaction_role', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  messageId: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: 'message can not be empty',
      },
      len: {
        args: [1, 200],
        msg: 'message must be between 1 and 200 characters',
      },
    },
  },
  channelId: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: 'channel can not be empty',
      },
      len: {
        args: [1, 200],
        msg: 'channel must be between 1 and 200 characters',
      },
    },
  },
  emoji: {
    type: DataTypes.STRING(70),
    allowNull: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    validate: {
      notEmpty: {
        args: true,
        msg: 'emoji can not be empty',
      },
      len: {
        args: [1, 50],
        msg: 'emoji must be between 1 and 50 characters',
      },
    },
  },
  roleId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: 'role can not be empty',
      },
      len: {
        args: [1, 50],
        msg: 'role must be between 1 and 50 characters',
      },
    },
  },
});

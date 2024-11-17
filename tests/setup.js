import { beforeAll } from 'vitest';
import { sequelize } from '../utils/database.js';
import models from '../models/index.js';

beforeAll(async () => {
  await sequelize.authenticate();
  for (const model of models) {
    await model.sync({ force: true });
  }
});

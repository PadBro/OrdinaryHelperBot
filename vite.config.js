import { defineConfig } from 'vitest/config';
import 'dotenv/config';

process.env.DB_NAME = process.env.DB_TEST_NAME;
process.env.DB_USER = process.env.DB_TEST_USER;
process.env.DB_PASSWORD = process.env.DB_TEST_PASSWORD;
process.env.DB_HOST = process.env.DB_TEST_HOST;
process.env.DB_PORT = process.env.DB_TEST_PORT;

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json-summary', 'json'],
      thresholds: {
        lines: 48,
        functions: 56,
        branches: 38,
        statements: 48,
      },
    },
  },
});

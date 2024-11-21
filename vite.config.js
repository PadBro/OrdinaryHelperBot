import { defineConfig } from 'vitest/config';
import 'dotenv/config';

process.env.DB_NAME = process.env.DB_TEST_NAME;
process.env.DB_USER = process.env.DB_TEST_USER;
process.env.DB_PASSWORD = process.env.DB_TEST_PASSWORD;
process.env.DB_HOST = process.env.DB_TEST_HOST;
process.env.DB_PORT = process.env.DB_TEST_PORT;

export default defineConfig({
  test: {
    fileParallelism: false,
    setupFiles: ['./tests/setup.js'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json-summary', 'json'],
      reportOnFailure: true,
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
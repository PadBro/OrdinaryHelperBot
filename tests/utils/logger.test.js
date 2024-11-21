import { it, expect, vi, beforeEach, afterEach } from 'vitest';
import Logger from '../../utils/logger.js';

let consoleLogMock, consoleErrorMock;

beforeEach(() => {
  consoleLogMock = vi.spyOn(console, 'log').mockImplementation(() => {});
  consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('should log debug messages with correct format', () => {
  Logger.debug('This is a debug message');
  expect(consoleLogMock).toHaveBeenCalledWith('[DEBUG]: This is a debug message');
});

it('should log warning messages with correct format', () => {
  Logger.warning('This is a warning message');
  expect(consoleLogMock).toHaveBeenCalledWith('[WARNING]: This is a warning message');
});

it('should log error messages with correct format', () => {
  Logger.error('This is an error message');
  expect(consoleErrorMock).toHaveBeenCalledWith('[ERROR]: This is an error message');
});

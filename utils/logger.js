/* eslint-disable no-console */

export default class Loggger {
  static debug = (message) => {
    console.log(`[DEBUG]: ${message}`);
  };

  static warning = (message) => {
    console.log(`[WARNING]: ${message}`);
  };

  static error = (message) => {
    console.error(`[ERROR]: ${message}`);
  };
}

import Logger from './logger.js';

export const addRole = (member, role_id) => {
  try {
    member.roles.add(role_id);
  } catch (e) {
    Logger.error(`Could not assign role on memberAdd: ${e}`);
  }
};

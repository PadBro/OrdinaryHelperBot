import Logger from './logger.js';

export const addRole = async (member, role_id) => {
  try {
    await member.roles.add(role_id);
    return true;
  } catch (e) {
    Logger.error(`Could not assign role to member: ${e}`);
    return false;
  }
};

export const removeRole = async (member, role_id) => {
  try {
    await member.roles.remove(role_id);
    return true;
  } catch (e) {
    Logger.error(`Could not remove role to member: ${e}`);
    return false;
  }
};

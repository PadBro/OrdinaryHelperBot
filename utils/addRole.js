export const addRole = (member, role_id) => {
  try {
    member.roles.add(role_id);
  } catch (e) {
    console.log(`could not assign role on memberAdd: ${e}`);
  }
};

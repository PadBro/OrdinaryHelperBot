export const removeLinkedRoles = async (interaction) => {
  const memberRole = interaction.guild.roles.cache.get(
    process.env.MEMBER_ROLE_ID
  );
  const linkedRole = interaction.guild.roles.cache.get(
    process.env.LINKED_ROLE_ID
  );
  memberRole.members.forEach((member) => member.roles.remove(linkedRole));
};

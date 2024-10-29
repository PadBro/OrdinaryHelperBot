export const getMembersToPurge = async (interaction) => {
  let role = interaction.guild.roles.cache.find(
    (r) => r.id === process.env.MEMBER_ROLE_ID,
  );

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000; //30 * 24 * 60 * 60 * 1000 = 30 days
  const specificRoleId = process.env.LINKED_ROLE_ID;

  const filteredMembers = role.members.filter((member) => {
    return (
      member.joinedTimestamp < thirtyDaysAgo &&
      !member.roles.cache.has(specificRoleId)
    );
  });
  return filteredMembers;
};

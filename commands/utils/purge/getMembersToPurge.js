import dayjs from 'dayjs';

export const getMembersToPurge = async (interaction) => {
  let role = interaction.guild.roles.cache.find(
    (role) => role.id === process.env.MEMBER_ROLE_ID
  );
  const purgePeriod =
    interaction.options.getInteger('days') || process.env.PURGE_PERIOD_IN_DAYS;
  const nDaysAgo = dayjs().subtract(purgePeriod, 'day');
  const specificRoleId = process.env.LINKED_ROLE_ID;

  const filteredMembers = role.members.filter((member) => {
    return (
      member.joinedTimestamp < nDaysAgo &&
      !member.roles.cache.has(specificRoleId)
    );
  });
  return filteredMembers;
};

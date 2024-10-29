import { getMembersToPurge } from './getMembersToPurge';

export const removeMembers = async (interaction) => {
  const memberRole = interaction.guild.roles.cache.get(
    process.env.MEMBER_ROLE_ID,
  );
  const filteredMembers = await getMembersToPurge(interaction);
  filteredMembers.map((m) => m.roles.remove(memberRole));
  return filteredMembers;
};

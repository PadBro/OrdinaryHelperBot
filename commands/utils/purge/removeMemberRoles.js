import { getMembersToPurge } from './getMembersToPurge.js';

export const removeMemberRoles = async (interaction) => {
  const memberRole = interaction.guild.roles.cache.get(
    process.env.MEMBER_ROLE_ID,
  );
  const filteredMembers = await getMembersToPurge(interaction);
  filteredMembers.forEach((member) => member.roles.remove(memberRole));
  return filteredMembers;
};

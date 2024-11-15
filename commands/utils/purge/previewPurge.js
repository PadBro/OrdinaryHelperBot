import { getMembersToPurge } from './getMembersToPurge.js';
import { createEmbed } from './embed.js';

export const previewPurge = async (interaction) => {
  const filteredMembers = await getMembersToPurge(interaction);
  const members = filteredMembers?.map(
    (member) => `${member.nickname || member}`
  );

  const embed = createEmbed(members);
  embed.setDescription(`To be purged: ${members.length} members`);

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};

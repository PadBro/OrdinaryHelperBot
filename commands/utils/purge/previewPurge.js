import { getMembersToPurge } from './getMembersToPurge.js';

export const previewPurge = async (interaction) => {
  const filteredMembers = await getMembersToPurge(interaction);

  await interaction.reply({
    content: `${filteredMembers?.map((member) => `${member}`).join(', ') || '---'}`,
    ephemeral: true,
  });
};

import { EmbedBuilder } from 'discord.js';
import { getMembersToPurge } from './getMembersToPurge.js';
import { chunkData } from '../../../utils/chunkData.js';

export const previewPurge = async (interaction) => {
  const filteredMembers = await getMembersToPurge(interaction);
  const members = filteredMembers?.map((member) => `${member}`);

  const embed = new EmbedBuilder()
    .setTitle('Purge')
    .setColor('#ce361e')
    .setDescription(`To be purged: ${members.length} members`)
    .setTimestamp();

  const chunkedData = chunkData(members, 3, 46);
  const data = chunkedData.map((chunk) => {
    const mappedChunk = chunk.map((subChunk) => {
      return {
        name: '\u200B',
        value: subChunk.join('\n') + '\u200B',
        inline: true,
      };
    });
    return mappedChunk;
  });
  let flattenData = data.flat(1);
  embed.setFields(flattenData);

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};

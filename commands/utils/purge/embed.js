import { EmbedBuilder } from 'discord.js';
import { chunkData } from '../../../utils/chunkData.js';

export const createEmbed = (members) => {
  const embed = new EmbedBuilder()
    .setTitle('Purge')
    .setColor('#ce361e')
    .setDescription(`${members.length} members purged`)
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

  return embed;
};

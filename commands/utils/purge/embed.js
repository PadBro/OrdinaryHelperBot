import { EmbedBuilder } from 'discord.js';
import { chunkData } from '../../../utils/chunkData.js';

export const createEmbed = (members) => {
  const amountSubChunks = 3;

  members = members.sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );

  if (members.length % amountSubChunks == 1) {
    const index = Math.floor(members.length / amountSubChunks);
    const item = members.splice(index, 1)[0];
    members.push(item);
  }

  const embed = new EmbedBuilder()
    .setTitle('Purge')
    .setColor('#ce361e')
    .setDescription(`${members.length} members purged`)
    .setTimestamp();

  const chunkedData = chunkData(members, amountSubChunks, 46);
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

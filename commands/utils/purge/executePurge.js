import { PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { confirmAction } from '../confirmAction.js';
import { hasPermission } from '../hasPermission.js';
import { removeMemberRoles } from './removeMemberRoles.js';
import { removeLinkedRoles } from './removeLinkedRoles.js';
import { chunkData } from '../../../utils/chunkData.js';

export const executePurge = async (interaction) => {
  if (!(await hasPermission(interaction, PermissionFlagsBits.BanMembers))) {
    return;
  }

  if (
    !(await confirmAction(
      interaction,
      'Do you really want to purge?',
      'Confirm Purge'
    ))
  ) {
    return;
  }

  const filteredMembers = await removeMemberRoles(interaction);
  const members = filteredMembers?.map((member) => `${member}`);

  const embed = new EmbedBuilder()
    .setTitle('Purge')
    .setDescription(`${members.length} members purged`)
    .setTimestamp();

  const chunkedData = chunkData(members, 3, 46);
  const data = chunkedData.map((chunk) => {
    const mappedChunk = chunk.map((subChunk) => {
      return {
        name: '\u200B',
        value: subChunk.join('\n'),
        inline: true,
      };
    });
    return mappedChunk;
  });

  await removeLinkedRoles(interaction);
  let flattenData = data.flat(1);
  embed.setFields(flattenData);

  await interaction.channel.send({
    embeds: [embed],
  });
};

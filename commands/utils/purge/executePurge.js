import { PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { confirmAction } from '../confirmAction.js';
import { hasPermission } from '../hasPermission.js';
import { removeMemberRoles } from './removeMemberRoles.js';
import { removeLinkedRoles } from './removeLinkedRoles.js';

export const executePurge = async (interaction) => {
  if (!hasPermission(interaction, PermissionFlagsBits.BanMembers)) {
    return;
  }

  if (
    !(await confirmAction(
      interaction,
      'Do you really want to purge?',
      'Confirm Purge',
    ))
  ) {
    return;
  }

  const filteredMembers = await removeMemberRoles(interaction);


  await removeLinkedRoles(interaction);

  const embed = new EmbedBuilder()
    .setTitle('Member Purge')
    .setDescription('Executed Purge')
    .addFields({
      name: 'Purged Members',
      value: `${filteredMembers?.map((member) => `${member}`).join(', ') || '---'}`,
    })
    .setTimestamp();

  await interaction.channel.send({
    embeds: [embed],
  });
};

import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { removeMemberRoles } from './removeMemberRoles.js';
import { hasPermission } from '../hasPermission.js';
import { confirmAction } from '../confirmAction.js';

export const removeMembers = async (interaction) => {
  if (!(await hasPermission(interaction, PermissionFlagsBits.BanMembers))) {
    return;
  }

  if (
    !(await confirmAction(
      interaction,
      'Do you really want to remove member roles?',
      'Confirm member remove'
    ))
  ) {
    return;
  }

  const filteredMembers = await removeMemberRoles(interaction);

  const embed = new EmbedBuilder()
    .setTitle('Member Remove')
    .setDescription('Executed Member Removal of Purge')
    .addFields({
      name: 'Removed Members',
      value: `${filteredMembers?.map((member) => `${member}`).join(', ') || '---'}`,
    })
    .setTimestamp();

  await interaction.channel.send({
    embeds: [embed],
  });

  return filteredMembers;
};

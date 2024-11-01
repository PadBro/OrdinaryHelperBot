import { PermissionFlagsBits } from 'discord.js';
import { hasPermission } from '../hasPermission.js';
import { removeLinkedRoles } from './removeLinkedRoles.js';
import { confirmAction } from '../confirmAction.js';

export const removeLinked = async (interaction) => {
  if (!(await hasPermission(interaction, PermissionFlagsBits.BanMembers))) {
    return;
  }

  if (
    !(await confirmAction(
      interaction,
      'Do you really want to remove linked roles?',
      'Confirm Linked Remove',
    ))
  ) {
    return;
  }

  await removeLinkedRoles(interaction);

  await interaction.channel.send('Removed all Linked Roles');
};

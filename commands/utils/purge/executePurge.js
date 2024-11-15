import { PermissionFlagsBits } from 'discord.js';
import { confirmAction } from '../confirmAction.js';
import { hasPermission } from '../hasPermission.js';
import { removeMemberRoles } from './removeMemberRoles.js';
import { removeLinkedRoles } from './removeLinkedRoles.js';
import { createEmbed } from './embed.js';

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
  const members = filteredMembers?.map((member) => `${member.nickname || member.displayName}`);

  const embed = createEmbed(members);
  embed.setDescription(`${members.length} members purged`);

  await removeLinkedRoles(interaction);

  await interaction.channel.send({
    embeds: [embed],
  });
};

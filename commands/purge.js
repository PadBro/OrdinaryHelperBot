import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { executePurge } from './utils/purge/executePurge.js';
import { previewPurge } from './utils/purge/previewPurge.js';
import { removeLinked } from './utils/purge/removeLinked.js';
import { removeMembers } from './utils/purge/removeMembers.js';

export const data = new SlashCommandBuilder()
  .setName('purge')
  .setDescription('Monthly Member Purge')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  .addSubcommand((subcommand) =>
    subcommand.setName('preview').setDescription('preview purge'),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('execute')
      .setDescription(
        'execute purge (remove inactive member roles and linked roles)',
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('remove-member')
      .setDescription('remove member role from inactive members'),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('remove-linked')
      .setDescription('remove linked role from every member'),
  );

export const execute = async (interaction) => {
  const subcommand = interaction.options.getSubcommand();
  switch (subcommand) {
    case 'preview':
      previewPurge(interaction);
      break;
    case 'execute':
      executePurge(interaction);
      break;
    case 'remove-member':
      removeMembers(interaction);
      break;
    case 'remove-linked':
      removeLinked(interaction);
      break;
    default:
      interaction.reply('command not found');
  }
};

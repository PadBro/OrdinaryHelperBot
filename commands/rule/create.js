import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { modal } from '../../modals/utils/createRule.js';

export const data = new SlashCommandBuilder()
  .setName('rule-create')
  .setDescription('Create a rule entry')
  .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog);

export const execute = async (interaction) => {
  await interaction.showModal(modal);
};

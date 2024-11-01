import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { modal } from '../../modals/utils/createFaq.js';

export const data = new SlashCommandBuilder()
  .setName('faq-create')
  .setDescription('Create a FAQ entry')
  .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog);

export const execute = async (interaction) => {
  await interaction.showModal(modal);
};

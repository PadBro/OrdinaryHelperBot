import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { faq } from '../../models/faq.js';

export const data = new SlashCommandBuilder()
  .setName('faq-create')
  .setDescription('Create a FAQ entry')
  .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
  .addStringOption((option) =>
    option.setName('question').setDescription('The question').setRequired(true),
  )
  .addStringOption((option) =>
    option.setName('answer').setDescription('The answer').setRequired(true),
  );

export const execute = async (interaction) => {
  const question = interaction.options.getString('question');
  const answer = interaction.options.getString('answer');

  try {
    faq.create({ question, answer });
    await interaction.reply({
      content: `The question "${question}" was created.`,
      ephemeral: true,
    });
  } catch (e) {
    console.error(e);
    await interaction.reply({
      content: `An error ocoured while creating the FAQ entry: ${e}`,
      ephemeral: true,
    });
  }
};

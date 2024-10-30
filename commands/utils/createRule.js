import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { rule as ruleModel } from '../../models/rule.js';

export const data = new SlashCommandBuilder()
  .setName('rule-create')
  .setDescription('Create a rule entry')
  .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
  .addStringOption((option) =>
    option
      .setName('name')
      .setDescription('The name of  the rule')
      .setRequired(true),
  )
  .addStringOption((option) =>
    option.setName('rule').setDescription('The rule').setRequired(true),
  );

export const execute = async (interaction) => {
  const name = interaction.options.getString('name');
  const rule = interaction.options.getString('rule');

  try {
    ruleModel.create({ name, rule });
    await interaction.reply({
      content: `The rule "${name}" was created.`,
      ephemeral: true,
    });
  } catch (e) {
    console.error(e);
    await interaction.reply({
      content: `An error ocoured while creating the rule entry: ${e}`,
      ephemeral: true,
    });
  }
};

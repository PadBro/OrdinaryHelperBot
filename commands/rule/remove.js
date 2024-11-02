import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { rule } from '../../models/rule.js';
import { Op } from 'sequelize';

export const data = new SlashCommandBuilder()
  .setName('rule-remove')
  .setDescription('Remove a frequently asked question')
  .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
  .addStringOption((option) =>
    option
      .setName('rule')
      .setDescription('The rule category')
      .setRequired(true)
      .setAutocomplete(true),
  );

export const autocomplete = async (interaction) => {
  const inputValue = interaction.options.getFocused();

  const rules = await rule.findAll({
    where: {
      rule: {
        [Op.like]: `${inputValue}%`,
      },
    },
    order: [['number', 'ASC']],
  });
  await interaction.respond(
    rules.map((rule) => ({
      name: `${rule.number}. ${rule.name}`,
      value: `${rule.id}`,
    })),
  );
};

export const execute = async (interaction) => {
  const ruleId = interaction.options.getString('rule');

  try {
    const result = await rule.destroy({
      where: {
        id: ruleId,
      },
    });
    if (result === 0) {
      await interaction.reply({
        content: 'The rule was not found.',
        ephemeral: true,
      });

      return;
    }

    await interaction.reply({
      content: 'The rule has been removed.',
      ephemeral: true,
    });
  } catch (e) {
    console.error(e);
    await interaction.reply({
      content: `An error occurred while retrieving the rule entry. Please try again later. If this error persists, please report to the staff team.`,
      ephemeral: true,
    });
  }
};

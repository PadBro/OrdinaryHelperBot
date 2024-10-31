import { SlashCommandBuilder, MessageFlags, EmbedBuilder } from 'discord.js';
import { rule } from '../../models/rule.js';
import { Op } from 'sequelize';

export const data = new SlashCommandBuilder()
  .setName('rule')
  .setDescription('Displays a rule')
  .addStringOption((option) =>
    option
      .setName('rule')
      .setDescription('The rule to display')
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
    order: [['name', 'ASC']],
  });
  await interaction.respond(
    rules.map((rule) => ({ name: rule.name, value: `${rule.id}` })),
  );
};

export const execute = async (interaction) => {
  const ruleId = interaction.options.getString('rule');

  try {
    const requestedRule = await rule.findOne({
      where: {
        id: ruleId,
      },
    });
    if (!requestedRule) {
      await interaction.reply({
        content:
          'The rule was not found please try again later. If this error pressists please report to the staff team.',
        ephemeral: true,
        flags: [MessageFlags.SuppressEmbeds],
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor('#f0833a')
      .setTitle(requestedRule.name)
      .setDescription(requestedRule.rule);

    await interaction.reply({
      embeds: [embed],
    });
  } catch (e) {
    console.error(e);
    await interaction.reply({
      content: `An error ocoured while retriving the rule entry. Please try again later. If this error persists, please report to the staff team.`,
      ephemeral: true,
    });
  }
};

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Logger from '../../utils/logger.js';
import { apiFetch } from '../../utils/apiFetch.js';

export const data = new SlashCommandBuilder()
  .setName('rule-remove')
  .setDescription('Remove a frequently asked question')
  .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
  .addStringOption((option) =>
    option
      .setName('rule')
      .setDescription('The rule category')
      .setRequired(true)
      .setAutocomplete(true)
  );

export const autocomplete = async (interaction) => {
  const inputValue = interaction.options.getFocused();

  const response = await apiFetch('/rules', {
    method: 'GET',
    query: {
      'filter[name]': inputValue,
    },
  });
  const ruleResponse = await response.json();
  await interaction.respond(
    ruleResponse.data.map((rule) => ({
      name: `${rule.number}. ${rule.name}`,
      value: `${rule.id}`,
    }))
  );
};

export const execute = async (interaction) => {
  const ruleId = interaction.options.getString('rule');

  try {
    const response = await apiFetch(`/rules/${ruleId}`, {
      method: 'DELETE',
    });
    const result = await response.text();

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
    Logger.error(e);
    await interaction.reply({
      content: `An error occurred while retrieving the rule entry. Please try again later. If this error persists, please report to the staff team.`,
      ephemeral: true,
    });
  }
};

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Logger from '../../utils/logger.js';
import { apiFetch } from '../../utils/apiFetch.js';

export const data = new SlashCommandBuilder()
  .setName('faq-remove')
  .setDescription('Remove a frequently asked question')
  .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
  .addStringOption((option) =>
    option
      .setName('question')
      .setDescription('The FAQ category')
      .setRequired(true)
      .setAutocomplete(true)
  );

export const autocomplete = async (interaction) => {
  const inputValue = interaction.options.getFocused();

  const response = await apiFetch('/faqs', {
    method: 'GET',
    query: {
      'filter[question]': inputValue,
    },
  });
  const faqResponse = await response.json();
  await interaction.respond(
    faqResponse.data.map((faq) => ({ name: faq.question, value: `${faq.id}` }))
  );
};

export const execute = async (interaction) => {
  const faqId = interaction.options.getString('question');

  try {
    const response = await apiFetch(`/faqs/${faqId}`, {
      method: 'DELETE',
    });
    const result = await response.text();

    if (result === 0) {
      await interaction.reply({
        content: 'The FAQ was not found.',
        ephemeral: true,
      });

      return;
    }

    await interaction.reply({
      content: 'The FAQ has been removed.',
      ephemeral: true,
    });
  } catch (e) {
    Logger.error(e);
    await interaction.reply({
      content: `An error occurred while removing the FAQ. Please try again later. If this error persists, please report to the staff team.`,
      ephemeral: true,
    });
  }
};

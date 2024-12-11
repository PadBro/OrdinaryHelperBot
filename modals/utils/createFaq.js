import {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
} from 'discord.js';
import Logger from '../../utils/logger.js';
import { apiFetch } from '../../utils/apiFetch.js';

const modal = new ModalBuilder()
  .setCustomId('createFaq')
  .setTitle('Create FAQ');

const questionInput = new TextInputBuilder()
  .setCustomId('question')
  .setLabel('Question:')
  .setStyle(TextInputStyle.Short);

const answerInput = new TextInputBuilder()
  .setCustomId('answer')
  .setLabel('Answer:')
  .setStyle(TextInputStyle.Paragraph);

const questionActionRow = new ActionRowBuilder().addComponents(questionInput);
const answerActionRow = new ActionRowBuilder().addComponents(answerInput);

modal.addComponents(questionActionRow, answerActionRow);

export { modal };

export const handler = async (interaction) => {
  const question = interaction.fields.getTextInputValue('question');
  const answer = interaction.fields.getTextInputValue('answer');

  try {
    const response = await apiFetch('/faqs', {
      method: 'POST',
      body: {
        question,
        answer,
      },
    });
    const createResponse = await response.json();

    if (createResponse.errors) {
      const errors = Object.entries(createResponse.errors)
        .map(([key, values]) => {
          return `**${key}**\n${values.join('\n')}`;
        })
        .join('\n\n');
      await interaction.reply({
        content: errors,
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: `The question "${question}" was created.`,
      ephemeral: true,
    });
  } catch (e) {
    Logger.error(e);
    await interaction.reply({
      content: `An error occurred while creating the FAQ entry. Please try again later. If this error persists, please report to the staff team.`,
      ephemeral: true,
    });
  }
};

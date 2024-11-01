import {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
} from 'discord.js';
import { faq } from '../../models/faq.js';

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
    await faq.create({ question, answer });

    await interaction.reply({
      content: `The question "${question}" was created.`,
      ephemeral: true,
    });
  } catch (e) {
    if (e.errors) {
      const errors = e.errors.map((error) => error.message).join('\n');
      await interaction.reply({
        content: errors,
        ephemeral: true,
      });
    } else {
      console.error(e);
      await interaction.reply({
        content: `An error ocoured while creating the FAQ entry. Please try again later. If this error persists, please report to the staff team.`,
        ephemeral: true,
      });
    }
  }
};

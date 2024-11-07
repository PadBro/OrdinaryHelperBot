import {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
} from 'discord.js';
import { rule as ruleModel } from '../../models/rule.js';
import Logger from '../../utils/logger.js';

const modal = new ModalBuilder()
  .setCustomId('createRule')
  .setTitle('Create rule');

const numberInput = new TextInputBuilder()
  .setCustomId('number')
  .setLabel('Rule number:')
  .setStyle(TextInputStyle.Short);

const questionInput = new TextInputBuilder()
  .setCustomId('name')
  .setLabel('Name:')
  .setStyle(TextInputStyle.Short);

const answerInput = new TextInputBuilder()
  .setCustomId('rule')
  .setLabel('Rule:')
  .setStyle(TextInputStyle.Paragraph);

const numberActionRow = new ActionRowBuilder().addComponents(numberInput);
const questionActionRow = new ActionRowBuilder().addComponents(questionInput);
const answerActionRow = new ActionRowBuilder().addComponents(answerInput);

modal.addComponents(numberActionRow, questionActionRow, answerActionRow);

export { modal };

export const handler = async (interaction) => {
  const name = interaction.fields.getTextInputValue('name');
  const rule = interaction.fields.getTextInputValue('rule');
  const number = parseInt(interaction.fields.getTextInputValue('number'));

  try {
    await ruleModel.create({ name, rule, number });

    await interaction.reply({
      content: `The rule "${name}" was created.`,
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
      Logger.error(e);
      await interaction.reply({
        content: `An error occurred while creating the rule entry. Please try again later. If this error persists, please report to the staff team.`,
        ephemeral: true,
      });
    }
  }
};

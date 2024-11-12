import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { faq } from '../../models/faq.js';
import { Op } from 'sequelize';
import Logger from '../../utils/logger.js';

export const data = new SlashCommandBuilder()
  .setName('faq')
  .setDescription('Answers frequently asked questions')
  .addStringOption((option) =>
    option
      .setName('question')
      .setDescription('The FAQ category')
      .setRequired(true)
      .setAutocomplete(true)
  );

export const autocomplete = async (interaction) => {
  const inputValue = interaction.options.getFocused();

  const faqs = await faq.findAll({
    where: {
      question: {
        [Op.like]: `${inputValue}%`,
      },
    },
  });
  await interaction.respond(
    faqs.map((faq) => ({ name: faq.question, value: `${faq.id}` }))
  );
};

export const execute = async (interaction) => {
  const faqId = interaction.options.getString('question');

  try {
    const askedFaq = await faq.findOne({
      where: {
        id: faqId,
      },
    });
    if (!askedFaq) {
      await interaction.reply({
        content:
          'The question was not found. Please try again later. If this error persists, please report to the staff team.',
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor('#f0833a')
      .setTitle(askedFaq.question)
      .setDescription(askedFaq.answer);

    await interaction.reply({
      embeds: [embed],
    });
  } catch (e) {
    Logger.error(e);
    await interaction.reply({
      content: `An error occurred while retrieving the FAQ entry. Please try again later. If this error persists, please report to the staff team.`,
      ephemeral: true,
    });
  }
};

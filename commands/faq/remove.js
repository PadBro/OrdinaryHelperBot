import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { faq } from '../../models/faq.js';
import { Op } from 'sequelize';

export const data = new SlashCommandBuilder()
  .setName('faq-remove')
  .setDescription('Remove a frequently asked question')
  .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
  .addStringOption((option) =>
    option
      .setName('question')
      .setDescription('The FAQ category')
      .setRequired(true)
      .setAutocomplete(true),
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
    faqs.map((faq) => ({ name: faq.question, value: `${faq.id}` })),
  );
};

export const execute = async (interaction) => {
  const faqId = interaction.options.getString('question');

  try {
    const result = await faq.destroy({
      where: {
        id: faqId,
      },
    });
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
    console.error(e);
    await interaction.reply({
      content: `An error occurred while retriving the FAQ entry. Please try again later. If this error persists, please report to the staff team.`,
      ephemeral: true,
    });
  }
};

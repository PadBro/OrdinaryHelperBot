import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { readFileSync } from 'fs';
import { join as joinPath } from 'path';

let faqs = [];
try {
  const filePath = joinPath(import.meta.dirname, '../../configs/faq.json');
  const faqsJson = readFileSync(filePath);
  faqs = JSON.parse(faqsJson);
} catch (e) {
  console.log(`[WARNING] No FAQs found. ${e}`);
}

const choices = faqs.map((faq) => ({ name: faq.name, value: faq.key }));

export const data = faqs.length
  ? new SlashCommandBuilder()
      .setName('faq')
      .setDescription('Answers frequently asked questions')
      .addStringOption((option) =>
        option
          .setName('category')
          .setDescription('The FAQ category')
          .setRequired(true)
          .addChoices(choices),
      )
  : undefined;

export const execute = faqs.length
  ? async (interaction) => {
      const category = interaction.options.getString('category');
      const faq = faqs.find((faq) => faq.key === category);
      if (!faq) {
        await interaction.reply(
          'The question was not found. Please try again later. If this error persists, please report to the staff team.',
        );
      } else {
        await interaction.reply({
          content: faq.answer,
          flags: [MessageFlags.SuppressEmbeds],
        });
      }
    }
  : undefined;

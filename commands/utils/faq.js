const { SlashCommandBuilder } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

let faqs = [];
try {
  faqs = require('../../configs/faq.json');
} catch (e) {
  console.log(`[WARNING] No FAQs found. ${e}`);
}

const choices = faqs.map((faq) => ({ name: faq.name, value: faq.key }));

const command = {
  data: new SlashCommandBuilder()
    .setName('faq')
    .setDescription('Answeres frequently asked questions')
    .addStringOption((option) =>
      option
        .setName('category')
        .setDescription('The FAQ category')
        .setRequired(true)
        .addChoices(choices),
    ),

  async execute(interaction) {
    const category = interaction.options.getString('category');
    const faq = faqs.find((faq) => faq.key === category);
    if (!faq) {
      await interaction.reply(
        'The question was not found please try again later. If this error pressists please report to the staff team.',
      );
    } else {
      await interaction.reply(faq.answere);
    }
  },
};
module.exports = faqs.length ? command : {};

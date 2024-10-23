const { SlashCommandBuilder } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const faqs = require('../../assets/faq.json');

const choices = faqs.map((faq) => ({name: faq.name, value: faq.key}))
module.exports = {
  data: new SlashCommandBuilder()
    .setName('faq')
    .setDescription('Answeres frequently asked questions')
    .addStringOption(option =>
      option.setName('category')
        .setDescription('The gif category')
        .setRequired(true)
        .addChoices(choices)
    ),

  async execute(interaction) {
  	const category = interaction.options.getString('category');
  	const faq = faqs.find((faq) => faq.key === category)
  	if (!faq) {
  		await interaction.reply("The quiestion was not found please try again later. If this error pressists please report to the staff team.");
  	} else {
  		await interaction.reply(faq.answere);
  	}
  }
}
const { SlashCommandBuilder } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

let rules = [];
try {
  rules = require('../../configs/rule.json');
} catch (e) {
  console.log(`[WARNING] No Rules found. ${e}`);
}

const choices = rules.map((rule) => ({ name: rule.name, value: rule.key }));

const command = {
  data: new SlashCommandBuilder()
    .setName('rule')
    .setDescription('Displays a rule')
    .addStringOption((option) =>
      option
        .setName('rule')
        .setDescription('The rule to display')
        .setRequired(true)
        .addChoices(choices),
    ),

  async execute(interaction) {
    const ruleKey = interaction.options.getString('rule');
    const rule = rules.find((rule) => rule.key === ruleKey);
    if (!rule) {
      await interaction.reply(
        'The rule was not found please try again later. If this error pressists please report to the staff team.',
      );
    } else {
      await interaction.reply(rule.answer);
    }
  },
};
module.exports = rules.length ? command : {};

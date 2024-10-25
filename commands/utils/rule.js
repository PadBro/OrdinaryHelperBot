import { SlashCommandBuilder } from 'discord.js';
import { readFileSync } from 'fs';
import { join as joinPath } from 'path';

let rules = [];
try {
  const filePath = joinPath(import.meta.dirname, '../../configs/rule.json');
  const rulesJson = readFileSync(filePath);
  rules = JSON.parse(rulesJson);
} catch (e) {
  console.log(`[WARNING] No Rules found. ${e}`);
}

const choices = rules.map((rule) => ({ name: rule.name, value: rule.key }));

export const data = rules.length
  ? new SlashCommandBuilder()
      .setName('rule')
      .setDescription('Displays a rule')
      .addStringOption((option) =>
        option
          .setName('rule')
          .setDescription('The rule to display')
          .setRequired(true)
          .addChoices(choices),
      )
  : undefined;

export const execute = rules.length
  ? async (interaction) => {
      const ruleKey = interaction.options.getString('rule');
      const rule = rules.find((rule) => rule.key === ruleKey);
      if (!rule) {
        await interaction.reply(
          'The rule was not found please try again later. If this error pressists please report to the staff team.',
        );
      } else {
        await interaction.reply(rule.answere);
      }
    }
  : undefined;

import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} from 'discord.js';
import Logger from '../utils/logger.js';

export const data = new SlashCommandBuilder()
  .setName('add-alt-account')
  .setDescription('Adds an alt account')
  .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
  .addUserOption((option) =>
    option
      .setName('member')
      .setDescription('The member to add an alt account')
      .setRequired(true)
  )
  .addUserOption((option) =>
    option.setName('alt').setDescription('The alt account').setRequired(true)
  );

export const execute = async (interaction) => {
  const member = interaction.options.getUser('member');
  const alt = interaction.options.getUser('alt');
  const channel = interaction.guild.channels.cache.get(
    process.env.ALT_ACCOUNT_CHANNEL
  );

  const embed = new EmbedBuilder()
    .setColor('#f0833a')
    .setDescription(`${member} - ${alt}`)
    .setTimestamp();

  try {
    await channel.send({ embeds: [embed] });
  } catch (e) {
    Logger.error(`Could not add alt account: ${e}`);
    interaction.reply({
      content:
        'An error occurred while adding the alt account. Please try again later. If this error persists, please report to the staff team.',
      ephemeral: true,
    });
    return;
  }

  interaction.reply({
    content: 'Alt account was added',
    ephemeral: true,
  });
};

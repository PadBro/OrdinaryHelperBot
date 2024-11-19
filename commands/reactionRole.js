import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} from 'discord.js';
import Logger from '../utils/logger.js';
import Paginate from './utils/paginate.js';
import { reactionRole } from '../models/reactionRole.js';
import { isValidEmoji } from '../utils/emoji.js';

export const data = new SlashCommandBuilder()
  .setName('reaction-role')
  .setDescription('Handles reaction roles on the server')
  .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
  .addSubcommand((subcommand) =>
    subcommand
      .setName('add')
      .setDescription('Adds a reaction role to a message.')
      .addStringOption((option) =>
        option
          .setName('message')
          .setDescription('The message link to add the reaction to.')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('emoji')
          .setDescription('The emoji to react with.')
          .setRequired(true)
      )
      .addRoleOption((option) =>
        option
          .setName('role')
          .setDescription('The role to assing/remove if reacted.')
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand.setName('list').setDescription('List all reaction roles.')
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('remove')
      .setDescription('Removes a reaction role.')
      .addStringOption((option) =>
        option
          .setName('reaction-role-id')
          .setDescription('The ID of the reactionrole to remove.')
          .setRequired(true)
      )
  );

export const execute = async (interaction) => {
  const subcommand = interaction.options.getSubcommand();
  switch (subcommand) {
    case 'add':
      addReactionRole(interaction);
      break;
    case 'list':
      listReactionRole(interaction);
      break;
    case 'remove':
      removeReactionRole(interaction);
      break;
    default:
      interaction.reply('command not found');
  }
};

const addReactionRole = async (interaction) => {
  const discordChannelLinkBase = 'https://discord.com/channels/';
  const discordCanaryLinkBase = 'https://canary.discord.com/channels/';

  const messageLink = interaction.options.getString('message');
  const emoji = interaction.options.getString('emoji');
  const role = interaction.options.getRole('role');

  if (role.name === '@everyone') {
    interaction.reply({
      content: 'The role can not be @everyone.',
      ephemeral: true,
    });
    return;
  }

  if (!messageLink.startsWith(discordChannelLinkBase) && !messageLink.startsWith(discordCanaryLinkBase)) {
    interaction.reply({
      content: 'The provided message link is not a discord message link.',
      ephemeral: true,
    });
    return;
  }

  const [guildId, channelId, messageId] = messageLink
    .replace(discordChannelLinkBase, '')
    .replace(discordCanaryLinkBase, '')
    .split('/');
  if (guildId !== interaction.guild.id) {
    interaction.reply({
      content: 'The provided link is not from this server.',
      ephemeral: true,
    });
    return;
  }

  const channel = await interaction.guild.channels.fetch(channelId);
  if (!channel) {
    interaction.reply({
      content: 'The channel was not found on this server.',
      ephemeral: true,
    });
    return;
  }
  const message = await channel.messages.fetch(messageId);
  if (!message) {
    interaction.reply({
      content: 'The message was not found on this server.',
      ephemeral: true,
    });
    return;
  }

  if (!isValidEmoji(emoji, interaction.guild.emojis)) {
    interaction.reply({
      content: 'The emoji is not valid.',
      ephemeral: true,
    });
    return;
  }

  try {
    await message.react(emoji);
  } catch (e) {
    Logger.error(`An error occoured while creating a reaction role: ${e}`);
    await interaction.reply({
      content: 'Could not react to message.',
      ephemeral: true,
    });
    return;
  }

  try {
    await reactionRole.create({
      messageId,
      channelId,
      emoji: emoji,
      roleId: role.id,
    });

    await interaction.reply({
      content: 'Reaction role was created.',
      ephemeral: true,
    });
  } catch (e) {
    Logger.error(e);
    await interaction.reply({
      content: `An error occurred while creating the FAQ entry. Please try again later. If this error persists, please report to the staff team.`,
      ephemeral: true,
    });
  }
};

const listReactionRole = async (interaction) => {
  const reactionRoles = await reactionRole.findAll();
  const rolesOrderedByMessage = {};
  const embeds = [];
  for (const role of reactionRoles) {
    if (!rolesOrderedByMessage[role.messageId]) {
      let channel;
      let message;
      try {
        channel = await interaction.guild.channels.cache.find(
          (channel) => `${role.channelId}` === `${channel.id}`
        );
        message = await channel.messages.fetch(role.messageId);
      } catch (e) {
        // Unknown message || Unknown channel
        if (e.code === 10008 || e.code === 10003) {
          role.destroy();
          continue;
        }
        Logger.error(
          `An error occoured while fetching the reaction roles: ${e}`
        );
        await interaction.reply({
          content:
            'An error occoured while fetching the reaction roles. Please try again later. If this error persists, please report to the staff team.',
          ephemeral: true,
        });
        return;
      }

      rolesOrderedByMessage[role.messageId] = {
        message,
        reactionRoles: [],
      };
    }
    role.role = await interaction.guild.roles.cache.find(
      (guildRole) => guildRole.id === role.roleId
    );
    rolesOrderedByMessage[role.messageId].reactionRoles.push(role);
  }

  Object.values(rolesOrderedByMessage).forEach((value) => {
    const embed = new EmbedBuilder()
      .setTitle('Reaction roles')
      .setDescription(`Reaction roles for: ${value.message.url}`)
      .setTimestamp();

    value.reactionRoles.forEach((reactionRole) => {
      embed.addFields({
        name: `ID: ${reactionRole.id}`,
        value: `Emoji: ${reactionRole.emoji}\n Role: ${reactionRole.role}`,
      });
    });

    embeds.push(embed);
  });

  const pagination = new Paginate(interaction, embeds);
  await pagination.paginate();
};

const removeReactionRole = async (interaction) => {
  const reactionRoleId = interaction.options.getString('reaction-role-id');

  const toBeRemovedReactionRole = await reactionRole.findOne({
    where: {
      id: reactionRoleId,
    },
  });
  if (!toBeRemovedReactionRole) {
    await interaction.reply({
      content: 'The reaction role was not found.',
      ephemeral: true,
    });

    return;
  }
  try {
    const channel = await interaction.guild.channels.cache.find(
      (channel) => `${toBeRemovedReactionRole.channelId}` === `${channel.id}`
    );
    const message = await channel.messages.fetch(
      toBeRemovedReactionRole.messageId
    );
    await message.reactions.cache.get(toBeRemovedReactionRole.emoji).remove();
  } catch {
    // the channel, message or reaction is already removed
  }

  try {
    await reactionRole.destroy({
      where: {
        id: reactionRoleId,
      },
    });

    await interaction.reply({
      content: 'The reaction role has been removed.',
      ephemeral: true,
    });
  } catch (e) {
    Logger.error(e);
    await interaction.reply({
      content: `An error occurred while removing the reaction role. Please try again later. If this error persists, please report to the staff team.`,
      ephemeral: true,
    });
  }
};

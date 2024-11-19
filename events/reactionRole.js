import { EmbedBuilder } from 'discord.js';
import { reactionRole } from '../models/reactionRole.js';
import { addRole, removeRole } from '../utils/roles.js';
import Logger from '../utils/logger.js';

export const handleReactionRole = async (reaction, user, type) => {
  if (user.bot) {
    return;
  }

  const member = await reaction.message.guild.members.fetch(user.id);
  const emoji = reaction.emoji.toString();
  const role = await reactionRole.findOne({
    where: {
      channelId: reaction.message.channelId,
      messageId: reaction.message.id,
      emoji: emoji,
    },
  });
  if (!role) {
    return;
  }

  const serverRole = reaction.message.guild.roles.cache.find(
    (guildRole) => guildRole.id === role.roleId
  );

  if (!serverRole) {
    Logger.warning(`The role with the ID ${role.roleId} was not found.`);
    return;
  }

  let embed = null;

  if (type === 'add' && !member.roles.cache.has(serverRole.id)) {
    const result = await addRole(member, serverRole);
    embed = getAddEmbed(result, serverRole, reaction);
  } else if (type === 'remove' && member.roles.cache.has(serverRole.id)) {
    const result = await removeRole(member, serverRole);
    embed = getRemoveEmbed(result, serverRole, reaction);
  }

  if (embed) {
    user.send({
      embeds: [embed],
    });
  }
};

const getAddEmbed = (result, serverRole, reaction) => {
  const embed = getEmbedBase();
  if (!result) {
    embed
      .setTitle('Reaction Roles error!')
      .setDescription(
        `You reacted in **${reaction.message.guild.name}** to the message ${reaction.message.url} \n` +
          'The role `' +
          serverRole.name +
          '` could **not** be assigned to you.\n' +
          'Please try again later. If this error persists, please report to the staff team.'
      );
  } else {
    embed
      .setTitle('Reaction Roles added!')
      .setDescription(
        `You reacted in **${reaction.message.guild.name}** to the message ${reaction.message.url} \n` +
          'The role `' +
          serverRole.name +
          '` was assigned to you.'
      );
  }
  return embed;
};

const getRemoveEmbed = (result, serverRole, reaction) => {
  const embed = getEmbedBase();
  if (!result) {
    embed
      .setTitle('Reaction Roles error!')
      .setDescription(
        `You removed your reaction in **${reaction.message.guild.name}** to the message ${reaction.message.url} \n` +
          'The role `' +
          serverRole.name +
          '` could **not** be removed to you.\n' +
          'Please try again later. If this error persists, please report to the staff team.'
      );
  } else {
    embed
      .setTitle('Reaction Roles removed!')
      .setDescription(
        `You removed your reaction in **${reaction.message.guild.name}** to the message ${reaction.message.url} \n` +
          'The role `' +
          serverRole.name +
          '` was removed to you.'
      );
  }
  return embed;
};

const getEmbedBase = () => {
  return new EmbedBuilder().setColor('#f0833a').setTimestamp();
};

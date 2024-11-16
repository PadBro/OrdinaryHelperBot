import { reactionRole } from "../models/reactionRole.js";
import { addRole, removeRole } from "../utils/roles.js";
import Logger from "../utils/logger.js";

export const handleReactionRole = async (reaction, user, type) => {
  if (user.bot) {
    return
  }

  const member = await reaction.message.guild.members.fetch(user.id);
  const emoji = reaction.emoji.toString();
  let databaseEmoji = emoji
  const emojiRegex = /^(\p{Emoji})$/u
  if (emojiRegex.test(emoji)) {
    databaseEmoji = emoji.codePointAt(0).toString(16)
  }
  const role = await reactionRole.findOne({
    where: {
      channelId: reaction.message.channelId,
      messageId: reaction.message.id,
      emoji: databaseEmoji,
    }
  })
  if (!role) {
    return
  }

  const serverRole = reaction.message.guild.roles.cache.find((guildRole) => guildRole.id === role.roleId)


  if (!serverRole) {
    Logger.warning(`The role with the ID ${role.roleId} was not found.`);
    return
  }
  if (type === 'add') {
    add(serverRole, member, user)
  } else if (type === 'remove') {
    remove(serverRole, member, user)
  }
}

const add = async (serverRole, member, user) => {
  const result = await addRole(member, serverRole);
  if (!result) {
    user.send('The role `' + serverRole.name + '` could **not** be assigned to you. Please try again later. If this error persists, please report to the staff team.')
    return
  }
  user.send('The role `' + serverRole.name + '` was assigned to you.')
}

const remove = async (serverRole, member, user) => {
  const result = await removeRole(member, serverRole);
  if (!result) {
    user.send('The role `' + serverRole.name + '` could **not** be assigned to you. Please try again later. If this error persists, please report to the staff team.')
    return
  }
  user.send('The role `' + serverRole.name + '` was removed to you.')
}

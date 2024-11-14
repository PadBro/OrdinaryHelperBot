import { reactionRole } from "../models/reactionRole.js";
import { addRole, removeRole } from "../utils/roles.js";
import Logger from "../utils/logger.js";

export const handleReaction = async (reaction, user, type) => {
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
    add(serverRole, member)
  } else if (type === 'remove') {
    remove(serverRole, member)
  }
}

const add = async (serverRole, member) => {
  const result = await addRole(member, serverRole);
  if (!result) {
    // send user message could not asign role
  }
  // send user message role was asigned
}

const remove = async (serverRole, member) => {
  const result = await removeRole(member, serverRole);
  if (!result) {
    // send user message could not remove role
  }
  // send user message role was removed
}

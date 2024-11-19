const emojiRegex =
  /^((?![\u{23}-\u1F6F3]([^\u{FE0F}]|$))\p{Emoji}(?:(?!\u{200D})\p{EComp}|(?=\u{200D})\u{200D}\p{Emoji})*)$/u;
const discordEmojiRegex = /^<.+:([0-9]+)>$/;

export const isValidEmoji = (emoji, guildEmojis) => {
  if (emojiRegex.test(emoji)) {
    return true;
  }

  const match = emoji.match(discordEmojiRegex);
  if (match) {
    const serverEmoji = guildEmojis.cache.find(
      (guildEmoji) => guildEmoji.id === `${match[1]}`
    );
    if (serverEmoji) {
      return true;
    }
  }

  return false;
};

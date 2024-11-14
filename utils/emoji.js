export default class Emoji {
  #emojiRegex = /^(\p{Emoji})$/u
  #discordEmojiRegex = /^<.+:([0-9]+)>$/

  emoji = ''
  constructor (emoji) {
    this.emoji = emoji
  }

  isValid (guildEmojis) {
    if (this.#emojiRegex.test(this.emoji)) {
      return true;
    }

    const match = this.emoji.match(this.#discordEmojiRegex);
    if (match) {
      const serverEmoji = guildEmojis.cache.find(guildEmoji => guildEmoji.id === `${match[1]}`)
      if (serverEmoji) {
        return true
      }
    }

    return false;
  }

  forDatabase () {
    if (this.#emojiRegex.test(this.emoji)) {
      return this.emoji.codePointAt(0).toString(16)
    }
    return this.emoji

  }

  forOutput () {
    if (this.#discordEmojiRegex.test(this.emoji)) {
      return this.emoji
    }
    return String.fromCodePoint("0x"+this.emoji)
  }
}
export const validate = () => {}

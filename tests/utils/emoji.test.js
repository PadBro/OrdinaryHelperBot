import { it, expect } from 'vitest';
import { isValidEmoji } from '../../utils/emoji.js';

const mockGuildEmojis = {
  cache: [
    { id: '1234567890', name: 'smile' },
    { id: '0987654321', name: 'sad' },
  ],
};

it('should return true for valid Unicode emoji', () => {
  expect(isValidEmoji('🙂', mockGuildEmojis)).toBe(true);
  expect(isValidEmoji('👨‍👩‍👧‍👦', mockGuildEmojis)).toBe(true);
});

it('should return false for invalid Unicode emoji', () => {
  expect(isValidEmoji('👍🏿a', mockGuildEmojis)).toBe(false);
  expect(isValidEmoji('👍🏿👨‍👩‍👧‍👦', mockGuildEmojis)).toBe(false);
});

it('should return true for valid Discord custom emoji', () => {
  expect(isValidEmoji('<:smile:1234567890>', mockGuildEmojis)).toBe(true);
});

it('should return false for Discord custom emoji with invalid ID', () => {
  expect(isValidEmoji('<:smile:1111111111>', mockGuildEmojis)).toBe(false);
});

it('should return false for invalid Discord emoji formats', () => {
  expect(isValidEmoji('<:smile1234567890>', mockGuildEmojis)).toBe(false);
  expect(isValidEmoji('smile:1234567890', mockGuildEmojis)).toBe(false);
});

it('should return false for non-emoji strings', () => {
  expect(isValidEmoji('not an emoji', mockGuildEmojis)).toBe(false);
  expect(isValidEmoji('12345', mockGuildEmojis)).toBe(false);
  expect(isValidEmoji('hello', mockGuildEmojis)).toBe(false);
});

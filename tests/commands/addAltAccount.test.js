import { expect, it, vi, beforeEach } from 'vitest';
import { execute } from '../../commands/addAltAccount.js';

const interaction = {
  reply: vi.fn(),
  channel: {
    send: vi.fn(),
  },
  options: {
    getUser: vi.fn((key) => key),
  },
};

beforeEach(() => {
  vi.clearAllMocks();
});

it('can add a alt account', async () => {
  await execute(interaction);

  expect(interaction.channel.send).toBeCalledWith({
    embeds: [
      {
        data: {
          color: 15762234,
          description: 'member - alt',
        },
      },
    ],
  });
  expect(interaction.reply).toBeCalledWith({
    content: 'Alt account was added',
    ephemeral: true,
  });
});

it('handles error', async () => {
  interaction.channel.send.mockRejectedValue(new Error());

  await execute(interaction);

  expect(interaction.reply).toBeCalledWith({
    content:
      'An error occurred while adding the alt account. Please try again later. If this error persists, please report to the staff team.',
    ephemeral: true,
  });
});

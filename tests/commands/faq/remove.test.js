import { expect, it, vi } from 'vitest';
import { execute, autocomplete } from '../../../commands/faq/remove.js';
import fetch from 'node-fetch';

const interaction = {
  options: {
    getFocused: vi.fn(),
    getString: vi.fn(),
  },
  respond: vi.fn(),
  reply: vi.fn(),
};

vi.mock('node-fetch');
fetch.mockReturnValue(
  Promise.resolve({
    json: () =>
      Promise.resolve({
        data: [
          {
            id: 1,
            question: 'Test',
            answer: 'Testing',
          },
          {
            id: 2,
            question: 'Abc',
            answer: 'Def',
          },
        ],
      }),
    text: () => Promise.resolve(1),
  })
);

it('can retrive autocomplete', async () => {
  interaction.options.getFocused.mockReturnValue('');
  await autocomplete(interaction);

  expect(interaction.respond).toBeCalledWith([
    { name: 'Test', value: '1' },
    { name: 'Abc', value: '2' },
  ]);
});

it('can execute', async () => {
  interaction.options.getString.mockReturnValue('1');
  await execute(interaction);

  expect(interaction.reply).toBeCalledWith({
    content: 'The FAQ has been removed.',
    ephemeral: true,
  });
});

it('returns error if faq is not found', async () => {
  fetch.mockReturnValue(
    Promise.resolve({
      text: () => Promise.resolve(0),
    })
  );
  interaction.options.getString.mockReturnValue('0');
  await execute(interaction);

  expect(interaction.reply).toBeCalledWith({
    content: 'The FAQ was not found.',
    ephemeral: true,
  });
});

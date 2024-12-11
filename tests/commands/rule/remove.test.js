import { expect, it, vi } from 'vitest';
import { execute, autocomplete } from '../../../commands/rule/remove.js';
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
            id: 2,
            number: 1,
            name: 'Abc',
            rule: 'Def',
          },
          {
            id: 1,
            number: 2,
            name: 'Test',
            rule: 'Testing',
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
    { name: '1. Abc', value: '2' },
    { name: '2. Test', value: '1' },
  ]);
});

it('can execute', async () => {
  interaction.options.getString.mockReturnValue('1');
  await execute(interaction);

  expect(interaction.reply).toBeCalledWith({
    content: 'The rule has been removed.',
    ephemeral: true,
  });
});

it('return error if rule is not found', async () => {
  fetch.mockReturnValue(
    Promise.resolve({
      text: () => Promise.resolve(0),
    })
  );

  interaction.options.getString.mockReturnValue('0');
  await execute(interaction);
});

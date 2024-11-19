import { expect, test, vi } from 'vitest';
import { execute, autocomplete } from '../../../commands/rule/index.js';
import { rule } from '../../../models/rule.js';

const interaction = {
  options: {
    getFocused: vi.fn(),
    getString: vi.fn(),
  },
  respond: vi.fn(),
  reply: vi.fn(),
};

test('can retrive autocomplete', async () => {
  await rule.bulkCreate([
    {
      number: 2,
      name: 'Test',
      rule: 'Testing',
    },
    {
      number: 1,
      name: 'Abc',
      rule: 'Def',
    },
  ]);

  interaction.options.getFocused.mockReturnValue('');
  await autocomplete(interaction);

  expect(interaction.respond).toBeCalledWith([
    { name: '1. Abc', value: '2' },
    { name: '2. Test', value: '1' },
  ]);
});

test('can execute', async () => {
  const ruleModel = await rule.create({
      number: 2,
      name: 'Test',
      rule: 'Testing',
  });

  interaction.options.getString.mockReturnValue(`${ruleModel.id}`);
  await execute(interaction);

  expect(interaction.reply).toBeCalledWith({
    embeds: [
      {
        data: {
          color: 15762234,
          description: 'Testing',
          title: '2. Test',
        },
      },
    ],
  });
});

test('return error if rule is not found', async () => {
  interaction.options.getString.mockReturnValue('0');
  await execute(interaction);

  expect(interaction.reply).toBeCalledWith({
    content:
      'The rule was not found please try again later. If this error persists, please report to the staff team.',
    ephemeral: true,
  });
});

import { expect, test, vi } from 'vitest';
import { execute, autocomplete } from '../../../commands/rule/remove.js';
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
    content: 'The rule has been removed.',
    ephemeral: true,
  });

  const removedrule = await rule.findOne({
    where: {
      id: ruleModel.id,
    },
  });

  expect(removedrule).toBeNull();
});

test('return error if rule is not found', async () => {
  await rule.create({
      number: 2,
      name: 'Test',
      rule: 'Testing',
  });

  interaction.options.getString.mockReturnValue('0');
  await execute(interaction);

  expect(interaction.reply).toBeCalledWith({
    content: 'The rule was not found.',
    ephemeral: true,
  });
  expect(await rule.count()).toBe(1);
});

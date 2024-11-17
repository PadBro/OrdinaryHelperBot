import { expect, test, vi } from 'vitest';
import { execute, autocomplete } from '../../../commands/faq/remove.js';
import { faq } from '../../../models/faq.js';

const interaction = {
  options: {
    getFocused: vi.fn(),
    getString: vi.fn(),
  },
  respond: vi.fn(),
  reply: vi.fn(),
};

test('can retrive autocomplete', async () => {
  await faq.bulkCreate([
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
  ]);

  interaction.options.getFocused.mockReturnValue('');
  await autocomplete(interaction);

  expect(interaction.respond).toBeCalledWith([
    { name: 'Test', value: '1' },
    { name: 'Abc', value: '2' },
  ]);
});

test('can execute', async () => {
  const faqModel = await faq.create({
    question: 'Test',
    answer: 'Testing',
  });

  interaction.options.getString.mockReturnValue(`${faqModel.id}`);
  await execute(interaction);

  expect(interaction.reply).toBeCalledWith({
    content: 'The FAQ has been removed.',
    ephemeral: true,
  });

  const removedFaq = await faq.findOne({
    where: {
      id: faqModel.id,
    },
  });

  expect(removedFaq).toBeNull();
});

test('return error if faq is not found', async () => {
  await faq.create({
    question: 'Test',
    answer: 'Testing',
  });

  interaction.options.getString.mockReturnValue('0');
  await execute(interaction);

  expect(interaction.reply).toBeCalledWith({
    content: 'The FAQ was not found.',
    ephemeral: true,
  });
  expect(await faq.count()).toBe(1);
});

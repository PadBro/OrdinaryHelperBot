import { expect, it, vi } from 'vitest';
import { execute, autocomplete } from '../../../commands/faq/index.js';
import { faq } from '../../../models/faq.js';

const interaction = {
  options: {
    getFocused: vi.fn(),
    getString: vi.fn(),
  },
  respond: vi.fn(),
  reply: vi.fn(),
};

it('can retrive autocomplete', async () => {
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

it('can execute', async () => {
  const faqModel = await faq.create({
    question: 'Test',
    answer: 'Testing',
  });

  interaction.options.getString.mockReturnValue(`${faqModel.id}`);
  await execute(interaction);

  expect(interaction.reply).toBeCalledWith({
    embeds: [
      {
        data: {
          color: 15762234,
          description: 'Testing',
          title: 'Test',
        },
      },
    ],
  });
});

it('returns error if faq is not found', async () => {
  interaction.options.getString.mockReturnValue('0');
  await execute(interaction);

  expect(interaction.reply).toBeCalledWith({
    content:
      'The question was not found. Please try again later. If this error persists, please report to the staff team.',
    ephemeral: true,
  });
});

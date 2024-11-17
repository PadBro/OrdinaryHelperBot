import { expect, test, beforeEach, vi } from 'vitest';
import { autocomplete } from '../../../commands/faq/index.js';
import { faq } from '../../../models/faq.js';

const interaction = {
  options: {
    getFocused: vi.fn(),
  },
  respond: vi.fn(),
};

beforeEach(async () => {
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
});

test('can retrive autocomplete', async () => {
  interaction.options.getFocused.mockReturnValue('');
  await autocomplete(interaction);

  expect(interaction.respond).toBeCalledWith([
    { name: 'Test', value: '1' },
    { name: 'Abc', value: '2' },
  ]);
});

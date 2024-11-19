import { expect, test, vi } from 'vitest';
import { execute } from '../../../commands/faq/create.js';
import { modal } from '../../../modals/utils/createFaq.js';

const interaction = {
  showModal: vi.fn(),
};

test('can call modal', async () => {
  await execute(interaction);

  expect(interaction.showModal).toBeCalledWith(modal);
});

import { expect, it, vi } from 'vitest';
import { execute } from '../../../commands/faq/create.js';
import { modal } from '../../../modals/utils/createFaq.js';

const interaction = {
  showModal: vi.fn(),
};

it('can call modal', async () => {
  await execute(interaction);

  expect(interaction.showModal).toBeCalledWith(modal);
});

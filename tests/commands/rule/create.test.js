import { expect, it, vi } from 'vitest';
import { execute } from '../../../commands/rule/create.js';
import { modal } from '../../../modals/utils/createRule.js';

const interaction = {
  showModal: vi.fn(),
};

it('can call modal', async () => {
  await execute(interaction);

  expect(interaction.showModal).toBeCalledWith(modal);
});

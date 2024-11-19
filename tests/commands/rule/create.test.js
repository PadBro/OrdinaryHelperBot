import { expect, test, vi } from 'vitest';
import { execute } from '../../../commands/rule/create.js';
import { modal } from '../../../modals/utils/createRule.js';

const interaction = {
  showModal: vi.fn(),
};

test('can call modal', async () => {
  await execute(interaction);

  expect(interaction.showModal).toBeCalledWith(modal);
});

import { expect, test, vi } from 'vitest';
import { addRole } from '../../utils/addRole.js';

const member = {
  roles: {
    add: vi.fn()
  },
};

test('can add role', async () => {
  addRole(member, '123');

  expect(member.roles.add).toBeCalledWith('123');
});

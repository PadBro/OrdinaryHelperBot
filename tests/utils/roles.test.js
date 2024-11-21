import { expect, test, vi } from 'vitest';
import { addRole, removeRole } from '../../utils/roles.js';

const member = {
  roles: {
    add: vi.fn(),
    remove: vi.fn()
  },
};

test('can add role', async () => {
  const result = await addRole(member, '123');
  expect(result).toBeTruthy()

  expect(member.roles.add).toBeCalledWith('123');
});

test('add role returns false in error case', async () => {
  member.roles.add.mockRejectedValue(new Error())
  const result = await addRole(member, '123');

  expect(result).toBe(false);
  expect(member.roles.add).toBeCalledWith('123');
});

test('can remove role', async () => {
  const result = await removeRole(member, '123');
  expect(result).toBeTruthy()

  expect(member.roles.remove).toBeCalledWith('123');
});

test('remove role returns false in error case', async () => {
  member.roles.remove.mockRejectedValue(new Error())
  const result = await removeRole(member, '123');

  expect(result).toBe(false);
  expect(member.roles.add).toBeCalledWith('123');
});

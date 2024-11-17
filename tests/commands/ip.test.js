import { expect, test, vi } from 'vitest'
import { execute } from "../../commands/ip.js"
import fetch from "node-fetch";

const interaction = {
  reply: vi.fn()
}

test('can retrive ip', async () => {
  vi.mock("node-fetch");
  fetch.mockReturnValue(
    Promise.resolve({ text: () => Promise.resolve("127.0.0.1") })
  );

  await execute(interaction);

  expect(interaction.reply).toBeCalledWith({
    "content": "Current ip: `127.0.0.1`",
    "ephemeral": true,
  })
});

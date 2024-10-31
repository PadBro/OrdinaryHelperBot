import { REST, Routes } from 'discord.js';
import { getCommands } from './getCommands.js';

export const deployCommands = async () => {
  const commands = (await getCommands()).map((command) =>
    command.data.toJSON(),
  );

  const rest = new REST().setToken(process.env.DISCORD_TOKEN);

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID,
      ),
      { body: commands },
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (error) {
    console.error(error);
  }
};

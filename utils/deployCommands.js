import { REST, Routes } from 'discord.js';
import { getCommands } from './getCommands.js';
import Logger from './logger.js';

export const deployCommands = async () => {
  const commands = (await getCommands()).map((command) =>
    command.data.toJSON()
  );

  const rest = new REST().setToken(process.env.DISCORD_TOKEN);

  try {
    Logger.debug(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    Logger.debug(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    Logger.error(error);
  }
};

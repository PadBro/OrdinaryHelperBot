import Logger from '../../utils/logger.js';

export const handler = async (interaction) => {
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    Logger.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.autocomplete(interaction);
  } catch (error) {
    Logger.error(error);
  }
};

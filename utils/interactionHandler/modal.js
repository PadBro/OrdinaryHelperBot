import Logger from '../../utils/logger.js';

export const handler = async (interaction) => {
  const modal = interaction.client.modals.get(interaction.customId);

  if (!modal) {
    Logger.error(`No modal matching ${interaction.customId} was found.`);
    return;
  }

  try {
    await modal.handler(interaction);
  } catch (error) {
    Logger.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while handling the modal!',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'There was an error while handling the modal!',
        ephemeral: true,
      });
    }
  }
};

export const handler = async (interaction) => {
  const modal = interaction.client.modals.get(interaction.customId);

  if (!modal) {
    console.error(`No modal matching ${interaction.customId} was found.`);
    return;
  }

  try {
    await modal.handler(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  }
};

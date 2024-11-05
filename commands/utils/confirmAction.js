import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';

export const confirmAction = async (
  interaction,
  confirmMessage,
  confirmLabel,
) => {
  const confirm = new ButtonBuilder()
    .setCustomId('confirm')
    .setLabel(confirmLabel)
    .setStyle(ButtonStyle.Danger);

  const cancel = new ButtonBuilder()
    .setCustomId('cancel')
    .setLabel('Cancel')
    .setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder().addComponents(confirm, cancel);

  const response = await interaction.reply({
    content: confirmMessage,
    components: [row],
    ephemeral: true,
  });
  const collectorFilter = (i) => i.user.id === interaction.user.id;

  try {
    const confirmation = await response.awaitMessageComponent({
      filter: collectorFilter,
      time: 60_000,
    });

    if (confirmation.customId === 'confirm') {
      await confirmation.update({
        content: 'executing command',
        components: [],
      });
      return true;
    } else if (confirmation.customId === 'cancel') {
      await confirmation.update({
        content: 'Action cancelled',
        components: [],
        ephemeral: true,
      });
      return false;
    }
  } catch {
    await interaction.editReply({
      content: 'Confirmation not received within 1 minute, cancelling',
      components: [],
    });
    return false;
  }
};

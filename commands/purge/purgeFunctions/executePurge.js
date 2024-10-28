import { PermissionFlagsBits, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js'; 


export const executePurge = async (interaction) => {
    interaction.guild
        if (!interaction.memberPermissions.has(PermissionFlagsBits.BanMembers)) {
            await interaction.reply('insufficient permission');
            return;
        }

        const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm Purge')
			.setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
			.addComponents(confirm, cancel);

        const response = await interaction.reply({
            content: `Are you sure you want to purge?`,
            components: [row],
            ephemeral: true
        })
        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

            if (confirmation.customId === 'confirm') {
                // purge();
                await confirmation.update({ content: 'purge executed', components: [] });
                await interaction.followUp({ content: 'purged', components: [], ephemeral: false });
            } else if (confirmation.customId === 'cancel') {
                await confirmation.update({ content: 'Action cancelled', components: [], ephemeral: true });
            }
        } catch (e) {
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
        }
}
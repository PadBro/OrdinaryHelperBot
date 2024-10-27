import { SlashCommandBuilder } from 'discord.js'; 


export const data = new SlashCommandBuilder()
	.setName('purge')
	.setDescription('Monthly Member Purge')
    .addSubcommand(subcommand =>
        subcommand
            .setName('preview')
            .setDescription('preview purge'))
    .addSubcommand(subcommand =>
		subcommand
			.setName('execute')
			.setDescription('execute purge (remove inactive member roles and linked roles)'))
    .addSubcommand(subcommand =>
		subcommand
			.setName('remove-member')
			.setDescription('remove member role from inactive members'))
	.addSubcommand(subcommand =>
		subcommand
			.setName('remove-linked')
			.setDescription('remove linked role from every member'))
    .addSubcommand(subcommand =>
		subcommand
			.setName('order66')
			.setDescription('remove every member'));


export const execute = async(interaction) => {
    if (interaction.options.getSubcommand() === "remove=linked") {
        interaction.reply("removeLinked");
    } else {
        interaction.reply("removeMember")
    }
}
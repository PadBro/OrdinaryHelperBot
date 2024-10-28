import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'; 
import { executePurge } from './purgeFunctions/executePurge.js';
import { previewPurge } from './purgeFunctions/previewPurge.js';
import { executeOrder66 } from './purgeFunctions/executeOrder66.js';

export const data = new SlashCommandBuilder()
	.setName('purge')
	.setDescription('Monthly Member Purge')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
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
    const subcommand = interaction.options.getSubcommand();
    switch(subcommand) {
        case 'preview':
            previewPurge(interaction);
            break;
        case 'execute':
            executePurge(interaction);
            break;
        case 'remove-member':
            // not implemented yet
            break;
        case 'remove-linked':
            // not implemented yet
            break;
        case 'order66':
            executeOrder66(interaction);
            break;
        default:
            interaction.reply('command not found');
    }
}
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import fetch from 'node-fetch';
import { writeFileSync, unlinkSync } from 'fs';

export const data = new SlashCommandBuilder()
  .setName('sync-linked-players')
  .setDescription(
    'Syncs the LinkedPlayers.json with the members on the server!',
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
  .addAttachmentOption((option) =>
    option
      .setName('linked-players-json')
      .setDescription('The LinkedPlayers.json file')
      .setRequired(true),
  );

export const execute = async (interaction) => {
  const attachment = interaction.options.getAttachment('linked-players-json');
  const response = await fetch(attachment.url);

  let linkedPlayers = [];
  try {
    linkedPlayers = await response.json();
  } catch (e) {
    await interaction.reply({
      content: `An error occurred loading the file. ${e}`,
      ephemeral: true,
    });
    return;
  }

  if (!Array.isArray(linkedPlayers)) {
    await interaction.reply({ content: 'Invalide file.', ephemeral: true });
    return;
  }

  const memberIds = interaction.guild.roles.cache
    .get(process.env.MEMBER_ROLE_ID)
    .members.map((member) => member.id);
  const filteredLinkedPlayers = linkedPlayers.filter((linkedPlayer) => {
    if (!linkedPlayer.discordID) {
      return false;
    }
    return memberIds.includes(linkedPlayer.discordID);
  });

  const path = './configs/LinkedPlayers.json';
  try {
    writeFileSync(path, JSON.stringify(filteredLinkedPlayers, null, '\t'));
  } catch (e) {
    await interaction.reply({
      content: `An error occurred creating the file. ${e}`,
      ephemeral: true,
    });
    return;
  }

  await interaction.reply({ files: [path] });

  unlinkSync(path);
};

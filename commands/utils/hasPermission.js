export const hasPermission = async (interaction, requiredPermissionFlag) => {
  if (!interaction.memberPermissions.has(requiredPermissionFlag)) {
    await interaction.reply({
      content: 'insufficient permission',
      ephemeral: true,
    });
    return false;
  }
  return true;
};

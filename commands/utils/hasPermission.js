export const hasPermission = async (
  interaction,
  requiredPermissionFlag,
  message = 'insufficient permission'
) => {
  if (!interaction.memberPermissions.has(requiredPermissionFlag)) {
    await interaction.reply({
      content: message,
      ephemeral: true,
    });
    return false;
  }
  return true;
};

export const hasPermission = async (interaction, requiredPermissionFlag) => {
  if (!interaction.memberPermissions.has(requiredPermissionFlag)) {
    await interaction.reply('insufficient permission');
    return false
  }
  return true
}
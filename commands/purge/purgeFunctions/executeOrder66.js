


export const executeOrder66 = async (interaction) => {
    const memberRole = interaction.guild.roles.cache.get(
      process.env.MEMBER_ROLE_ID,
    );
    memberRole.members.map((m) => m.roles.remove(memberRole));
    await interaction.reply('Removed all Member Roles');
  };
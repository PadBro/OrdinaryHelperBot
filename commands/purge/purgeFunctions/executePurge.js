import { PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { confirmAction } from '../../utils/confirmAction.js';
import { removeLinked } from './removeLinked.js';
import { getMembersToPurge } from './getMembersToPurge.js';

export const executePurge = async (interaction) => {
  interaction.guild;
  if (!interaction.memberPermissions.has(PermissionFlagsBits.BanMembers)) {
    await interaction.reply('insufficient permission');
    return;
  }

  if (
    !(await confirmAction(
      interaction,
      'Do you really want to purge?',
      'Confirm Purge',
    ))
  ) {
    return;
  }

  const memberRole = interaction.guild.roles.cache.get(
    process.env.MEMBER_ROLE_ID,
  );
  const filteredMembers = await getMembersToPurge(interaction);
  filteredMembers.map((m) => m.roles.remove(memberRole));

  await removeLinked(interaction);

  const embed = new EmbedBuilder()
    .setTitle('Member Purge')
    .setDescription('Executed Purge')
    .addFields({
      name: 'Purged Members',
      value: `${filteredMembers?.map((member) => `<@${member.id}>`).join(', ') || '---'}`,
    })
    .setTimestamp();

  await interaction.channel.send({
    embeds: [embed],
    components: [],
    ephemeral: false,
  });
};

import { EmbedBuilder } from 'discord.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const sendLeaveMessage = (channel, member) => {
  const roles = member.roles.cache;
  const filteredRoles = roles.filter((role) => role.name != '@everyone');

  let embedColor = 'FF0000';
  if (roles.find((role) => role.id == process.env.MEMBER_ROLE_ID)) {
    const memberRole = member.guild.roles.cache.find(
      (role) => role.id == process.env.MEMBER_ROLE_ID,
    );
    embedColor = memberRole.hexColor;
  }

  const diff = dayjs().diff(dayjs(member.joinedAt), 'day', true);
  const duration = dayjs.duration(diff, 'days').humanize();

  const embed = new EmbedBuilder()
    .setColor(embedColor)
    .setTitle(`${member.user.username} left the Server`)
    .setDescription(`${member} left`)
    .addFields(
      { name: 'Nickname:', value: `${member.nickname ?? '---'}`, inline: true },
      {
        name: 'Displayname:',
        value: `${member.user.displayName}`,
        inline: true,
      },
      { name: '\u200B', value: '\u200B' },
      {
        name: 'Roles:',
        value:
          filteredRoles.size > 0 ? filteredRoles.toJSON().join(', ') : '---',
        inline: true,
      },
      { name: 'Time on Server:', value: `${duration}`, inline: true },
    )
    .setThumbnail(member.user.avatarURL())
    .setTimestamp();

  channel.send({ embeds: [embed] });
};

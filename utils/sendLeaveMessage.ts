import { EmbedBuilder, ColorResolvable } from 'discord.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const sendLeaveMessage = (channel, member) => {
  const roles = member.roles.cache;
  const rolesString = roles.map((role) => role.name);
  const rolesStringFiltered = rolesString.filter((role) => role != '@everyone');

  let embedColor = '#FF0000';
  if (roles.find((role) => role.id == process.env.MEMBER_ROLE_ID)) {
    const memberRole = member.guild.roles.cache.find(
      (role) => role.id == process.env.MEMBER_ROLE_ID,
    );
    embedColor = memberRole.hexColor;
  }

  const diff = dayjs().diff(dayjs(member.joinedAt), 'day', true);
  const duration = dayjs.duration(diff, 'days').humanize();

  const embed = new EmbedBuilder()
    .setColor(embedColor as ColorResolvable)
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
        value: rolesStringFiltered.length
          ? rolesStringFiltered.join(', ')
          : '---',
        inline: true,
      },
      { name: 'Time on Server:', value: `${duration}`, inline: true },
    )
    .setThumbnail(member.user.avatarURL())
    .setTimestamp();

  channel.send({ embeds: [embed] });
};

module.exports = { sendLeaveMessage };

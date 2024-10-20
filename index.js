const { EmbedBuilder } = require('discord.js');
const dayjs = require('dayjs')
const relativeTime = require("dayjs/plugin/relativeTime");
const duration = require("dayjs/plugin/duration");

dayjs.extend(duration);
dayjs.extend(relativeTime);

const { Client, Events, IntentsBitField } = require('discord.js');

const flags = [
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMembers,
  IntentsBitField.Flags.GuildPresences,
];
const intents = new IntentsBitField();
intents.add(flags);
const client = new Client({ intents: [intents] });

const dotenv = require('dotenv');
dotenv.config();

client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on("guildMemberRemove", member => {
  const channel = client.channels.cache.get(process.env.LEAVE_CHANNEL);
  sendLeaveMessage(channel, member)
});

client.login(process.env.DISCORD_TOKEN);

const sendLeaveMessage = (channel, member) => {

  const roles = member.roles.cache;
  const rolesString = roles.map((role) => role.name);
  const rolesStringFiltered = rolesString.filter((role) => role != '@everyone')


  let embedColor = 'FF0000'
  if (roles.find(role => role.id == process.env.MEMBER_ROLE_ID)) {
    const memberRole = member.guild.roles.cache.find(role => role.id == process.env.MEMBER_ROLE_ID)
    embedColor = memberRole.hexColor
  }

  const diff = dayjs().diff(dayjs(member.joinedAt), 'day')
  const duration = dayjs.duration(diff, "days").humanize();

  const embed = new EmbedBuilder()
    .setColor(embedColor)
    .setTitle(`${member.displayName} left the Server`)
    .setDescription(`${member} left`)
    .addFields(
      { name: 'Nickname:', value: `${member.nickname ?? '---'}`, inline: true },
      { name: 'Displayname:', value: `${member.displayName}`, inline: true },
      { name: '\u200B', value: '\u200B' },
      { name: 'Roles:', value: rolesStringFiltered.length ? rolesStringFiltered.join(', ') : '---', inline: true },
      { name: 'Time on Server', value: `${duration}`, inline: true },
    )
    .setTimestamp();

  channel.send({ embeds: [embed] });
}
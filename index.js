const { Client, Events, IntentsBitField } = require('discord.js');
const { sendLeaveMessage } = require('./utils/sendLeaveMessage');

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

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('guildMemberRemove', (member) => {
  const channel = client.channels.cache.get(process.env.LEAVE_CHANNEL);
  sendLeaveMessage(channel, member);
});

client.login(process.env.DISCORD_TOKEN);

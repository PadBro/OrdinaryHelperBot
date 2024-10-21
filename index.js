const { Client, Events, IntentsBitField } = require('discord.js');
const { sendLeaveMessage } = require('./utils/sendLeaveMessage');
const { addRole } = require('./utils/addRole');
const dotenv = require('dotenv');
dotenv.config();

const flags = [
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMembers,
  IntentsBitField.Flags.GuildPresences,
];

const intents = new IntentsBitField();
intents.add(flags);
const client = new Client({ intents: [intents] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('guildMemberRemove', (member) => {
  const channel = client.channels.cache.get(process.env.LEAVE_CHANNEL);
  sendLeaveMessage(channel, member);
});

client.on('guildMemberAdd', (member) => {
  if (process.env.JOIN_ROLE_ID) {
    addRole(member, process.env.JOIN_ROLE_ID)
  }
});

client.login(process.env.DISCORD_TOKEN);

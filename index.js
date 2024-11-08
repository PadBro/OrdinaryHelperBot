import 'dotenv/config';
import { Client, Events, IntentsBitField } from 'discord.js';
import { sequelize } from './utils/database.js';
import models from './models/index.js';
import {
  sendLeaveMessage,
  addRole,
  getCommands,
  deployCommands,
  getModals,
  Logger,
} from './utils/index.js';
import {
  modalHandler,
  commandsHandler,
  autocompleteHandler,
} from './utils/interactionHandler/index.js';

const flags = [
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMembers,
  IntentsBitField.Flags.GuildPresences,
];

const intents = new IntentsBitField();
intents.add(flags);

const client = new Client({ intents: [intents] });
client.commands = await getCommands();
client.modals = await getModals();

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    commandsHandler(interaction);
  } else if (interaction.isAutocomplete()) {
    autocompleteHandler(interaction);
  } else if (interaction.isModalSubmit()) {
    modalHandler(interaction);
  }
});

client.once(Events.ClientReady, (readyClient) => {
  Logger.debug(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('guildMemberRemove', (member) => {
  const channel = client.channels.cache.get(process.env.LEAVE_CHANNEL);
  sendLeaveMessage(channel, member);
});

client.on('guildMemberAdd', (member) => {
  if (process.env.JOIN_ROLE_ID) {
    addRole(member, process.env.JOIN_ROLE_ID);
  }
});

try {
  await sequelize.authenticate();
  Logger.debug('Connection to the database has been established successfully.');
} catch (error) {
  Logger.error('Unable to connect to the database:', error);
}

Logger.debug('syncing models');
for (const model of models) {
  try {
    await model.sync({ alter: true });
  } catch (e) {
    throw `${model.name}: ${e}`;
  }
}
Logger.debug('models synced');

deployCommands();
client.login(process.env.DISCORD_TOKEN);

import 'dotenv/config';
import { Client, Events, GatewayIntentBits, Partials } from 'discord.js';
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

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMessageReactions,
];
const partials =  [
  Partials.Message,
  Partials.Channel,
  Partials.Reaction
];

const client = new Client({ intents, partials });
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

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  console.log(reaction)
  console.log(reaction.emoji)
  const role = await models[2].findOne({
    where: {
      channelId: reaction.message.channelId,
      messageId: reaction.message.id,
      emoji: reaction.emoji.toString().codePointAt(0).toString(16),
    }
  })
  console.log(role)
  // if (user.bot) {
  //   return
  // }
  // if (reaction.partial) {
  //   try {
  //     await reaction.fetch();
  //   } catch (error) {
  //     console.error('Something went wrong when fetching the message:', error);
  //     return;
  //   }
  // }

  // console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
  // console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
});

client.on(Events.MessageReactionRemove, async (reaction, user) => {
  console.log(reaction)
  console.log(reaction.emoji)
  const role = await models[2].findOne({
    where: {
      channelId: reaction.message.channelId,
      messageId: reaction.message.id,
      emoji: reaction.emoji.toString(),
    }
  })
  console.log(role)
  // console.log(reaction)
  // if (user.bot) {
  //   return
  // }
  // // When a reaction is received, check if the structure is partial
  // if (reaction.partial) {
  //   // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
  //   try {
  //     await reaction.fetch();
  //   } catch (error) {
  //     console.error('Something went wrong when fetching the message:', error);
  //     // Return as `reaction.message.author` may be undefined/null
  //     return;
  //   }
  // }

  // // Now the message has been cached and is fully available
  // console.log(`${reaction.message.author}'s message "${reaction.message.content}" lost a reaction!`);
  // // The reaction is now also fully available and the properties will be reflected accurately:
  // console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
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

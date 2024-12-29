import 'dotenv/config';
import {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  ActivityType,
} from 'discord.js';
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
} from './events/interaction.js';
import { handleReactionRole } from './events/reactionRole.js';
import dayjs from 'dayjs';

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMessageReactions,
];
const partials = [Partials.Message, Partials.Channel, Partials.Reaction];

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
  Logger.debug(`Ready! Logged in as ${readyClient.user.tag} at ` + dayjs().format('YYYY-MM-DD HH:mm:ss'));
  readyClient.user.setActivity('on play.ordinary-smp.com', {
    type: ActivityType.Playing,
  });
});

client.on(Events.GuildMemberRemove, (member) => {
  const channel = client.channels.cache.get(process.env.LEAVE_CHANNEL);
  sendLeaveMessage(channel, member);
});

client.on(Events.GuildMemberAdd, async (member) => {
  if (process.env.JOIN_ROLE_ID) {
    addRole(member, process.env.JOIN_ROLE_ID);
  }
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  handleReactionRole(reaction, user, 'add');
});

client.on(Events.MessageReactionRemove, async (reaction, user) => {
  handleReactionRole(reaction, user, 'remove');
});

deployCommands();
client.login(process.env.DISCORD_TOKEN);

import { EmbedBuilder } from 'discord.js';

export const closedDmEmbed = new EmbedBuilder()
  .setTitle('Error sending DM')
  .setColor('#ce361e')
  .setDescription(
    `I was unable to send you a DM. Please make sure your DMs are open and try again.
    If you don't know how, [click here](https://support.discord.com/hc/en-us/articles/217916488-Blocking-Privacy-Settings)`
  );


export const applicationStartedDmEmbed = new EmbedBuilder()
  .setTitle('Application Started')
  .setColor('#2e856e')
  .setDescription(
    `Your application process has been started. Please check your DMs for further instructions.`
  );

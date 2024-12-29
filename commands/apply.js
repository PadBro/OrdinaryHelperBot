import { SlashCommandBuilder } from 'discord.js';
import { Op } from 'sequelize';
import { confirmActionDm } from './utils/confirmActionDm.js';
import { applications } from '../models/applications.js';
import { Logger } from '../utils/index.js';
import { applicationStartedDmEmbed, closedDmEmbed } from './applyEmbeds.js';

export const data = new SlashCommandBuilder()
  .setName('apply')
  .setDescription('Start an application process')
  .addStringOption((option) =>
    option
      .setName('application')
      .setDescription('The application you want to start')
      .setRequired(true)
      .addChoices(
        { name: 'Member', value: 'member' },
        { name: 'EventManager', value: 'eventManager' },
        { name: 'Staff', value: 'staff' }
      )
  );

export const execute = async (interaction) => {
  const member = interaction.member;
  const application = interaction.options.getString('application');

  const channel = await member.createDM();

  try {
    await channel.send('Thank you for starting an application process');
  } catch (e) {
    Logger.error('cannot send direct message: ' + e);
    await interaction.reply({
      embeds: [closedDmEmbed],
      ephemeral: true,
    });
    return;
  }

  await interaction.reply({
    embeds: [applicationStartedDmEmbed],
    ephemeral: true,
  });

  const confirmed = await confirmActionDm(
    channel,
    `Are you sure you want to start an application for ${application}?`,
    'Yes',
    'Thank you for applying. Your application process has started.'
  );


  if (!confirmed) {
    channel.send('Application process cancelled');
    return;
  }

  try {
    const app = await applications.findOne({
      where: {
        [Op.and]: [
          { discordUserId: member.id },
          { state: 'INPROCESS' },
          { type: application.toUpperCase() },
        ],
      },
    });
    if (app !== null) {
      await channel.send('You already have an application in process');
      return;
    }
    await applications.create({
      discordUserId: member.id,
      createdAt: new Date(),
      state: 'INPROCESS',
      type: application.toUpperCase(),
    });
  } catch (e) {
    Logger.error(e);
  }
};


function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

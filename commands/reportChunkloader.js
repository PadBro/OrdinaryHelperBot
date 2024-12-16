import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonStyle,
} from 'discord.js';
import { hasPermission } from './utils/hasPermission.js';
import { confirmAction } from './utils/confirmAction.js';
import Logger from '../utils/logger.js';

export const data = new SlashCommandBuilder()
  .setName('report-chunkloader')
  .setDescription('Report a chunkloader')
  .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
  .addIntegerOption((option) =>
    option.setName('x').setDescription('The X coordinate.').setRequired(true)
  )
  .addIntegerOption((option) =>
    option.setName('y').setDescription('The Y coordinate.').setRequired(true)
  )
  .addIntegerOption((option) =>
    option.setName('z').setDescription('The Z coordinate.').setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('dimension')
      .setDescription('The dimension of the chunkloader.')
      .setRequired(true)
      .addChoices(
        { name: 'Overworld', value: 'overworld' },
        { name: 'Nether', value: 'nether' },
        { name: 'End', value: 'end' }
      )
  )
  .addStringOption((option) =>
    option.setName('additional').setDescription('Additional information.')
  )
  .addUserOption((option) =>
    option.setName('member').setDescription('The owner of the chunkloader.')
  );

export const execute = async (interaction) => {
  const x = interaction.options.getInteger('x');
  const y = interaction.options.getInteger('y');
  const z = interaction.options.getInteger('z');
  const dimension = interaction.options.getString('dimension');
  const additional = interaction.options.getString('additional');
  const user = interaction.options.getUser('member') ?? interaction.user;

  if (
    !(await hasPermission(interaction, PermissionFlagsBits.ViewAuditLog)) &&
    user !== interaction.user
  ) {
    interaction.reply({
      content: 'You can not report a chunkloader for other members.',
      ephemeral: true,
    });
    return;
  }

  const coordinates = {
    Overworld: null,
    Nether: null,
    End: null,
  };
  let color = '';

  switch (dimension) {
    case 'overworld':
      color = '#00ff00';
      coordinates.Overworld = { x, y, z };
      coordinates.Nether = { x: Math.round(x / 8), y, z: Math.round(z / 8) };
      break;
    case 'nether':
      color = '#ff0000';
      coordinates.Nether = { x, y, z };
      coordinates.Overworld = { x: x * 8, y, z: z * 8 };
      break;
    case 'end':
      color = '#000000';
      coordinates.End = { x, y, z };
      break;
  }
  const fields = Object.entries(coordinates)
    .filter(([, localCoordinates]) => localCoordinates !== null)
    .map(([localDimension, localCoordinates]) => ({
      name: `${localDimension}:`,
      value:
        `X: ${localCoordinates.x}\nY: ${localCoordinates.y}\nZ: ${localCoordinates.z}\n` +
        '```/tp @p ' +
        localCoordinates.x +
        ' ' +
        localCoordinates.y +
        ' ' +
        localCoordinates.z +
        '```',
      inline: true,
    }));

  const description = [
    `**Chunkloader from**: ${user}`,
    `**Dimension**: ${dimension}`,
    additional ? '**Additional information**:' + '\n`' + additional + '`' : '',
  ];

  const embed = new EmbedBuilder()
    .setColor(color)
    .setDescription(description.filter((field) => field !== '').join('\n\n'))
    .addFields(fields)
    .setThumbnail(user.displayAvatarURL())
    .setTimestamp();

  const confirmed = await confirmAction(
    interaction,
    'Do you want to report this Chunkloader?',
    'Report',
    ButtonStyle.Success,
    [embed]
  );
  if (!confirmed) {
    return;
  }

  try {
    const channel = interaction.guild.channels.cache.get(
      process.env.CHUNKLOADER_CHANNEL
    );
    await channel.send({
      embeds: [embed],
    });
  } catch (e) {
    Logger.error(`Could not report chunkloader: ${e}`);
    await interaction.editReply({
      content:
        'An error occurred while reporting your chunkloader. Please try again later. If this error persists, please report to the staff team.',
      ephemeral: true,
    });
  }

  await interaction.editReply({
    content: 'Thank you for reporting your chunkloader.',
    ephemeral: true,
  });
};

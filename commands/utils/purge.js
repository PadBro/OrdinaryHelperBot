import { EmbedBuilder } from 'discord.js';
import dayjs from 'dayjs';
import { chunkData } from '../../utils/chunkData.js';
import { removeRole } from '../../utils/roles.js';

export const createEmbed = (members) => {
  const amountSubChunks = 3;

  members = members.sort((a, b) => {
    const startsWithLessThan = (str) => str.startsWith('<');

    if (startsWithLessThan(a) && !startsWithLessThan(b)) {
      return 1;
    } else if (!startsWithLessThan(a) && startsWithLessThan(b)) {
      return -1;
    } else {
      return a.localeCompare(b, undefined, { sensitivity: 'base' });
    }
  });

  members = members.map((member) => member.replace(/_/g, '\\_'));

  if (members.length % amountSubChunks == 1) {
    const index = Math.floor(members.length / amountSubChunks);
    const item = members.splice(index, 1)[0];
    members.push(item);
  }

  const embed = new EmbedBuilder()
    .setTitle('Purge')
    .setColor('#ce361e')
    .setDescription(`${members.length} members purged`)
    .setTimestamp();

  const chunkedData = chunkData(members, amountSubChunks, 46);
  const data = chunkedData.map((chunk) => {
    const mappedChunk = chunk.map((subChunk) => {
      return {
        name: '\u200B',
        value: subChunk.join('\n') + '\u200B',
        inline: true,
      };
    });
    return mappedChunk;
  });

  let flattenData = data.flat(1);
  embed.setFields(flattenData);

  return embed;
};

export const getMembersToPurge = async (interaction) => {
  let role = interaction.guild.roles.cache.find(
    (role) => role.id === process.env.MEMBER_ROLE_ID
  );
  const purgePeriod =
    interaction.options.getInteger('days') || process.env.PURGE_PERIOD_IN_DAYS;
  const nDaysAgo = dayjs().subtract(purgePeriod, 'day');

  const filteredMembers = role.members.filter((member) => {
    return (
      member.joinedTimestamp < nDaysAgo &&
      !member.roles.cache.has(process.env.LINKED_ROLE_ID) &&
      !member.roles.cache.has(process.env.PURGE_IMMUNITY_ROLE_ID)
    );
  });
  return filteredMembers;
};

export const removeLinkedRoles = async (interaction) => {
  const memberRole = interaction.guild.roles.cache.get(
    process.env.MEMBER_ROLE_ID
  );
  const linkedRole = interaction.guild.roles.cache.get(
    process.env.LINKED_ROLE_ID
  );
  memberRole.members.forEach((member) => removeRole(member, linkedRole));
};

export const removeMemberRoles = async (interaction) => {
  const memberRole = interaction.guild.roles.cache.get(
    process.env.MEMBER_ROLE_ID
  );
  const filteredMembers = await getMembersToPurge(interaction);
  filteredMembers.forEach((member) => removeRole(member, memberRole));
  return filteredMembers;
};

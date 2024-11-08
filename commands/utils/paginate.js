import { ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType} from 'discord.js';


export default class Paginate {
  #timeout = 60_000;
  #buttons = {
    previous: new ButtonBuilder()
      .setCustomId('paginate-previous')
      .setLabel('Previous')
      .setStyle(ButtonStyle.Secondary),
    next: new ButtonBuilder()
      .setCustomId('paginate-next')
      .setLabel('Next')
      .setStyle(ButtonStyle.Secondary)
  }
  #actionRow = new ActionRowBuilder().addComponents(Object.values(this.#buttons));

  #data = [];
  #page = 1;
  #maxPage = 1;
  #interaction = undefined;
  payload = undefined;
  #embedBuilder = () => null;

  constructor (interaction, data, embedBuilder, page = 1) {
    this.#data = data;
    this.#page = page
    this.#maxPage = data.length
    this.#interaction = interaction
    this.#embedBuilder = embedBuilder
  }

  paginate(message) {
    this.collector = message.createMessageComponentCollector({
      filter: ({ customId }) => ['previous', 'next'].some((position) => this.#buttons[position]?.data.custom_id === customId),
      time: this.#timeout,
      componentType: ComponentType.Button
    });

    this.collector.on('collect', async (interaction) => {
      if (interaction.customId === this.#buttons.previous?.data.custom_id) {
        console.log('prev')
        this.goPrev(interaction);
        return;
      }

      if (interaction.customId === this.#buttons.next?.data.custom_id) {
        console.log('next')
        this.goNext(interaction);
        return;
      }
    });
    this.collector.on('end', () => {
      this.#interaction.editReply({
        content: "Interaction canceled",
        components: [],
      });
      return
    });
    return this;
  }

  goPrev(interaction) {
    this.#page--;
    this.render()
    interaction.update(this.payload)
  }

  async goNext(interaction) {
    this.#page++;
    this.render()
    interaction.update(this.payload)
  }

  async render() {
    const embed = this.#getEmbed();
    this.payload = {
      embeds: [embed],
      ephemeral: true,
      components: [this.#actionRow],
    }

    this.#buttons.next?.setDisabled(this.#page >= this.#maxPage);
    this.#buttons.previous?.setDisabled(this.#page <= 1);

    if (this.#interaction.replied || this.#interaction.deferred){
      return await this.#interaction.editReply(this.payload);
    }
    return await this.#interaction.reply(this.payload);
  }

  #getEmbed() {
    // console.log(this.#data)
    console.log(this.#page)
    return this.#embedBuilder(this.#data[this.#page - 1])
  }
}


// export const paginate = async (
//   interaction,
//   confirmMessage,
// ) => {


//   const response = await interaction.reply({
//     content: confirmMessage,
//     components: [row],
//     ephemeral: true,
//   });
//   const collectorFilter = (i) => i.user.id === interaction.user.id;

//   try {
//     const confirmation = await response.awaitMessageComponent({
//       filter: collectorFilter,
//       time: 60_000,
//     });

//     if (confirmation.customId === 'confirm') {
//       await confirmation.update({
//         content: 'executing command',
//         components: [],
//       });
//       return true;
//     } else if (confirmation.customId === 'cancel') {
//       await confirmation.update({
//         content: 'Action cancelled',
//         components: [],
//         ephemeral: true,
//       });
//       return false;
//     }
//   } catch {
//     await interaction.editReply({
//       content: 'Confirmation not received within 1 minute, cancelling',
//       components: [],
//     });
//     return false;
//   }
// };

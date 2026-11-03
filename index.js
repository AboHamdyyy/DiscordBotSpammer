const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
  new SlashCommandBuilder()
    .setName('spam')
    .setDescription('Send spam messages with text and action buttons')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message to send')
        .setRequired(true))
    .setContexts([0, 1, 2])
    .setIntegrationTypes([0, 1])
];

const rest = new REST({ version: '10' }).setToken(config.TOKEN);

client.on('clientReady', async () => {
  console.log(`Logged in successfully as ${client.user.tag}`);
  
  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );
	console.log('Coded By Abo Hamdy > https://guns.lol/abohamdy \n You can start spamming now !');
  } catch (error) {
    console.error(error);
  }
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

client.on('interactionCreate', async interaction => {
  
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'spam') {
      const userMessage = interaction.options.getString('message');

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('start_spam')
            .setLabel('SPAM')
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Guns.lol')
            .setURL('https://guns.lol/abohamdy')
        );

      client.tempMessage = userMessage;

      await interaction.reply({
        content: `**Ready to spam :\n**${userMessage}\n**Click the button (SPAM) to start :**`,
        components: [row],
        ephemeral: true 
      });
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId === 'start_spam') {
      const msgToSend = client.tempMessage || 'test';

      await interaction.reply({
        content: msgToSend
      });

      for (let i = 0; i < 4; i++) {
        await sleep(800);
        try {
          await interaction.followUp({
            content: msgToSend
          });
        } catch (err) {
          console.error(`Error:`, err.message);
        }
      }

      const rowAgain = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('start_spam')
            .setLabel('SPAM')
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Guns.lol')
            .setURL('https://guns.lol/abohamdy')
        );

      await interaction.followUp({
        content: '**☠️ Spam finished**\n**Click the button (SPAM) if you want to spam again :**',
        components: [rowAgain],
        ephemeral: true
      });
    }
  }

});

client.login(config.TOKEN);
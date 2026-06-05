require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

const app = express();
const statusFile = path.join(__dirname, 'status.json');

function writeStatus(status) {
  fs.writeFileSync(statusFile, JSON.stringify({
    status,
    updatedAt: new Date().toISOString()
  }, null, 2));
}

if (!fs.existsSync(statusFile)) writeStatus('offline');

app.get('/status.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile(statusFile);
});

app.get('/', (req, res) => res.send('Bot online'));
app.listen(process.env.PORT || 3000);

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Setzt den Webseiten-Status')
    .addStringOption(option =>
      option.setName('wert')
        .setDescription('online oder offline')
        .setRequired(true)
        .addChoices(
          { name: 'online', value: 'online' },
          { name: 'offline', value: 'offline' }
        )
    ),
  new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Zeigt den aktuellen Status')
];

client.once('ready', async () => {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands.map(c => c.toJSON()) }
  );
  console.log(`Eingeloggt als ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'panel') {
    const current = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
    return interaction.reply({
      content: `Aktuell: **${current.status.toUpperCase()}**`,
      ephemeral: true
    });
  }

  if (interaction.commandName === 'status') {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return interaction.reply({
        content: 'Du hast keinen Zugriff auf diesen Befehl.',
        ephemeral: true
      });
    }

    const value = interaction.options.getString('wert');
    writeStatus(value);

    return interaction.reply({
      content: `Status auf **${value.toUpperCase()}** gesetzt.`,
      ephemeral: true
    });
  }
});

client.login(process.env.DISCORD_TOKEN);

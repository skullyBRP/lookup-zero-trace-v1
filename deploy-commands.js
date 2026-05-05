require("dotenv").config();

const { REST, Routes, SlashCommandBuilder } = require("discord.js");

// ======================
// COMMANDS
// ======================
const commands = [

  // /setinfo
  new SlashCommandBuilder()
    .setName("setinfo")
    .setDescription("Sla info op")

    .addStringOption(option =>
      option.setName("id")
        .setDescription("Discord ID")
        .setRequired(true)
    )

    .addStringOption(option =>
      option.setName("info")
        .setDescription("Info")
        .setRequired(true)
    ),

  // /lookup
  new SlashCommandBuilder()
    .setName("lookup")
    .setDescription("Bekijk info")

    .addStringOption(option =>
      option.setName("id")
        .setDescription("Discord ID")
        .setRequired(true)
    )

].map(cmd => cmd.toJSON());

// ======================
// DISCORD API
// ======================
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Deploying commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("Commands deployed!");
  } catch (err) {
    console.error(err);
  }
})();
require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder
} = require("discord.js");

const express = require("express");
const db = require("./database");

// ======================
// 🌐 RENDER WEB SERVER
// ======================
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is alive");
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Web server running on port " + PORT);
});

// ======================
// 🤖 DISCORD CLIENT
// ======================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// READY
client.on("clientReady", () => {
  console.log("Lookup Bot is online!");
});

// ======================
// COMMAND HANDLER
// ======================
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {

    // ======================
    // 📝 /setinfo
    // ======================
    if (interaction.commandName === "setinfo") {

      const id = interaction.options.getString("id");
      const info = interaction.options.getString("info");

      await db.setInfo(id, info);

      await interaction.reply({
        content: `✅ Info opgeslagen voor **${id}**`,
        flags: 64 // alleen jij ziet het
      });

      setTimeout(() => {
        interaction.deleteReply().catch(() => {});
      }, 10000);
    }

    // ======================
    // 🔍 /lookup
    // ======================
    if (interaction.commandName === "lookup") {

      const id = interaction.options.getString("id");

      const user = await client.users.fetch(id).catch(() => null);

      if (!user) {
        return interaction.reply({
          content: "❌ User niet gevonden.",
          flags: 64
        });
      }

      const member = interaction.guild?.members.cache.get(id);
      const info = await db.getInfo(id) || "Geen info gevonden";

      const embed = new EmbedBuilder()
        .setTitle("🔍 User Lookup")
        .setColor(0x00AEFF)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: "👤 Username", value: user.username, inline: true },
          { name: "🏷️ Nickname", value: member?.nickname || "Geen nickname", inline: true },
          { name: "🆔 ID", value: user.id, inline: false },
          {
            name: "📅 Account gemaakt",
            value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
            inline: false
          },
          { name: "📄 Info", value: info, inline: false }
        );

      await interaction.reply({
        embeds: [embed],
        flags: 64 // alleen jij ziet het
      });

      setTimeout(() => {
        interaction.deleteReply().catch(() => {});
      }, 10000);
    }

  } catch (err) {
    console.error(err);

    if (interaction.replied || interaction.deferred) {
      await interaction.editReply("❌ Error");
    } else {
      await interaction.reply({ content: "❌ Error", flags: 64 });
    }
  }
});

// ======================
// LOGIN
// ======================
client.login(process.env.TOKEN);
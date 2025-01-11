const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome! Use /login to connect your Spotify account.");
});

bot.onText(/\/login/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `Click the link below to log in to Spotify:\nhttp://localhost:3000/login`
  );
});

bot.onText(/\/play (.+)/, async (msg, match) => {
  const songName = match[1];
  try {
    const searchResult = await spotifyApi.searchTracks(songName);
    const trackUri = searchResult.body.tracks.items[0]?.uri;
    if (trackUri) {
      await spotifyApi.play({ uris: [trackUri] });
      bot.sendMessage(msg.chat.id, `Now playing: ${songName}`);
    } else {
      bot.sendMessage(msg.chat.id, "Song not found.");
    }
  } catch (err) {
    bot.sendMessage(msg.chat.id, "Error playing song. Make sure you're logged in.");
  }
});

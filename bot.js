const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.mentions.has(client.user) || message.content.toLowerCase().includes('flora')) {
    try {
      await message.channel.sendTyping();
      const prompt = message.content.replace(/<@!?\d+>/g, '').trim() || "مرحباً";
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (text.length > 2000) {
        message.reply(text.substring(0, 1990) + "...");
      } else {
        message.reply(text);
      }
    } catch (error) {
      console.error(error);
      message.reply("عذراً، حدث خطأ أثناء معالجة الطلب!");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

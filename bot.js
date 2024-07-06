const { Telegraf } = require('telegraf');
require('dotenv').config();
const { processMessage } = require('./openaiHelper');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome! How can I assist you today?'));
bot.help((ctx) => ctx.reply('You can ask me about available rooms, prices, or create a booking.'));

bot.on('text', async (ctx) => {

    console.log("telegram ctx object " + ctx.chat.id);

    const userMessage = ctx.message.text;
    const response = await processMessage(userMessage);
    console.log("Received to bot: " + response);
    ctx.reply(response);
});

bot.launch();

console.log('Telegram bot is running...');
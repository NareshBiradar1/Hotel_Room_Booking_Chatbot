const { Telegraf } = require('telegraf');
require('dotenv').config();
const { processMessage } = require('./openaiHelper');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

let messages;

bot.start((ctx) =>{
    ctx.reply('Welcome! How can I assist you today?');
    messages = [
        { role: 'system', content: 'You are a helpful assistant.' }
    ];
});
bot.help((ctx) => ctx.reply('You can ask me about available rooms, prices, or create a booking.'));

bot.on('text', async (ctx) => {
    const chatId = ctx.chat.id.toString();

    const userMessage = ctx.message.text;
    const response = await processMessage(userMessage , messages);
    console.log("Received to bot: " + response);
    ctx.reply(response);
});

bot.launch();

console.log('Telegram bot is running...');
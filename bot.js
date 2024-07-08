const { Telegraf } = require('telegraf');
require('dotenv').config();
const { processMessage } = require('./Controllers/openaiHelper.js');
const sequelize = require('./DataBase/database.js');


const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

sequelize.sync({ force: true }).then(() => {
    console.log("Database and tables created!");
}).catch((err) => {
    console.log("Error: ", err);
})

bot.start(async (ctx) => {
    ctx.reply('Welcome! How can I assist you today?');
});
bot.help((ctx) => ctx.reply('You can ask me about available rooms, prices, or create a booking.'));

bot.on('text', async (ctx) => {
    const session_id = ctx.chat.id.toString();
    const prompt = ctx.message.text;
    const response = await processMessage({ prompt, session_id });
    ctx.reply(response);
});

bot.launch();

console.log('Telegram bot is running...');
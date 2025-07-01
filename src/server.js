// server.js

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const logger = require('./bot/utils/logger');
const startAttachController = require('./bot/controllers/startAttachController');
const paymentController = require('./bot/controllers/paymentCallbacksController');

const authRoutes = require('./api/routers/authRoutes');
const paymentRoutes = require('./api/routers/paymentRoutes');
const generalRoutes = require('./api/routers/generalRoutes');

const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// === Telegram Bot ===
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText('/start', (message) => {
    startAttachController.sendStartMessage(bot, message);
});

bot.on('successful_payment', (message) => {
    paymentController.validateSuccessPurchase(bot, message);
});

bot.on('pre_checkout_query', async (query) => {
    await paymentController.validateInvoiceProcess(bot, query);
});

bot.on('polling_error', (error) => {
    logger.error(`Polling error: ${error.message}`);
});

// === Express Server ===
const app = express();
const port = process.env.PORT || 1000;

app.use(bodyParser.json());
app.use(bodyParser.text());

// === Статика для бота (если используется) ===
app.use(express.static(path.join(__dirname, 'TelegramBot-UnigramPayment')));

// === Роуты API ===
app.use('/api', generalRoutes);
app.use('/api', authRoutes);
app.use('/api/payment', paymentRoutes);

// === Запуск сервера ===
app.listen(port, () => {
    logger.message(`Server + Bot running at port: ${port}`);
});

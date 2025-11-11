// src/telegram/bot.js
const { Telegraf } = require('telegraf');
const AuthService = require('../services/auth.service');
const logger = require('../utils/logger');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start(async (ctx) => {
  const { payload } = ctx.payload; 
  const chatId = String(ctx.chat.id);
  const username = ctx.from?.username || null;

  if (!payload) return ctx.reply('Нажмите «Привязать Telegram» в личном кабинете.');

  try {
    await AuthService.linkTelegramByToken({ linkToken: payload, chatId, username });
    await ctx.reply('Telegram привязан. Вернитесь на сайт и запросите код.');
  } catch (e) {
    logger.error(`Ошибка привязки: ${e.message}`);
    await ctx.reply(`Ошибка привязки: ${e.message || ''}`);
  }
});

module.exports = bot;

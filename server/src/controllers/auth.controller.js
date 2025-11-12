// src/controllers/auth.controller.js
const AuthService = require('../services/auth.service');
const bot = require('../telegraf/bot');

async function createLink(req, res) {
  try {
    const { phoneNumber } = req.body;
    const botUsername = process.env.TELEGRAM_BOT_USERNAME;
    const data = await AuthService.createLinkDeepLink({ phoneNumber, botUsername });
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function requestOtp(req, res) {
  try {
    const { phoneNumber } = req.body;
    const sendOtp = (chatId, code) =>
      bot.telegram.sendMessage(chatId, `Ваш одноразовый код: ${code}\nДействует 5 минут.`);
    const data = await AuthService.requestOtp({ phoneNumber, sendOtp });
    res.json(data);
  } catch (e) {
    const status = e.code === 'NOT_LINKED' ? 409 : 400;
    res.status(status).json({ error: e.message, code: e.code });
  }
}

async function verifyOtp(req, res) {
  try {
    const { phoneNumber, code } = req.body;
    const data = await AuthService.verifyOtp({ phoneNumber, code });
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { createLink, requestOtp, verifyOtp };

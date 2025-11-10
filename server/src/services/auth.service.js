// src/services/auth.service.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dayjs = require('dayjs');
const { Customer } = require('../../db/models'); // index.js из sequelize-cli
const redis = require('../configs/redis.config');
const logger = require('../utils/logger');

const OTP_TTL_MIN = 5;
const OTP_LEN = 6;
const MAX_ATTEMPTS = 5;
const LOCK_MIN = 15;

function genCode() {
  return String(
    Math.floor(10 ** (OTP_LEN - 1) + Math.random() * 9 * 10 ** (OTP_LEN - 1)),
  );
}

function signLinkToken(payload) {
  return jwt.sign(payload, process.env.LINK_JWT_SECRET, { expiresIn: '10m' });
}
function verifyLinkToken(token) {
  return jwt.verify(token, process.env.LINK_JWT_SECRET);
}

async function createLinkDeepLink({ phoneNumber, botUsername }) {
  const customer = await Customer.findOne({ where: { phoneNumber } });
  if (!customer) throw new Error('Пользователь не найден');

  const token = signLinkToken({ phoneNumber });
  const deepLink = `https://t.me/${botUsername}?start=${encodeURIComponent(token)}`;
  return { deepLink, expiresInSeconds: 600 };
}

async function linkTelegramByToken({ linkToken, chatId, username }) {
  const { phoneNumber } = verifyLinkToken(linkToken);
  const customer = await Customer.findOne({ where: { phoneNumber } });
  if (!customer) throw new Error('Пользователь не найден');

  await redis.set(`chat:${phoneNumber}`, String(chatId), 'EX', 60 * 60 * 24 * 30); // EX n сек. [web:138][web:140]
  if (username)
    await redis.set(`tguser:${chatId}:username`, username, 'EX', 60 * 60 * 24 * 30);
  return true;
}

async function requestOtp({ phoneNumber, sendOtp }) {
  const customer = await Customer.findOne({ where: { phoneNumber } });
  if (!customer) throw new Error('Пользователь не найден');

  const lockTtl = await redis.ttl(`lock:${phoneNumber}`);
  if (lockTtl && lockTtl > 0) throw new Error('Слишком много попыток. Попробуйте позже.');

  const chatId = await redis.get(`chat:${phoneNumber}`);
  if (!chatId) {
    const err = new Error('Telegram не привязан. Сначала привяжите Telegram.');
    err.code = 'NOT_LINKED';
    throw err;
  }

  const code = genCode();
  const hash = await bcrypt.hash(code, 10);
  const expISO = dayjs().add(OTP_TTL_MIN, 'minute').toISOString();

  await redis.set(
    `otp:${phoneNumber}`,
    JSON.stringify({ hash, expISO, attempts: 0 }),
    'EX',
    OTP_TTL_MIN * 60,
  );

  await sendOtp(chatId, code);
  logger.info(`OTP отправлен в чат ${chatId}`);
  return { sent: true, ttlSeconds: OTP_TTL_MIN * 60 };
}

async function verifyOtp({ phoneNumber, code }) {
  const raw = await redis.get(`otp:${phoneNumber}`);
  if (!raw) throw new Error('Код не запрошен или истек');

  const data = JSON.parse(raw);
  if (dayjs(data.expISO).isBefore(dayjs())) {
    await redis.del(`otp:${phoneNumber}`);
    throw new Error('Код истек');
  }

  const ok = await bcrypt.compare(code, data.hash);
  if (!ok) {
    const attempts = (data.attempts || 0) + 1;
    if (attempts >= MAX_ATTEMPTS) {
      await redis.set(`lock:${phoneNumber}`, '1', 'EX', LOCK_MIN * 60);
      await redis.del(`otp:${phoneNumber}`);
    } else {
      data.attempts = attempts;
      await redis.set(`otp:${phoneNumber}`, JSON.stringify(data), 'EX', 180);
    }
    throw new Error('Неверный код');
  }

  await redis.del(`otp:${phoneNumber}`);

  const customer = await Customer.findOne({ where: { phoneNumber } });
  if (!customer) throw new Error('Пользователь не найден');

  const accessToken = jwt.sign(
    { sub: customer.id, phoneNumber, name: customer.name },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );
  const refreshToken = jwt.sign({ sub: customer.id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  return {
    accessToken,
    refreshToken,
    user: { id: customer.id, name: customer.name, phoneNumber },
  };
}

module.exports = {
  createLinkDeepLink,
  linkTelegramByToken,
  requestOtp,
  verifyOtp,
};

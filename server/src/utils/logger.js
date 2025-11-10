// src/utils/logger.js
const pino = require('pino');

const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'yyyy-MM-dd HH:mm:ss',
      ignore: 'pid,hostname',
    },
  },
});

module.exports = logger;

// src/configs/redis.config.js
// import Redis from 'ioredis'
const Redis = require('ioredis');
const logger = require('../utils/logger.js');
// import logger from '../utils/logger.js';

const url = process.env.REDIS_URL; // напр. redis://127.0.0.1:6379

const common = {
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false,
  retryStrategy: (times) => (times > 5 ? null : Math.min(times * 200, 2000)),
};

let redis;

if (url && (url.startsWith('redis://') || url.startsWith('rediss://'))) {
  const isTLS = url.startsWith('rediss://');
  const parsed = new URL(url);
  const tls = isTLS
    ? { rejectUnauthorized: false, servername: parsed.hostname }
    : undefined;
  redis = new Redis(url, { ...common, tls });
} else {
  const host = process.env.REDIS_HOST || '127.0.0.1';
  const port = Number(process.env.REDIS_PORT || 5432);
  const password = process.env.REDIS_PASSWORD || undefined;
  const username = process.env.REDIS_USERNAME || 'default';
  const tls =
    process.env.REDIS_TLS === '1'
      ? { rejectUnauthorized: false, servername: host }
      : undefined;
  redis = new Redis({ host, port, password, username, tls, ...common });
}

redis.on('connect', () => logger.info('[redis] connected'));
redis.on('error', (err) => logger.error(`[redis] ${err.message}`));

module.exports = redis;

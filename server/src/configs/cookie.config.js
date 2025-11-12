const jwtConfig = require('./jwt.config');

const parseExpiresInToMs = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const match = value.match(/^(\d+)(ms|s|m|h|d)$/);
    if (!match) return Number(value) || 0;
    const amount = Number(match[1]);
    const unit = match[2];
    const multipliers = {
      ms: 1,
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    return amount * (multipliers[unit] ?? 1);
  }
  return 0;
};

const refreshOptions = {
  maxAge: parseExpiresInToMs(jwtConfig.refresh.expiresIn),
  httpOnly: true,
  secure: false,
};

module.exports = {
  refresh: refreshOptions,
  refreshToken: refreshOptions,
};

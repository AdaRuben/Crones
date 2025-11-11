const jwt = require('jsonwebtoken');
const jwtConfig = require('../configs/jwt.config');
require('dotenv').config();

function generateTokens(payload) {
  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    jwtConfig.refresh,
  );
  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    jwtConfig.access,
  );
  return { refreshToken, accessToken };
}

module.exports = generateTokens;

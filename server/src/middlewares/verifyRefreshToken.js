const jwt = require('jsonwebtoken')

function verifyRefreshToken(req, res, next) {
  try {
    const { refreshToken } = req.cookies;
    const { admin } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    res.locals.admin = admin;
    next()
  } catch (err) {
    console.log(err);
    res.sendStatus(401)
  }
}

module.exports = verifyRefreshToken;
const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyAccessToken(req, res, next) {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    if (!accessToken) {
      return res.sendStatus(401);
    }

    const { admin } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    res.locals.admin = admin;
    next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(403);
  }
}

// Bearer ASJDOASDOAISDJ

module.exports = verifyAccessToken;

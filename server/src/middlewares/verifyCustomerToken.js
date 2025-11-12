const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyCustomerToken(req, res, next) {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) {
      return res.status(401).json({ error: 'Access token is required' });
    }

    const { user } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    res.locals.customer = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

module.exports = verifyCustomerToken;

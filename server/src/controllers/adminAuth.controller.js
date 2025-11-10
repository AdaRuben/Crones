const cookieConfig = require('../configs/cookie.config');
const AdminAuthService = require('../services/adminAuth.service');
const generateTokens = require('../utils/generateTokens');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class AdminAuthController {
  static async signup(req, res) {
    try {
      const admin = await AdminAuthService.signup(req.body);
      const { refreshToken, accessToken } = generateTokens({ admin });
      res
        .status(201)
        .cookie('refreshToken', refreshToken, cookieConfig.refresh)
        .json({ admin, accessToken });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async signin(req, res) {
    try {
      const admin = await AdminAuthService.signin(req.body);
      const { refreshToken, accessToken } = generateTokens({ admin });
      res
        .status(200)
        .cookie('refreshToken', refreshToken, cookieConfig.refresh)
        .json({ admin, accessToken });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async refresh(req, res) {
    try {
      const { refreshToken } = req.cookies;
      const { admin } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      const { refreshToken: newRefreshToken, accessToken } = generateTokens({ admin });
      res
        .cookie('refreshToken', newRefreshToken, cookieConfig.refresh)
        .json({ admin, accessToken });
    } catch (err) {
      console.log(err);
      res.sendStatus(401);
    }
  }

  static async signout(req, res) {
    res.clearCookie('refreshToken').sendStatus(204);
  }
}

module.exports = AdminAuthController;

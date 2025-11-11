const AuthService = require('../services/auth.service');
const cookieConfig = require('../configs/cookie.config');
const generateTokens = require('../utils/generateTokens');
const jwt = require('jsonwebtoken');

class AuthController {
  static async signup(req, res) {
    try {
      const userData = req.body;
      if (!userData.name || !userData.phoneNumber || !userData.password) {
        return res
          .status(400)
          .json({ message: 'Name, phoneNumber and password are required' });
      }
      const user = await AuthService.signup(userData);
      const { accessToken, refreshToken } = generateTokens({ user });
      res.cookie('refreshToken', refreshToken, cookieConfig.refreshToken);
      return res.status(200).json({ accessToken, user });
    } catch (error) {
      console.log(error);

      if (error.message === 'Duplicate entry') {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  }

  static async signin(req, res) {
    try {
      const userData = req.body;
      if (!userData.phoneNumber || !userData.password) {
        return res.status(400).json({ message: 'phoneNumber and password are required' });
      }
      const user = await AuthService.signin(userData);
      const { accessToken, refreshToken } = generateTokens({ user });
      res.cookie('refreshToken', refreshToken, cookieConfig.refreshToken);
      return res.status(200).json({ accessToken, user });
    } catch (error) {
      if (error.message === 'Invalid phoneNumber or password') {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  }

  static async signout(req, res) {
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  static async refresh(req, res) {
    try {
      const oldRefreshToken = req.cookies.refreshToken;
      if (!oldRefreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
      }
      const { user } = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
      const { accessToken, refreshToken } = generateTokens({ user });
      res.cookie('refreshToken', refreshToken, cookieConfig.refreshToken);
      return res.status(200).json({ accessToken, user });
    } catch (error) {
      console.log(error);
      if (error.message === 'TokenExpiredError') {
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = AuthController;

const AuthRouter = require('express').Router();
const AuthController = require('../controllers/auth.controller');

AuthRouter.post('/auth/telegram/link', AuthController.createLink);
AuthRouter.post('/auth/request-otp', AuthController.requestOtp);
AuthRouter.post('/auth/verify-otp', AuthController.verifyOtp);

module.exports = AuthRouter;

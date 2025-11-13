const express = require('express');
const SupportChatController = require('../controllers/supportChat.controller');
const verifyAccessToken = require('../middlewares/verifyAccessToken');

const supportChatRouter = express.Router();

supportChatRouter.get('/customer/:customerId', SupportChatController.getCustomerChat);
supportChatRouter.get('/:chatId/messages', SupportChatController.getChatMessages);
supportChatRouter.get(
  '/admin/:adminId',
  verifyAccessToken,
  SupportChatController.getAdminChats,
);

module.exports = supportChatRouter;
